"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { inr, CATEGORY_LABELS } from "@/lib/format";
import { useCart } from "./CartProvider";
import { Rotation360Viewer } from "./Rotation360Viewer";
import { ProductGallery } from "./ProductGallery";

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
  category: string;
  variants: ClientVariant[];
};

export function ProductDetailClient({ product }: { product: ClientProduct }) {
  const { add } = useCart();

  // Distinct colours, in first-seen order.
  const colors = useMemo(() => {
    const seen = new Map<string, ClientVariant>();
    for (const v of product.variants) if (!seen.has(v.color)) seen.set(v.color, v);
    return [...seen.values()];
  }, [product.variants]);

  const [color, setColor] = useState(colors[0]?.color ?? "");

  // Variants (sizes) available for the chosen colour = a different photo set.
  const sizesForColor = product.variants.filter((v) => v.color === color);
  const firstInStock =
    sizesForColor.find((v) => v.stock > 0) ?? sizesForColor[0];
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
    if (!selected || selected.stock <= 0) return;
    add({
      variantId: selected.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      color: selected.color,
      size: selected.size,
      price: product.price,
      image: selected.images[0],
      maxStock: selected.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  const swatch = (v: ClientVariant) => v.colorHex || "#c4c4c4";
  const stock = selected?.stock ?? 0;

  return (
    <div className="max-w-container mx-auto px-6 py-8">
      <nav className="text-xs text-grey-500 mb-6">
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>{" "}
        /{" "}
        <Link href={`/shop?category=${product.category}`} className="hover:text-ink">
          {CATEGORY_LABELS[product.category] ?? product.category}
        </Link>{" "}
        / <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Viewer — switches on the selected variant's displayMode */}
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
        <div>
          <p className="font-display text-xs tracking-label text-grey-500">
            {CATEGORY_LABELS[product.category] ?? product.category}
          </p>
          <h1 className="font-display text-3xl mt-1">{product.name}</h1>
          <p className="text-xl mt-3">{inr(product.price)}</p>

          <p className="text-sm text-grey-600 leading-relaxed mt-5">
            {product.description}
          </p>

          {/* Colour */}
          <div className="mt-7">
            <p className="font-display text-xs tracking-label text-grey-500 mb-2">
              Colour — <span className="text-ink">{color}</span>
            </p>
            <div className="flex gap-2">
              {colors.map((v) => (
                <button
                  key={v.color}
                  onClick={() => onColor(v.color)}
                  title={v.color}
                  className={`w-8 h-8 rounded-pill border-2 ${
                    color === v.color ? "border-ink" : "border-grey-200"
                  }`}
                  style={{ background: swatch(v) }}
                  aria-label={v.color}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-6">
            <p className="font-display text-xs tracking-label text-grey-500 mb-2">
              Size
            </p>
            <div className="flex flex-wrap gap-2">
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
                    className={`min-w-11 px-3 py-2 border text-sm font-display tracking-button transition-colors ${
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
          <div className="mt-5 text-sm">
            {stock <= 0 ? (
              <span className="text-sale font-bold">Out of stock</span>
            ) : stock <= 5 ? (
              <span className="text-sale">Only {stock} left</span>
            ) : (
              <span className="text-rating">In stock</span>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={onAdd}
            disabled={stock <= 0}
            className="mt-4 w-full sm:w-auto font-display text-sm tracking-button bg-ink text-white px-10 py-4 rounded-button hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {stock <= 0 ? "Sold out" : added ? "✓ Added to bag" : "Add to bag"}
          </button>

          {added && (
            <p className="mt-3 text-sm">
              <Link href="/cart" className="underline">
                View bag →
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
