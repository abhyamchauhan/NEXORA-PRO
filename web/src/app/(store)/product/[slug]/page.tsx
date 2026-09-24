import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  ProductDetailClient,
  type ClientProduct,
} from "@/components/store/ProductDetailClient";
import { ProductCard } from "@/components/store/ProductCard";
import { getEffectiveSizeChart } from "@/lib/size-chart";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { variants: { orderBy: { id: "asc" } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not found" };
  const image = product.variants.flatMap((v) => v.images)[0];
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const sizeChart = await getEffectiveSizeChart({
    id: product.id,
    category: product.category,
  });

  // "You might also like" — same category, excluding this product.
  const related = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id } },
    include: { variants: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const clientProduct: ClientProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    salePrice: product.salePrice,
    saleStartsAt: product.saleStartsAt?.toISOString() ?? null,
    saleEndsAt: product.saleEndsAt?.toISOString() ?? null,
    releaseAt: product.releaseAt?.toISOString() ?? null,
    category: product.category,
    material: product.material,
    care: product.care,
    rating: product.rating,
    reviewCount: product.reviewCount,
    variants: product.variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex,
      stock: v.stock,
      displayMode: v.displayMode,
      images: v.images,
      imageLabels: v.imageLabels,
    })),
  };

  return (
    <>
      <ProductDetailClient product={clientProduct} sizeChart={sizeChart} />

      {related.length > 0 && (
        <section className="max-w-container mx-auto px-6 py-14 border-t border-grey-200 mt-6">
          <h2 className="font-display text-2xl mb-6">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
