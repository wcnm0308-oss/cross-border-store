import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  INQUIRY_STATUS_OPTIONS,
  getInquiryStatusBadgeClass,
  getInquiryStatusLabel,
  getInquiryStatusSelectValue,
  isInquiryStatus,
} from "@/lib/inquiry-status";

export const dynamic = "force-dynamic";

type Inquiry = {
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

async function updateInquiryStatus(formData: FormData) {
  "use server";

  const adminPassword = process.env.ADMIN_PASSWORD;
  const inputKey = String(formData.get("adminKey") || "");
  const inquiryId = String(formData.get("inquiryId") || "");
  const nextStatus = String(formData.get("status") || "new");

  if (!adminPassword || inputKey !== adminPassword) {
    redirect("/admin/inquiries");
  }

  if (!inquiryId || !isInquiryStatus(nextStatus)) {
    redirect(
      `/admin/inquiries?key=${encodeURIComponent(
        inputKey,
      )}&statusError=invalid`,
    );
  }

  const supabase = getSupabaseAdminClient();

  await supabase
    .from("inquiries")
    .update({ status: nextStatus })
    .eq("id", inquiryId);

  revalidatePath("/admin/inquiries");
  redirect(`/admin/inquiries?key=${encodeURIComponent(inputKey)}`);
}

export default async function AdminInquiriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const inputKey = typeof params?.key === "string" ? params.key : "";
  const statusError =
    typeof params?.statusError === "string" ? params.statusError : "";

  const adminPassword = process.env.ADMIN_PASSWORD;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const isUnlocked = Boolean(adminPassword) && inputKey === adminPassword;

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
    .select(
      "id,name,email,interested_product,message,cart_items,cart_total,country,status,created_at"
    )
    .order("created_at", { ascending: false })
    .limit(50);

  const inquiries = (data ?? []) as Inquiry[];

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

          <div className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
            Total shown: {inquiries.length}
          </div>
        </div>

        {statusError === "invalid" ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            Status was not saved because it is not a supported pipeline status.
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
              暂无询盘
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              客户提交询盘后，会显示在这里。
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
                          href={`/admin/inquiries/${encodeURIComponent(
                            inquiry.id
                          )}?key=${encodeURIComponent(inputKey)}`}
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
