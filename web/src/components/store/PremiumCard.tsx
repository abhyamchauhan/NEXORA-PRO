"use client";

import Link from "next/link";
import { useRef, type ReactNode, type CSSProperties } from "react";

type PremiumCardProps = {
  /** When set, the whole card is a link. Otherwise it renders as a static block. */
  href?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * Luxury account-card wrapper. On pointer-capable, non-reduced-motion desktops
 * it tracks the cursor for a faint radial highlight, a ~1deg tilt and a subtle
 * lift/scale. Everything is transform/opacity only and is driven through CSS
 * variables the .premium-card rules read (see globals.css). On touch devices,
 * reduced-motion, or when the pointer leaves, all vars reset to rest.
 */
export function PremiumCard({ href, children, className = "", style }: PremiumCardProps) {
  const ref = useRef<HTMLElement | null>(null);

  const interactive = () => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return (
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  };

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el || !interactive()) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    // ±1deg tilt, inverted so the card leans toward the cursor.
    el.style.setProperty("--ry", `${(px - 0.5) * 2}deg`);
    el.style.setProperty("--rx", `${(0.5 - py) * 2}deg`);
    el.style.setProperty("--ty", "-6px");
    el.style.setProperty("--sc", "1.015");
  }

  function onEnter() {
    const el = ref.current;
    if (!el || !interactive()) return;
    el.style.setProperty("--ty", "-6px");
    el.style.setProperty("--sc", "1.015");
  }

  function reset() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--ty", "0px");
    el.style.setProperty("--sc", "1");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  }

  const cardClass = `premium-card group ${className}`;
  const inner = <span className="premium-card__glow" aria-hidden="true" />;

  if (href) {
    return (
      <div className="[perspective:1000px]">
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={cardClass}
          style={style}
          onMouseMove={onMove}
          onMouseEnter={onEnter}
          onMouseLeave={reset}
        >
          {inner}
          {children}
        </Link>
      </div>
    );
  }

  return (
    <div className="[perspective:1000px]">
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={cardClass}
        style={style}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={reset}
      >
        {inner}
        {children}
      </div>
    </div>
  );
}
