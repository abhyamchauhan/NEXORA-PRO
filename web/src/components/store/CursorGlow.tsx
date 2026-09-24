"use client";

import { useEffect, useRef, useState } from "react";

// Subtle desktop cursor accent: a soft ring that trails the pointer and grows
// over interactive elements (links, buttons, product images). Augments the
// native cursor rather than replacing it. Only on fine-pointer devices; fully
// disabled for touch and prefers-reduced-motion. transform/opacity only.
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const shown = useRef(false);
  const big = useRef(false);
  const raf = useRef(0);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    const interactive = "a, button, [role='button'], input[type='submit'], [data-cursor]";

    const render = () => {
      const el = ref.current;
      if (el) {
        el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%) scale(${big.current ? 1.9 : 1})`;
        el.style.opacity = shown.current ? (big.current ? "0.9" : "0.5") : "0";
      }
      raf.current = requestAnimationFrame(render);
    };
    raf.current = requestAnimationFrame(render);

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      shown.current = true;
      big.current = !!(e.target as Element)?.closest?.(interactive);
    };
    const onLeave = () => (shown.current = false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] w-7 h-7 rounded-pill border border-ink/60 mix-blend-difference"
      style={{ opacity: 0, transition: "opacity 0.2s ease, transform 0.12s ease-out", willChange: "transform, opacity" }}
    />
  );
}
