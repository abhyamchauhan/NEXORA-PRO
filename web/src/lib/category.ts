import type { Category } from "@prisma/client";
import { prisma } from "./prisma";

export type CategoryTile = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
};

export type CategoryGroup = {
  group: string;
  tiles: CategoryTile[];
};

export type CategoryBannerView = {
  id: string;
  heading: string | null;
  subtext: string | null;
  image: string | null;
  buttonText: string | null;
  buttonLink: string | null;
};

export const isCategory = (v: string): v is Category =>
  v === "men" || v === "women" || v === "kids";

export function slugify(v: string): string {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Flat list of sub-categories for admin selects (product tagging).
export async function getSubCategoryOptions() {
  const subs = await prisma.subCategory.findMany({
    orderBy: [{ category: "asc" }, { group: "asc" }, { position: "asc" }],
    select: { id: true, name: true, group: true, category: true },
  });
  return subs;
}

// Everything the category landing page needs: ordered visible banners, and the
// sub-categories grouped by their `group` label, each with a representative
// image (its own, or the first product photo tagged to it as a fallback).
export async function getCategoryLanding(category: Category) {
  const [banners, subs] = await Promise.all([
    prisma.categoryBanner.findMany({
      where: { category, visible: true },
      orderBy: { position: "asc" },
    }),
    prisma.subCategory.findMany({
      where: { category },
      orderBy: [{ group: "asc" }, { position: "asc" }],
    }),
  ]);

  // Fallback images: first product photo per sub-category that has no image set.
  const missing = subs.filter((s) => !s.image).map((s) => s.id);
  const fallback = new Map<string, string>();
  if (missing.length) {
    const products = await prisma.product.findMany({
      where: { subCategoryId: { in: missing } },
      select: { subCategoryId: true, variants: { select: { images: true }, take: 1 } },
    });
    for (const p of products) {
      if (!p.subCategoryId || fallback.has(p.subCategoryId)) continue;
      const img = p.variants.flatMap((v) => v.images).find(Boolean);
      if (img) fallback.set(p.subCategoryId, img);
    }
  }

  // Preserve first-seen group order (already sorted by group then position).
  const groupsMap = new Map<string, CategoryGroup>();
  for (const s of subs) {
    if (!groupsMap.has(s.group)) groupsMap.set(s.group, { group: s.group, tiles: [] });
    groupsMap.get(s.group)!.tiles.push({
      id: s.id,
      name: s.name,
      slug: s.slug,
      image: s.image ?? fallback.get(s.id) ?? null,
    });
  }

  const bannerViews: CategoryBannerView[] = banners.map((b) => ({
    id: b.id,
    heading: b.heading,
    subtext: b.subtext,
    image: b.image,
    buttonText: b.buttonText,
    buttonLink: b.buttonLink,
  }));

  return { banners: bannerViews, groups: [...groupsMap.values()] };
}
