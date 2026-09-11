import { prisma } from "@/lib/prisma";
import { SubCategoryManager, type SubRow } from "./SubCategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminSubCategoriesPage() {
  const subs = await prisma.subCategory.findMany({
    orderBy: [{ category: "asc" }, { group: "asc" }, { position: "asc" }],
  });
  const initial: SubRow[] = subs.map((s) => ({
    id: s.id,
    category: s.category,
    group: s.group,
    name: s.name,
    slug: s.slug,
    image: s.image,
    position: s.position,
  }));
  return <SubCategoryManager initial={initial} />;
}
