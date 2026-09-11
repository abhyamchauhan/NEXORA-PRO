"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { inr, CATEGORY_LABELS } from "@/lib/format";
import {
  saleActive,
  effectivePrice,
  discountPct,
  isComingSoon,
  countdownTarget,
} from "@/lib/pricing";
import { Countdown } from "./Countdown";
import { useCart } from "./CartProvider";
import { Rotation360Viewer } from "./Rotation360Viewer";
import { ProductGallery } from "./ProductGallery";
import { Stars } from "./Stars";
import { WishlistButton } from "./WishlistButton";
import { SizeGuide } from "./SizeGuide";
import type { SizeChartData } from "@/lib/size-chart";

export type ClientVariant = {
  id: string;
  size: string;
  color: string;
  colorHex: string | null;
  stock: number;
  displayMode: "static" | "rotation360";
  images: string[];
  imageLabels: string[];
};

export type ClientProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  saleStartsAt: string | null;
  saleEndsAt: string | null;
  releaseAt: string | null;
  category: string;
  material: string | null;
  care: string | null;
  rating: number | null;
  reviewCount: number;
  variants: ClientVariant[];
};

export function ProductDetailClient({
  product,
  sizeChart,
}: {
  product: ClientProduct;
  sizeChart: SizeChartData | null;
}) {
  const { add } = useCart();
  const router = useRouter();

  // Sale / drop state (Step 16). Computed from the server-provided fields.
  const onSale = saleActive(product);
  const effPrice = effectivePrice(product);
  const pct = discountPct(product);
  const comingSoon = isComingSoon(product);
  const target = countdownTarget(product);

  const colors = useMemo(() => {
    const seen = new Map<string, ClientVariant>();
    for (const v of product.variants) if (!seen.has(v.color)) seen.set(v.color, v);
    return [...seen.values()];
  }, [product.variants]);

  const [color, setColor] = useState(colors[0]?.color ?? "");
  const sizesForColor = product.variants.filter((v) => v.color === color);
  const firstInStock = sizesForColor.find((v) => v.stock > 0) ?? sizesForColor[0];
  const [size, setSize] = useState(firstInStock?.size ?? "");

  const selected =
    product.variants.find((v) => v.color === color && v.size === size) ??
    firstInStock;

  const [added, setAdded] = useState(false);

  function onColor(next: string) {
    setColor(next);
    const sizes = product.variants.filter((v) => v.color === next);
    const inStock = sizes.find((v) => v.stock > 0) ?? sizes[0];
    setSize(inStock?.size ?? "");
    setAdded(false);
  }

  function onAdd() {
    if (comingSoon || !selected || selected.stock <= 0) return;
    add({
      variantId: selected.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      color: selected.color,
      size: selected.size,
      price: effPrice, // sale price when on sale
      image: selected.images[0],
      maxStock: selected.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  const swatch = (v: ClientVariant) => v.colorHex || "#c4c4c4";
  const stock = selected?.stock ?? 0;

  return (
    <div className="max-w-container mx-auto px-6 py-10">
      <nav className="text-sm text-grey-500 mb-8">
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>{" "}
        /{" "}
        <Link href={`/shop?category=${product.category}`} className="hover:text-ink">
          {CATEGORY_LABELS[product.category] ?? product.category}
        </Link>{" "}
        / <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Viewer */}
        <div>
          {selected?.displayMode === "rotation360" && selected.images.length ? (
            <Rotation360Viewer images={selected.images} alt={product.name} />
          ) : (
            <ProductGallery
              images={selected?.images ?? []}
              labels={selected?.imageLabels ?? []}
              alt={product.name}
            />
          )}
        </div>

        {/* Details */}
        <div className="lg:py-2">
          <p className="font-display text-sm tracking-label text-grey-500">
            {CATEGORY_LABELS[product.category] ?? product.category}
          </p>
          <div className="flex items-start justify-between gap-4 mt-2">
            <h1 className="font-display text-3xl sm:text-4xl leading-tight">
              {product.name}
            </h1>
            <WishlistButton productId={product.id} className="mt-1 text-ink shrink-0" size={26} />
          </div>

          {product.rating != null && (
            <div className="mt-3">
              <Stars rating={product.rating} count={product.reviewCount} size="lg" />
            </div>
          )}

          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <p className="text-2xl sm:text-3xl font-display">{inr(effPrice)}</p>
            {onSale && (
              <>
                <span className="text-lg text-grey-400 line-through">{inr(product.price)}</span>
                <span className="font-display text-xs tracking-button bg-sale text-white px-2 py-1 rounded-button sale-pulse">
                  {pct}% OFF
                </span>
              </>
            )}
          </div>

          {/* Sale ends / Drops in — flip countdown */}
          {target && (
            <div className="mt-5 border border-grey-200 bg-grey-50 p-4">
              <p className="font-display text-xs tracking-label text-grey-500 mb-2">
                {target.kind === "drop" ? "Drops in" : "Sale ends in"}
              </p>
              <Countdown endsAt={target.endsAt} onExpire={() => router.refresh()} size="md" />
            </div>
          )}

          <p className="text-base text-grey-600 leading-relaxed mt-6 max-w-prose">
            {product.description}
          </p>

          {/* Colour */}
          <div className="mt-9">
            <p className="font-display text-base tracking-button mb-3">
              Colour — <span className="text-grey-500">{color}</span>
            </p>
            <div className="flex gap-3">
              {colors.map((v) => (
                <button
                  key={v.color}
                  onClick={() => onColor(v.color)}
                  title={v.color}
                  className={`w-10 h-10 rounded-pill border-2 transition-transform hover:scale-105 ${
                    color === v.color ? "border-ink" : "border-grey-200"
                  }`}
                  style={{ background: swatch(v) }}
                  aria-label={v.color}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display text-base tracking-button">Size</p>
              <SizeGuide chart={sizeChart} />
            </div>
            <div className="flex flex-wrap gap-2.5">
              {sizesForColor.map((v) => {
                const soldOut = v.stock <= 0;
                return (
                  <button
                    key={v.id}
                    disabled={soldOut}
                    onClick={() => {
                      setSize(v.size);
                      setAdded(false);
                    }}
                    className={`min-w-14 px-4 py-3 border text-base font-display tracking-button transition-colors ${
                      size === v.size
                        ? "border-ink bg-ink text-white"
                        : "border-grey-300 hover:border-ink"
                    } ${soldOut ? "opacity-40 line-through cursor-not-allowed" : ""}`}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock indicator */}
          <div className="mt-6 text-base font-display tracking-button">
            {comingSoon ? (
              <span className="text-grey-500">Coming soon</span>
            ) : stock <= 0 ? (
              <span className="text-sale">Out of stock</span>
            ) : stock <= 5 ? (
              <span className="text-sale">Only {stock} left</span>
            ) : (
              <span className="text-rating">In stock</span>
            )}
          </div>

          {/* Add to cart (or coming-soon lock) */}
          <button
            onClick={onAdd}
            disabled={comingSoon || stock <= 0}
            className="mt-5 w-full sm:w-auto font-display text-base tracking-button bg-accent text-white px-12 py-4 rounded-button transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {comingSoon
              ? "Coming soon"
              : stock <= 0
                ? "Sold out"
                : added
                  ? "✓ Added to bag"
                  : "Add to bag"}
          </button>

          {added && (
            <p className="mt-3 text-base">
              <Link href="/cart" className="underline">
                View bag →
              </Link>
            </p>
          )}

          {/* Product details */}
          <div className="mt-12 border-t border-grey-200 pt-8">
            <h2 className="font-display text-xl mb-5">Product details</h2>
            <dl className="space-y-4 text-base">
              <Row label="Category">
                {CATEGORY_LABELS[product.category] ?? product.category}
              </Row>
              {product.material && <Row label="Material">{product.material}</Row>}
              <Row label="Care">
                {product.care ||
                  "Machine wash cold with like colours. Do not bleach. Tumble dry low. Warm iron if needed."}
              </Row>
              <Row label="Shipping">
                Free doorstep delivery across India · easy 7-day returns.
              </Row>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-4">
      <dt className="font-display text-sm tracking-label text-grey-500">{label}</dt>
      <dd className="text-grey-700">{children}</dd>
    </div>
  );
}
