import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";
import { ShopFilters } from "./ShopFilters";
import { Stagger } from "@/components/store/Stagger";
import { EmptyState } from "@/components/store/EmptyState";
import { CATEGORY_LABELS } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: SP }) {
  const { category, q } = await searchParams;
  const label = q
    ? `Search: ${q}`
    : category && CATEGORY_LABELS[category]
      ? CATEGORY_LABELS[category]
      : "Shop all";
  return {
    title: label,
    description: `Shop ${label} at NEXORA — premium streetwear. Free doorstep delivery in India.`,
  };
}

type SP = Promise<{
  category?: string;
  size?: string;
  color?: string;
  min?: string;
  max?: string;
  sort?: string;
  q?: string;
  sub?: string;
  group?: string;
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
  const q = sp.q?.trim();
  const sub = sp.sub?.trim();
  const group = sp.group?.trim();

  const where: Prisma.ProductWhereInput = {};
  if (q)
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  if (category) where.category = category as Prisma.ProductWhereInput["category"];
  // Sub-category / group scoping (from the category landing tiles).
  if (sub) where.subCategory = { is: { slug: sub } };
  else if (group) where.subCategory = { is: { group } };
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

  const [products, allVariants, subRow] = await Promise.all([
    prisma.product.findMany({ where, orderBy, include: { variants: true } }),
    prisma.variant.findMany({ select: { size: true, color: true } }),
    sub
      ? prisma.subCategory.findFirst({ where: { slug: sub }, select: { name: true } })
      : Promise.resolve(null),
  ]);

  const sizeOptions = [...new Set(allVariants.map((v) => v.size))].sort();
  const colorOptions = [...new Set(allVariants.map((v) => v.color))].sort();

  const heading = q
    ? `Results for “${q}”`
    : subRow
      ? subRow.name
      : group
        ? group
        : category
          ? CATEGORY_LABELS[category]
          : "All products";

  return (
    <div className="max-w-container mx-auto px-6 py-10">
      <h1 className="font-display text-3xl mb-1">{heading}</h1>
      <p className="text-sm text-grey-500 mb-8">
        {products.length} product{products.length !== 1 ? "s" : ""}
      </p>

      <div className="grid lg:grid-cols-[20%_1fr] gap-10">
        {/* Sticky filter sidebar */}
        <div className="lg:sticky lg:top-28 self-start">
          <ShopFilters sizeOptions={sizeOptions} colorOptions={colorOptions} />
        </div>

        {/* Product area with an elegant 1px divider on desktop */}
        <div className="lg:border-l lg:border-grey-200/70 lg:pl-10">
          {products.length === 0 ? (
            <EmptyState
              icon="⌕"
              title={q ? `No results for “${q}”` : "No products match"}
              message={
                q
                  ? "Try a different search term, or browse the full collection."
                  : "Try clearing a filter or two, or browse everything."
              }
              ctaLabel="Browse all products"
              ctaHref="/shop"
            />
          ) : (
            <Stagger className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </Stagger>
          )}
        </div>
      </div>
    </div>
  );
}
