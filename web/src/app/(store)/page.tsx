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

  // Nothing is hardcoded — the homepage is composed from the CMS rows + the
  // admin-managed hero carousel slides.
  if (sections.length === 0 && banners.length === 0) {
    return (
      <div className="max-w-container mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-4xl mb-3">NEXORA</h1>
        <p className="text-grey-500 mb-6">
          The homepage has no content yet.
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
      {banners.length > 0 && <CategoryBannerCarousel banners={banners} />}
      {sections.map((s) => (
        <SectionRenderer key={s.id} section={s} />
      ))}
    </div>
  );
}
