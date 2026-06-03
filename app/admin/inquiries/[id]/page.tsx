import Link from "next/link";
import type { ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminPassword, isAdminAuthorized } from "@/lib/admin-auth";
import {
  getInquiryStatusBadgeClass,
  getInquiryStatusLabel,
} from "@/lib/inquiry-status";

export const dynamic = "force-dynamic";

type InquiryRecord = Record<string, unknown>;

type InternalNote = {
  id: string;
  note: string | null;
  created_at: string | null;
  created_by: string | null;
};

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

function renderCartItem(item: Record<string, unknown>, index: number) {
  const productName = getItemValue(item, [
    "name",
    "product_name",
    "title",
    "slug",
    "id",
  ]);
  const sku = getItemValue(item, ["slug", "id", "sku"]);
  const quantity = getItemValue(item, ["quantity", "qty"]);
  const price = getItemValue(item, ["price", "unit_price"]);
  const currency = getItemValue(item, ["currency"]);
  const priceLabel =
    price === "-" ? "-" : currency === "-" ? price : `${price} ${currency}`;

  return (
    <div
      key={index}
      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
    >
      <div className="flex flex-col gap-3 text-sm md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-semibold text-slate-900">{productName}</p>
          <p className="mt-1 text-xs text-slate-500">SKU: {sku}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
            Qty: {quantity}
          </span>
          <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
            Price: {priceLabel}
          </span>
        </div>
      </div>
    </div>
  );
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
          {value.map((item, index) => renderCartItem(item, index))}
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
          Admin password is not configured
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Please add ADMIN_PASSWORD to your environment variables.
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
          Order Request Admin
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Enter the admin password to view and manage customer order requests.
        </p>

        <form className="mt-6 space-y-4" method="get">
          <div>
            <label htmlFor="key" className="block text-sm font-medium text-slate-700">
              Admin Password
            </label>
            <input
              id="key"
              name="key"
              type="password"
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Enter Admin
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

function SupabaseConfigMissing() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-red-700">
          Supabase environment variables are missing
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
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

function getSearchParam(
  params: Awaited<PageProps["searchParams"]>,
  key: string,
) {
  const value = params?.[key];

  return typeof value === "string" ? value.trim() : "";
}

function buildBackHref(params: {
  key: string;
  q?: string;
  status?: string;
  dateRange?: string;
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

  const queryString = searchParams.toString();

  return queryString ? `/admin/inquiries?${queryString}` : "/admin/inquiries";
}

function buildDetailHref(
  id: string,
  params: {
    key: string;
    q?: string;
    status?: string;
    dateRange?: string;
    notesError?: string;
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

  if (params.notesError) {
    searchParams.set("notesError", params.notesError);
  }

  const queryString = searchParams.toString();

  return queryString
    ? `/admin/inquiries/${encodeURIComponent(id)}?${queryString}`
    : `/admin/inquiries/${encodeURIComponent(id)}`;
}

async function addInternalNote(formData: FormData) {
  "use server";

  const inputKey = String(formData.get("adminKey") || "");
  const inquiryId = String(formData.get("inquiryId") || "");
  const note = String(formData.get("note") || "").trim();
  const q = String(formData.get("q") || "").trim();
  const status = String(formData.get("statusFilter") || "");
  const dateRange = String(formData.get("dateRange") || "all");
  const redirectHref = inquiryId
    ? buildDetailHref(inquiryId, {
        key: inputKey,
        q,
        status,
        dateRange,
      })
    : buildBackHref({ key: inputKey, q, status, dateRange });

  if (!(await isAdminAuthorized(inputKey))) {
    redirect("/admin/inquiries");
  }

  if (!inquiryId || !note) {
    redirect(redirectHref);
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("inquiry_notes").insert({
    inquiry_id: inquiryId,
    note,
    created_by: "admin",
  });

  if (error) {
    redirect(
      buildDetailHref(inquiryId, {
        key: inputKey,
        q,
        status,
        dateRange,
        notesError: "unavailable",
      }),
    );
  }

  revalidatePath(`/admin/inquiries/${inquiryId}`);
  redirect(redirectHref);
}

export default async function InquiryDetailPage({
  params,
  searchParams,
}: PageProps) {
  const [{ id }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const inputKey = getSearchParam(resolvedSearchParams, "key");
  const backHref = buildBackHref({
    key: inputKey,
    q: getSearchParam(resolvedSearchParams, "q"),
    status: getSearchParam(resolvedSearchParams, "status"),
    dateRange: getSearchParam(resolvedSearchParams, "dateRange"),
  });
  const q = getSearchParam(resolvedSearchParams, "q");
  const statusFilter = getSearchParam(resolvedSearchParams, "status");
  const dateRange = getSearchParam(resolvedSearchParams, "dateRange");
  const notesError = getSearchParam(resolvedSearchParams, "notesError");

  const adminPassword = getAdminPassword();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const isUnlocked = await isAdminAuthorized(inputKey);

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
        title="Unable to load order request"
        message={error.message || "The order request could not be loaded."}
      />
    );
  }

  const inquiry = (data ?? null) as InquiryRecord | null;

  if (!inquiry) {
    return (
      <MessageCard
        backHref={backHref}
        title="Order request not found"
        message="No order request record was found for this ID."
      />
    );
  }

  const status = getFirstValue(inquiry, ["status"]);
  const products = getFirstValue(inquiry, [
    "request_cart",
    "request_cart_items",
    "cart",
    "products",
    "items",
    "cart_items",
    "order_items",
    "inquiry_items",
    "interested_product",
    "interested_products",
  ]);
  const message = getFirstValue(inquiry, ["message", "requirements", "note"]);
  const { data: notesData, error: notesQueryError } = await supabase
    .from("inquiry_notes")
    .select("id,note,created_at,created_by")
    .eq("inquiry_id", id)
    .order("created_at", { ascending: false });
  const internalNotes = (notesData ?? []) as InternalNote[];
  const notesUnavailable = Boolean(notesQueryError);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href={backHref}
            className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            Back to Inquiries
          </Link>
          <Link
            href="/admin/logout"
            className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            Log Out
          </Link>
        </div>

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-slate-500">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Order Request Details
            </h1>
            <p className="mt-3 break-all text-sm text-slate-600">
              Request ID: {formatText(getFirstValue(inquiry, ["id"]))}
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
              <InfoRow label="Country" value={getFirstValue(inquiry, ["country", "destination_country"])} />
              <InfoRow label="Company" value={getFirstValue(inquiry, ["company", "company_name"])} />
              <InfoRow label="Phone / WhatsApp" value={getFirstValue(inquiry, ["phone", "whatsapp", "WhatsApp"])} />
              <InfoRow label="Estimated Quantity" value={getFirstValue(inquiry, ["quantity", "estimated_quantity"])} />
            </dl>
          </InfoCard>

          <InfoCard title="Request Cart / Products">
            {renderStructuredValue(products)}
          </InfoCard>

          <InfoCard title="Customer Message">
            {renderStructuredValue(message)}
          </InfoCard>

          <InfoCard title="Internal Follow-up Notes">
            {notesUnavailable ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                Follow-up notes are not available until the database migration is
                applied.
              </div>
            ) : (
              <div className="space-y-5">
                {notesError === "unavailable" ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    The note could not be saved. Please confirm the database
                    migration has been applied.
                  </div>
                ) : null}

                {internalNotes.length > 0 ? (
                  <div className="space-y-3">
                    {internalNotes.map((note) => (
                      <div
                        key={note.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-800">
                          {note.note || "-"}
                        </p>
                        <p className="mt-3 text-xs text-slate-500">
                          {formatDate(note.created_at)} by{" "}
                          {note.created_by || "admin"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No follow-up notes yet.
                  </p>
                )}

                <form action={addInternalNote} className="space-y-3">
                  <input type="hidden" name="adminKey" value={inputKey} />
                  <input type="hidden" name="inquiryId" value={id} />
                  <input type="hidden" name="q" value={q} />
                  <input
                    type="hidden"
                    name="statusFilter"
                    value={statusFilter}
                  />
                  <input type="hidden" name="dateRange" value={dateRange} />

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      Add Follow-up Note
                    </span>
                    <textarea
                      name="note"
                      required
                      rows={4}
                      className="resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                      placeholder="Record reply status, shipping estimate, quoted price, customer feedback, or next follow-up step..."
                    />
                  </label>

                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  >
                    Save Follow-up Note
                  </button>
                </form>
              </div>
            )}
          </InfoCard>

          <InfoCard title="Status & Timeline">
            <dl>
              <InfoRow label="Current Status" value={getInquiryStatusLabel(status)} />
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
