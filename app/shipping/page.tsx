export default function ShippingPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
        Shipping & Delivery
      </p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950">
        Shipping details are confirmed before payment.
      </h1>

      <div className="mt-8 space-y-6 text-stone-700">
        <p>
          International shipping cost depends on destination country, product
          type, quantity, packaging, and available delivery options.
        </p>

        <p>
          Because online checkout is still being prepared, you can submit a
          request first and ask about the shipping estimate before payment.
        </p>

        <p>
          Please include your destination country, expected quantity, and any
          delivery questions when submitting an order request.
        </p>
      </div>
    </main>
  );
}
