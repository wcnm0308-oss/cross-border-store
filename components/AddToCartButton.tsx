"use client";

import { Product } from "@/data/products";
import { useState } from "react";

type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
};

type AddToCartButtonProps = {
  product: Product;
};

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    const cartKey = "cross-border-store-cart";
    const oldCart = window.localStorage.getItem(cartKey);
    const cartItems: CartItem[] = oldCart ? JSON.parse(oldCart) : [];

    const existingItem = cartItems.find((item) => item.id === product.id);

    let nextCart: CartItem[];

    if (existingItem) {
      nextCart = cartItems.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      );
    } else {
      nextCart = [
        ...cartItems,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          currency: product.currency,
          quantity: 1,
        },
      ];
    }

    window.localStorage.setItem(cartKey, JSON.stringify(nextCart));
    window.dispatchEvent(new Event("cart-updated"));
    setAdded(true);
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={handleAddToCart}
        className="rounded-full bg-stone-950 px-8 py-4 text-sm font-semibold text-white hover:bg-stone-800"
      >
        Add to Request Cart
      </button>

      {added && (
        <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          Added to request cart. You can review selected products before
          submitting your order request.
        </p>
      )}
    </div>
  );
}
