import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

// Render on request so it reflects the live catalogue (and never hits the DB at
// build time).
export const dynamic = "force-dynamic";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/shop?category=men`, priority: 0.8 },
    { url: `${base}/shop?category=women`, priority: 0.8 },
    { url: `${base}/shop?category=kids`, priority: 0.8 },
  ];

  try {
    const products = await prisma.product.findMany({
      select: { slug: true, updatedAt: true },
    });
    return [
      ...staticRoutes,
      ...products.map((p) => ({
        url: `${base}/product/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    // DB unavailable at build — still emit the static routes.
    return staticRoutes;
  }
}
