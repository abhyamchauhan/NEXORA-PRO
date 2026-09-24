import { auth } from "@/auth";
import {
  userCartInputs,
  priceLines,
  OrderError,
  type LineInput,
} from "@/lib/place-order";
import { parseItems, parseCouponCode } from "@/lib/checkout-input";
import { evaluateCoupon } from "@/lib/coupon";

// Validates a coupon against the current cart subtotal (server-authoritative)
// and returns the discount preview + a clear message.
export async function POST(req: Request) {
  const session = await auth();
  const body = await req.json().catch(() => ({}));
  const code = parseCouponCode(body?.code);
  if (!code) return Response.json({ ok: false, message: "Enter a coupon code." });

  let items: LineInput[];
  if (session?.user) items = await userCartInputs(session.user.id);
  else items = parseItems(body?.items);

  let subtotal: number;
  try {
    ({ subtotal } = await priceLines(items));
  } catch (e) {
    return Response.json({
      ok: false,
      message: e instanceof OrderError ? e.message : "Your bag is empty.",
    });
  }
  if (subtotal <= 0)
    return Response.json({ ok: false, message: "Your bag is empty." });

  const res = await evaluateCoupon(code, subtotal);
  if (!res.ok) return Response.json({ ok: false, message: res.message });
  return Response.json({
    ok: true,
    code: res.coupon.code,
    discount: res.discount,
    message: res.message,
  });
}
