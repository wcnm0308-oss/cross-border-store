export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
        About Us
      </p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950">
        Reliable sourcing for cross-border buyers.
      </h1>

      <p className="mt-6 text-lg leading-8 text-stone-700">
        Cross Border Store is a B2B-oriented independent store built for buyers
        who need clear product information, simple inquiry submission, and direct
        communication before placing bulk orders.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-semibold text-stone-950">Product Focus</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            We organize products around practical sourcing needs, specifications,
            and quotation discussions.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-semibold text-stone-950">Inquiry First</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Buyers can add products to an inquiry cart and send requirements
            directly for follow-up.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-semibold text-stone-950">Long-Term Ready</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            The site is designed to grow gradually with better products, policies,
            SEO, analytics, and operations.
          </p>
        </div>
      </div>
    </main>
  );
}
