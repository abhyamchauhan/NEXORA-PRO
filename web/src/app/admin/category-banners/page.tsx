import { prisma } from "@/lib/prisma";
import { CategoryBannerManager, type BannerRow } from "./CategoryBannerManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoryBannersPage() {
  const banners = await prisma.categoryBanner.findMany({
    orderBy: [{ category: "asc" }, { position: "asc" }],
  });
  const initial: BannerRow[] = banners.map((b) => ({
    id: b.id,
    category: b.category,
    heading: b.heading,
    subtext: b.subtext,
    image: b.image,
    buttonText: b.buttonText,
    buttonLink: b.buttonLink,
    position: b.position,
    visible: b.visible,
  }));
  return <CategoryBannerManager initial={initial} />;
}
