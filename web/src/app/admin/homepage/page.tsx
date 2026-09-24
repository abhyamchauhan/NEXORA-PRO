import { prisma } from "@/lib/prisma";
import { HomepageList } from "./HomepageList";
import { ThemeSettings } from "./ThemeSettings";
import type { SectionRow } from "./SectionMiniPreview";
import { getSiteTheme } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function AdminHomepage() {
  const [sections, theme] = await Promise.all([
    prisma.homepageSection.findMany({ orderBy: { position: "asc" } }),
    getSiteTheme(),
  ]);

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

  return (
    <>
      <ThemeSettings initial={theme} />
      <HomepageList initial={rows} />
    </>
  );
}
