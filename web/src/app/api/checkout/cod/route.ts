import { auth } from "@/auth";
import { parseShipping } from "@/lib/shipping";
import {
  placeOrder,
  userCartInputs,
  OrderError,
  type LineInput,
} from "@/lib/place-order";
import { parseGuestEmail, parseItems, parseCouponCode } from "@/lib/checkout-input";
import { sendOrderConfirmation } from "@/lib/email";

// Cash on Delivery — works for logged-in customers and guests.
export async function POST(req: Request) {
  const session = await auth();
  const body = await req.json().catch(() => ({}));

  const shipping = parseShipping(body?.shipping);
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
      payment: { status: "pending" },
    });
    // Confirmation email — best-effort; never blocks or rolls back the order.
    await sendOrderConfirmation(order.id);
    return Response.json({ orderId: order.id });
  } catch (e) {
    const msg = e instanceof OrderError ? e.message : "Could not place order.";
    return Response.json({ error: msg }, { status: 400 });
  }
}
