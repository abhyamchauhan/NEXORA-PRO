import type { Category } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";

const CATEGORIES: Category[] = ["men", "women", "kids"];

// GET — the image for each of the three categories.
export async function GET() {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const rows = await prisma.categorySetting.findMany();
  const map: Record<string, string | null> = { men: null, women: null, kids: null };
  for (const r of rows) map[r.category] = r.image ?? null;
  return Response.json({ images: map });
}

// PUT { category, image } — set/replace one category's representative image.
export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return forbidden();

  const b = (await req.json().catch(() => ({}))) as { category?: string; image?: string | null };
  const category = b.category as Category;
  if (!CATEGORIES.includes(category))
    return Response.json({ error: "Category must be men, women or kids." }, { status: 400 });
  const image = typeof b.image === "string" && b.image.trim() ? b.image.trim() : null;

  await prisma.categorySetting.upsert({
    where: { category },
    create: { category, image },
    update: { image },
  });
  return Response.json({ ok: true, category, image });
}
