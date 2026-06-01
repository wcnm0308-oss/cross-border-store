"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
};

const cartKey = "cross-border-store-cart";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = window.localStorage.getItem(cartKey);
    const items: CartItem[] = savedCart ? JSON.parse(savedCart) : [];
    setCartItems(items);
  }, []);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }, [cartItems]);

  function handleClearCart() {
    window.localStorage.removeItem(cartKey);
    setCartItems([]);
  }

  function handleRemoveItem(id: string) {
    const nextCart = cartItems.filter((item) => item.id !== id);
    window.localStorage.setItem(cartKey, JSON.stringify(nextCart));
    setCartItems(nextCart);
  }

  return (
    <main className="bg-stone-50 px-6 pb-16 text-stone-950">
      <section className="mx-auto max-w-5xl">
        <section className="py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            Inquiry Cart
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
            Review the products you want to quote.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
            Submit your inquiry to request pricing, MOQ, shipping, and lead
            time.
          </p>
        </section>

        {cartItems.length === 0 ? (
          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-bold">
              Your inquiry cart is empty.
            </h2>

            <p className="mt-4 text-sm leading-6 text-stone-600">
              Continue browsing products and add items you want us to quote.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-block rounded-full bg-stone-950 px-8 py-4 text-sm font-semibold text-white hover:bg-stone-800"
            >
              Continue Browsing
            </Link>
          </section>
        ) : (
          <section className="grid gap-8 md:grid-cols-[1.4fr_0.8fr]">
            <div className="grid gap-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-stone-500">
                        Quantity: {item.quantity}
                      </p>

                      <Link
                        href={`/products/${item.slug}`}
                        className="mt-2 block text-2xl font-bold hover:underline"
                      >
                        {item.name}
                      </Link>

                      <p className="mt-2 text-sm text-stone-600">
                        ${item.price} {item.currency} / item
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:items-end">
                      <p className="text-xl font-bold">
                        ${item.price * item.quantity} {item.currency}
                      </p>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="rounded-full border border-stone-300 px-5 py-2 text-sm font-semibold hover:bg-stone-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Inquiry Summary</h2>

              <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-6">
                <span className="text-sm font-semibold text-stone-600">
                  Estimated Product Total
                </span>

                <span className="text-2xl font-bold">${totalPrice} USD</span>
              </div>

              <Link
                href="/inquiry"
                className="mt-8 block rounded-full bg-stone-950 px-8 py-4 text-center text-sm font-semibold text-white hover:bg-stone-800"
              >
                Submit Inquiry
              </Link>

              <button
                type="button"
                onClick={handleClearCart}
                className="mt-3 w-full rounded-full border border-stone-300 px-8 py-4 text-sm font-semibold hover:bg-stone-50"
              >
                Clear Inquiry Cart
              </button>

              <p className="mt-5 text-xs leading-5 text-stone-500">
                This RFQ flow sends your selected products to our team so we can
                confirm pricing, MOQ, shipping, and lead time.
              </p>
            </aside>
          </section>
        )}
      </section>
    </main>
  );
}
