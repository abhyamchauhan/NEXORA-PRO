import { getUserSession, unauthorized } from "@/lib/auth-guard";
import { parseShipping } from "@/lib/shipping";
import { verifyRazorpaySignature, isRazorpayConfigured } from "@/lib/razorpay";
import { placeOrderFromCart, OrderError } from "@/lib/place-order";

// Verifies the Razorpay signature, then places the order from the DB cart.
export async function POST(req: Request) {
  const session = await getUserSession();
  if (!session) return unauthorized();
  if (!isRazorpayConfigured())
    return Response.json({ error: "Payment not configured." }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    shipping: rawShipping,
  } = body ?? {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
    return Response.json({ error: "Missing payment fields." }, { status: 400 });

  const ok = verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  );
  if (!ok)
    return Response.json(
      { error: "Payment verification failed." },
      { status: 400 },
    );

  const shipping = parseShipping(rawShipping);
  if (!shipping.ok) return Response.json({ error: shipping.error }, { status: 400 });

  try {
    const order = await placeOrderFromCart(session.user.id, shipping.data, {
      status: "paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });
    return Response.json({ orderId: order.id });
  } catch (e) {
    const msg = e instanceof OrderError ? e.message : "Could not place order.";
    return Response.json({ error: msg }, { status: 400 });
  }
}
