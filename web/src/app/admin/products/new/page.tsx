import { ProductForm } from "../ProductForm";
import { getSubCategoryOptions } from "@/lib/category";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const subCategories = await getSubCategoryOptions();
  return <ProductForm subCategories={subCategories} />;
}
