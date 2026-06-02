import Link from "next/link";
import { products } from "@/data/products";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductsPage() {
  return (
    <main className="bg-stone-50 px-6 pb-16 text-stone-950">
      <section className="mx-auto max-w-6xl">
        <section className="grid gap-8 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
              Products
            </p>

            <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
              Browse cross-border products.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
              Explore product examples, ask questions before buying, and send
              an order request while online checkout is being prepared.
            </p>
          </div>

          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-stone-950">
              Contact before payment
            </p>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Availability, shipping estimate, final cost, and payment details
              can be confirmed before you place an order.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="flex rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex w-full flex-col">
                <Link
                  href={`/products/${product.slug}`}
                  className="group block"
                >
                  <div className="aspect-square rounded-[1.5rem] bg-gradient-to-br from-stone-200 via-stone-100 to-white p-6">
                    <div className="flex h-full items-center justify-center rounded-2xl border border-white/70 bg-white/50 text-center text-sm font-semibold text-stone-500">
                      Product Image
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-medium text-stone-500">
                      {product.category}
                    </p>

                    <h2 className="mt-2 text-xl font-bold group-hover:underline">
                      {product.name}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      {product.shortDescription}
                    </p>
                  </div>
                </Link>

                <div className="mt-5 space-y-3 border-t border-stone-200 pt-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                      Price Reference
                    </p>
                    <p className="mt-1 text-lg font-bold">
                      ${product.price} {product.currency}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-stone-500">
                      {product.quoteNote}
                    </p>
                  </div>

                  <div className="grid gap-2 text-xs leading-5 text-stone-600">
                    <p className="rounded-2xl bg-stone-50 px-4 py-3">
                      <span className="font-semibold text-stone-950">
                        Order note:
                      </span>{" "}
                      {product.moq}
                    </p>
                    <p className="rounded-2xl bg-stone-50 px-4 py-3">
                      <span className="font-semibold text-stone-950">
                        Packaging:
                      </span>{" "}
                      {product.packaging}
                    </p>
                  </div>
                </div>

                <div className="mt-auto grid gap-3 pt-6">
                  <Link
                    href={`/products/${product.slug}`}
                    className="rounded-full border border-stone-300 px-6 py-3 text-center text-sm font-semibold hover:bg-stone-50"
                  >
                    View Details
                  </Link>

                  <AddToCartButton product={product} />
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-[2rem] bg-stone-950 px-6 py-12 text-center text-white md:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-400">
            Ask Before Buying
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            Have a question before ordering?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-stone-300 md:text-base">
            Tell us which product you like, where it should be shipped, and
            what you want to confirm before payment.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/inquiry"
              className="rounded-full bg-white px-8 py-4 text-center text-sm font-semibold text-stone-950 hover:bg-stone-100"
            >
              Request Order
            </Link>

            <Link
              href="/cart"
              className="rounded-full border border-stone-600 px-8 py-4 text-center text-sm font-semibold text-white hover:bg-stone-900"
            >
              Go to Inquiry Cart
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
