const faqs = [
  {
    question: "Can I request a quotation before placing an order?",
    answer:
      "Yes. This website is inquiry-first. You can add products to the inquiry cart and submit your requirements for follow-up.",
  },
  {
    question: "Do I need a large order quantity?",
    answer:
      "Quantity requirements depend on the product, packaging, and supply arrangement. You can include your expected quantity in the inquiry.",
  },
  {
    question: "Can you ship internationally?",
    answer:
      "International shipping options depend on the destination country, product type, and order details. Shipping terms are confirmed before quotation.",
  },
  {
    question: "Are prices fixed on the website?",
    answer:
      "For B2B and cross-border inquiries, prices may change based on quantity, specification, packaging, and logistics requirements.",
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
        FAQ
      </p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950">
        Common questions from buyers.
      </h1>

      <div className="mt-10 space-y-4">
        {faqs.map((item) => (
          <div
            key={item.question}
            className="rounded-2xl border border-stone-200 bg-white p-6"
          >
            <h2 className="font-semibold text-stone-950">{item.question}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
