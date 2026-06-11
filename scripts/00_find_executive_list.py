#!/usr/bin/env python3
"""Discover an executive list from public search results.

This helper reduces the manual work needed before running
``scripts/01_find_candidate_accounts.py``. It reads a company list, searches only
public web-search result pages for executive/management information, extracts
names and positions found in returned titles/snippets, and writes
``data/raw/executive_list.xlsx``.

Compliance guardrails:
- Uses only public web-search result pages and their returned titles/snippets.
- Does not log in to any platform.
- Does not bypass CAPTCHAs or other access controls.
- Does not invent executives; rows are saved only when a name/position is found
  in a real search-result title or snippet.
"""

from __future__ import annotations

import argparse
import importlib.util
import logging
import random
import re
import sys
import time
import urllib.error
import urllib.request
from html.parser import HTMLParser
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

BASE_DIR = Path(__file__).resolve().parent
ACCOUNT_SCRIPT = BASE_DIR / "01_find_candidate_accounts.py"
DEFAULT_INPUT_PATH = Path("data/raw/company_list.xlsx")
DEFAULT_OUTPUT_PATH = Path("data/raw/executive_list.xlsx")
VERIFY_STATUS = "需人工确认"

COMPANY_COLUMNS = ["stock_code", "firm_name"]
OUTPUT_COLUMNS = [
    "stock_code",
    "firm_name",
    "executive_name",
    "position",
    "source_title",
    "source_snippet",
    "source_url",
    "query",
    "confidence_score",
    "reason",
    "verify_status",
]

EXECUTIVE_QUERY_TERMS = [
    "高管 名单",
    "高级管理人员",
    "董事长 总经理 董秘",
    "管理层",
    "董事 监事 高级管理人员",
]

POSITION_TERMS = [
    "董事会秘书",
    "财务负责人",
    "监事会主席",
    "副董事长",
    "副总经理",
    "独立董事",
    "财务总监",
    "法定代表人",
    "实际控制人",
    "总会计师",
    "董事长",
    "总经理",
    "副总裁",
    "总裁",
    "董秘",
    "董事",
    "监事",
    "CEO",
    "CFO",
    "CTO",
]

BAD_NAME_TERMS = {
    "公司",
    "集团",
    "股份",
    "有限",
    "证券",
    "公告",
    "年度",
    "报告",
    "名单",
    "高管",
    "管理层",
    "董事会",
    "监事会",
    "高级",
    "人员",
    "薪酬",
    "相关",
    "中国",
    "控股",
    "银行",
    "股份",
    "变动",
    "简历",
    "职务",
    "秘书",
    "同时",
    "担任",
    "助理",
    "副行长",
    "行长",
    "秘書",
    "等职",
    "先生",
    "女士",
}

LOGGER = logging.getLogger("executive_list_discovery")


class VisibleTextParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self._skip_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() in {"script", "style", "noscript", "svg"}:
            self._skip_depth += 1

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() in {"script", "style", "noscript", "svg"} and self._skip_depth:
            self._skip_depth -= 1
        elif tag.lower() in {"p", "div", "li", "tr", "h1", "h2", "h3", "br"}:
            self.parts.append("。")

    def handle_data(self, data: str) -> None:
        if not self._skip_depth:
            self.parts.append(data)


def fetch_public_page_text(url: str, timeout: int, max_chars: int = 100_000) -> str:
    """Fetch visible text from a public HTML page; skip binary/non-HTML data."""
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; AcademicExecutiveDiscovery/1.0; public pages only)",
            "Accept": "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.7",
        },
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        content_type = response.headers.get("Content-Type", "").lower()
        if content_type and "html" not in content_type and "text" not in content_type:
            return ""
        body = response.read(max_chars * 4).decode("utf-8", errors="replace")
    parser = VisibleTextParser()
    parser.feed(body)
    return normalize_space("".join(parser.parts))[:max_chars]


def evidence_excerpt(text: str, name: str, position: str, width: int = 120) -> str:
    indexes = [idx for idx in [text.find(name), text.find(position)] if idx >= 0]
    if not indexes:
        return normalize_space(text[: width * 2])
    center = min(indexes)
    start = max(0, center - width)
    end = min(len(text), center + width)
    return normalize_space(text[start:end])


def load_account_helpers():
    """Load shared stdlib-only XLSX/search helpers from script 01."""
    spec = importlib.util.spec_from_file_location("candidate_account_helpers", ACCOUNT_SCRIPT)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Could not load helper script: {ACCOUNT_SCRIPT}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


helpers = load_account_helpers()
read_xlsx_rows = helpers.read_xlsx_rows
write_xlsx = helpers.write_xlsx
search_public_web = helpers.search_public_web
normalize_space = helpers.normalize_space
SearchResult = helpers.SearchResult


@dataclass(frozen=True)
class Company:
    stock_code: str
    firm_name: str


@dataclass(frozen=True)
class ExecutiveCandidate:
    executive_name: str
    position: str
    source_title: str
    source_snippet: str
    source_url: str
    query: str
    confidence_score: int
    reason: str


def clean_name(name: str) -> str:
    name = normalize_space(name)
    name = re.sub(r"^(由|为|是|任|聘任|选举|提名|候选人|先生|女士)+", "", name)
    name = re.sub(r"(先生|女士|博士|简历|简介|任职|辞职|离任|上任|当选|获聘).*$", "", name)
    return normalize_space(name.strip(" ：:，,。、；;（）()[]【】<>《》"))


def is_plausible_name(name: str, firm_name: str = "") -> bool:
    name = clean_name(name)
    if not (2 <= len(name) <= 6):
        return False
    if any(term in name for term in BAD_NAME_TERMS):
        return False
    if any(position in name for position in POSITION_TERMS):
        return False
    if name.endswith("职"):
        return False
    if not re.fullmatch(r"[\u4e00-\u9fa5·]{2,6}", name):
        return False
    compact_firm = re.sub(r"(股份有限公司|有限责任公司|有限公司|集团|股份|公司|银行|证券)", "", firm_name or "")
    firm_tokens = {compact_firm[index:index + 2] for index in range(max(0, len(compact_firm) - 1))}
    firm_tokens = {token for token in firm_tokens if len(token) == 2}
    if name in firm_name or any(token and token in name for token in firm_tokens):
        return False
    return True


def normalize_position(position: str) -> str:
    position = normalize_space(position).upper() if position.isascii() else normalize_space(position)
    aliases = {"董事会秘书": "董事会秘书", "董秘": "董事会秘书"}
    return aliases.get(position, position)


def build_queries(company: Company) -> Iterable[str]:
    for term in EXECUTIVE_QUERY_TERMS:
        yield f"{company.firm_name} {term}"
    if company.stock_code:
        yield f"{company.stock_code} {company.firm_name} 高管"


def candidate_patterns(position: str) -> list[re.Pattern[str]]:
    escaped_position = re.escape(position)
    if position in {"董事", "监事"}:
        escaped_position = rf"{escaped_position}(?!会)"
    name = r"([\u4e00-\u9fa5·]{2,4}(?:·[\u4e00-\u9fa5]{2,4})?)"
    left_boundary = r"(?:^|[\s:：，,、。；;（）()【】《》])"
    right_boundary = r"(?=$|[\s:：，,、。；;（）()【】《》]|先生|女士|简历|简介|履历|_)"
    verb_sep = r"[\s:：，,、]*(?:由|为|是|任|聘任|选举|提名为|担任|出任|获聘为|当选为)?[\s:：，,、]*(?:先生|女士)?[\s:：，,、]*"
    return [
        re.compile(rf"{left_boundary}{escaped_position}{verb_sep}{name}{right_boundary}"),
        re.compile(rf"{left_boundary}{name}(?:先生|女士)?(?:担任|出任|任职|获聘为|当选为|任){escaped_position}{right_boundary}"),
    ]


def extract_candidates_from_result(query: str, result: SearchResult, firm_name: str = "") -> list[ExecutiveCandidate]:
    text = normalize_space(f"{result.title}。{result.snippet}")
    compact_firm = re.sub(r"(股份有限公司|有限责任公司|有限公司|集团|股份|公司)", "", firm_name or "")
    for firm_token in {firm_name, compact_firm}:
        if firm_token:
            text = text.replace(firm_token, " ")
    text = normalize_space(text)
    candidates: dict[tuple[str, str], ExecutiveCandidate] = {}

    for position in POSITION_TERMS:
        normalized_position = normalize_position(position)
        for pattern in candidate_patterns(position):
            for match in pattern.finditer(text):
                raw_name = next((group for group in match.groups() if group), "")
                name = clean_name(raw_name)
                if not is_plausible_name(name, firm_name):
                    continue
                score, reason = score_executive_candidate(name, normalized_position, result)
                key = (name, normalized_position)
                existing = candidates.get(key)
                if existing is None or score > existing.confidence_score:
                    candidates[key] = ExecutiveCandidate(
                        executive_name=name,
                        position=normalized_position,
                        source_title=result.title,
                        source_snippet=evidence_excerpt(text, name, normalized_position),
                        source_url=result.url,
                        query=query,
                        confidence_score=score,
                        reason=reason,
                    )
    return list(candidates.values())


def score_executive_candidate(name: str, position: str, result: SearchResult) -> tuple[int, str]:
    text = f"{result.title} {result.snippet}"
    score = 30
    reasons = ["公开搜索结果标题/摘要中出现姓名和职位"]

    if position in text:
        score += 20
        reasons.append("职位命中")
    if name in text:
        score += 20
        reasons.append("姓名命中")
    if any(term in text for term in ["高管", "高级管理人员", "管理层", "董事", "监事", "简历"]):
        score += 15
        reasons.append("包含高管/管理层相关语境")
    if any(term in text for term in ["公告", "年报", "年度报告", "任职", "聘任", "选举"]):
        score += 10
        reasons.append("包含公告/年报/任职等来源信号")
    if any(term in result.url.lower() for term in ["cninfo.com.cn", "sse.com.cn", "szse.cn", "stock"]):
        score += 5
        reasons.append("链接域名具有证券信息相关性")

    return min(100, score), "；".join(reasons)


def load_companies(input_path: Path, cli_companies: list[str] | None) -> list[Company]:
    companies: list[Company] = []
    if cli_companies:
        for item in cli_companies:
            parts = [normalize_space(part) for part in re.split(r"[,，]", item, maxsplit=1)]
            if len(parts) != 2 or not all(parts):
                raise ValueError(f"--company must look like 'stock_code,firm_name', got: {item}")
            companies.append(Company(stock_code=parts[0], firm_name=parts[1]))
        return companies

    rows = read_xlsx_rows(input_path)
    missing = [column for column in COMPANY_COLUMNS if column not in rows[0]] if rows else []
    if missing:
        raise ValueError(f"Company list is missing required columns: {', '.join(missing)}")
    return [
        Company(stock_code=normalize_space(row.get("stock_code")), firm_name=normalize_space(row.get("firm_name")))
        for row in rows
        if normalize_space(row.get("firm_name"))
    ]


def discover_executives(
    companies: list[Company],
    max_results: int,
    timeout: int,
    sleep_seconds: float,
    engine: str,
    fetch_pages: bool,
) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    best_by_company_person_position: dict[tuple[str, str, str], dict[str, object]] = {}

    for company_index, company in enumerate(companies, start=1):
        LOGGER.info("Processing company %s/%s: %s %s", company_index, len(companies), company.stock_code, company.firm_name)
        for query in build_queries(company):
            LOGGER.info("Searching: %s", query)
            results = search_public_web(query, max_results=max_results, timeout=timeout, engine=engine)
            for result in results:
                result_variants = [result]
                if fetch_pages and result.url:
                    try:
                        page_text = fetch_public_page_text(result.url, timeout=timeout)
                    except (urllib.error.URLError, TimeoutError, ValueError) as exc:
                        LOGGER.debug("Could not fetch public page %s: %s", result.url, exc)
                        page_text = ""
                    if page_text:
                        result_variants.append(SearchResult(title=result.title, snippet=page_text, url=result.url))
                for source_result in result_variants:
                    for candidate in extract_candidates_from_result(query, source_result, company.firm_name):
                        row = {
                            "stock_code": company.stock_code,
                            "firm_name": company.firm_name,
                            "executive_name": candidate.executive_name,
                            "position": candidate.position,
                            "source_title": candidate.source_title,
                            "source_snippet": candidate.source_snippet,
                            "source_url": candidate.source_url,
                            "query": candidate.query,
                            "confidence_score": candidate.confidence_score,
                            "reason": candidate.reason,
                            "verify_status": VERIFY_STATUS,
                        }
                        key = (company.stock_code, candidate.executive_name, candidate.position)
                        existing = best_by_company_person_position.get(key)
                        if existing is None or int(row["confidence_score"]) > int(existing["confidence_score"]):
                            best_by_company_person_position[key] = row
            if sleep_seconds > 0:
                time.sleep(sleep_seconds + random.uniform(0, min(0.5, sleep_seconds)))

    rows = list(best_by_company_person_position.values())
    rows.sort(key=lambda row: (str(row["stock_code"]), str(row["firm_name"]), -int(row["confidence_score"]), str(row["executive_name"])))
    return rows


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Automatically discover executive names/positions from public search results.")
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT_PATH, help="Company xlsx with stock_code and firm_name. Default: data/raw/company_list.xlsx")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_PATH, help="Executive output xlsx. Default: data/raw/executive_list.xlsx")
    parser.add_argument("--company", action="append", help="Company pair in the form 'stock_code,firm_name'. Can be repeated; skips --input.")
    parser.add_argument("--max-results", type=int, default=8, help="Maximum search results per query. Default: 8")
    parser.add_argument("--timeout", type=int, default=20, help="HTTP timeout in seconds. Default: 20")
    parser.add_argument("--sleep", type=float, default=2.0, help="Polite delay between search requests in seconds. Default: 2")
    parser.add_argument("--engine", choices=["auto", "duckduckgo", "bing"], default="auto", help="Public search engine to use. Default: auto")
    parser.add_argument("--no-fetch-pages", action="store_true", help="Only parse search-result titles/snippets; do not fetch public result pages.")
    parser.add_argument("--log-level", default="INFO", choices=["DEBUG", "INFO", "WARNING", "ERROR"])
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(sys.argv[1:] if argv is None else argv)
    logging.basicConfig(level=getattr(logging, args.log_level), format="%(asctime)s %(levelname)s %(message)s")

    companies = load_companies(args.input, args.company)
    LOGGER.info("Loaded %s companies", len(companies))
    rows = discover_executives(
        companies,
        max_results=max(1, args.max_results),
        timeout=max(1, args.timeout),
        sleep_seconds=max(0.0, args.sleep),
        engine=args.engine,
        fetch_pages=not args.no_fetch_pages,
    )
    write_xlsx(args.output, rows, OUTPUT_COLUMNS)
    LOGGER.info("Wrote %s executive rows to %s", len(rows), args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
