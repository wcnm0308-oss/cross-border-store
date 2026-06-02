import Link from "next/link";

const featuredProducts = [
  {
    name: "Minimal Travel Organizer",
    slug: "minimal-travel-organizer",
    description:
      "Compact travel storage product suitable for lightweight cross-border retail and bulk sourcing.",
  },
  {
    name: "Everyday Canvas Tote",
    slug: "everyday-canvas-tote",
    description:
      "Practical daily-use bag product with room for packaging, branding, and quantity-based quotation.",
  },
  {
    name: "Desk Cable Kit",
    slug: "desk-cable-kit",
    description:
      "Small desktop accessory product suitable for simple product display and inquiry-based orders.",
  },
];

const advantages = [
  {
    title: "Inquiry-first workflow",
    text: "Buyers can collect interested products into an inquiry cart and submit detailed requirements before quotation.",
  },
  {
    title: "Flexible order discussion",
    text: "MOQ, packaging, shipping method, destination country, and lead time can be confirmed during follow-up.",
  },
  {
    title: "Built for export communication",
    text: "The site structure supports product display, buyer information collection, and admin-side inquiry tracking.",
  },
];

const inquirySteps = [
  {
    step: "01",
    title: "Browse products",
    text: "Review product pages, basic details, and potential sourcing options.",
  },
  {
    step: "02",
    title: "Add to inquiry cart",
    text: "Select products and quantities before submitting a request.",
  },
  {
    step: "03",
    title: "Submit requirements",
    text: "Send name, email, company, country, message, and selected products.",
  },
  {
    step: "04",
    title: "Receive follow-up",
    text: "The inquiry is saved in the admin dashboard and sent by email for business follow-up.",
  },
];

export default function Home() {
  return (
    <main className="bg-stone-50 text-stone-950">
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10">
        <div className="grid items-center gap-12 py-16 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
              Inquiry-based Cross-border Store
            </p>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              A practical sourcing website for global buyers.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
              Explore products, add them to an inquiry cart, submit sourcing
              requirements, and start quotation communication without a complex
              checkout process.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/products"
                className="rounded-full bg-stone-950 px-8 py-4 text-center text-sm font-semibold text-white hover:bg-stone-800"
              >
                View Products
              </Link>

              <Link
                href="/inquiry"
                className="rounded-full border border-stone-300 px-8 py-4 text-center text-sm font-semibold text-stone-950 hover:bg-white"
              >
                Request a Quote
              </Link>
            </div>

            <div className="mt-10 grid gap-4 text-sm text-stone-600 sm:grid-cols-3">
              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <p className="font-semibold text-stone-950">Product Display</p>
                <p className="mt-2">Clear product entry points.</p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <p className="font-semibold text-stone-950">Inquiry Cart</p>
                <p className="mt-2">Collect products before RFQ.</p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <p className="font-semibold text-stone-950">Admin Follow-up</p>
                <p className="mt-2">Track inquiry status later.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="rounded-[1.5rem] bg-stone-100 p-6">
              <div className="rounded-[1.25rem] border border-white bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Buyer Inquiry Preview
                </p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <p className="text-sm font-semibold text-stone-950">
                      Selected Products
                    </p>
                    <p className="mt-2 text-sm text-stone-600">
                      Travel organizer × 200 units
                    </p>
                    <p className="text-sm text-stone-600">
                      Canvas tote × 500 units
                    </p>
                  </div>

                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <p className="text-sm font-semibold text-stone-950">
                      Buyer Requirement
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      Please quote FOB price, packaging options, sample lead
                      time, and shipping estimate to destination country.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-stone-950 p-4 text-white">
                    <p className="text-sm font-semibold">Inquiry submitted</p>
                    <p className="mt-2 text-sm text-stone-300">
                      Saved to database and sent by email notification.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="border-t border-stone-200 py-14">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
              Why Choose Us
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Designed for real inquiry communication.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {advantages.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-stone-200 py-14">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              From product browsing to quotation follow-up.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {inquirySteps.map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-bold text-stone-400">
                  {item.step}
                </p>
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-stone-200 py-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
                Featured Products
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Start with available product examples.
              </h2>
            </div>

            <Link
              href="/products"
              className="rounded-full border border-stone-300 px-6 py-3 text-center text-sm font-semibold text-stone-950 hover:bg-white"
            >
              View All Products
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-stone-200 via-stone-100 to-white" />
                <h3 className="mt-5 text-lg font-bold group-hover:text-stone-700">
                  {product.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {product.description}
                </p>
                <p className="mt-5 text-sm font-semibold text-stone-950">
                  View details →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-stone-950 px-6 py-12 text-center text-white md:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-400">
            Ready for RFQ
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            Send product requirements and start quotation discussion.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-stone-300 md:text-base">
            Add products to the inquiry cart or submit your sourcing request
            directly. We will use your details for quotation and follow-up.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/products"
              className="rounded-full bg-white px-8 py-4 text-center text-sm font-semibold text-stone-950 hover:bg-stone-100"
            >
              Browse Products
            </Link>

            <Link
              href="/inquiry"
              className="rounded-full border border-stone-600 px-8 py-4 text-center text-sm font-semibold text-white hover:bg-stone-900"
            >
              Submit Inquiry
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
