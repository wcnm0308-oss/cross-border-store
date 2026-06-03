import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-stone-50 px-6 pb-16 text-stone-950">
      <section className="mx-auto max-w-6xl py-16">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-sm md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            404
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Page not found
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-stone-600">
            The page you are looking for may have moved or no longer exists.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="rounded-full bg-stone-950 px-8 py-4 text-center text-sm font-semibold text-white hover:bg-stone-800"
            >
              Back to Home
            </Link>

            <Link
              href="/products"
              className="rounded-full border border-stone-300 px-8 py-4 text-center text-sm font-semibold text-stone-950 hover:bg-stone-50"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
