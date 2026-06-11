#!/usr/bin/env python3
"""Discover candidate short-video accounts for listed executives.

This script reads ``data/raw/executive_list.xlsx``, generates public-search
queries for each executive, collects search-result titles/snippets/URLs, scores
candidate relevance from the returned public metadata, and writes
``data/interim/candidate_accounts.xlsx`` for manual verification.

Compliance guardrails:
- Uses only public web-search result pages.
- Does not log in to any platform.
- Does not bypass CAPTCHAs or other access controls.
- Does not invent accounts; only persisted rows come from actual search results.
"""

from __future__ import annotations

import argparse
import html
import logging
import random
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable
from xml.etree import ElementTree as ET

INPUT_PATH = Path("data/raw/executive_list.xlsx")
OUTPUT_PATH = Path("data/interim/candidate_accounts.xlsx")
REQUIRED_COLUMNS = ["stock_code", "firm_name", "executive_name", "position"]
OUTPUT_COLUMNS = [
    "stock_code",
    "firm_name",
    "executive_name",
    "position",
    "platform",
    "query",
    "title",
    "snippet",
    "url",
    "confidence_score",
    "reason",
    "verify_status",
]
QUERY_TERMS = ["抖音", "快手", "视频号", "直播", "短视频"]
VERIFY_STATUS = "需人工确认"

LOGGER = logging.getLogger("candidate_accounts")

NS = {
    "main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "rel": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "pkgrel": "http://schemas.openxmlformats.org/package/2006/relationships",
}


@dataclass(frozen=True)
class Executive:
    stock_code: str
    firm_name: str
    executive_name: str
    position: str


@dataclass(frozen=True)
class SearchResult:
    title: str
    snippet: str
    url: str


def normalize_space(value: object) -> str:
    return re.sub(r"\s+", " ", "" if value is None else str(value)).strip()


def column_index(cell_ref: str) -> int:
    letters = re.sub(r"[^A-Z]", "", cell_ref.upper())
    index = 0
    for char in letters:
        index = index * 26 + (ord(char) - ord("A") + 1)
    return index - 1


def read_shared_strings(zf: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in zf.namelist():
        return []
    root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    strings: list[str] = []
    for item in root.findall("main:si", NS):
        parts = [node.text or "" for node in item.findall(".//main:t", NS)]
        strings.append("".join(parts))
    return strings


def workbook_first_sheet_path(zf: zipfile.ZipFile) -> str:
    workbook = ET.fromstring(zf.read("xl/workbook.xml"))
    first_sheet = workbook.find("main:sheets/main:sheet", NS)
    if first_sheet is None:
        raise ValueError("Workbook does not contain any sheets.")
    rel_id = first_sheet.attrib.get(f"{{{NS['rel']}}}id")
    if not rel_id:
        raise ValueError("First sheet relationship id is missing.")

    rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
    for rel in rels.findall("pkgrel:Relationship", NS):
        if rel.attrib.get("Id") == rel_id:
            target = rel.attrib["Target"]
            if target.startswith("/"):
                return target.lstrip("/")
            return f"xl/{target}"
    raise ValueError(f"Could not resolve worksheet relationship {rel_id!r}.")


def cell_text(cell: ET.Element, shared_strings: list[str]) -> str:
    cell_type = cell.attrib.get("t")
    if cell_type == "inlineStr":
        return "".join(node.text or "" for node in cell.findall(".//main:t", NS))

    value = cell.find("main:v", NS)
    raw = value.text if value is not None else ""
    if cell_type == "s":
        try:
            return shared_strings[int(raw)]
        except (ValueError, IndexError):
            return ""
    return raw or ""


def read_xlsx_rows(path: Path) -> list[dict[str, str]]:
    """Read the first worksheet from an xlsx file using only the stdlib."""
    if not path.exists():
        hint = ""
        if path == INPUT_PATH:
            hint = " Run scripts/00_find_executive_list.py first to auto-discover data/raw/executive_list.xlsx from a company list."
        raise FileNotFoundError(f"Input file not found: {path}.{hint}")

    with zipfile.ZipFile(path) as zf:
        shared_strings = read_shared_strings(zf)
        sheet_path = workbook_first_sheet_path(zf)
        root = ET.fromstring(zf.read(sheet_path))

    rows: list[list[str]] = []
    for row in root.findall(".//main:sheetData/main:row", NS):
        values: list[str] = []
        for cell in row.findall("main:c", NS):
            idx = column_index(cell.attrib.get("r", "A1"))
            while len(values) <= idx:
                values.append("")
            values[idx] = normalize_space(cell_text(cell, shared_strings))
        rows.append(values)

    while rows and not any(rows[0]):
        rows.pop(0)
    if not rows:
        return []

    headers = [normalize_space(header) for header in rows[0]]
    missing = [column for column in REQUIRED_COLUMNS if column not in headers]
    if missing:
        raise ValueError(f"Input file is missing required columns: {', '.join(missing)}")

    records: list[dict[str, str]] = []
    for values in rows[1:]:
        record = {header: values[idx] if idx < len(values) else "" for idx, header in enumerate(headers) if header}
        if any(normalize_space(record.get(column)) for column in REQUIRED_COLUMNS):
            records.append({column: normalize_space(record.get(column)) for column in REQUIRED_COLUMNS})
    return records


def xlsx_col_name(index: int) -> str:
    name = ""
    index += 1
    while index:
        index, rem = divmod(index - 1, 26)
        name = chr(ord("A") + rem) + name
    return name


def write_xlsx(path: Path, rows: list[dict[str, object]], columns: list[str]) -> None:
    """Write a small, standards-compliant xlsx workbook with inline strings."""
    path.parent.mkdir(parents=True, exist_ok=True)
    all_rows = [columns] + [[normalize_space(row.get(column, "")) for column in columns] for row in rows]

    sheet_rows: list[str] = []
    for row_idx, row_values in enumerate(all_rows, start=1):
        cells: list[str] = []
        for col_idx, value in enumerate(row_values):
            cell_ref = f"{xlsx_col_name(col_idx)}{row_idx}"
            escaped = html.escape(value, quote=False)
            cells.append(f'<c r="{cell_ref}" t="inlineStr"><is><t>{escaped}</t></is></c>')
        sheet_rows.append(f'<row r="{row_idx}">{"".join(cells)}</row>')

    last_col = xlsx_col_name(max(len(columns) - 1, 0))
    dimension = f"A1:{last_col}{len(all_rows)}"
    worksheet = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <dimension ref="{dimension}"/>
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  <sheetData>{''.join(sheet_rows)}</sheetData>
</worksheet>'''

    files = {
        "[Content_Types].xml": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>''',
        "_rels/.rels": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>''',
        "xl/workbook.xml": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="candidate_accounts" sheetId="1" r:id="rId1"/></sheets>
</workbook>''',
        "xl/_rels/workbook.xml.rels": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>''',
        "xl/worksheets/sheet1.xml": worksheet,
        "xl/styles.xml": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts><fills count="1"><fill><patternFill patternType="none"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs></styleSheet>''',
        "docProps/core.xml": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:creator>candidate account discovery script</dc:creator></cp:coreProperties>''',
        "docProps/app.xml": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Python</Application></Properties>''',
    }

    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for filename, content in files.items():
            zf.writestr(filename, content)


class DuckDuckGoParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.results: list[SearchResult] = []
        self._in_title = False
        self._in_snippet = False
        self._title_parts: list[str] = []
        self._snippet_parts: list[str] = []
        self._url = ""

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = dict(attrs)
        classes = attr.get("class", "") or ""
        if tag == "a" and "result__a" in classes:
            self._in_title = True
            self._title_parts = []
            self._snippet_parts = []
            self._url = unwrap_duckduckgo_url(attr.get("href", "") or "")
        elif tag in {"a", "div"} and "result__snippet" in classes:
            self._in_snippet = True

    def handle_endtag(self, tag: str) -> None:
        if self._in_title and tag == "a":
            self._in_title = False
        elif self._in_snippet and tag in {"a", "div"}:
            self._in_snippet = False
            title = normalize_space("".join(self._title_parts))
            snippet = normalize_space("".join(self._snippet_parts))
            if title and self._url:
                self.results.append(SearchResult(title=title, snippet=snippet, url=self._url))

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self._title_parts.append(data)
        if self._in_snippet:
            self._snippet_parts.append(data)


class BingParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.results: list[SearchResult] = []
        self._in_item = False
        self._in_title = False
        self._in_snippet = False
        self._title_parts: list[str] = []
        self._snippet_parts: list[str] = []
        self._url = ""

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = dict(attrs)
        classes = attr.get("class", "") or ""
        if tag == "li" and "b_algo" in classes:
            self._in_item = True
            self._title_parts = []
            self._snippet_parts = []
            self._url = ""
        elif self._in_item and tag == "a" and not self._url:
            href = attr.get("href", "") or ""
            if href.startswith("http"):
                self._url = href
                self._in_title = True
        elif self._in_item and tag == "p":
            self._in_snippet = True

    def handle_endtag(self, tag: str) -> None:
        if self._in_title and tag == "a":
            self._in_title = False
        elif self._in_snippet and tag == "p":
            self._in_snippet = False
        elif self._in_item and tag == "li":
            self._in_item = False
            title = normalize_space("".join(self._title_parts))
            snippet = normalize_space("".join(self._snippet_parts))
            if title and self._url:
                self.results.append(SearchResult(title=title, snippet=snippet, url=self._url))

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self._title_parts.append(data)
        elif self._in_snippet:
            self._snippet_parts.append(data)


def unwrap_duckduckgo_url(url: str) -> str:
    if not url:
        return ""
    parsed = urllib.parse.urlparse(html.unescape(url))
    query = urllib.parse.parse_qs(parsed.query)
    if "uddg" in query and query["uddg"]:
        return query["uddg"][0]
    return urllib.parse.urljoin("https://duckduckgo.com", html.unescape(url))


def fetch_url(url: str, timeout: int) -> str:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; AcademicCandidateDiscovery/1.0; public search only)",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.7",
        },
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read().decode("utf-8", errors="replace")


def search_duckduckgo(query: str, max_results: int, timeout: int) -> list[SearchResult]:
    url = "https://duckduckgo.com/html/?" + urllib.parse.urlencode({"q": query})
    body = fetch_url(url, timeout=timeout)
    parser = DuckDuckGoParser()
    parser.feed(body)
    return parser.results[:max_results]


def search_bing(query: str, max_results: int, timeout: int) -> list[SearchResult]:
    url = "https://www.bing.com/search?" + urllib.parse.urlencode({"q": query, "ensearch": "0"})
    body = fetch_url(url, timeout=timeout)
    parser = BingParser()
    parser.feed(body)
    return parser.results[:max_results]


def search_public_web(query: str, max_results: int, timeout: int, engine: str) -> list[SearchResult]:
    engines = [engine] if engine != "auto" else ["duckduckgo", "bing"]
    last_error: Exception | None = None
    for selected in engines:
        try:
            if selected == "duckduckgo":
                results = search_duckduckgo(query, max_results, timeout)
            elif selected == "bing":
                results = search_bing(query, max_results, timeout)
            else:
                raise ValueError(f"Unsupported search engine: {selected}")
            if results:
                return results
        except (urllib.error.URLError, TimeoutError, ValueError) as exc:
            last_error = exc
            LOGGER.warning("Search failed for %r via %s: %s", query, selected, exc)
    if last_error:
        LOGGER.warning("No results collected for %r; last error: %s", query, last_error)
    return []


def infer_platform(query_term: str, title: str, snippet: str, url: str) -> str:
    text = f"{query_term} {title} {snippet} {url}".lower()
    if "douyin" in text or "抖音" in text or "iesdouyin" in text:
        return "抖音"
    if "kuaishou" in text or "kwai" in text or "快手" in text:
        return "快手"
    if "视频号" in text or "channels.weixin" in text or "微信视频号" in text:
        return "视频号"
    if "直播" in text:
        return "直播"
    if "短视频" in text:
        return "短视频"
    return query_term


def score_candidate(executive: Executive, platform: str, result: SearchResult) -> tuple[int, str]:
    text = f"{result.title} {result.snippet}".lower()
    url = result.url.lower()
    score = 0
    reasons: list[str] = []

    firm = executive.firm_name.lower()
    name = executive.executive_name.lower()
    position = executive.position.lower()

    if firm and firm in text:
        score += 25
        reasons.append("标题/摘要包含公司名")
    if name and name in text:
        score += 30
        reasons.append("标题/摘要包含高管姓名")
    if position and position in text:
        score += 10
        reasons.append("标题/摘要包含职位")
    if platform and platform.lower() in text:
        score += 15
        reasons.append("标题/摘要包含平台关键词")

    platform_domain_patterns = {
        "抖音": ["douyin.com", "iesdouyin.com"],
        "快手": ["kuaishou.com", "kwai.com"],
        "视频号": ["weixin.qq.com", "channels.weixin"],
    }
    if any(pattern in url for pattern in platform_domain_patterns.get(platform, [])):
        score += 10
        reasons.append("链接域名与平台匹配")

    account_terms = ["抖音号", "快手号", "视频号", "账号", "主页", "认证", "官方", "直播间", "主播", "粉丝"]
    matched_account_terms = [term for term in account_terms if term in text]
    if matched_account_terms:
        score += min(15, 5 + 2 * len(matched_account_terms))
        reasons.append("出现账号/认证/主页等候选信号")

    weak_terms = ["招聘", "采购", "招标", "股票行情", "股吧", "百科", "年报", "公告"]
    matched_weak_terms = [term for term in weak_terms if term in text]
    if matched_weak_terms:
        score -= min(20, 5 * len(matched_weak_terms))
        reasons.append("包含可能无关的公告/行情/招聘等词")

    if not reasons:
        reasons.append("仅由公开搜索结果返回，相关性较弱")

    return max(0, min(100, score)), "；".join(reasons)


def build_queries(executive: Executive) -> Iterable[tuple[str, str]]:
    for term in QUERY_TERMS:
        yield term, f"{executive.firm_name} {executive.executive_name} {term}"


def discover_candidates(
    executives: list[Executive],
    max_results: int,
    timeout: int,
    sleep_seconds: float,
    engine: str,
) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    seen: set[tuple[str, str, str, str]] = set()

    for row_number, executive in enumerate(executives, start=1):
        LOGGER.info("Processing %s/%s: %s %s", row_number, len(executives), executive.firm_name, executive.executive_name)
        for query_term, query in build_queries(executive):
            LOGGER.info("Searching: %s", query)
            results = search_public_web(query, max_results=max_results, timeout=timeout, engine=engine)
            for result in results:
                if not result.url:
                    continue
                key = (executive.stock_code, executive.executive_name, query_term, result.url)
                if key in seen:
                    continue
                seen.add(key)
                platform = infer_platform(query_term, result.title, result.snippet, result.url)
                score, reason = score_candidate(executive, platform, result)
                rows.append(
                    {
                        "stock_code": executive.stock_code,
                        "firm_name": executive.firm_name,
                        "executive_name": executive.executive_name,
                        "position": executive.position,
                        "platform": platform,
                        "query": query,
                        "title": result.title,
                        "snippet": result.snippet,
                        "url": result.url,
                        "confidence_score": score,
                        "reason": reason,
                        "verify_status": VERIFY_STATUS,
                    }
                )
            if sleep_seconds > 0:
                time.sleep(sleep_seconds + random.uniform(0, min(0.5, sleep_seconds)))
    rows.sort(key=lambda row: (str(row["stock_code"]), str(row["executive_name"]), -int(row["confidence_score"])))
    return rows


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Find candidate executive short-video accounts from public search results.")
    parser.add_argument("--input", type=Path, default=INPUT_PATH, help="Input xlsx path. Default: data/raw/executive_list.xlsx")
    parser.add_argument("--output", type=Path, default=OUTPUT_PATH, help="Output xlsx path. Default: data/interim/candidate_accounts.xlsx")
    parser.add_argument("--max-results", type=int, default=5, help="Maximum search results to save per query. Default: 5")
    parser.add_argument("--timeout", type=int, default=20, help="HTTP timeout in seconds. Default: 20")
    parser.add_argument("--sleep", type=float, default=2.0, help="Polite delay between search requests in seconds. Default: 2")
    parser.add_argument(
        "--engine",
        choices=["auto", "duckduckgo", "bing"],
        default="auto",
        help="Public search engine to use. 'auto' tries DuckDuckGo then Bing. Default: auto",
    )
    parser.add_argument("--log-level", default="INFO", choices=["DEBUG", "INFO", "WARNING", "ERROR"])
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(sys.argv[1:] if argv is None else argv)
    logging.basicConfig(level=getattr(logging, args.log_level), format="%(asctime)s %(levelname)s %(message)s")

    records = read_xlsx_rows(args.input)
    executives = [Executive(**record) for record in records]
    LOGGER.info("Loaded %s executive rows from %s", len(executives), args.input)

    candidates = discover_candidates(
        executives,
        max_results=max(1, args.max_results),
        timeout=max(1, args.timeout),
        sleep_seconds=max(0.0, args.sleep),
        engine=args.engine,
    )
    write_xlsx(args.output, candidates, OUTPUT_COLUMNS)
    LOGGER.info("Wrote %s candidate rows to %s", len(candidates), args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
