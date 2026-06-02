export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
        Terms of Service
      </p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950">
        This website is used for product display and inquiry communication.
      </h1>

      <div className="mt-8 space-y-6 text-stone-700">
        <p>
          Product information on this website is for reference and inquiry
          purposes. Final pricing, availability, specifications, packaging,
          shipping cost, and delivery time should be confirmed before order.
        </p>

        <p>
          Submitting an inquiry does not create a binding purchase contract. A
          formal order should be based on confirmed quotation, payment terms, and
          agreement between both parties.
        </p>

        <p>
          We may update product information, website content, and service terms
          as the business develops.
        </p>
      </div>
    </main>
  );
}
