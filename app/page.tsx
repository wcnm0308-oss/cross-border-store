import Link from "next/link";

const featuredProducts = [
  {
    name: "Botanical Herbal Tea Sampler",
    slug: "botanical-herbal-tea-sampler",
    description:
      "A light herbal tea sampler for daily tea moments, gifting, and first-time cross-border orders.",
  },
  {
    name: "Daily Wellness Tea Gift Box",
    slug: "daily-wellness-tea-gift-box",
    description:
      "A gift-ready herbal tea box for personal routines, seasonal gifts, and small cross-border orders.",
  },
  {
    name: "Chinese Herbal Flower Tea Pack",
    slug: "chinese-herbal-flower-tea-pack",
    description:
      "A flower tea pack inspired by Chinese herbal tea culture, suitable for casual drinking and thoughtful gifting.",
  },
];

const advantages = [
  {
    title: "Request before checkout",
    text: "Before online checkout is ready, you can request an order and ask about shipping details.",
  },
  {
    title: "Small orders welcome",
    text: "Ask about one item, a few pieces, or a larger quantity. We will confirm what is available.",
  },
  {
    title: "Shipping questions welcome",
    text: "Share your country and product interest so delivery cost and timing can be discussed before payment.",
  },
];

const inquirySteps = [
  {
    step: "01",
    title: "Browse tea products",
    text: "Review herbal tea products, gift options, basic details, and price references.",
  },
  {
    step: "02",
    title: "Add to request cart",
    text: "Save tea products you want to ask about before checkout is available.",
  },
  {
    step: "03",
    title: "Send order request",
    text: "Send your name, email, country, message, and selected products.",
  },
  {
    step: "04",
    title: "Confirm next steps",
    text: "We reply with availability, shipping estimate, final cost, and payment arrangement.",
  },
];

export default function Home() {
  return (
    <main className="bg-stone-50 text-stone-950">
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10">
        <div className="grid items-center gap-12 py-16 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
              Cross-border Herbal Tea Store
            </p>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Shop herbal tea gifts with help before checkout.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
              Browse herbal tea products, ask about shipping, and request an
              order before online checkout is ready. Small orders, gift orders,
              and product questions are welcome.
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
                Request Order
              </Link>
            </div>

            <div className="mt-10 grid gap-4 text-sm text-stone-600 sm:grid-cols-3">
              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <p className="font-semibold text-stone-950">Herbal Tea Gifts</p>
                <p className="mt-2">Tea products for daily use and gifting.</p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <p className="font-semibold text-stone-950">Request Cart</p>
                <p className="mt-2">Save items before requesting.</p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <p className="font-semibold text-stone-950">Shipping Help</p>
                <p className="mt-2">Ask before payment.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="rounded-[1.5rem] bg-stone-100 p-6">
              <div className="rounded-[1.25rem] border border-white bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Order Request Preview
                </p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <p className="text-sm font-semibold text-stone-950">
                      Selected Products
                    </p>
                    <p className="mt-2 text-sm text-stone-600">
                      Herbal tea sampler x 2 sets
                    </p>
                    <p className="text-sm text-stone-600">
                      Tea gift box x 1 box
                    </p>
                  </div>

                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <p className="text-sm font-semibold text-stone-950">
                      Buyer Question
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      Can you confirm availability, shipping estimate, gift
                      packaging, and payment details before I place the order?
                    </p>
                  </div>

                  <div className="rounded-2xl bg-stone-950 p-4 text-white">
                    <p className="text-sm font-semibold">Request submitted</p>
                    <p className="mt-2 text-sm text-stone-300">
                      Saved for review and sent by email notification.
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
              Why Shop Here
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Built for cross-border herbal tea shopping while checkout is being prepared.
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
              From tea product browsing to order request.
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
                Start with herbal tea samplers and gift-ready products.
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
            Ready to order
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            Ask a tea product question or request an order.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-stone-300 md:text-base">
            Add herbal tea products to the request cart or send a request
            directly. We will confirm availability, delivery, final cost, and
            payment details.
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
              Request Order
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
