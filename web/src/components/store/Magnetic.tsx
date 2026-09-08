"use client";

import { useRef, useState } from "react";

// Subtle magnetic cursor-follow. The element drifts a few px toward the cursor
// and eases back on leave. Wrap a button/link; children stay fully clickable.
export function Magnetic({
  children,
  strength = 4,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength;
    const dy = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength;
    setT({ x: dx, y: dy });
  }

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
      style={{ transform: `translate(${t.x}px, ${t.y}px)` }}
      className={`inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${className}`}
    >
      {children}
    </span>
  );
}
