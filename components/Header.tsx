"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
};

const cartKey = "cross-border-store-cart";

export default function Header() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  function updateCartCount() {
    try {
      const savedCart = window.localStorage.getItem(cartKey);
      const cartItems: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

      const totalQuantity = cartItems.reduce((total, item) => {
        return total + Number(item.quantity || 0);
      }, 0);

      setCartCount(totalQuantity);
    } catch {
      setCartCount(0);
    }
  }

  useEffect(() => {
    updateCartCount();
  }, [pathname]);

  useEffect(() => {
    updateCartCount();

    window.addEventListener("focus", updateCartCount);
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cart-updated", updateCartCount);

    return () => {
      window.removeEventListener("focus", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="text-xl font-bold tracking-tight">
        跨境商店
      </Link>

      <nav className="hidden items-center gap-6 text-sm font-semibold text-stone-600 md:flex">
        <Link href="/products" className="hover:text-stone-950">
          产品展示
        </Link>

        <Link href="/cart" className="hover:text-stone-950">
          购物车
        </Link>

        <Link href="/contact" className="hover:text-stone-950">
          询盘
        </Link>
      </nav>

      <Link
        href="/cart"
        className="rounded-full border border-stone-300 px-5 py-2 text-sm font-semibold hover:bg-white"
      >
        查看购物车
        {cartCount > 0 && (
          <span className="ml-2 rounded-full bg-stone-950 px-2 py-0.5 text-xs text-white">
            {cartCount}
          </span>
        )}
      </Link>
    </header>
  );
}