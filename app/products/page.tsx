import Link from "next/link";
import { products } from "@/data/products";

export default function ProductsPage() {
  return (
    <main className="bg-stone-50 px-6 pb-16 text-stone-950">
      <section className="mx-auto max-w-6xl">
        <section className="py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            Product Collection
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
            Products built for cross-border brand testing.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
            This is the first product collection page of our independent store
            MVP. Each product can be reviewed, added to the inquiry cart, and
            submitted for a custom quote.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
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

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-lg font-bold">
                    ${product.price} {product.currency}
                  </span>

                  <span className="text-sm font-semibold text-stone-500">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </section>
    </main>
  );
}
