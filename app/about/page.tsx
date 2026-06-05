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
      <p className="mt-4 text-base leading-7 text-stone-600">
        Submit an order request first, receive confirmation by email, and review
        availability, shipping estimate, final cost, and payment details before
        deciding whether to continue.
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
            Add products to the request cart and ask about availability,
            delivery, packaging, or payment before deciding whether to continue.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-semibold text-stone-950">Email Confirmation</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            After you submit a request, we send confirmation and follow up by
            email before any payment step is arranged.
          </p>
        </div>
      </div>
    </main>
  );
}
