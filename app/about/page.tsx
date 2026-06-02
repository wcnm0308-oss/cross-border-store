export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
        About Us
      </p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950">
        A simple cross-border store in its early stage.
      </h1>

      <p className="mt-6 text-lg leading-8 text-stone-700">
        Cross Border Store helps individual buyers browse products, ask order
        questions, and confirm international delivery and payment details before
        online checkout is ready.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-semibold text-stone-950">Product Browsing</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Browse practical products with clear descriptions and price
            references before sending a request.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-semibold text-stone-950">Ask Before Buying</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Add products to the inquiry cart and ask about availability,
            delivery, packaging, or payment before placing an order.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-semibold text-stone-950">Growing Store</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            The site will grow gradually with better products, clearer policies,
            checkout options, and customer support.
          </p>
        </div>
      </div>
    </main>
  );
}
