import type { MetadataRoute } from "next";
import { products } from "@/data/products";

const siteUrl = "https://cross-border-store-lac.vercel.app";
const lastModified = new Date();

const staticRoutes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/products", changeFrequency: "weekly", priority: 0.9 },
  { path: "/cart", changeFrequency: "monthly", priority: 0.6 },
  { path: "/inquiry", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/shipping", changeFrequency: "monthly", priority: 0.6 },
  { path: "/returns", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
] as const;

function absoluteUrl(path: string) {
  return path === "/" ? siteUrl : `${siteUrl}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const productPages = products.map((product) => ({
    url: absoluteUrl(`/products/${product.slug}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...publicPages, ...productPages];
}
