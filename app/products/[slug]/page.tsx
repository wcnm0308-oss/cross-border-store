import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import AddToCartButton from "@/components/AddToCartButton";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const quoteSteps = [
  {
    step: "01",
    title: "Add product to inquiry cart",
    text: "Collect this item with any other products you want us to quote.",
  },
  {
    step: "02",
    title: "Submit quantity and requirements",
    text: "Share target quantity, packaging needs, destination, and shipping notes.",
  },
  {
    step: "03",
    title: "Receive follow-up",
    text: "Our team reviews the request and follows up with price, MOQ, and lead time.",
  },
];

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
        <section className="grid gap-12 py-16 md:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm">
            <div className="aspect-square rounded-[1.5rem] bg-gradient-to-br from-stone-200 via-stone-100 to-white p-8">
              <div className="flex h-full items-center justify-center rounded-2xl border border-white/70 bg-white/50 text-center text-sm font-semibold text-stone-500">
                Product Image
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600">
              <p className="rounded-2xl bg-stone-50 px-4 py-3">
                <span className="font-semibold text-stone-950">MOQ:</span>{" "}
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

          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
              {product.category}
            </p>

            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
              {product.name}
            </h1>

            <p className="mt-5 text-lg leading-8 text-stone-600">
              {product.description}
            </p>

            <div className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                Price Reference
              </p>

              <p className="mt-2 text-3xl font-bold">
                ${product.price} {product.currency}
              </p>

              <p className="mt-3 text-sm leading-6 text-stone-600">
                {product.quoteNote}. Final quotation depends on quantity,
                packaging, destination country, shipping method, and lead time
                request.
              </p>
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
              This page supports inquiry-based sourcing. Add the product to
              your inquiry cart before submitting quantity, packaging, and
              shipping requirements.
            </p>
          </div>
        </section>

        <section className="grid gap-6 border-t border-stone-200 py-12 md:grid-cols-2">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Product Overview</h2>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              {product.shortDescription}
            </p>

            <ul className="mt-6 space-y-3 text-sm leading-6 text-stone-600">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-stone-950" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Sourcing Notes</h2>
            <div className="mt-5 grid gap-4 text-sm leading-6 text-stone-600">
              {product.sourcingNotes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Inquiry Tips</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-600">
              {product.inquiryTips.map((tip) => (
                <li key={tip} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-stone-950" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">
              Shipping & Packaging Discussion
            </h2>
            <p className="mt-5 text-sm leading-6 text-stone-600">
              Shipping cost and packaging plan are confirmed after we know the
              destination country, quantity, carton requirements, and preferred
              shipping method. Include these details in your inquiry so the
              follow-up can be more accurate.
            </p>
          </div>
        </section>

        <section className="border-t border-stone-200 py-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
              RFQ Process
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              How to request a quote
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {quoteSteps.map((item) => (
              <div
                key={item.step}
                className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
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

        <section className="rounded-[2rem] bg-stone-950 px-6 py-12 text-center text-white md:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-400">
            Ready for quotation
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            Add this product to your RFQ and send requirements.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-stone-300 md:text-base">
            You can review selected products in the inquiry cart or submit your
            sourcing inquiry directly.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/cart"
              className="rounded-full bg-white px-8 py-4 text-center text-sm font-semibold text-stone-950 hover:bg-stone-100"
            >
              Go to Inquiry Cart
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
