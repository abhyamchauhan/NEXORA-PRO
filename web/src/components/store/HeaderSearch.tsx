"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { inr, PLACEHOLDER_IMG, CATEGORY_LABELS } from "@/lib/format";

type Hit = {
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string | null;
};
type CatHit = { label: string; href: string };

// Header search: a magnifier that expands to an input with a live, debounced
// predictive dropdown (products + category suggestions). Submitting or the
// "See all results" link routes to /shop?q=… (the full results page).
export function HeaderSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [products, setProducts] = useState<Hit[]>([]);
  const [categories, setCategories] = useState<CatHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // a query has completed
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Debounced predictive fetch.
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setProducts([]);
      setCategories([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const id = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.json() : { products: [], categories: [] }))
        .then((d) => {
          setProducts(d.products ?? []);
          setCategories(d.categories ?? []);
          setSearched(true);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 300);
    return () => {
      clearTimeout(id);
      ctrl.abort();
    };
  }, [q]);

  function goToResults(term: string) {
    const t = term.trim();
    if (!t) return;
    setOpen(false);
    setQ("");
    router.push(`/shop?q=${encodeURIComponent(t)}`);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    goToResults(q);
  }

  const term = q.trim();
  const showDropdown = open && term.length >= 2;
  const hasResults = products.length > 0 || categories.length > 0;

  return (
    <div ref={rootRef} className="relative flex items-center">
      <button
        aria-label="Search"
        onClick={() => setOpen((o) => !o)}
        className="hover:opacity-70 transition-opacity"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-50 w-[22rem] max-w-[85vw] bg-white text-ink border border-grey-200 shadow-drawer">
          <form onSubmit={submit} className="p-2 border-b border-grey-100 flex gap-2">
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

          {showDropdown && (
            <div className="max-h-[70vh] overflow-auto">
              {loading && !searched && (
                <p className="px-3 py-4 text-sm text-grey-500">Searching…</p>
              )}

              {searched && !hasResults && (
                <div className="px-3 py-5 text-center">
                  <p className="text-sm text-ink">
                    No results for “{term}”.
                  </p>
                  <p className="text-xs text-grey-500 mt-1 mb-3">
                    Try another term, or browse a category.
                  </p>
                  <div className="flex justify-center gap-2">
                    {Object.entries(CATEGORY_LABELS).map(([slug, label]) => (
                      <Link
                        key={slug}
                        href={`/shop?category=${slug}`}
                        onClick={() => setOpen(false)}
                        className="font-display text-[11px] tracking-button border border-grey-300 px-3 py-1.5 hover:border-ink"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {categories.length > 0 && (
                <div className="pt-2">
                  <p className="px-3 pb-1 font-display text-[10px] tracking-label text-grey-400">
                    CATEGORIES
                  </p>
                  {categories.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 text-sm hover:bg-grey-50"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}

              {products.length > 0 && (
                <div className="pt-2">
                  <p className="px-3 pb-1 font-display text-[10px] tracking-label text-grey-400">
                    PRODUCTS
                  </p>
                  {products.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/product/${p.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-grey-50"
                    >
                      <span className="relative w-11 h-14 bg-grey-50 shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image || PLACEHOLDER_IMG}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-sm tracking-button truncate">
                          {p.name}
                        </span>
                        <span className="block text-xs text-grey-500">
                          {CATEGORY_LABELS[p.category] ?? p.category} · {inr(p.price)}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {hasResults && (
                <button
                  type="button"
                  onClick={() => goToResults(term)}
                  className="w-full text-left px-3 py-3 border-t border-grey-100 font-display text-xs tracking-button hover:bg-grey-50"
                >
                  See all results for “{term}” →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
