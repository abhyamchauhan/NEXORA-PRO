"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function ProductsControls() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  // Debounced search → updates the URL, which re-runs the server query.
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (q) next.set("q", q);
      else next.delete("q");
      router.replace(`/admin/products?${next.toString()}`);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/admin/products?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name…"
        className="flex-1 min-w-[200px] border border-grey-300 bg-white px-3 py-2 text-sm outline-none focus:border-ink"
      />
      <select
        value={params.get("category") ?? ""}
        onChange={(e) => update("category", e.target.value)}
        className="border border-grey-300 bg-white px-3 py-2 text-sm outline-none focus:border-ink"
      >
        <option value="">All categories</option>
        <option value="men">Men</option>
        <option value="women">Women</option>
        <option value="kids">Kids</option>
      </select>
      <select
        value={params.get("sort") ?? ""}
        onChange={(e) => update("sort", e.target.value)}
        className="border border-grey-300 bg-white px-3 py-2 text-sm outline-none focus:border-ink"
      >
        <option value="">Newest</option>
        <option value="name">Name A–Z</option>
        <option value="price-asc">Price low–high</option>
        <option value="price-desc">Price high–low</option>
      </select>
    </div>
  );
}
