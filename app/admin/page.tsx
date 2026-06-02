import Link from "next/link";

export default function AdminHomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
        Admin
      </p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950">
        Inquiry management entrance.
      </h1>

      <p className="mt-6 text-lg leading-8 text-stone-700">
        Use the admin inquiry dashboard to review buyer submissions, search
        inquiries, filter by status, and manage follow-up progress.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/admin/login"
          className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800"
        >
          Admin Login
        </Link>

        <Link
          href="/admin/inquiries"
          className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-900 hover:bg-white"
        >
          Go to Inquiries
        </Link>
      </div>
    </main>
  );
}
