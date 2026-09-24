import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryLanding, isCategory } from "@/lib/category";
import { getActiveCategoryPromo } from "@/lib/promo";
import { CATEGORY_LABELS } from "@/lib/format";
import { CategoryBannerCarousel } from "@/components/store/CategoryBannerCarousel";
import { SubCategoryAccordion } from "@/components/store/SubCategoryAccordion";
import { PromoBar } from "@/components/store/PromoBar";

export const dynamic = "force-dynamic";

type Params = Promise<{ cat: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { cat } = await params;
  const label = CATEGORY_LABELS[cat] ?? "Shop";
  return {
    title: label,
    description: `Shop ${label} at NEXORA — premium streetwear. Browse by category.`,
  };
}

export default async function CategoryLandingPage({ params }: { params: Params }) {
  const { cat } = await params;
  if (!isCategory(cat)) notFound();

  const [{ banners, groups }, promo] = await Promise.all([
    getCategoryLanding(cat),
    getActiveCategoryPromo(cat),
  ]);
  const label = CATEGORY_LABELS[cat] ?? cat;

  return (
    <div>
      {promo && <PromoBar promo={promo} />}
      {banners.length > 0 && <CategoryBannerCarousel banners={banners} />}

      <div className="max-w-container mx-auto px-6 pt-10">
        <div className="flex items-end justify-between">
          <h1 className="font-display text-3xl sm:text-4xl">{label}</h1>
          <Link
            href={`/shop?category=${cat}`}
            className="font-display text-xs tracking-button text-grey-500 hover:text-ink"
          >
            Shop all {label} →
          </Link>
        </div>
      </div>

      {groups.length > 0 ? (
        <SubCategoryAccordion category={cat} groups={groups} />
      ) : (
        <div className="max-w-container mx-auto px-6 py-16 text-center">
          <p className="text-grey-500 mb-5">
            No sub-categories yet for {label}.
          </p>
          <Link
            href={`/shop?category=${cat}`}
            className="inline-block font-display text-sm tracking-button bg-ink text-white px-6 py-3 rounded-button"
          >
            Browse all {label}
          </Link>
        </div>
      )}
    </div>
  );
}
