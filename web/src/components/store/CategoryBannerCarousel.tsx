"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ProductImage } from "./ProductImage";
import type { CategoryBannerView } from "@/lib/category";

// Auto-rotating, swipeable banner carousel for a category landing page.
// transform-only slides; autoplay pauses on hover and is disabled for
// prefers-reduced-motion. Swipe on touch, dots + arrows on desktop.
export function CategoryBannerCarousel({ banners }: { banners: CategoryBannerView[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = banners.length;
  const startX = useRef<number | null>(null);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const go = (next: number) => setI(((next % n) + n) % n);

  useEffect(() => {
    if (n <= 1 || paused || reduce.current) return;
    const id = setInterval(() => setI((c) => (c + 1) % n), 5000);
    return () => clearInterval(id);
  }, [n, paused]);

  if (n === 0) return null;

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
    startX.current = null;
  }

  return (
    <div
      className="relative overflow-hidden bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      <div
        className="flex transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {banners.map((b) => (
          <div key={b.id} className="relative w-full shrink-0 min-h-[280px] sm:min-h-[380px] flex items-center text-white">
            {b.image && (
              <div className="absolute inset-0">
                <ProductImage src={b.image} alt={b.heading ?? "Banner"} sizes="100vw" priority />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            )}
            <div className="relative max-w-container mx-auto w-full px-6 sm:px-10 py-14">
              <div className="max-w-xl">
                {b.subtext && (
                  <p className="font-display text-xs tracking-label text-concrete mb-3">{b.subtext}</p>
                )}
                {b.heading && (
                  <h2 className="font-display text-3xl sm:text-5xl leading-[1.05] mb-5">{b.heading}</h2>
                )}
                {b.buttonText && (
                  <Link
                    href={b.buttonLink || "/shop"}
                    className="inline-block font-display text-sm tracking-button bg-white text-ink px-7 py-3.5 rounded-button transition-transform duration-300 hover:scale-105 active:scale-95"
                  >
                    {b.buttonText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {n > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={() => go(i - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center rounded-pill bg-white/85 text-ink hover:bg-white transition-colors"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={() => go(i + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center rounded-pill bg-white/85 text-ink hover:bg-white transition-colors"
          >
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((b, idx) => (
              <button
                key={b.id}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => go(idx)}
                className={`h-1.5 rounded-pill transition-all duration-300 ${
                  idx === i ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
