import Link from "next/link";

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const policyLinks = [
  { href: "/shipping", label: "Shipping & Delivery" },
  { href: "/returns", label: "Returns & Refunds" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-stone-950">
            Cross Border Store
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-stone-600">
            A cross-border independent store where buyers can browse products,
            ask questions, and confirm delivery and payment details before
            checkout is ready.
          </p>
          <div className="mt-5 grid gap-2 text-sm text-stone-600">
            <p>Request order before checkout.</p>
            <p>Email confirmation after submission.</p>
            <p>Final cost and shipping confirmed by email.</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-stone-950">Company</h3>
          <div className="mt-4 grid gap-3 text-sm text-stone-600">
            {companyLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-stone-950">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-stone-950">Policies</h3>
          <div className="mt-4 grid gap-3 text-sm text-stone-600">
            {policyLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-stone-950">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-5 text-xs text-stone-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Cross Border Store. All rights reserved.</p>
          <Link href="/admin" className="hover:text-stone-950">
            Admin Entrance
          </Link>
        </div>
      </div>
    </footer>
  );
}
