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

const navItems = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/inquiry", label: "Request Order" },
];

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
    <header className="flex items-center justify-between gap-6">
      <Link href="/" className="shrink-0 text-xl font-bold tracking-tight">
        Cross Border Store
      </Link>

      <nav className="hidden items-center gap-6 text-sm font-semibold text-stone-600 md:flex">
        {navItems.map((item) => {
          const isActive =
            item.href === "/products"
              ? pathname.startsWith("/products")
              : pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "text-stone-950"
                  : "hover:text-stone-950"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/cart"
        className="shrink-0 rounded-full border border-stone-300 px-5 py-2 text-sm font-semibold hover:bg-white"
      >
        Inquiry Cart
        {cartCount > 0 && (
          <span className="ml-2 rounded-full bg-stone-950 px-2 py-0.5 text-xs text-white">
            {cartCount}
          </span>
        )}
      </Link>
    </header>
  );
}
