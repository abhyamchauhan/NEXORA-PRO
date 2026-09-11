import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep private/functional routes out of search results.
      disallow: ["/admin", "/api", "/account", "/orders", "/checkout", "/order"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
