import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import AddToCartButton from "@/components/AddToCartButton";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-stone-50 px-6 pb-16 text-stone-950">
      <section className="mx-auto max-w-6xl">
        <section className="grid gap-12 py-16 md:grid-cols-2">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm">
            <div className="aspect-square rounded-[1.5rem] bg-gradient-to-br from-stone-200 via-stone-100 to-white p-8">
              <div className="flex h-full items-center justify-center rounded-2xl border border-white/70 bg-white/50 text-center text-sm font-semibold text-stone-500">
                Product Image
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
              {product.category}
            </p>

            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
              {product.name}
            </h1>

            <p className="mt-5 text-2xl font-bold">
              ${product.price} {product.currency}
            </p>

            <p className="mt-6 text-lg leading-8 text-stone-600">
              {product.description}
            </p>

            <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">Product Highlights</h2>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-600">
                {product.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-stone-950" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <AddToCartButton product={product} />

              <Link
                href="/inquiry"
                className="rounded-full border border-stone-300 px-8 py-4 text-center text-sm font-semibold hover:bg-white"
              >
                Request a Quote
              </Link>
            </div>

            <p className="mt-5 text-sm leading-6 text-stone-500">
              Add this product to your inquiry cart to request pricing, MOQ,
              shipping options, and lead time.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
