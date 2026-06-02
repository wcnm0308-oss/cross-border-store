const faqs = [
  {
    question: "Can I order as an individual buyer?",
    answer:
      "Yes. This store is designed for individual cross-border buyers first. Small orders and product questions are welcome.",
  },
  {
    question: "Why do I need to submit a request instead of checkout now?",
    answer:
      "Online checkout is not ready yet. You can submit a request so we can confirm availability, delivery, final cost, and payment details before you order.",
  },
  {
    question: "Can I ask about shipping before payment?",
    answer:
      "Yes. Please share your destination country and the products you are interested in, and we can discuss the shipping estimate before payment.",
  },
  {
    question: "Can I buy small quantities?",
    answer:
      "Yes. You can ask about one item, a few pieces, or a larger quantity. Availability and delivery details may vary by product.",
  },
  {
    question: "How will I receive the final price?",
    answer:
      "After you submit a request, we review the products, quantity, destination country, and shipping needs, then reply by email with the next step.",
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
        FAQ
      </p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950">
        Common questions before ordering.
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
