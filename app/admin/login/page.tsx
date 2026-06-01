import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getAdminPassword,
  hasValidAdminCookie,
  isValidAdminPassword,
  setAdminSessionCookie,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchParam(
  params: Awaited<PageProps["searchParams"]>,
  key: string,
) {
  const value = params?.[key];

  return typeof value === "string" ? value.trim() : "";
}

async function loginAction(formData: FormData) {
  "use server";

  const password = String(formData.get("password") || "");

  if (!isValidAdminPassword(password)) {
    redirect("/admin/login?error=invalid");
  }

  await setAdminSessionCookie();
  redirect("/admin/inquiries");
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const error = getSearchParam(params, "error");
  const isConfigured = Boolean(getAdminPassword());
  const isLoggedIn = await hasValidAdminCookie();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Admin Login
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Enter the admin password to manage customer inquiries.
        </p>

        {!isConfigured ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            ADMIN_PASSWORD is not configured.
          </div>
        ) : null}

        {isLoggedIn ? (
          <Link
            href="/admin/inquiries"
            className="mt-6 inline-flex w-full justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open Inquiries
          </Link>
        ) : (
          <form action={loginAction} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Admin Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                placeholder="Enter password"
              />
            </div>

            {error === "invalid" ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                The password is incorrect.
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!isConfigured}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Log In
            </button>
          </form>
        )}

        <Link
          href="/admin/inquiries"
          className="mt-4 inline-flex w-full justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to Inquiries
        </Link>
      </div>
    </main>
  );
}
