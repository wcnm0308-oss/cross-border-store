import Link from "next/link";
import type { ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  getInquiryStatusBadgeClass,
  getInquiryStatusLabel,
} from "@/lib/inquiry-status";

export const dynamic = "force-dynamic";

type InquiryRecord = Record<string, unknown>;

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

function getFirstValue(record: InquiryRecord | null, keys: string[]) {
  if (!record) return null;

  for (const key of keys) {
    const value = record[key];

    if (
      value !== null &&
      value !== undefined &&
      !(typeof value === "string" && value.trim() === "")
    ) {
      return value;
    }
  }

  return null;
}

function formatText(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";

  if (typeof value === "string") return value || "-";
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "-";
  }
}

function formatDate(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";

  const rawValue = String(value);
  const date = new Date(rawValue);

  if (Number.isNaN(date.getTime())) {
    return rawValue || "-";
  }

  return date.toLocaleString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getItemValue(item: Record<string, unknown>, keys: string[]) {
  return formatText(getFirstValue(item, keys));
}

function renderStructuredValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return <p className="text-sm text-slate-500">-</p>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <p className="text-sm text-slate-500">-</p>;
    }

    if (value.every(isRecord)) {
      return (
        <div className="space-y-3">
          {value.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-col gap-2 text-sm md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    {getItemValue(item, ["name", "product_name", "title"])}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    SKU: {getItemValue(item, ["sku", "id", "slug"])}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                    Qty: {getItemValue(item, ["quantity", "qty"])}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                    Price: {getItemValue(item, ["price", "unit_price"])}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }

  if (typeof value === "string") {
    return <p className="whitespace-pre-wrap text-sm text-slate-700">{value}</p>;
  }

  return (
    <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-700 ring-1 ring-slate-200">
      {formatText(value)}
    </pre>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="grid gap-1 border-b border-slate-100 py-3 last:border-0 md:grid-cols-3 md:gap-4">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="whitespace-pre-wrap break-words text-sm text-slate-900 md:col-span-2">
        {formatText(value)}
      </dd>
    </div>
  );
}

function AdminPasswordMissing() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-red-700">
          绠＄悊鍛樺瘑鐮佹湭閰嶇疆
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          璇峰厛鎶?ADMIN_PASSWORD 娣诲姞鍒颁綘鐨勭幆澧冨彉閲忛噷銆?
        </p>
      </div>
    </main>
  );
}

function UnauthorizedAdmin() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          璇㈢洏绠＄悊鍚庡彴
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          杈撳叆绠＄悊鍛樺瘑鐮佸悗锛屽彲浠ユ煡鐪嬪拰绠＄悊瀹㈡埛璇㈢洏璁板綍銆?
        </p>

        <form className="mt-6 space-y-4" method="get">
          <div>
            <label htmlFor="key" className="block text-sm font-medium text-slate-700">
              绠＄悊鍛樺瘑鐮?
            </label>
            <input
              id="key"
              name="key"
              type="password"
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              placeholder="杈撳叆瀵嗙爜"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            杩涘叆鍚庡彴
          </button>
        </form>
      </div>
    </main>
  );
}

function SupabaseConfigMissing() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-red-700">
          Supabase 鐜鍙橀噺缂哄け
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          璇锋鏌?NEXT_PUBLIC_SUPABASE_URL 鍜?SUPABASE_SERVICE_ROLE_KEY銆?
        </p>
      </div>
    </main>
  );
}

function MessageCard({
  title,
  message,
  backHref,
}: {
  title: string;
  message: string;
  backHref: string;
}) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href={backHref}
          className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
        >
          Back to Inquiries
        </Link>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-3 text-sm text-slate-600">{message}</p>
        </div>
      </div>
    </main>
  );
}

export default async function InquiryDetailPage({
  params,
  searchParams,
}: PageProps) {
  const [{ id }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const inputKey =
    typeof resolvedSearchParams?.key === "string" ? resolvedSearchParams.key : "";
  const backHref = inputKey
    ? `/admin/inquiries?key=${encodeURIComponent(inputKey)}`
    : "/admin/inquiries";

  const adminPassword = process.env.ADMIN_PASSWORD;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const isUnlocked = Boolean(adminPassword) && inputKey === adminPassword;

  if (!adminPassword) {
    return <AdminPasswordMissing />;
  }

  if (!isUnlocked) {
    return <UnauthorizedAdmin />;
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return <SupabaseConfigMissing />;
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <MessageCard
        backHref={backHref}
        title="Unable to load inquiry"
        message={error.message || "The inquiry could not be loaded."}
      />
    );
  }

  const inquiry = (data ?? null) as InquiryRecord | null;

  if (!inquiry) {
    return (
      <MessageCard
        backHref={backHref}
        title="Inquiry not found"
        message="No inquiry record was found for this ID."
      />
    );
  }

  const status = getFirstValue(inquiry, ["status"]);
  const products = getFirstValue(inquiry, [
    "products",
    "items",
    "cart_items",
    "inquiry_items",
    "interested_product",
  ]);
  const message = getFirstValue(inquiry, ["message", "requirements", "note"]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link
            href={backHref}
            className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            Back to Inquiries
          </Link>
        </div>

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-slate-500">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Inquiry Details
            </h1>
            <p className="mt-3 break-all text-sm text-slate-600">
              Inquiry ID: {formatText(getFirstValue(inquiry, ["id"]))}
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full border px-4 py-2 text-sm font-semibold ${getInquiryStatusBadgeClass(
              status,
            )}`}
          >
            {getInquiryStatusLabel(status)}
          </span>
        </div>

        <div className="space-y-6">
          <InfoCard title="Customer Information">
            <dl>
              <InfoRow label="Customer Name" value={getFirstValue(inquiry, ["customer_name", "name"])} />
              <InfoRow label="Email" value={getFirstValue(inquiry, ["email", "customer_email"])} />
              <InfoRow label="Company" value={getFirstValue(inquiry, ["company", "company_name"])} />
              <InfoRow label="Phone / WhatsApp" value={getFirstValue(inquiry, ["phone", "whatsapp", "WhatsApp"])} />
              <InfoRow label="Country" value={getFirstValue(inquiry, ["country", "destination_country"])} />
            </dl>
          </InfoCard>

          <InfoCard title="Inquiry Items / Products">
            {renderStructuredValue(products)}
          </InfoCard>

          <InfoCard title="Message / Requirements">
            {renderStructuredValue(message)}
          </InfoCard>

          <InfoCard title="Status & Timeline">
            <dl>
              <InfoRow label="Status" value={getInquiryStatusLabel(status)} />
              <InfoRow label="Created At" value={formatDate(getFirstValue(inquiry, ["created_at"]))} />
              <InfoRow label="Updated At" value={formatDate(getFirstValue(inquiry, ["updated_at"]))} />
            </dl>
          </InfoCard>
        </div>

        <div className="mt-8">
          <Link
            href={backHref}
            className="inline-flex rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Back to Inquiries
          </Link>
        </div>
      </div>
    </main>
  );
}
