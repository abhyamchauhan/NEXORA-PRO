import type { Coupon } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { inr } from "@/lib/format";

export type CouponResult =
  | { ok: true; coupon: Coupon; discount: number; message: string }
  | { ok: false; message: string };

export function computeDiscount(coupon: Coupon, subtotal: number): number {
  const raw =
    coupon.type === "percentage"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;
  return Math.max(0, Math.min(raw, subtotal));
}

// Validate a coupon against the current subtotal. Server-authoritative — the
// same checks run again inside the order transaction before the discount is
// committed.
export async function evaluateCoupon(
  codeRaw: string,
  subtotal: number,
): Promise<CouponResult> {
  const code = (codeRaw || "").trim().toUpperCase();
  if (!code) return { ok: false, message: "Enter a coupon code." };

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.active)
    return { ok: false, message: "This code isn't valid." };
  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now())
    return { ok: false, message: "This code has expired." };
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit)
    return { ok: false, message: "This code has reached its usage limit." };
  if (coupon.minOrder != null && subtotal < coupon.minOrder)
    return {
      ok: false,
      message: `Minimum order of ${inr(coupon.minOrder)} not met.`,
    };

  const discount = computeDiscount(coupon, subtotal);
  return {
    ok: true,
    coupon,
    discount,
    message: `Coupon applied! You saved ${inr(discount)}.`,
  };
}
