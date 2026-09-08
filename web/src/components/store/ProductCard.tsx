import Link from "next/link";
import type { Product, Variant } from "@prisma/client";
import { inr } from "@/lib/format";
import { ProductImage } from "./ProductImage";

type CardProduct = Product & { variants: Variant[] };

export function ProductCard({ product }: { product: CardProduct }) {
  const firstImage = product.variants.flatMap((v) => v.images)[0];
  const colours = new Set(product.variants.map((v) => v.color)).size;
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
  const has360 = product.variants.some((v) => v.displayMode === "rotation360");

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block transition-transform duration-300 ease-out hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] bg-grey-50 overflow-hidden transition-shadow duration-300 group-hover:shadow-card">
        <ProductImage
          src={firstImage}
          alt={product.name}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {has360 && (
          <span className="absolute top-2 left-2 bg-ink text-white text-[10px] font-display tracking-button px-2 py-1">
            360°
          </span>
        )}
        {totalStock === 0 && (
          <span className="absolute top-2 right-2 bg-grey-100 text-grey-500 text-[10px] font-display tracking-button px-2 py-1">
            SOLD OUT
          </span>
        )}
      </div>
      <div className="pt-3">
        <p className="font-display text-base tracking-button group-hover:text-grey-500 transition-colors">
          {product.name}
        </p>
        <p className="text-base mt-1">{inr(product.price)}</p>
        <p className="text-sm text-grey-400 mt-0.5">
          {colours} colour{colours !== 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
}
