"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SingleImageUpload } from "./SingleImageUpload";
import { typeLabel } from "./SectionMiniPreview";

type Section = {
  id: string;
  type: string;
  heading: string | null;
  subtext: string | null;
  image: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  productIds: string[];
  categories: string[];
};

const CATEGORIES = ["men", "women", "kids"];

export function SectionForm({
  section,
  products,
}: {
  section: Section;
  products: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [heading, setHeading] = useState(section.heading ?? "");
  const [subtext, setSubtext] = useState(section.subtext ?? "");
  const [image, setImage] = useState<string | undefined>(section.image ?? undefined);
  const [buttonText, setButtonText] = useState(section.buttonText ?? "");
  const [buttonLink, setButtonLink] = useState(section.buttonLink ?? "");
  const [productIds, setProductIds] = useState<string[]>(section.productIds);
  const [categories, setCategories] = useState<string[]>(section.categories);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showImage = section.type === "hero" || section.type === "banner";
  const showButton = section.type === "hero" || section.type === "banner";
  const showProducts = section.type === "featuredProducts";
  const showCategories = section.type === "categoryShowcase";

  function toggle<T>(list: T[], v: T) {
    return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/homepage/${section.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heading,
        subtext,
        image: image ?? "",
        buttonText,
        buttonLink,
        productIds,
        categories,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Could not save.");
      return;
    }
    router.push("/admin/homepage");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Edit {typeLabel(section.type)}</h1>
        <Link href="/admin/homepage" className="text-sm text-grey-500 hover:text-ink">
          ← Back
        </Link>
      </div>

      <div className="bg-white border border-grey-200 p-6 space-y-5">
        <Labeled label="Heading">
          <input value={heading} onChange={(e) => setHeading(e.target.value)} className="in" />
        </Labeled>

        {(section.type === "hero" || section.type === "banner" || section.type === "featuredProducts" || section.type === "categoryShowcase") && (
          <Labeled label={section.type === "featuredProducts" || section.type === "categoryShowcase" ? "Subtext (optional)" : "Subtext / eyebrow"}>
            <input value={subtext} onChange={(e) => setSubtext(e.target.value)} className="in" />
          </Labeled>
        )}

        {showImage && (
          <div>
            <span className="font-display text-xs tracking-label text-grey-500">
              Background image
            </span>
            <div className="mt-2">
              <SingleImageUpload value={image} onChange={setImage} />
            </div>
          </div>
        )}

        {showButton && (
          <div className="grid grid-cols-2 gap-4">
            <Labeled label="Button text">
              <input value={buttonText} onChange={(e) => setButtonText(e.target.value)} className="in" placeholder="Shop now" />
            </Labeled>
            <Labeled label="Button link">
              <input value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} className="in" placeholder="/shop" />
            </Labeled>
          </div>
        )}

        {showCategories && (
          <div>
            <span className="font-display text-xs tracking-label text-grey-500">
              Categories to show
            </span>
            <div className="flex gap-2 mt-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategories((cs) => toggle(cs, c))}
                  className={`px-4 py-2 border text-sm font-display tracking-button capitalize ${
                    categories.includes(c) ? "border-ink bg-ink text-white" : "border-grey-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {showProducts && (
          <div>
            <span className="font-display text-xs tracking-label text-grey-500">
              Products in this section ({productIds.length} selected)
            </span>
            <div className="mt-2 max-h-64 overflow-y-auto border border-grey-200 divide-y divide-grey-100">
              {products.length === 0 && (
                <p className="p-3 text-sm text-grey-500">No products yet.</p>
              )}
              {products.map((p) => (
                <label key={p.id} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-grey-50">
                  <input
                    type="checkbox"
                    checked={productIds.includes(p.id)}
                    onChange={() => setProductIds((ids) => toggle(ids, p.id))}
                  />
                  {p.name}
                </label>
              ))}
            </div>
            <p className="text-xs text-grey-400 mt-1">
              Order follows the order you tick them.
            </p>
          </div>
        )}

        {error && <p className="text-sale text-sm">{error}</p>}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="font-display text-sm tracking-button bg-ink text-white px-6 py-3 rounded-button hover:bg-black disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <Link
          href="/admin/homepage"
          className="font-display text-sm tracking-button border border-grey-300 px-6 py-3 rounded-button hover:border-ink"
        >
          Cancel
        </Link>
      </div>

      <style jsx>{`
        :global(.in) {
          width: 100%;
          border: 1px solid #dddddd;
          background: #fff;
          padding: 0.55rem 0.65rem;
          font-size: 0.9rem;
          outline: none;
          margin-top: 0.25rem;
        }
        :global(.in:focus) {
          border-color: #1c1c1c;
        }
      `}</style>
    </form>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-display text-xs tracking-label text-grey-500">{label}</span>
      {children}
    </label>
  );
}
