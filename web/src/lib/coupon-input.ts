import type { DiscountType } from "@prisma/client";

export type CouponInput = {
  code: string;
  type: DiscountType;
  value: number;
  minOrder: number | null;
  expiresAt: Date | null;
  usageLimit: number | null;
  active: boolean;
};

type Result = { ok: true; data: CouponInput } | { ok: false; error: string };

const CODE_RE = /^[A-Z0-9]{3,24}$/;

export function parseCouponInput(raw: unknown): Result {
  const b = (raw ?? {}) as Record<string, unknown>;
  const code = typeof b.code === "string" ? b.code.trim().toUpperCase() : "";
  const type = b.type as DiscountType;
  const value = Number(b.value);

  if (!CODE_RE.test(code))
    return { ok: false, error: "Code must be 3–24 letters/numbers (no spaces)." };
  if (type !== "percentage" && type !== "fixed")
    return { ok: false, error: "Choose a discount type." };
  if (!Number.isFinite(value) || value <= 0)
    return { ok: false, error: "Discount value must be greater than 0." };
  if (type === "percentage" && value > 100)
    return { ok: false, error: "Percentage cannot exceed 100." };

  const minOrderRaw = Number(b.minOrder);
  const minOrder =
    b.minOrder === "" || b.minOrder == null || !Number.isFinite(minOrderRaw)
      ? null
      : Math.max(0, Math.round(minOrderRaw));

  const usageRaw = Number(b.usageLimit);
  const usageLimit =
    b.usageLimit === "" || b.usageLimit == null || !Number.isFinite(usageRaw)
      ? null
      : Math.max(1, Math.round(usageRaw));

  let expiresAt: Date | null = null;
  if (typeof b.expiresAt === "string" && b.expiresAt.trim()) {
    const d = new Date(b.expiresAt);
    if (isNaN(d.getTime())) return { ok: false, error: "Invalid expiry date." };
    expiresAt = d;
  }

  return {
    ok: true,
    data: {
      code,
      type,
      value: Math.round(value),
      minOrder,
      expiresAt,
      usageLimit,
      active: b.active === undefined ? true : Boolean(b.active),
    },
  };
}
