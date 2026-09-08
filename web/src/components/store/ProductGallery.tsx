"use client";

import { useState, useEffect } from "react";
import { ProductImage } from "./ProductImage";

// Static gallery: main image + thumbnail navigation. Captions (Front/Back/…)
// come from the variant's imageLabels.
export function ProductGallery({
  images,
  labels,
  alt,
  bgColor,
}: {
  images: string[];
  labels: string[];
  alt: string;
  bgColor: string;
}) {
  const [active, setActive] = useState(0);

  // Reset to the first image whenever the image set changes (colour switch).
  useEffect(() => setActive(0), [images]);

  const list = images.length ? images : [""];

  return (
    <div>
      <div
        className="relative aspect-[4/5] overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <ProductImage src={list[active]} alt={alt} fit="contain" sizes="(max-width:1024px) 100vw, 50vw" priority />
        {labels[active] && (
          <span className="absolute bottom-3 left-3 bg-white/80 text-ink text-[11px] font-display tracking-button px-2 py-1">
            {labels[active]}
          </span>
        )}
      </div>

      {list.length > 1 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {list.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-20 border ${
                active === i ? "border-ink" : "border-grey-200"
              }`}
              style={{ backgroundColor: bgColor }}
              aria-label={labels[i] || `View ${i + 1}`}
            >
              <ProductImage src={src} alt={labels[i] || `${alt} ${i + 1}`} fit="contain" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
