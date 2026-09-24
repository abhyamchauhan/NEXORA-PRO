import { getUserSession, unauthorized } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";

// Wishlist is per-user. All endpoints scoped to the signed-in customer.
export async function GET() {
  const session = await getUserSession();
  if (!session) return unauthorized();
  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    select: { productId: true },
  });
  return Response.json({ productIds: items.map((i) => i.productId) });
}

export async function POST(req: Request) {
  const session = await getUserSession();
  if (!session) return unauthorized();
  const { productId } = await req.json().catch(() => ({}));
  if (typeof productId !== "string")
    return Response.json({ error: "productId required" }, { status: 400 });

  // Ignore if the product doesn't exist.
  const exists = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  if (!exists) return Response.json({ error: "Not found" }, { status: 404 });

  await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    update: {},
    create: { userId: session.user.id, productId },
  });
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getUserSession();
  if (!session) return unauthorized();
  const { productId } = await req.json().catch(() => ({}));
  if (typeof productId !== "string")
    return Response.json({ error: "productId required" }, { status: 400 });
  await prisma.wishlistItem.deleteMany({
    where: { userId: session.user.id, productId },
  });
  return Response.json({ ok: true });
}
