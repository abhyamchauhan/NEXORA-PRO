"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Header search: a magnifier that expands to an input. Submitting routes to
// /shop?q=… which filters the Product table by name and shows results (with a
// proper empty state when nothing matches).
export function HeaderSearch({ tone }: { tone: "light" | "dark" }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setOpen(false);
    setQ("");
    router.push(`/shop?q=${encodeURIComponent(term)}`);
  }

  return (
    <div className="relative flex items-center">
      <button
        aria-label="Search"
        onClick={() => setOpen((o) => !o)}
        className="font-display text-sm tracking-button hover:opacity-70 transition-opacity"
      >
        {/* magnifier glyph */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <form
          onSubmit={submit}
          className={`absolute right-0 top-9 z-50 w-72 max-w-[80vw] border shadow-drawer p-2 flex gap-2 ${
            tone === "light"
              ? "bg-white text-ink border-grey-200"
              : "bg-white text-ink border-grey-200"
          }`}
        >
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            placeholder="Search products…"
            className="flex-1 border border-grey-300 px-3 py-2 text-sm outline-none focus:border-ink"
          />
          <button
            type="submit"
            className="font-display text-xs tracking-button bg-ink text-white px-3 rounded-button"
          >
            Go
          </button>
        </form>
      )}
    </div>
  );
}
