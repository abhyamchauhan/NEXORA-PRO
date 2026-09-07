import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";

export const dynamic = "force-dynamic";

const CATEGORY_TILES = [
  { id: "men", label: "Men", copy: "Boxy fits, hard shells" },
  { id: "women", label: "Women", copy: "Column drapes, clean lines" },
  { id: "kids", label: "Kids", copy: "The house block, scaled down" },
];

export default async function HomePage() {
  const [featured, fresh] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      include: { variants: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      include: { variants: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const grid = featured.length ? featured : fresh;

  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white">
        <div className="max-w-container mx-auto px-6 py-24 sm:py-32">
          <p className="font-display text-xs tracking-label text-concrete mb-5">
            Render 01 — the season drop
          </p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.95] max-w-4xl">
            Streetwear,
            <br />
            engineered clean.
          </h1>
          <p className="text-grey-400 max-w-lg mt-6">
            Heavyweight fabrics, boxy blocks, monochrome only. Shot as product,
            never on a model.
          </p>
          <div className="flex gap-3 mt-8">
            <Link
              href="/shop"
              className="font-display text-sm tracking-button bg-white text-ink px-7 py-3 rounded-button hover:bg-concrete transition-colors"
            >
              Shop all
            </Link>
            <Link
              href="/shop?category=men"
              className="font-display text-sm tracking-button border border-graphite px-7 py-3 rounded-button hover:border-white transition-colors"
            >
              New in
            </Link>
          </div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="max-w-container mx-auto px-6 py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {CATEGORY_TILES.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.id}`}
              className="group relative bg-grey-50 border border-grey-200 p-8 h-44 flex flex-col justify-end hover:border-ink transition-colors"
            >
              <p className="font-display text-3xl">{c.label}</p>
              <p className="text-sm text-grey-500">{c.copy}</p>
              <span className="absolute top-6 right-6 font-display text-xs tracking-button text-grey-400 group-hover:text-ink">
                Shop →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured grid */}
      <section className="max-w-container mx-auto px-6 pb-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-2xl">
            {featured.length ? "Featured" : "New arrivals"}
          </h2>
          <Link
            href="/shop"
            className="font-display text-xs tracking-button text-grey-500 hover:text-ink"
          >
            View all →
          </Link>
        </div>
        {grid.length === 0 ? (
          <div className="border border-grey-200 p-14 text-center text-grey-500">
            <p>No products yet.</p>
            <p className="text-sm mt-1">
              Add products from the{" "}
              <Link href="/admin/products/new" className="underline">
                admin panel
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {grid.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
