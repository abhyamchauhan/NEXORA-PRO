import Link from "next/link";
import type { HydratedSection } from "@/lib/homepage";
import { CATEGORY_LABELS } from "@/lib/format";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductImage } from "@/components/store/ProductImage";
import { Reveal } from "@/components/store/Reveal";
import { Stagger } from "@/components/store/Stagger";
import { LetterReveal } from "@/components/store/LetterReveal";
import { Magnetic } from "@/components/store/Magnetic";
import { HeroParallax } from "@/components/store/HeroParallax";

export function SectionRenderer({ section }: { section: HydratedSection }) {
  switch (section.type) {
    case "hero":
      return <HeroSection s={section} />;
    case "banner":
      return <BannerSection s={section} />;
    case "featuredProducts":
      return <FeaturedProductsSection s={section} />;
    case "categoryShowcase":
      return <CategoryShowcaseSection s={section} />;
    default:
      return null;
  }
}

function Cta({ text, link }: { text?: string | null; link?: string | null }) {
  if (!text) return null;
  return (
    <Link
      href={link || "/shop"}
      className="inline-block font-display text-sm tracking-button bg-white text-ink px-7 py-3.5 rounded-button transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-ink hover:text-white active:scale-95"
    >
      {text}
    </Link>
  );
}

function HeroSection({ s }: { s: HydratedSection }) {
  return (
    <section className="relative bg-black text-white overflow-hidden">
      {s.image && <HeroParallax src={s.image} alt={s.heading ?? "NEXORA"} />}
      <div className="relative max-w-container mx-auto px-6 py-28 sm:py-36">
        {s.subtext && (
          <p className="font-display text-xs sm:text-sm tracking-label text-concrete mb-5 anim-fade-up anim-delay-1">
            {s.subtext}
          </p>
        )}
        {s.heading && (
          <h1 className="hero-wobble font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.95] max-w-4xl">
            <LetterReveal text={s.heading} start={0.15} />
          </h1>
        )}
        {s.buttonText && (
          <div className="mt-8 anim-fade-up anim-delay-3">
            <Magnetic strength={6}>
              <Cta text={s.buttonText} link={s.buttonLink} />
            </Magnetic>
          </div>
        )}
      </div>
    </section>
  );
}

function BannerSection({ s }: { s: HydratedSection }) {
  return (
    <Reveal>
      <section className="max-w-container mx-auto px-6 py-8">
        <div className="relative overflow-hidden bg-ink text-white min-h-[240px] flex items-center">
          {s.image && (
            <div className="absolute inset-0">
              <ProductImage src={s.image} alt={s.heading ?? "Banner"} sizes="100vw" />
              <div className="absolute inset-0 bg-black/45" />
            </div>
          )}
          <div className="relative px-8 py-12 max-w-xl">
            {s.subtext && (
              <p className="font-display text-xs tracking-label text-concrete mb-3">
                {s.subtext}
              </p>
            )}
            {s.heading && (
              <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-4">
                {s.heading}
              </h2>
            )}
            <Cta text={s.buttonText} link={s.buttonLink} />
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function FeaturedProductsSection({ s }: { s: HydratedSection }) {
  if (s.products.length === 0) return null;
  return (
    <Reveal>
      <section className="max-w-container mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-2xl sm:text-3xl">
            {s.heading || "Featured"}
          </h2>
          <Link
            href="/shop"
            className="font-display text-xs tracking-button text-grey-500 hover:text-ink"
          >
            View all →
          </Link>
        </div>
        <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {s.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Stagger>
      </section>
    </Reveal>
  );
}

function CategoryShowcaseSection({ s }: { s: HydratedSection }) {
  const cats = s.categories.length ? s.categories : ["men", "women", "kids"];
  return (
    <Reveal>
      <section className="max-w-container mx-auto px-6 py-12">
        {s.heading && (
          <h2 className="font-display text-2xl sm:text-3xl mb-6">{s.heading}</h2>
        )}
        <div className="grid gap-4 sm:grid-cols-3">
          {cats.map((c) => (
            <Link
              key={c}
              href={`/category/${c}`}
              className="group relative bg-grey-50 border border-grey-200 p-8 h-48 flex flex-col justify-end hover:border-ink transition-colors"
            >
              <p className="font-display text-3xl">
                {CATEGORY_LABELS[c] ?? c}
              </p>
              <span className="absolute top-6 right-6 font-display text-xs tracking-button text-grey-400 group-hover:text-ink">
                Shop →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
