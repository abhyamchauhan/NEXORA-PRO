import { getUserSession, unauthorized } from "@/lib/auth-guard";
import { getCartLines } from "@/lib/cart";
import { parseShipping } from "@/lib/shipping";
import {
  isRazorpayConfigured,
  createRazorpayOrder,
  razorpayKeyId,
} from "@/lib/razorpay";

// Creates a Razorpay order for the current user's cart. The amount is computed
// server-side from the DB cart — the client cannot influence the price.
export async function POST(req: Request) {
  const session = await getUserSession();
  if (!session) return unauthorized();

  if (!isRazorpayConfigured())
    return Response.json(
      { error: "Online payment is not configured yet. Use Cash on Delivery." },
      { status: 503 },
    );

  const body = await req.json().catch(() => ({}));
  const shipping = parseShipping(body?.shipping);
  if (!shipping.ok) return Response.json({ error: shipping.error }, { status: 400 });

  const lines = await getCartLines(session.user.id);
  if (lines.length === 0)
    return Response.json({ error: "Your bag is empty." }, { status: 400 });

  const total = lines.reduce((s, l) => s + l.price * l.quantity, 0);

  try {
    const order = await createRazorpayOrder(
      total * 100,
      `nexora_${session.user.id.slice(-6)}_${Date.now()}`,
    );
    return Response.json({
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpayKeyId(),
      total,
    });
  } catch {
    return Response.json(
      { error: "Could not start payment. Please try again." },
      { status: 502 },
    );
  }
}
