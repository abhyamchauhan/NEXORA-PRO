import { getUserSession, unauthorized } from "@/lib/auth-guard";
import {
  getCartLines,
  addToCart,
  setCartQty,
  removeFromCart,
  clearCart,
} from "@/lib/cart";

// All cart endpoints are scoped to the signed-in user — a customer can only
// ever read or change their own cart.

export async function GET() {
  const session = await getUserSession();
  if (!session) return unauthorized();
  const lines = await getCartLines(session.user.id);
  return Response.json({ lines });
}

export async function POST(req: Request) {
  const session = await getUserSession();
  if (!session) return unauthorized();
  const { variantId, quantity } = await req.json().catch(() => ({}));
  if (typeof variantId !== "string")
    return Response.json({ error: "variantId required" }, { status: 400 });
  await addToCart(session.user.id, variantId, Math.max(1, Number(quantity) || 1));
  return Response.json({ lines: await getCartLines(session.user.id) });
}

export async function PATCH(req: Request) {
  const session = await getUserSession();
  if (!session) return unauthorized();
  const { variantId, quantity } = await req.json().catch(() => ({}));
  if (typeof variantId !== "string")
    return Response.json({ error: "variantId required" }, { status: 400 });
  await setCartQty(session.user.id, variantId, Number(quantity) || 0);
  return Response.json({ lines: await getCartLines(session.user.id) });
}

export async function DELETE(req: Request) {
  const session = await getUserSession();
  if (!session) return unauthorized();
  const { variantId } = await req.json().catch(() => ({}));
  if (variantId) await removeFromCart(session.user.id, variantId);
  else await clearCart(session.user.id);
  return Response.json({ lines: await getCartLines(session.user.id) });
}
