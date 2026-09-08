import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";
import { parseProductFields } from "@/lib/product-input";
import { uniqueSlug } from "@/lib/slug";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/admin/products/:id
export async function GET(_req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });
  if (!product) return Response.json({ error: "Not found." }, { status: 404 });
  return Response.json({ product });
}

// PATCH /api/admin/products/:id — updates PRODUCT FIELDS ONLY. Variants are
// managed independently via the per-variant endpoints, so editing product
// details never touches (or requires resubmitting) variants.
export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Not found." }, { status: 404 });

  const parsed = parseProductFields(await req.json().catch(() => null));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  const data = parsed.data;

  const slug =
    data.name === existing.name
      ? existing.slug
      : await uniqueSlug(data.name, existing.id);

  const product = await prisma.product.update({
    where: { id },
    data: {
      slug,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      featured: data.featured,
      bgColor: data.bgColor,
      material: data.material,
      care: data.care,
      rating: data.rating,
      reviewCount: data.reviewCount,
    },
    include: { variants: true },
  });

  return Response.json({ product });
}

// DELETE /api/admin/products/:id
export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();

  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
