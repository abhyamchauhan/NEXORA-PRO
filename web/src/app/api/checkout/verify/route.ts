import { auth } from "@/auth";
import { parseShipping } from "@/lib/shipping";
import { verifyRazorpaySignature, isRazorpayConfigured } from "@/lib/razorpay";
import {
  placeOrder,
  userCartInputs,
  OrderError,
  type LineInput,
} from "@/lib/place-order";
import { parseGuestEmail, parseItems, parseCouponCode } from "@/lib/checkout-input";
import { sendOrderConfirmation } from "@/lib/email";

// Verifies the Razorpay signature, then places the order (guest or logged-in).
export async function POST(req: Request) {
  if (!isRazorpayConfigured())
    return Response.json({ error: "Payment not configured." }, { status: 503 });

  const session = await auth();
  const body = await req.json().catch(() => ({}));
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    shipping: rawShipping,
  } = body ?? {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
    return Response.json({ error: "Missing payment fields." }, { status: 400 });

  if (!verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature))
    return Response.json({ error: "Payment verification failed." }, { status: 400 });

  const shipping = parseShipping(rawShipping);
  if (!shipping.ok) return Response.json({ error: shipping.error }, { status: 400 });
  const couponCode = parseCouponCode(body?.couponCode);

  let userId: string | null = null;
  let guestEmail: string | null = null;
  let items: LineInput[];
  if (session?.user) {
    userId = session.user.id;
    items = await userCartInputs(userId);
  } else {
    guestEmail = parseGuestEmail(body?.email);
    if (!guestEmail)
      return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    items = parseItems(body?.items);
  }

  try {
    const order = await placeOrder({
      userId,
      guestEmail,
      shipping: shipping.data,
      items,
      couponCode,
      payment: {
        status: "paid",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
    });
    // Confirmation email — best-effort; never blocks or rolls back the order.
    await sendOrderConfirmation(order.id);
    return Response.json({ orderId: order.id });
  } catch (e) {
    const msg = e instanceof OrderError ? e.message : "Could not place order.";
    return Response.json({ error: msg }, { status: 400 });
  }
}
