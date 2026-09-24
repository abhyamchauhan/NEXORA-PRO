import { prisma } from "@/lib/prisma";
import { PromoManager, type PromoRow } from "./PromoManager";

export const dynamic = "force-dynamic";

export default async function AdminPromosPage() {
  const promos = await prisma.promoCountdown.findMany({ orderBy: { endsAt: "asc" } });
  const initial: PromoRow[] = promos.map((p) => ({
    id: p.id,
    category: p.category,
    label: p.label,
    endsAt: p.endsAt.toISOString(),
    buttonText: p.buttonText,
    buttonLink: p.buttonLink,
    visible: p.visible,
  }));
  return <PromoManager initial={initial} />;
}
