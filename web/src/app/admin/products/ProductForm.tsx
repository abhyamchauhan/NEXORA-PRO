"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VariantMatrix, type VariantRow } from "./VariantMatrix";

export type VariantState = {
  id?: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  displayMode: "static" | "rotation360";
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
  subCategoryId: string | null;
  material: string | null;
  care: string | null;
  rating: number | null;
  reviewCount: number;
  variants: VariantState[];
};

export type SubCategoryOption = {
  id: string;
  name: string;
  group: string;
  category: "men" | "women" | "kids";
};

export function ProductForm({
  initial,
  subCategories = [],
}: {
  initial?: ProductInitial;
  subCategories?: SubCategoryOption[];
}) {
  const router = useRouter();
  const editing = !!initial;

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState<string>(initial ? String(initial.price) : "");
  const [category, setCategory] = useState<"men" | "women" | "kids">(initial?.category ?? "men");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [subCategoryId, setSubCategoryId] = useState<string>(initial?.subCategoryId ?? "");
  const [material, setMaterial] = useState(initial?.material ?? "");
  const [care, setCare] = useState(initial?.care ?? "");
  const [rating, setRating] = useState(initial?.rating != null ? String(initial.rating) : "");
  const [reviewCount, setReviewCount] = useState(initial?.reviewCount ? String(initial.reviewCount) : "");

  // Create-mode only: the matrix rows to submit with the product.
  const [matrixRows, setMatrixRows] = useState<VariantRow[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [detailsMsg, setDetailsMsg] = useState<string | null>(null);

  function fieldsPayload() {
    return {
      name,
      description,
      price: Number(price),
      category,
      featured,
      subCategoryId: subCategoryId || null,
      material,
      care,
      rating: rating ? Number(rating) : null,
      reviewCount: reviewCount ? Number(reviewCount) : 0,
    };
  }

  // Sub-categories available for the currently-selected category.
  const subOptions = subCategories.filter((s) => s.category === category);

  // CREATE: product + all matrix variants in one request.
  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (matrixRows.length === 0) {
      setError("Add at least one variant (pick sizes + colours, then Generate).");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...fieldsPayload(),
        variants: matrixRows.map((r) => ({
          size: r.size,
          color: r.color,
          colorHex: r.colorHex,
          stock: r.stock,
          displayMode: r.displayMode,
          images: r.images,
          imageLabels: r.imageLabels,
        })),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Could not create the product.");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  // EDIT: save product fields only (variants are managed live in the matrix).
  async function onSaveDetails() {
    setDetailsMsg(null);
    setSaving(true);
    const res = await fetch(`/api/admin/products/${initial!.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fieldsPayload()),
    });
    setSaving(false);
    const d = await res.json().catch(() => ({}));
    setDetailsMsg(res.ok ? "Details saved ✓" : d.error || "Could not save.");
    if (res.ok) router.refresh();
  }

  const initialRows: VariantRow[] = (initial?.variants ?? []).map((v) => ({
    id: v.id,
    size: v.size,
    color: v.color,
    colorHex: v.colorHex,
    stock: v.stock,
    displayMode: v.displayMode,
    images: v.images,
    imageLabels: v.imageLabels,
  }));

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">{editing ? "Edit product" : "Add product"}</h1>
        <Link href="/admin/products" className="text-sm text-grey-500 hover:text-ink">
          ← Back
        </Link>
      </div>

      {/* Product details */}
      <form onSubmit={editing ? (e) => e.preventDefault() : onCreate}>
        <div className="bg-white border border-grey-200 p-6 space-y-4">
          <Labeled label="Name">
            <input value={name} onChange={(e) => setName(e.target.value)} required className="input" />
          </Labeled>
          <Labeled label="Description">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required className="input" />
          </Labeled>
          <div className="grid grid-cols-2 gap-4">
            <Labeled label="Price (₹)">
              <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} required className="input" />
            </Labeled>
            <Labeled label="Category">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as "men" | "women" | "kids");
                  setSubCategoryId(""); // sub-categories are category-specific
                }}
                className="input"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </Labeled>
          </div>

          <Labeled label="Sub-category (optional)">
            <select
              value={subCategoryId}
              onChange={(e) => setSubCategoryId(e.target.value)}
              className="input"
              disabled={subOptions.length === 0}
            >
              <option value="">
                {subOptions.length === 0 ? "No sub-categories for this category yet" : "— None —"}
              </option>
              {subOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.group} → {s.name}
                </option>
              ))}
            </select>
          </Labeled>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Feature on homepage
          </label>
          <Labeled label="Material (optional)">
            <input value={material} onChange={(e) => setMaterial(e.target.value)} className="input" placeholder="380 GSM brushed cotton fleece" />
          </Labeled>
          <Labeled label="Care instructions (optional)">
            <textarea value={care} onChange={(e) => setCare(e.target.value)} rows={2} className="input" placeholder="Machine wash cold, tumble dry low." />
          </Labeled>
          <div className="grid grid-cols-2 gap-4">
            <Labeled label="Rating (0–5, optional)">
              <input type="number" step="0.1" min={0} max={5} value={rating} onChange={(e) => setRating(e.target.value)} className="input" placeholder="4.8" />
            </Labeled>
            <Labeled label="Review count (optional)">
              <input type="number" min={0} value={reviewCount} onChange={(e) => setReviewCount(e.target.value)} className="input" placeholder="128" />
            </Labeled>
          </div>

          {editing && (
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onSaveDetails}
                disabled={saving}
                className="font-display text-sm tracking-button bg-ink text-white px-6 py-3 rounded-button hover:bg-black disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save details"}
              </button>
              {detailsMsg && (
                <span className={`text-sm ${detailsMsg.includes("✓") ? "text-rating" : "text-sale"}`}>{detailsMsg}</span>
              )}
            </div>
          )}
        </div>

        {/* Variants matrix */}
        <div className="mt-8">
          <h2 className="font-display text-sm tracking-label text-grey-500 mb-3">
            Variants — sizes × colours
          </h2>
          <VariantMatrix
            productId={initial?.id}
            initial={initialRows}
            onLocalChange={editing ? undefined : setMatrixRows}
          />
          {editing && (
            <p className="text-xs text-grey-400 mt-3">
              Each variant saves on its own — editing one never affects the others.
            </p>
          )}
        </div>

        {!editing && (
          <>
            {error && <p className="text-sale text-sm mt-5">{error}</p>}
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="font-display text-sm tracking-button bg-ink text-white px-6 py-3 rounded-button hover:bg-black disabled:opacity-60"
              >
                {saving ? "Creating…" : "Create product"}
              </button>
              <Link href="/admin/products" className="font-display text-sm tracking-button border border-grey-300 px-6 py-3 rounded-button hover:border-ink">
                Cancel
              </Link>
            </div>
          </>
        )}
      </form>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border: 1px solid #dddddd;
          background: #fff;
          padding: 0.55rem 0.65rem;
          font-size: 0.9rem;
          outline: none;
        }
        :global(.input:focus) {
          border-color: #1c1c1c;
        }
      `}</style>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-display text-xs tracking-label text-grey-500">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
