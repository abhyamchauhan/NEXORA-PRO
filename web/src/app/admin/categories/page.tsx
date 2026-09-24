import { getCategoryImages } from "@/lib/category";
import { CategoryImages } from "./CategoryImages";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const map = await getCategoryImages();
  const initial = {
    men: map.men ?? null,
    women: map.women ?? null,
    kids: map.kids ?? null,
  };
  return <CategoryImages initial={initial} />;
}
