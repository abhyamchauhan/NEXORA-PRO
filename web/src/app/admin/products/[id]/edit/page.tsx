import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm, type ProductInitial } from "../../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });
  if (!product) notFound();

  const initial: ProductInitial = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    featured: product.featured,
    variants: product.variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex ?? "",
      stock: v.stock,
      displayMode: v.displayMode,
      images: v.images,
      imageLabels: v.imageLabels,
    })),
  };

  return <ProductForm initial={initial} />;
}
