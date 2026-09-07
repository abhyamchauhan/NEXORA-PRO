import { getUserSession, unauthorized } from "@/lib/auth-guard";
import { parseShipping } from "@/lib/shipping";
import { placeOrderFromCart, OrderError } from "@/lib/place-order";

// Cash on Delivery — places the order immediately with status "pending".
export async function POST(req: Request) {
  const session = await getUserSession();
  if (!session) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const shipping = parseShipping(body?.shipping);
  if (!shipping.ok) return Response.json({ error: shipping.error }, { status: 400 });

  try {
    const order = await placeOrderFromCart(session.user.id, shipping.data, {
      status: "pending",
    });
    return Response.json({ orderId: order.id });
  } catch (e) {
    const msg = e instanceof OrderError ? e.message : "Could not place order.";
    return Response.json({ error: msg }, { status: 400 });
  }
}
