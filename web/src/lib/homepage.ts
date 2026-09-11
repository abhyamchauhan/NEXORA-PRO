import type { HomepageSection, Product, Variant } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type HydratedSection = HomepageSection & {
  products: (Product & { variants: Variant[] })[];
};

export type HomeBannerView = {
  id: string;
  heading: string | null;
  subtext: string | null;
  image: string | null;
  buttonText: string | null;
  buttonLink: string | null;
};

// Visible homepage hero-carousel slides, in order.
export async function getHomeBanners(): Promise<HomeBannerView[]> {
  const rows = await prisma.homeBanner.findMany({
    where: { visible: true },
    orderBy: { position: "asc" },
  });
  return rows.map((b) => ({
    id: b.id,
    heading: b.heading,
    subtext: b.subtext,
    image: b.image,
    buttonText: b.buttonText,
    buttonLink: b.buttonLink,
  }));
}

// Fetch homepage sections in saved order, hydrating the picked products for
// featuredProducts sections (preserving the admin's chosen order).
export async function getHomepageSections(
  onlyVisible = true,
): Promise<HydratedSection[]> {
  const sections = await prisma.homepageSection.findMany({
    where: onlyVisible ? { visible: true } : undefined,
    orderBy: { position: "asc" },
  });

  const allIds = [...new Set(sections.flatMap((s) => s.productIds))];
  const products = allIds.length
    ? await prisma.product.findMany({
        where: { id: { in: allIds } },
        include: { variants: true },
      })
    : [];
  const byId = new Map(products.map((p) => [p.id, p]));

  return sections.map((s) => ({
    ...s,
    products: s.productIds
      .map((id) => byId.get(id))
      .filter((p): p is Product & { variants: Variant[] } => !!p),
  }));
}
