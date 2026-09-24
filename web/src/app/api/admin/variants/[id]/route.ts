import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";
import { parseVariantInput } from "@/lib/product-input";

type Ctx = { params: Promise<{ id: string }> };

// Update ONE variant in place — never touches sibling variants or the product.
export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const { id } = await params;

  const parsed = parseVariantInput(await req.json().catch(() => ({})));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  try {
    const variant = await prisma.variant.update({
      where: { id },
      data: parsed.data,
    });
    return Response.json({ variant });
  } catch {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
}

// Delete ONE variant.
export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const { id } = await params;
  try {
    await prisma.variant.delete({ where: { id } });
  } catch {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
