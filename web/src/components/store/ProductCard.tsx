"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Product, Variant } from "@prisma/client";
import { inr } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { WishlistButton } from "./WishlistButton";

type CardProduct = Product & { variants: Variant[] };

// Premium hover: the card floats up, tilts very slightly toward the cursor,
// gains a soft glow, and the image zooms + brightens. All transform/opacity
// (60fps-friendly); resets smoothly on leave; disabled for reduced-motion via
// the CSS transition being the only motion (pointer handlers just set state).
export function ProductCard({ product }: { product: CardProduct }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hover, setHover] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const allImages = product.variants.flatMap((v) => v.images).filter(Boolean);
  const firstImage = allImages[0];
  // A different angle/photo to crossfade to on hover (falls back to none).
  const secondImage = allImages.find((img) => img && img !== firstImage) ?? null;
  const colours = new Set(product.variants.map((v) => v.color)).size;
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
  const has360 = product.variants.some((v) => v.displayMode === "rotation360");

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -py * 2, ry: px * 2 }); // ≈ ±1deg
  }

  const transform = `translateY(${hover ? -8 : 0}px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${hover ? 1.01 : 1})`;

  return (
    <div className="relative">
      <WishlistButton
        productId={product.id}
        className="absolute top-2 right-2 z-20 w-9 h-9 rounded-pill bg-white/85 backdrop-blur text-ink shadow-sm"
        size={18}
      />
      <Link
        ref={ref}
        href={`/product/${product.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseMove={onMove}
      onMouseLeave={() => {
        setHover(false);
        setTilt({ rx: 0, ry: 0 });
      }}
      className="group block [perspective:1000px]"
    >
      <div
        style={{ transform }}
        className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform [transform-style:preserve-3d]"
      >
        <div
          className="relative aspect-[4/5] bg-grey-50 overflow-hidden transition-[box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]"
          style={hover ? { boxShadow: "0 24px 50px -12px rgb(0 0 0 / 0.28)" } : undefined}
        >
          {/* Base image — fades OUT on hover when a second angle exists */}
          <ProductImage
            src={firstImage}
            alt={product.name}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`transition-[transform,filter,opacity] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] group-hover:brightness-[1.04] ${
              secondImage ? "group-hover:opacity-0" : ""
            }`}
          />
          {/* Second angle — crossfades IN on hover */}
          {secondImage && (
            <span className="absolute inset-0 opacity-0 transition-opacity duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100">
              <ProductImage
                src={secondImage}
                alt={`${product.name} — alternate view`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
            </span>
          )}
          {has360 && (
            <span className="absolute top-2 left-2 bg-ink text-white text-[10px] font-display tracking-button px-2 py-1">
              360°
            </span>
          )}
          {totalStock === 0 && (
            <span className="absolute bottom-2 left-2 bg-grey-100 text-grey-500 text-[10px] font-display tracking-button px-2 py-1">
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
      </div>
      </Link>
    </div>
  );
}
