import { prisma } from "@/lib/prisma";
import { HomepageList } from "./HomepageList";
import type { SectionRow } from "./SectionMiniPreview";

export const dynamic = "force-dynamic";

export default async function AdminHomepage() {
  const sections = await prisma.homepageSection.findMany({
    orderBy: { position: "asc" },
  });

  const rows: SectionRow[] = sections.map((s) => ({
    id: s.id,
    type: s.type,
    position: s.position,
    visible: s.visible,
    heading: s.heading,
    subtext: s.subtext,
    image: s.image,
    buttonText: s.buttonText,
    buttonLink: s.buttonLink,
    productIds: s.productIds,
    categories: s.categories,
  }));

  return <HomepageList initial={rows} />;
}
