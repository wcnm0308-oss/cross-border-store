import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminPassword, isAdminAuthorized } from "@/lib/admin-auth";
import {
  INQUIRY_STATUS_OPTIONS,
  getInquiryStatusBadgeClass,
  getInquiryStatusLabel,
  getInquiryStatusSelectValue,
  isInquiryStatus,
} from "@/lib/inquiry-status";

export const dynamic = "force-dynamic";

type Inquiry = {
  [key: string]: unknown;
  id: string;
  name: string | null;
  email: string | null;
  interested_product: string | null;
  message: string | null;
  cart_items: unknown;
  cart_total: number | null;
  country: string | null;
  status: string | null;
  created_at: string | null;
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const DATE_RANGE_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "last7", label: "Last 7 days" },
  { value: "last30", label: "Last 30 days" },
] as const;

type DateRange = (typeof DATE_RANGE_OPTIONS)[number]["value"];

const SEARCH_FIELDS = [
  "name",
  "customer_name",
  "email",
  "customer_email",
  "company",
  "company_name",
  "country",
  "destination_country",
  "interested_product",
  "cart_items",
  "items",
  "products",
  "message",
  "requirements",
  "note",
];

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

function formatDate(value: string | null) {
  if (!value) return "-";

  try {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatCartItems(value: unknown) {
  if (!value) return "-";

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "-";
  }
}

function getSearchParam(
  params: Awaited<PageProps["searchParams"]>,
  key: string,
) {
  const value = params?.[key];

  return typeof value === "string" ? value.trim() : "";
}

function isDateRange(value: unknown): value is DateRange {
  return DATE_RANGE_OPTIONS.some((option) => option.value === value);
}

function stringifySearchValue(value: unknown, depth = 0): string {
  if (value === null || value === undefined || depth > 4) {
    return "";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => stringifySearchValue(item, depth + 1)).join(" ");
  }

  if (typeof value === "object") {
    return Object.values(value)
      .map((item) => stringifySearchValue(item, depth + 1))
      .join(" ");
  }

  return "";
}

function matchesKeyword(inquiry: Inquiry, keyword: string) {
  if (!keyword) {
    return true;
  }

  const normalizedKeyword = keyword.toLowerCase();
  const searchableText = SEARCH_FIELDS.map((field) =>
    stringifySearchValue(inquiry[field]),
  )
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedKeyword);
}

function getDateRangeStart(dateRange: DateRange) {
  const start = new Date();

  if (dateRange === "today") {
    start.setHours(0, 0, 0, 0);
    return start;
  }

  if (dateRange === "last7") {
    start.setDate(start.getDate() - 7);
    return start;
  }

  if (dateRange === "last30") {
    start.setDate(start.getDate() - 30);
    return start;
  }

  return null;
}

function matchesDateRange(value: unknown, dateRange: DateRange) {
  const start = getDateRangeStart(dateRange);

  if (!start) {
    return true;
  }

  if (value === null || value === undefined || value === "") {
    return true;
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return true;
  }

  return date >= start;
}

function buildAdminInquiriesHref(params: {
  key: string;
  q?: string;
  status?: string;
  dateRange?: string;
  statusError?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params.key) {
    searchParams.set("key", params.key);
  }

  if (params.q) {
    searchParams.set("q", params.q);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.dateRange && params.dateRange !== "all") {
    searchParams.set("dateRange", params.dateRange);
  }

  if (params.statusError) {
    searchParams.set("statusError", params.statusError);
  }

  const queryString = searchParams.toString();

  return queryString ? `/admin/inquiries?${queryString}` : "/admin/inquiries";
}

function buildAdminInquiryDetailHref(
  id: string,
  params: {
    key: string;
    q?: string;
    status?: string;
    dateRange?: string;
  },
) {
  const searchParams = new URLSearchParams();

  if (params.key) {
    searchParams.set("key", params.key);
  }

  if (params.q) {
    searchParams.set("q", params.q);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.dateRange && params.dateRange !== "all") {
    searchParams.set("dateRange", params.dateRange);
  }

  const queryString = searchParams.toString();

  return queryString
    ? `/admin/inquiries/${encodeURIComponent(id)}?${queryString}`
    : `/admin/inquiries/${encodeURIComponent(id)}`;
}

async function updateInquiryStatus(formData: FormData) {
  "use server";

  const inputKey = String(formData.get("adminKey") || "");
  const inquiryId = String(formData.get("inquiryId") || "");
  const nextStatus = String(formData.get("status") || "new");
  const q = String(formData.get("q") || "").trim();
  const statusFilter = String(formData.get("statusFilter") || "");
  const dateRangeFilter = String(formData.get("dateRange") || "all");
  const redirectHref = buildAdminInquiriesHref({
    key: inputKey,
    q,
    status: isInquiryStatus(statusFilter) ? statusFilter : "",
    dateRange: isDateRange(dateRangeFilter) ? dateRangeFilter : "all",
  });

  if (!(await isAdminAuthorized(inputKey))) {
    redirect("/admin/inquiries");
  }

  if (!inquiryId || !isInquiryStatus(nextStatus)) {
    redirect(
      buildAdminInquiriesHref({
        key: inputKey,
        q,
        status: isInquiryStatus(statusFilter) ? statusFilter : "",
        dateRange: isDateRange(dateRangeFilter) ? dateRangeFilter : "all",
        statusError: "invalid",
      }),
    );
  }

  const supabase = getSupabaseAdminClient();

  await supabase
    .from("inquiries")
    .update({ status: nextStatus })
    .eq("id", inquiryId);

  revalidatePath("/admin/inquiries");
  redirect(redirectHref);
}

export default async function AdminInquiriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const inputKey = getSearchParam(params, "key");
  const q = getSearchParam(params, "q");
  const rawStatusFilter = getSearchParam(params, "status");
  const selectedStatus = isInquiryStatus(rawStatusFilter)
    ? rawStatusFilter
    : "";
  const rawDateRange = getSearchParam(params, "dateRange");
  const dateRange = isDateRange(rawDateRange) ? rawDateRange : "all";
  const statusError = getSearchParam(params, "statusError");
  const hasInvalidStatusFilter = Boolean(rawStatusFilter && !selectedStatus);
  const hasActiveFilters = Boolean(q || selectedStatus || dateRange !== "all");
  const clearFiltersHref = buildAdminInquiriesHref({ key: inputKey });

  const adminPassword = getAdminPassword();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const isUnlocked = await isAdminAuthorized(inputKey);

  if (!adminPassword) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-red-700">
            管理员密码未配置
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            请先把 ADMIN_PASSWORD 添加到你的环境变量里。
          </p>
        </div>
      </main>
    );
  }

  if (!isUnlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            询盘管理后台
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            输入管理员密码后，可以查看和管理客户询盘记录。
          </p>

          <form className="mt-6 space-y-4" method="get">
            <div>
              <label
                htmlFor="key"
                className="block text-sm font-medium text-slate-700"
              >
                管理员密码
              </label>
              <input
                id="key"
                name="key"
                type="password"
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                placeholder="输入密码"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              进入后台
            </button>
          </form>

          <Link
            href="/admin/login"
            className="mt-4 inline-flex w-full justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Go to Admin Login
          </Link>
        </div>
      </main>
    );
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-red-700">
            Supabase 环境变量缺失
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            请检查 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY。
          </p>
        </div>
      </main>
    );
  }

  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const allInquiries = (data ?? []) as Inquiry[];
  const statusCounts = INQUIRY_STATUS_OPTIONS.map((status) => ({
    ...status,
    count: allInquiries.filter((inquiry) => inquiry.status === status.value)
      .length,
    href: buildAdminInquiriesHref({
      key: inputKey,
      q,
      status: status.value,
      dateRange,
    }),
  }));
  const inquiries = allInquiries.filter((inquiry) => {
    return (
      matchesKeyword(inquiry, q) &&
      (!selectedStatus || inquiry.status === selectedStatus) &&
      matchesDateRange(inquiry.created_at, dateRange)
    );
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-slate-500">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Customer Inquiries
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              查看客户询盘，并管理每条询盘的跟进状态。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
              Showing {inquiries.length} inquiries
            </div>
            <Link
              href="/admin/logout"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              Log Out
            </Link>
          </div>
        </div>

        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {statusCounts.map((status) => {
            const isSelected = selectedStatus === status.value;

            return (
              <Link
                key={status.value}
                href={status.href}
                className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 ${
                  isSelected
                    ? "border-slate-900 ring-2 ring-slate-900/10"
                    : "border-slate-200"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {status.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {status.count}
                </p>
              </Link>
            );
          })}
        </section>

        <form
          method="get"
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <input type="hidden" name="key" value={inputKey} />

          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_auto_auto] lg:items-end">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Keyword
              </span>
              <input
                name="q"
                type="search"
                defaultValue={q}
                placeholder="Search name, email, company, country, product..."
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Status
              </span>
              <select
                name="status"
                defaultValue={selectedStatus}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              >
                <option value="">All statuses</option>
                {INQUIRY_STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.value}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Date Range
              </span>
              <select
                name="dateRange"
                defaultValue={dateRange}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              >
                {DATE_RANGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Apply Filters
            </button>

            <Link
              href={clearFiltersHref}
              className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear Filters
            </Link>
          </div>
        </form>

        {statusError === "invalid" ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            Status was not saved because it is not a supported pipeline status.
          </div>
        ) : null}

        {hasInvalidStatusFilter ? (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
            Unsupported status filter ignored.
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-6 text-red-700 shadow-sm">
            <h2 className="text-lg font-semibold">读取询盘失败</h2>
            <p className="mt-2 text-sm">{error.message}</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              {hasActiveFilters
                ? "No inquiries match the current filters."
                : "No inquiries yet"}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {hasActiveFilters
                ? "Try adjusting the keyword, status, or date range."
                : "Customer inquiries will appear here after submission."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Country
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Cart
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Details
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Message
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="align-top">
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {formatDate(inquiry.created_at)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-900">
                        {inquiry.name || "-"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                        {inquiry.email || "-"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                        {inquiry.country || "-"}
                      </td>

                      <td className="min-w-48 px-4 py-4 text-slate-700">
                        {inquiry.interested_product || "-"}
                      </td>

                      <td className="min-w-64 px-4 py-4">
                        <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-700">
                          {formatCartItems(inquiry.cart_items)}
                        </pre>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                        {inquiry.cart_total ?? "-"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <form
                          action={updateInquiryStatus}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="hidden"
                            name="adminKey"
                            value={inputKey}
                          />
                          <input
                            type="hidden"
                            name="inquiryId"
                            value={inquiry.id}
                          />
                          <input type="hidden" name="q" value={q} />
                          <input
                            type="hidden"
                            name="statusFilter"
                            value={selectedStatus}
                          />
                          <input
                            type="hidden"
                            name="dateRange"
                            value={dateRange}
                          />

                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getInquiryStatusBadgeClass(
                              inquiry.status,
                            )}`}
                          >
                            {getInquiryStatusLabel(inquiry.status)}
                          </span>

                          <select
                            name="status"
                            defaultValue={getInquiryStatusSelectValue(
                              inquiry.status,
                            )}
                            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-slate-900"
                          >
                            {INQUIRY_STATUS_OPTIONS.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.value}
                              </option>
                            ))}
                          </select>

                          <button
                            type="submit"
                            className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                          >
                            Save
                          </button>
                        </form>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <Link
                          href={buildAdminInquiryDetailHref(inquiry.id, {
                            key: inputKey,
                            q,
                            status: selectedStatus,
                            dateRange,
                          })}
                          className="inline-flex rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          View Details
                        </Link>
                      </td>

                      <td className="min-w-80 px-4 py-4 leading-6 text-slate-700">
                        {inquiry.message || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
