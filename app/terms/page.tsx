export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
        Terms of Service
      </p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950">
        This website is used for product browsing and order requests.
      </h1>

      <div className="mt-8 space-y-6 text-stone-700">
        <p>
          Product information on this website is for reference while online
          checkout is being prepared. Final availability, price, packaging,
          shipping cost, delivery time, and payment details should be confirmed
          before order.
        </p>

        <p>
          Submitting a request does not create a binding purchase contract. A
          final order should be based on confirmed product details, shipping
          estimate, payment terms, and buyer approval.
        </p>

        <p>
          We may update product information, website content, and service terms
          as the business develops.
        </p>
      </div>
    </main>
  );
}
