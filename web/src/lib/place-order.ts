import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Shipping } from "@/lib/shipping";
import { evaluateCoupon, computeDiscount } from "@/lib/coupon";
import { effectivePrice, isComingSoon } from "@/lib/pricing";

export type LineInput = { variantId: string; quantity: number };

type Payment = {
  status: OrderStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
};

export class OrderError extends Error {}

/** Line inputs from a logged-in user's DB cart. */
export async function userCartInputs(userId: string): Promise<LineInput[]> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });
  return (cart?.items ?? []).map((i) => ({
    variantId: i.variantId,
    quantity: i.quantity,
  }));
}

/** Re-price line inputs from the DB (never trust client prices) + subtotal. */
export async function priceLines(items: LineInput[]) {
  const ids = items.map((i) => i.variantId);
  const variants = await prisma.variant.findMany({
    where: { id: { in: ids } },
    include: { product: true },
  });
  const byId = new Map(variants.map((v) => [v.id, v]));
  let subtotal = 0;
  const lines = items.map((it) => {
    const v = byId.get(it.variantId);
    if (!v) throw new OrderError("An item in your bag is no longer available.");
    const qty = Math.max(1, Math.floor(it.quantity));
    subtotal += effectivePrice(v.product) * qty;
    return { v, qty };
  });
  return { lines, subtotal };
}

/**
 * Places an order for a logged-in user OR a guest, in one transaction:
 * re-prices from the DB, validates stock, applies + re-checks any coupon
 * (incrementing its usage atomically), snapshots line items, decrements stock,
 * and clears the user's DB cart. Totals/discount are server-authoritative.
 */
export async function placeOrder(opts: {
  userId: string | null;
  guestEmail?: string | null;
  shipping: Shipping;
  items: LineInput[];
  couponCode?: string | null;
  payment: Payment;
}) {
  const { userId, guestEmail, shipping, items, couponCode, payment } = opts;
  if (!items || items.length === 0) throw new OrderError("Your bag is empty.");

  // Validate coupon against the current subtotal before opening the tx.
  const { subtotal } = await priceLines(items);
  let discount = 0;
  let appliedCode: string | null = null;
  let couponId: string | null = null;
  if (couponCode) {
    const res = await evaluateCoupon(couponCode, subtotal);
    if (!res.ok) throw new OrderError(res.message);
    discount = res.discount;
    appliedCode = res.coupon.code;
    couponId = res.coupon.id;
  }

  return prisma.$transaction(async (tx) => {
    // Re-price inside the tx and check stock.
    const ids = items.map((i) => i.variantId);
    const variants = await tx.variant.findMany({
      where: { id: { in: ids } },
      include: { product: true },
    });
    const byId = new Map(variants.map((v) => [v.id, v]));
    let sub = 0;
    const lines = items.map((it) => {
      const v = byId.get(it.variantId);
      if (!v) throw new OrderError("An item in your bag is no longer available.");
      if (isComingSoon(v.product))
        throw new OrderError(`${v.product.name} hasn't dropped yet.`);
      const qty = Math.max(1, Math.floor(it.quantity));
      if (qty > v.stock)
        throw new OrderError(
          `Only ${v.stock} left of ${v.product.name} (${v.color}/${v.size}).`,
        );
      sub += effectivePrice(v.product) * qty;
      return { v, qty };
    });

    // Re-check + apply coupon atomically.
    if (couponId) {
      const fresh = await tx.coupon.findUnique({ where: { id: couponId } });
      if (!fresh || !fresh.active) throw new OrderError("This code isn't valid.");
      if (fresh.expiresAt && fresh.expiresAt.getTime() < Date.now())
        throw new OrderError("This code has expired.");
      if (fresh.usageLimit != null && fresh.usedCount >= fresh.usageLimit)
        throw new OrderError("This code has reached its usage limit.");
      if (fresh.minOrder != null && sub < fresh.minOrder)
        throw new OrderError("Minimum order amount not met.");
      discount = computeDiscount(fresh, sub);
      appliedCode = fresh.code;
      await tx.coupon.update({
        where: { id: fresh.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    const total = Math.max(0, sub - discount);

    const order = await tx.order.create({
      data: {
        userId: userId ?? undefined,
        guestEmail: userId ? null : (guestEmail ?? null),
        total,
        discount,
        couponCode: appliedCode,
        status: payment.status,
        shippingName: shipping.name,
        shippingPhone: shipping.phone,
        shippingAddress: shipping.address,
        shippingCity: shipping.city,
        shippingState: shipping.state,
        shippingPincode: shipping.pincode,
        razorpayOrderId: payment.razorpayOrderId,
        razorpayPaymentId: payment.razorpayPaymentId,
        items: {
          create: lines.map(({ v, qty }) => ({
            variantId: v.id,
            productName: v.product.name,
            color: v.color,
            size: v.size,
            price: effectivePrice(v.product),
            quantity: qty,
            image: v.images[0] ?? null,
          })),
        },
      },
    });

    for (const { v, qty } of lines) {
      await tx.variant.update({
        where: { id: v.id },
        data: { stock: { decrement: qty } },
      });
    }

    if (userId) {
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return order;
  });
}
