"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminImageInput } from "@/components/admin/AdminImageInput";

const CATS = [
  { key: "men", label: "Men" },
  { key: "women", label: "Women" },
  { key: "kids", label: "Kids" },
] as const;

export function CategoryImages({
  initial,
}: {
  initial: Record<string, string | null>;
}) {
  const router = useRouter();
  const [images, setImages] = useState<Record<string, string | null>>(initial);
  const [msg, setMsg] = useState<string | null>(null);

  async function save(category: string, image: string | null) {
    setImages((m) => ({ ...m, [category]: image }));
    setMsg(null);
    const res = await fetch("/api/admin/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, image }),
    });
    setMsg(res.ok ? "Saved ✓ — refresh the homepage to see it." : "Could not save.");
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl">Category images</h1>
        {msg && <span className="text-sm text-rating">{msg}</span>}
      </div>
      <p className="text-sm text-grey-500 mb-6">
        Representative image for each top-level category, shown behind the{" "}
        <strong>Shop by category</strong> tiles on the homepage. Uploads go
        straight to Cloudinary and save instantly.
      </p>

      <div className="grid sm:grid-cols-3 gap-6">
        {CATS.map((c) => (
          <div key={c.key} className="bg-white border border-grey-200 p-5">
            <p className="font-display text-sm tracking-button mb-3">{c.label}</p>
            <AdminImageInput
              value={images[c.key] ?? null}
              onChange={(url) => save(c.key, url)}
              label="Category image"
              aspect="aspect-[4/3]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
