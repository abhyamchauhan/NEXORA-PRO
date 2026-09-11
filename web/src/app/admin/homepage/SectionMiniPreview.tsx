"use client";

export type SectionRow = {
  id: string;
  type: string;
  position: number;
  visible: boolean;
  heading: string | null;
  subtext: string | null;
  image: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  productIds: string[];
  categories: string[];
};

const TYPE_LABELS: Record<string, string> = {
  hero: "Hero",
  banner: "Banner",
  featuredProducts: "Featured products",
  categoryShowcase: "Category showcase",
};

export function typeLabel(t: string) {
  return TYPE_LABELS[t] ?? t;
}

// A rough visual thumbnail so the admin recognises each block at a glance.
export function SectionMiniPreview({ s }: { s: SectionRow }) {
  const base =
    "w-28 h-16 shrink-0 border border-grey-200 overflow-hidden relative text-[6px] leading-tight";

  if (s.type === "hero" || s.type === "banner") {
    return (
      <div className={`${base} bg-black text-white flex flex-col justify-end p-1.5`}>
        {s.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        )}
        <span className="relative font-display uppercase truncate">
          {s.heading || "Heading"}
        </span>
        {s.buttonText && (
          <span className="relative mt-0.5 bg-white text-black px-1 self-start">
            {s.buttonText}
          </span>
        )}
      </div>
    );
  }

  if (s.type === "featuredProducts") {
    return (
      <div className={`${base} bg-grey-50 p-1.5`}>
        <span className="font-display uppercase block mb-1 truncate">
          {s.heading || "Featured"}
        </span>
        <div className="grid grid-cols-4 gap-0.5">
          {Array.from({ length: Math.min(4, Math.max(1, s.productIds.length)) }).map(
            (_, i) => (
              <div key={i} className="aspect-square bg-concrete" />
            ),
          )}
        </div>
      </div>
    );
  }

  // categoryShowcase
  return (
    <div className={`${base} bg-grey-50 p-1.5`}>
      <span className="font-display uppercase block mb-1 truncate">
        {s.heading || "Categories"}
      </span>
      <div className="grid grid-cols-3 gap-0.5">
        {(s.categories.length ? s.categories : ["men", "women", "kids"]).map((c) => (
          <div key={c} className="h-5 bg-white border border-grey-200 grid place-items-center">
            <span className="uppercase">{c.slice(0, 3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
