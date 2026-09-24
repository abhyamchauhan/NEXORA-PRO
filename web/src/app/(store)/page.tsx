import Link from "next/link";
import { getHomepageSections, getHomeBanners } from "@/lib/homepage";
import { SectionRenderer } from "@/components/store/home/HomeSections";
import { CategoryBannerCarousel } from "@/components/store/CategoryBannerCarousel";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [sections, banners] = await Promise.all([
    getHomepageSections(),
    getHomeBanners(),
  ]);

  // Nothing is hardcoded — the homepage renders every section purely in its
  // saved order, the hero slider included (it's a normal `heroCarousel` section
  // whose slides come from the admin's Home slider list).
  if (sections.length === 0) {
    return (
      <div className="max-w-container mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-4xl mb-3">NEXORA</h1>
        <p className="text-grey-500 mb-6">
          The homepage has no sections yet.
        </p>
        <Link
          href="/admin/homepage"
          className="inline-block font-display text-sm tracking-button bg-ink text-white px-6 py-3 rounded-button"
        >
          Set up the homepage
        </Link>
      </div>
    );
  }

  return (
    <div>
      {sections.map((s) =>
        s.type === "heroCarousel" ? (
          banners.length > 0 ? (
            <CategoryBannerCarousel key={s.id} banners={banners} />
          ) : null
        ) : (
          <SectionRenderer key={s.id} section={s} />
        ),
      )}
    </div>
  );
}
