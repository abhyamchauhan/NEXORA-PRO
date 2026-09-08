"use client";

import { useEffect, useRef, useState } from "react";
import { ProductImage } from "./ProductImage";

// Gentle hero parallax: the background drifts slower than the page scroll.
// Scaled up a touch so the drift never exposes an edge. transform-only (60fps),
// disabled for reduced-motion.
export function HeroParallax({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [y, setY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        setY(Math.min(window.scrollY * 0.15, 70));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 will-change-transform transition-opacity duration-700"
      style={{
        transform: `translateY(${y}px) scale(1.12)`,
        opacity: mounted ? 1 : 0,
      }}
    >
      <ProductImage src={src} alt={alt} sizes="100vw" priority />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
