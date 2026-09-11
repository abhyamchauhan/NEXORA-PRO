"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const CATEGORIES = [
  { id: "", label: "All" },
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "kids", label: "Kids" },
];

const SORTS = [
  { id: "", label: "Newest" },
  { id: "price-asc", label: "Price low–high" },
  { id: "price-desc", label: "Price high–low" },
  { id: "name", label: "Name A–Z" },
];

export function ShopFilters({
  sizeOptions,
  colorOptions,
}: {
  sizeOptions: string[];
  colorOptions: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const [min, setMin] = useState(params.get("min") ?? "");
  const [max, setMax] = useState(params.get("max") ?? "");

  function push(next: URLSearchParams) {
    router.replace(`/shop?${next.toString()}`);
  }

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    push(next);
  }

  function toggleCsv(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    const current = (next.get(key)?.split(",").filter(Boolean)) ?? [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    if (updated.length) next.set(key, updated.join(","));
    else next.delete(key);
    push(next);
  }

  function applyPrice() {
    const next = new URLSearchParams(params.toString());
    if (min) next.set("min", min);
    else next.delete("min");
    if (max) next.set("max", max);
    else next.delete("max");
    push(next);
  }

  const activeCategory = params.get("category") ?? "";
  const activeSizes = params.get("size")?.split(",").filter(Boolean) ?? [];
  const activeColors = params.get("color")?.split(",").filter(Boolean) ?? [];
  const hasFilters = params.toString().length > 0;

  return (
    <aside className="space-y-7 text-sm">
      <Group title="Category">
        <ul className="space-y-1.5">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setParam("category", c.id)}
                className={`text-left ${
                  activeCategory === c.id
                    ? "text-ink font-bold"
                    : "text-grey-500 hover:text-ink"
                }`}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Sort">
        <select
          value={params.get("sort") ?? ""}
          onChange={(e) => setParam("sort", e.target.value)}
          className="w-full border border-grey-300 bg-white px-2 py-2 text-sm outline-none focus:border-ink"
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </Group>

      <Group title="Price (₹)">
        <div className="flex items-center gap-2">
          <input
            value={min}
            onChange={(e) => setMin(e.target.value)}
            onBlur={applyPrice}
            placeholder="Min"
            inputMode="numeric"
            className="w-full border border-grey-300 px-2 py-1.5 outline-none focus:border-ink"
          />
          <span className="text-grey-400">–</span>
          <input
            value={max}
            onChange={(e) => setMax(e.target.value)}
            onBlur={applyPrice}
            placeholder="Max"
            inputMode="numeric"
            className="w-full border border-grey-300 px-2 py-1.5 outline-none focus:border-ink"
          />
        </div>
      </Group>

      {sizeOptions.length > 0 && (
        <Group title="Size">
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((s) => (
              <button
                key={s}
                onClick={() => toggleCsv("size", s)}
                className={`min-w-9 px-2 py-1.5 border text-xs font-display tracking-button ${
                  activeSizes.includes(s)
                    ? "border-ink bg-ink text-white"
                    : "border-grey-300 hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </Group>
      )}

      {colorOptions.length > 0 && (
        <Group title="Colour">
          <ul className="space-y-1.5">
            {colorOptions.map((c) => (
              <li key={c}>
                <label className="flex items-center gap-2 cursor-pointer text-grey-600">
                  <input
                    type="checkbox"
                    checked={activeColors.includes(c)}
                    onChange={() => toggleCsv("color", c)}
                  />
                  {c}
                </label>
              </li>
            ))}
          </ul>
        </Group>
      )}

      {hasFilters && (
        <button
          onClick={() => router.replace("/shop")}
          className="text-xs text-sale underline"
        >
          Clear all filters
        </button>
      )}
    </aside>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-display text-xs tracking-label text-grey-500 mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}
