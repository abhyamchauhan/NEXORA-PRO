import { prisma } from "@/lib/prisma";
import { HomeBannerManager, type HomeBannerRow } from "./HomeBannerManager";

export const dynamic = "force-dynamic";

export default async function AdminHomeBannersPage() {
  const banners = await prisma.homeBanner.findMany({ orderBy: { position: "asc" } });
  const initial: HomeBannerRow[] = banners.map((b) => ({
    id: b.id,
    heading: b.heading,
    subtext: b.subtext,
    image: b.image,
    buttonText: b.buttonText,
    buttonLink: b.buttonLink,
    position: b.position,
    visible: b.visible,
  }));
  return <HomeBannerManager initial={initial} />;
}
