import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const siteUrl = "https://cross-border-store-lac.vercel.app";
const siteTitle =
  "Cross Border Herbal Tea Store | Request Tea Gifts Online";
const siteDescription =
  "Cross-border herbal tea store for browsing tea gifts, requesting an order before checkout is ready, and asking about shipping and availability.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Cross Border Herbal Tea Store",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "Cross Border Herbal Tea Store",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col bg-stone-50 text-stone-950">
          <div className="mx-auto w-full max-w-6xl px-6 py-8">
            <Header />
          </div>

          <div className="flex-1">{children}</div>

          <Footer />
        </div>
      </body>
    </html>
  );
}
