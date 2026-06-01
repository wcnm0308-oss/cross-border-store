export default function Home() {
  return (
    <main className="bg-stone-50 text-stone-950">
      <section className="mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl flex-col px-6 pb-8">
        <div className="grid flex-1 items-center gap-12 py-20 md:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
              Cross-border DTC Brand Store
            </p>

            <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Build a global brand, not just an online shop.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-stone-600">
              A clean cross-border e-commerce storefront for showcasing
              products, telling brand stories, collecting inquiries, and
              preparing for global sales.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="/products"
                className="rounded-full bg-stone-950 px-8 py-4 text-center text-sm font-semibold text-white hover:bg-stone-800"
              >
                View Products
              </a>

              <a
                href="/contact"
                className="rounded-full border border-stone-300 px-8 py-4 text-center text-sm font-semibold text-stone-950 hover:bg-white"
              >
                Get Inquiry
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="aspect-[4/5] rounded-[1.5rem] bg-gradient-to-br from-stone-200 via-stone-100 to-white p-6">
              <div className="flex h-full flex-col justify-between rounded-[1rem] border border-white/70 bg-white/60 p-6 backdrop-blur">
                <div>
                  <p className="text-sm font-semibold text-stone-500">
                    Featured Product
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">
                    Global-ready product card
                  </h2>
                </div>

                <div>
                  <p className="text-sm leading-6 text-stone-600">
                    Product image, price, selling points, shipping notes, and
                    inquiry button will be placed here.
                  </p>

                  <div className="mt-6 rounded-full bg-stone-950 px-5 py-3 text-center text-sm font-semibold text-white">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-4 border-t border-stone-200 py-12 md:grid-cols-3">
          {["Product Display", "Brand Trust", "Inquiry Funnel"].map((item) => (
            <div key={item} className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold">{item}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                This block will become part of our cross-border independent
                store MVP.
              </p>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}