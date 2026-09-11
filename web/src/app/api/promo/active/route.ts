import { getActiveSitePromo } from "@/lib/promo";

export const dynamic = "force-dynamic";

// Public: the active site-wide promo (or null). Used by the client PromoBar
// loader so the bar can appear on every page, including statically-rendered ones.
export async function GET() {
  const promo = await getActiveSitePromo();
  return Response.json({ promo });
}
