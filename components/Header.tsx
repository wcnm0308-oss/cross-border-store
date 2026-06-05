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

const mobileNavItems = [
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Request Cart" },
  { href: "/inquiry", label: "Request Order" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
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

  function isNavItemActive(href: string) {
    if (href === "/products") {
      return pathname.startsWith("/products");
    }

    return pathname === href;
  }

  return (
    <header className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="shrink-0 text-lg font-bold tracking-tight sm:text-xl">
          Cross Border Store
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-stone-600 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                isNavItemActive(item.href)
                  ? "text-stone-950"
                  : "hover:text-stone-950"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/cart"
            className="rounded-full border border-stone-300 px-3 py-2 text-sm font-semibold hover:bg-white sm:px-5"
          >
            Request Cart
            {cartCount > 0 && (
              <span className="ml-2 rounded-full bg-stone-950 px-2 py-0.5 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-site-nav"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold hover:bg-white md:hidden"
          >
            {isMobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav
          id="mobile-site-nav"
          className="grid gap-2 rounded-3xl border border-stone-200 bg-white p-3 text-sm font-semibold text-stone-700 shadow-sm md:hidden"
        >
          {mobileNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl px-4 py-3 ${
                isNavItemActive(item.href)
                  ? "bg-stone-950 text-white"
                  : "hover:bg-stone-50 hover:text-stone-950"
              }`}
            >
              {item.label}
              {item.href === "/cart" && cartCount > 0 && (
                <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-950">
                  {cartCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
