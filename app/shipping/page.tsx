export default function ShippingPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
        Shipping & Delivery
      </p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950">
        Shipping options are confirmed before quotation.
      </h1>

      <div className="mt-8 space-y-6 text-stone-700">
        <p>
          Shipping methods, lead time, and delivery costs depend on product type,
          order quantity, destination country, and buyer requirements.
        </p>

        <p>
          For inquiry-based orders, we usually confirm shipping details together
          with the quotation, including estimated production time, packaging,
          export arrangement, and available logistics options.
        </p>

        <p>
          Buyers can include destination country, expected quantity, and delivery
          requirements when submitting an inquiry.
        </p>
      </div>
    </main>
  );
}
