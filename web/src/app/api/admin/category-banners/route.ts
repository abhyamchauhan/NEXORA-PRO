import type { Category } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";

const CATEGORIES: Category[] = ["men", "women", "kids"];

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);

export async function GET() {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const banners = await prisma.categoryBanner.findMany({
    orderBy: [{ category: "asc" }, { position: "asc" }],
  });
  return Response.json({ banners });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return forbidden();

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const category = b.category as Category;
  if (!CATEGORIES.includes(category))
    return Response.json({ error: "Category must be men, women or kids." }, { status: 400 });

  const last = await prisma.categoryBanner.findFirst({
    where: { category },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const banner = await prisma.categoryBanner.create({
    data: {
      category,
      heading: str(b.heading),
      subtext: str(b.subtext),
      image: str(b.image),
      buttonText: str(b.buttonText),
      buttonLink: str(b.buttonLink),
      position: (last?.position ?? -1) + 1,
    },
  });
  return Response.json({ banner }, { status: 201 });
}
