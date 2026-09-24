import type { SectionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";

const TYPES: SectionType[] = [
  "hero",
  "banner",
  "featuredProducts",
  "categoryShowcase",
  "heroCarousel",
];

// GET — all sections (including hidden) for the admin editor.
export async function GET() {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const sections = await prisma.homepageSection.findMany({
    orderBy: { position: "asc" },
  });
  return Response.json({ sections });
}

// POST { type } — create a section with sensible defaults at the end.
export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return forbidden();

  const body = await req.json().catch(() => ({}));
  const type = body?.type as SectionType;
  if (!TYPES.includes(type))
    return Response.json({ error: "Invalid section type." }, { status: 400 });

  const defaults: Record<SectionType, Record<string, unknown>> = {
    hero: {
      heading: "New season, engineered clean.",
      subtext: "The season drop",
      buttonText: "Shop all",
      buttonLink: "/shop",
    },
    banner: {
      heading: "Free delivery across India",
      subtext: "Limited time",
      buttonText: "Shop now",
      buttonLink: "/shop",
    },
    featuredProducts: { heading: "Featured", productIds: [] },
    categoryShowcase: {
      heading: "Shop by category",
      categories: ["men", "women", "kids"],
    },
    heroCarousel: { heading: "Hero slider" },
  };

  // The hero slider defaults to the TOP (position 0) as a sensible starting
  // point — but it's a normal reorderable section, so the admin can move it
  // anywhere afterwards. Everything else appends to the end.
  let position: number;
  if (type === "heroCarousel") {
    await prisma.homepageSection.updateMany({ data: { position: { increment: 1 } } });
    position = 0;
  } else {
    const last = await prisma.homepageSection.findFirst({ orderBy: { position: "desc" } });
    position = (last?.position ?? -1) + 1;
  }

  const section = await prisma.homepageSection.create({
    data: { type, position, ...defaults[type] },
  });
  return Response.json({ section }, { status: 201 });
}
