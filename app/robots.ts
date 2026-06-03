import type { MetadataRoute } from "next";

const siteUrl = "https://cross-border-store-lac.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/admin/*"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
