import type { Category, DisplayMode } from "@prisma/client";

export type VariantInput = {
  id?: string;
  size: string;
  color: string;
  colorHex?: string | null;
  stock: number;
  displayMode: DisplayMode;
  images: string[];
  imageLabels: string[];
};

export type ProductInput = {
  name: string;
  description: string;
  price: number;
  category: Category;
  featured: boolean;
  material: string | null;
  care: string | null;
  rating: number | null;
  reviewCount: number;
  variants: VariantInput[];
};

const CATEGORIES = ["men", "women", "kids"] as const;
const DISPLAY_MODES = ["static", "rotation360"] as const;

// Validate a single variant (used by the per-variant admin endpoints so one
// row can be created/updated independently of the rest of the product).
export function parseVariantInput(
  raw: unknown,
):
  | { ok: true; data: Omit<VariantInput, "id"> }
  | { ok: false; error: string } {
  if (typeof raw !== "object" || raw === null)
    return { ok: false, error: "Invalid variant." };
  const v = raw as Record<string, unknown>;

  const size = typeof v.size === "string" ? v.size.trim() : "";
  const color = typeof v.color === "string" ? v.color.trim() : "";
  const colorHex =
    typeof v.colorHex === "string" && v.colorHex.trim() ? v.colorHex.trim() : null;
  const stock = Number(v.stock);
  const displayMode = v.displayMode as DisplayMode;
  const images = Array.isArray(v.images)
    ? v.images.filter((x): x is string => typeof x === "string" && !!x)
    : [];
  const imageLabels = Array.isArray(v.imageLabels)
    ? v.imageLabels.map((x) => (typeof x === "string" ? x : ""))
    : [];

  if (!size) return { ok: false, error: "Size is required." };
  if (!color) return { ok: false, error: "Colour is required." };
  if (!Number.isFinite(stock) || stock < 0)
    return { ok: false, error: "Stock must be 0 or more." };
  if (!DISPLAY_MODES.includes(displayMode as (typeof DISPLAY_MODES)[number]))
    return { ok: false, error: "Invalid display mode." };
  if (displayMode === "rotation360" && images.length > 0 && images.length < 12)
    return { ok: false, error: `360° needs 12–16 images (has ${images.length}).` };
  if (images.length > 16) return { ok: false, error: "Max 16 images." };

  return {
    ok: true,
    data: { size, color, colorHex, stock: Math.round(stock), displayMode, images, imageLabels },
  };
}

type ParseResult =
  | { ok: true; data: ProductInput }
  | { ok: false; error: string };

export type ProductFields = Omit<ProductInput, "variants">;

// Validate product fields only (no variants) — used by the details PATCH so
// editing product info never touches variants.
export function parseProductFields(
  raw: unknown,
): { ok: true; data: ProductFields } | { ok: false; error: string } {
  if (typeof raw !== "object" || raw === null)
    return { ok: false, error: "Invalid payload." };
  const b = raw as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const description = typeof b.description === "string" ? b.description.trim() : "";
  const price = Number(b.price);
  const category = b.category as Category;

  if (name.length < 2) return { ok: false, error: "Name is required." };
  if (description.length < 5) return { ok: false, error: "Description is required." };
  if (!Number.isFinite(price) || price < 0)
    return { ok: false, error: "Price must be a non-negative number." };
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number]))
    return { ok: false, error: "Category must be men, women or kids." };

  const material =
    typeof b.material === "string" && b.material.trim() ? b.material.trim() : null;
  const care = typeof b.care === "string" && b.care.trim() ? b.care.trim() : null;
  const ratingRaw = Number(b.rating);
  const rating =
    Number.isFinite(ratingRaw) && ratingRaw > 0 ? Math.max(0, Math.min(5, ratingRaw)) : null;
  const reviewCountRaw = Number(b.reviewCount);
  const reviewCount =
    Number.isFinite(reviewCountRaw) && reviewCountRaw > 0 ? Math.round(reviewCountRaw) : 0;

  return {
    ok: true,
    data: {
      name,
      description,
      price: Math.round(price),
      category,
      featured: Boolean(b.featured),
      material,
      care,
      rating,
      reviewCount,
    },
  };
}

// Server-side validation. Never trusts the client; also strips any stray fields
// (e.g. an attempt to set role/ids we don't want).
export function parseProductInput(raw: unknown): ParseResult {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Invalid payload." };
  }
  const b = raw as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const description =
    typeof b.description === "string" ? b.description.trim() : "";
  const price = Number(b.price);
  const category = b.category as Category;
  const featured = Boolean(b.featured);
  const material =
    typeof b.material === "string" && b.material.trim() ? b.material.trim() : null;
  const care =
    typeof b.care === "string" && b.care.trim() ? b.care.trim() : null;
  const ratingRaw = Number(b.rating);
  const rating =
    Number.isFinite(ratingRaw) && ratingRaw > 0
      ? Math.max(0, Math.min(5, ratingRaw))
      : null;
  const reviewCountRaw = Number(b.reviewCount);
  const reviewCount =
    Number.isFinite(reviewCountRaw) && reviewCountRaw > 0
      ? Math.round(reviewCountRaw)
      : 0;

  if (name.length < 2) return { ok: false, error: "Name is required." };
  if (description.length < 5)
    return { ok: false, error: "Description is required." };
  if (!Number.isFinite(price) || price < 0)
    return { ok: false, error: "Price must be a non-negative number." };
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number]))
    return { ok: false, error: "Category must be men, women or kids." };

  if (!Array.isArray(b.variants) || b.variants.length === 0)
    return { ok: false, error: "Add at least one variant." };

  const variants: VariantInput[] = [];
  for (const [i, rawV] of b.variants.entries()) {
    if (typeof rawV !== "object" || rawV === null)
      return { ok: false, error: `Variant ${i + 1} is invalid.` };
    const v = rawV as Record<string, unknown>;

    const size = typeof v.size === "string" ? v.size.trim() : "";
    const color = typeof v.color === "string" ? v.color.trim() : "";
    const colorHex =
      typeof v.colorHex === "string" && v.colorHex.trim()
        ? v.colorHex.trim()
        : null;
    const stock = Number(v.stock);
    const displayMode = v.displayMode as DisplayMode;
    const images = Array.isArray(v.images)
      ? v.images.filter((x): x is string => typeof x === "string" && !!x)
      : [];
    const imageLabels = Array.isArray(v.imageLabels)
      ? v.imageLabels.map((x) => (typeof x === "string" ? x : ""))
      : [];

    if (!size) return { ok: false, error: `Variant ${i + 1}: size is required.` };
    if (!color)
      return { ok: false, error: `Variant ${i + 1}: colour is required.` };
    if (!Number.isFinite(stock) || stock < 0)
      return { ok: false, error: `Variant ${i + 1}: stock must be >= 0.` };
    if (!DISPLAY_MODES.includes(displayMode as (typeof DISPLAY_MODES)[number]))
      return { ok: false, error: `Variant ${i + 1}: invalid display mode.` };

    // Enforce the hybrid photo counts.
    if (displayMode === "rotation360" && images.length > 0 && images.length < 12)
      return {
        ok: false,
        error: `Variant ${i + 1}: 360° needs 12-16 images (has ${images.length}).`,
      };
    if (images.length > 16)
      return { ok: false, error: `Variant ${i + 1}: max 16 images.` };

    variants.push({
      id: typeof v.id === "string" ? v.id : undefined,
      size,
      color,
      colorHex,
      stock: Math.round(stock),
      displayMode,
      images,
      imageLabels,
    });
  }

  return {
    ok: true,
    data: {
      name,
      description,
      price: Math.round(price),
      category,
      featured,
      material,
      care,
      rating,
      reviewCount,
      variants,
    },
  };
}
