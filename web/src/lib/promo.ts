import type { Category } from "@prisma/client";
import { prisma } from "./prisma";

export type PromoView = {
  id: string;
  label: string;
  endsAt: string; // ISO
  buttonText: string | null;
  buttonLink: string | null;
};

function toView(p: {
  id: string;
  label: string;
  endsAt: Date;
  buttonText: string | null;
  buttonLink: string | null;
}): PromoView {
  return {
    id: p.id,
    label: p.label,
    endsAt: p.endsAt.toISOString(),
    buttonText: p.buttonText,
    buttonLink: p.buttonLink,
  };
}

// The soonest-ending active, visible, site-wide promo (category null). Never
// throws (the store layout renders on every route, including static ones with
// no DB at build time) — falls back to no promo.
export async function getActiveSitePromo(): Promise<PromoView | null> {
  try {
    const p = await prisma.promoCountdown.findFirst({
      where: { category: null, visible: true, endsAt: { gt: new Date() } },
      orderBy: { endsAt: "asc" },
    });
    return p ? toView(p) : null;
  } catch {
    return null;
  }
}

// The soonest-ending active promo for a specific category.
export async function getActiveCategoryPromo(category: Category): Promise<PromoView | null> {
  try {
    const p = await prisma.promoCountdown.findFirst({
      where: { category, visible: true, endsAt: { gt: new Date() } },
      orderBy: { endsAt: "asc" },
    });
    return p ? toView(p) : null;
  } catch {
    return null;
  }
}
