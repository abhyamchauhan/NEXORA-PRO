import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";
import { parseProductInput } from "@/lib/product-input";
import { uniqueSlug } from "@/lib/slug";

// GET /api/admin/products?q=&category=&sort=
export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) return forbidden();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const category = searchParams.get("category")?.trim();
  const sort = searchParams.get("sort")?.trim();

  const where: Prisma.ProductWhereInput = {};
  if (q) where.name = { contains: q, mode: "insensitive" };
  if (category && ["men", "women", "kids"].includes(category))
    where.category = category as Prisma.ProductWhereInput["category"];

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : sort === "name"
          ? { name: "asc" }
          : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { variants: true },
  });

  return Response.json({ products });
}

// POST /api/admin/products
export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return forbidden();

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = parseProductInput(raw);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  const data = parsed.data;

  const slug = await uniqueSlug(data.name);

  const product = await prisma.product.create({
    data: {
      slug,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      featured: data.featured,
      subCategoryId: data.subCategoryId,
      material: data.material,
      care: data.care,
      rating: data.rating,
      reviewCount: data.reviewCount,
      variants: {
        create: data.variants.map((v) => ({
          size: v.size,
          color: v.color,
          colorHex: v.colorHex,
          stock: v.stock,
          displayMode: v.displayMode,
          images: v.images,
          imageLabels: v.imageLabels,
        })),
      },
    },
    include: { variants: true },
  });

  return Response.json({ product }, { status: 201 });
}
