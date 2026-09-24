import type { Category } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";
import { slugify } from "@/lib/category";

const CATEGORIES: Category[] = ["men", "women", "kids"];

// A slug unique within a category (append -2, -3, … on collision).
async function uniqueSlug(category: Category, name: string, ignoreId?: string) {
  const base = slugify(name) || "item";
  let slug = base;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const clash = await prisma.subCategory.findFirst({
      where: { category, slug, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
      select: { id: true },
    });
    if (!clash) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const subs = await prisma.subCategory.findMany({
    orderBy: [{ category: "asc" }, { group: "asc" }, { position: "asc" }],
  });
  return Response.json({ subCategories: subs });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return forbidden();

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const category = b.category as Category;
  const group = typeof b.group === "string" ? b.group.trim() : "";
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const image = typeof b.image === "string" && b.image.trim() ? b.image.trim() : null;

  if (!CATEGORIES.includes(category))
    return Response.json({ error: "Category must be men, women or kids." }, { status: 400 });
  if (!group) return Response.json({ error: "Group is required (e.g. Topwear)." }, { status: 400 });
  if (!name) return Response.json({ error: "Name is required." }, { status: 400 });

  const slug = await uniqueSlug(category, name);
  // Append after the current max position within this category+group.
  const last = await prisma.subCategory.findFirst({
    where: { category, group },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const sub = await prisma.subCategory.create({
    data: { category, group, name, slug, image, position: (last?.position ?? -1) + 1 },
  });
  return Response.json({ subCategory: sub }, { status: 201 });
}
