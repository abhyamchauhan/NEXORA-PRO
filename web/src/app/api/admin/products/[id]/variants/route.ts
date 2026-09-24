import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";
import { parseVariantInput } from "@/lib/product-input";

type Ctx = { params: Promise<{ id: string }> };

// Add ONE new variant to an existing product (matrix "add size/colour" in edit
// mode). Independent of the other variants.
export async function POST(req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id }, select: { id: true } });
  if (!product) return Response.json({ error: "Product not found." }, { status: 404 });

  const parsed = parseVariantInput(await req.json().catch(() => ({})));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  const variant = await prisma.variant.create({
    data: { ...parsed.data, productId: id },
  });
  return Response.json({ variant }, { status: 201 });
}
