import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cross Border Store",
  description: "A cross-border independent store MVP built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-stone-50 text-stone-950">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <Header />
          </div>

          {children}
        </div>
      </body>
    </html>
  );
}