import { auth } from "@/auth";
import { parseShipping } from "@/lib/shipping";
import {
  userCartInputs,
  priceLines,
  OrderError,
  type LineInput,
} from "@/lib/place-order";
import { parseGuestEmail, parseItems, parseCouponCode } from "@/lib/checkout-input";
import { evaluateCoupon } from "@/lib/coupon";
import {
  isRazorpayConfigured,
  createRazorpayOrder,
  razorpayKeyId,
} from "@/lib/razorpay";

// Creates a Razorpay order for the current cart (guest or logged-in). Amount is
// computed server-side from the DB (incl. any coupon) — never from the client.
export async function POST(req: Request) {
  if (!isRazorpayConfigured())
    return Response.json(
      { error: "Online payment is not configured yet. Use Cash on Delivery." },
      { status: 503 },
    );

  const session = await auth();
  const body = await req.json().catch(() => ({}));

  const shipping = parseShipping(body?.shipping);
  if (!shipping.ok) return Response.json({ error: shipping.error }, { status: 400 });
  const couponCode = parseCouponCode(body?.couponCode);

  let items: LineInput[];
  if (session?.user) {
    items = await userCartInputs(session.user.id);
  } else {
    if (!parseGuestEmail(body?.email))
      return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    items = parseItems(body?.items);
  }
  if (items.length === 0)
    return Response.json({ error: "Your bag is empty." }, { status: 400 });

  let subtotal: number;
  try {
    ({ subtotal } = await priceLines(items));
  } catch (e) {
    return Response.json(
      { error: e instanceof OrderError ? e.message : "Invalid cart." },
      { status: 400 },
    );
  }

  let discount = 0;
  if (couponCode) {
    const res = await evaluateCoupon(couponCode, subtotal);
    if (!res.ok) return Response.json({ error: res.message }, { status: 400 });
    discount = res.discount;
  }
  const total = Math.max(0, subtotal - discount);

  try {
    const order = await createRazorpayOrder(
      total * 100,
      `nexora_${(session?.user?.id ?? "guest").slice(-6)}_${Date.now()}`,
    );
    return Response.json({
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpayKeyId(),
      total,
      discount,
    });
  } catch {
    return Response.json(
      { error: "Could not start payment. Please try again." },
      { status: 502 },
    );
  }
}
