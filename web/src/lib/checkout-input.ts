import type { LineInput } from "@/lib/place-order";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseGuestEmail(raw: unknown): string | null {
  const e = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  return EMAIL_RE.test(e) ? e : null;
}

export function parseItems(raw: unknown): LineInput[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
    .map((x) => ({
      variantId: String(x.variantId ?? ""),
      quantity: Math.max(1, Math.floor(Number(x.quantity) || 1)),
    }))
    .filter((x) => x.variantId);
}

export function parseCouponCode(raw: unknown): string | null {
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}
