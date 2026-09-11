import { getUserSession, unauthorized } from "@/lib/auth-guard";
import { mergeGuestCart, getCartLines } from "@/lib/cart";

// POST { lines: [{ variantId, quantity }] } — merges a guest's localStorage
// cart into their DB cart at login, then returns the unified cart.
export async function POST(req: Request) {
  const session = await getUserSession();
  if (!session) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const lines = Array.isArray(body?.lines) ? body.lines : [];
  const clean = lines
    .filter((l: unknown) => l && typeof l === "object")
    .map((l: { variantId?: unknown; quantity?: unknown }) => ({
      variantId: String(l.variantId ?? ""),
      quantity: Math.max(1, Number(l.quantity) || 1),
    }))
    .filter((l: { variantId: string }) => l.variantId);

  await mergeGuestCart(session.user.id, clean);
  return Response.json({ lines: await getCartLines(session.user.id) });
}
