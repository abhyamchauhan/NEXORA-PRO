"use client";

import { useState } from "react";
import { SizeChartEditor } from "@/components/admin/SizeChartEditor";

const CATS = [
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "kids", label: "Kids" },
];

export default function AdminSizeCharts() {
  const [cat, setCat] = useState("men");

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl mb-2">Size charts</h1>
      <p className="text-sm text-grey-500 mb-6">
        Category defaults. A product without its own chart uses its category
        default. Per-product charts are edited on the product's Edit page.
      </p>

      <div className="flex gap-2 mb-6">
        {CATS.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`font-display text-xs tracking-button px-4 py-2 border rounded-button ${
              cat === c.id ? "border-ink bg-ink text-white" : "border-grey-300"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-grey-200 p-6">
        {/* key forces a reload when the category changes */}
        <SizeChartEditor key={cat} category={cat} />
      </div>
    </div>
  );
}
