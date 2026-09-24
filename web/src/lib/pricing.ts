// Sale / drop pricing helpers (Step 16). Used by BOTH the storefront display
// and the server-authoritative order pricing, so a sale can never be faked by
// the client — checkout always re-derives the effective price from the DB row.

export type SaleFields = {
  price: number;
  salePrice: number | null;
  saleStartsAt: Date | string | null;
  saleEndsAt: Date | string | null;
  releaseAt: Date | string | null;
};

const ms = (d: Date | string | null): number | null =>
  d == null ? null : new Date(d).getTime();

// Is a flash sale currently in effect?
export function saleActive(p: SaleFields, now: number = Date.now()): boolean {
  if (p.salePrice == null || p.salePrice >= p.price) return false;
  const start = ms(p.saleStartsAt);
  const end = ms(p.saleEndsAt);
  if (start != null && start > now) return false;
  if (end != null && end <= now) return false;
  return true;
}

// The price the customer actually pays right now.
export function effectivePrice(p: SaleFields, now: number = Date.now()): number {
  return saleActive(p, now) ? (p.salePrice as number) : p.price;
}

export function discountPct(p: SaleFields, now: number = Date.now()): number | null {
  if (!saleActive(p, now)) return null;
  return Math.round((1 - (p.salePrice as number) / p.price) * 100);
}

// Product not yet released (drop/launch): not purchasable until releaseAt.
export function isComingSoon(p: SaleFields, now: number = Date.now()): boolean {
  const r = ms(p.releaseAt);
  return r != null && r > now;
}

// The countdown target to show for a product, if any: the sale end while on
// sale, else the release time while coming soon. ISO string for the client.
export function countdownTarget(p: SaleFields, now: number = Date.now()): {
  endsAt: string;
  kind: "sale" | "drop";
} | null {
  if (isComingSoon(p, now) && p.releaseAt)
    return { endsAt: new Date(p.releaseAt).toISOString(), kind: "drop" };
  if (saleActive(p, now) && p.saleEndsAt)
    return { endsAt: new Date(p.saleEndsAt).toISOString(), kind: "sale" };
  return null;
}
