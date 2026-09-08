"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImageUploader } from "./ImageUploader";

type DisplayMode = "static" | "rotation360";

export type VariantState = {
  id?: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  displayMode: DisplayMode;
  images: string[];
  imageLabels: string[];
};

export type ProductInitial = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "men" | "women" | "kids";
  featured: boolean;
  material: string | null;
  care: string | null;
  rating: number | null;
  reviewCount: number;
  variants: VariantState[];
};

const blankVariant = (): VariantState => ({
  size: "",
  color: "",
  colorHex: "",
  stock: 0,
  displayMode: "static", // default; 360° is opt-in premium treatment
  images: [],
  imageLabels: [],
});

export function ProductForm({ initial }: { initial?: ProductInitial }) {
  const router = useRouter();
  const editing = !!initial;

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState<string>(
    initial ? String(initial.price) : "",
  );
  const [category, setCategory] = useState<"men" | "women" | "kids">(
    initial?.category ?? "men",
  );
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [material, setMaterial] = useState(initial?.material ?? "");
  const [care, setCare] = useState(initial?.care ?? "");
  const [rating, setRating] = useState<string>(
    initial?.rating != null ? String(initial.rating) : "",
  );
  const [reviewCount, setReviewCount] = useState<string>(
    initial?.reviewCount ? String(initial.reviewCount) : "",
  );
  const [variants, setVariants] = useState<VariantState[]>(
    initial?.variants?.length ? initial.variants : [blankVariant()],
  );

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function patchVariant(i: number, patch: Partial<VariantState>) {
    setVariants((vs) => vs.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      name,
      description,
      price: Number(price),
      category,
      featured,
      material,
      care,
      rating: rating ? Number(rating) : null,
      reviewCount: reviewCount ? Number(reviewCount) : 0,
      variants,
    };

    const url = editing
      ? `/api/admin/products/${initial!.id}`
      : "/api/admin/products";
    const res = await fetch(url, {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Could not save the product.");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">
          {editing ? "Edit product" : "Add product"}
        </h1>
        <Link href="/admin/products" className="text-sm text-grey-500 hover:text-ink">
          ← Back
        </Link>
      </div>

      {/* Product fields */}
      <div className="bg-white border border-grey-200 p-6 space-y-4">
        <Labeled label="Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input"
          />
        </Labeled>
        <Labeled label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
            className="input"
          />
        </Labeled>
        <div className="grid grid-cols-2 gap-4">
          <Labeled label="Price (₹)">
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="input"
            />
          </Labeled>
          <Labeled label="Category">
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as "men" | "women" | "kids")
              }
              className="input"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
          </Labeled>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Feature on homepage
        </label>

        <Labeled label="Material (optional)">
          <input
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="input"
            placeholder="380 GSM brushed cotton fleece"
          />
        </Labeled>
        <Labeled label="Care instructions (optional)">
          <textarea
            value={care}
            onChange={(e) => setCare(e.target.value)}
            rows={2}
            className="input"
            placeholder="Machine wash cold, tumble dry low, do not bleach."
          />
        </Labeled>
        <div className="grid grid-cols-2 gap-4">
          <Labeled label="Rating (0–5, optional)">
            <input
              type="number"
              step="0.1"
              min={0}
              max={5}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="input"
              placeholder="4.8"
            />
          </Labeled>
          <Labeled label="Review count (optional)">
            <input
              type="number"
              min={0}
              value={reviewCount}
              onChange={(e) => setReviewCount(e.target.value)}
              className="input"
              placeholder="128"
            />
          </Labeled>
        </div>
      </div>

      {/* Variants */}
      <div className="flex items-center justify-between mt-8 mb-3">
        <h2 className="font-display text-sm tracking-label text-grey-500">
          Variants ({variants.length})
        </h2>
        <button
          type="button"
          onClick={() => setVariants((vs) => [...vs, blankVariant()])}
          className="text-xs font-display tracking-button border border-grey-300 px-3 py-1.5 rounded-button hover:border-ink"
        >
          + Add variant
        </button>
      </div>

      <div className="space-y-4">
        {variants.map((v, i) => (
          <div key={i} className="bg-white border border-grey-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-xs tracking-label text-grey-500">
                Variant {i + 1}
              </span>
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setVariants((vs) => vs.filter((_, idx) => idx !== i))
                  }
                  className="text-xs text-sale underline"
                >
                  Remove variant
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Labeled label="Size">
                <input
                  value={v.size}
                  onChange={(e) => patchVariant(i, { size: e.target.value })}
                  placeholder="M / L / OS"
                  className="input"
                />
              </Labeled>
              <Labeled label="Colour">
                <input
                  value={v.color}
                  onChange={(e) => patchVariant(i, { color: e.target.value })}
                  placeholder="Black"
                  className="input"
                />
              </Labeled>
              <Labeled label="Hex">
                <input
                  value={v.colorHex}
                  onChange={(e) => patchVariant(i, { colorHex: e.target.value })}
                  placeholder="#131313"
                  className="input"
                />
              </Labeled>
              <Labeled label="Stock">
                <input
                  type="number"
                  min={0}
                  value={v.stock}
                  onChange={(e) =>
                    patchVariant(i, { stock: Number(e.target.value) })
                  }
                  className="input"
                />
              </Labeled>
            </div>

            {/* Hybrid photo mode toggle */}
            <div className="mt-4">
              <span className="font-display text-xs tracking-label text-grey-500">
                Photo mode
              </span>
              <div className="flex gap-2 mt-1">
                <ModeButton
                  active={v.displayMode === "static"}
                  onClick={() => patchVariant(i, { displayMode: "static" })}
                  title="Static photos"
                  sub="4–6 images · default"
                />
                <ModeButton
                  active={v.displayMode === "rotation360"}
                  onClick={() => patchVariant(i, { displayMode: "rotation360" })}
                  title="360° rotation"
                  sub="12–16 images · premium"
                />
              </div>
            </div>

            <div className="mt-4">
              <ImageUploader
                mode={v.displayMode}
                images={v.images}
                labels={v.imageLabels}
                onChange={(images, imageLabels) =>
                  patchVariant(i, { images, imageLabels })
                }
              />
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-sale text-sm mt-5">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="font-display text-sm tracking-button bg-ink text-white px-6 py-3 rounded-button hover:bg-black transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : editing ? "Save changes" : "Create product"}
        </button>
        <Link
          href="/admin/products"
          className="font-display text-sm tracking-button border border-grey-300 px-6 py-3 rounded-button hover:border-ink"
        >
          Cancel
        </Link>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border: 1px solid #dddddd;
          background: #fff;
          padding: 0.55rem 0.65rem;
          font-size: 0.85rem;
          outline: none;
        }
        :global(.input:focus) {
          border-color: #1c1c1c;
        }
      `}</style>
    </form>
  );
}

function Labeled({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-display text-xs tracking-label text-grey-500">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function ModeButton({
  active,
  onClick,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 text-left border px-3 py-2 rounded-button transition-colors ${
        active ? "border-ink bg-grey-50" : "border-grey-200 hover:border-grey-400"
      }`}
    >
      <span className="block font-display text-xs tracking-button">{title}</span>
      <span className="block text-[11px] text-grey-500">{sub}</span>
    </button>
  );
}
