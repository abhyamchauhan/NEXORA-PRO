import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm, type ProductInitial } from "../../ProductForm";
import { SizeChartEditor } from "@/components/admin/SizeChartEditor";

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
    bgColor: product.bgColor,
    material: product.material,
    care: product.care,
    rating: product.rating,
    reviewCount: product.reviewCount,
    variants: product.variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex ?? "",
      stock: v.stock,
      displayMode: v.displayMode,
      images: v.images,
      imagesOriginal: v.imagesOriginal,
      imageLabels: v.imageLabels,
    })),
  };

  const sizes = [...new Set(product.variants.map((v) => v.size))];

  return (
    <div className="space-y-10">
      <ProductForm initial={initial} />

      <section className="max-w-3xl">
        <h2 className="font-display text-xl mb-1">Size chart (this product)</h2>
        <p className="text-sm text-grey-500 mb-4">
          Overrides the category default for this product. Leave the fields empty
          to fall back to the {product.category} default. Saves on its own —
          independent of the product form above.
        </p>
        <div className="bg-white border border-grey-200 p-6">
          <SizeChartEditor
            productId={product.id}
            suggestedSizes={sizes.length ? sizes : ["S", "M", "L", "XL", "XXL"]}
          />
        </div>
      </section>
    </div>
  );
}
