import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";
import { parseProductInput } from "@/lib/product-input";
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

// PATCH /api/admin/products/:id  — updates fields and reconciles variants.
export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();

  const { id } = await params;
  const existing = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });
  if (!existing) return Response.json({ error: "Not found." }, { status: 404 });

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const parsed = parseProductInput(raw);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  const data = parsed.data;

  // Regenerate slug only if the name changed.
  const slug =
    data.name === existing.name
      ? existing.slug
      : await uniqueSlug(data.name, existing.id);

  const incomingIds = new Set(
    data.variants.map((v) => v.id).filter((x): x is string => !!x),
  );
  const toDelete = existing.variants
    .filter((v) => !incomingIds.has(v.id))
    .map((v) => v.id);

  const product = await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        slug,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        featured: data.featured,
        material: data.material,
        care: data.care,
        rating: data.rating,
        reviewCount: data.reviewCount,
      },
    });

    // Remove variants the admin deleted (order-item refs are set null, history
    // is preserved via the snapshot columns).
    if (toDelete.length)
      await tx.variant.deleteMany({ where: { id: { in: toDelete } } });

    for (const v of data.variants) {
      const values = {
        size: v.size,
        color: v.color,
        colorHex: v.colorHex,
        stock: v.stock,
        displayMode: v.displayMode,
        images: v.images,
        imageLabels: v.imageLabels,
      };
      if (v.id && existing.variants.some((e) => e.id === v.id)) {
        await tx.variant.update({ where: { id: v.id }, data: values });
      } else {
        await tx.variant.create({ data: { ...values, productId: id } });
      }
    }

    return tx.product.findUnique({ where: { id }, include: { variants: true } });
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
