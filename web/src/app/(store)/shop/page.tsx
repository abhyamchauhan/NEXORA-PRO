import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";
import { ShopFilters } from "./ShopFilters";
import { CATEGORY_LABELS } from "@/lib/format";

export const dynamic = "force-dynamic";

type SP = Promise<{
  category?: string;
  size?: string;
  color?: string;
  min?: string;
  max?: string;
  sort?: string;
}>;

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const category =
    sp.category && ["men", "women", "kids"].includes(sp.category)
      ? sp.category
      : undefined;
  const sizes = sp.size?.split(",").filter(Boolean) ?? [];
  const colors = sp.color?.split(",").filter(Boolean) ?? [];
  const min = sp.min ? Number(sp.min) : undefined;
  const max = sp.max ? Number(sp.max) : undefined;

  const where: Prisma.ProductWhereInput = {};
  if (category) where.category = category as Prisma.ProductWhereInput["category"];
  if (min !== undefined || max !== undefined)
    where.price = {
      ...(min !== undefined && Number.isFinite(min) ? { gte: min } : {}),
      ...(max !== undefined && Number.isFinite(max) ? { lte: max } : {}),
    };
  if (sizes.length || colors.length)
    where.variants = {
      some: {
        ...(sizes.length ? { size: { in: sizes } } : {}),
        ...(colors.length ? { color: { in: colors } } : {}),
      },
    };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sp.sort === "price-asc"
      ? { price: "asc" }
      : sp.sort === "price-desc"
        ? { price: "desc" }
        : sp.sort === "name"
          ? { name: "asc" }
          : { createdAt: "desc" };

  const [products, allVariants] = await Promise.all([
    prisma.product.findMany({ where, orderBy, include: { variants: true } }),
    prisma.variant.findMany({ select: { size: true, color: true } }),
  ]);

  const sizeOptions = [...new Set(allVariants.map((v) => v.size))].sort();
  const colorOptions = [...new Set(allVariants.map((v) => v.color))].sort();

  const heading = category ? CATEGORY_LABELS[category] : "All products";

  return (
    <div className="max-w-container mx-auto px-6 py-10">
      <h1 className="font-display text-3xl mb-1">{heading}</h1>
      <p className="text-sm text-grey-500 mb-8">
        {products.length} product{products.length !== 1 ? "s" : ""}
      </p>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <ShopFilters sizeOptions={sizeOptions} colorOptions={colorOptions} />

        <div>
          {products.length === 0 ? (
            <div className="border border-grey-200 p-14 text-center text-grey-500">
              No products match these filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
