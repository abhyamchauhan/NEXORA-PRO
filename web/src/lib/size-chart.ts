import type { Category } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type SizeChartRow = { size: string; values: Record<string, number> };

export type SizeChartData = {
  fields: string[];
  rows: SizeChartRow[];
};

// Common presets the admin can start from (all in cm). Purely a convenience —
// fields remain fully editable.
export const FIELD_PRESETS: Record<string, string[]> = {
  Tops: ["Chest", "Length", "Shoulder"],
  Bottoms: ["Waist", "Hip", "Inseam"],
};

export const cmToInch = (cm: number) => Math.round((cm / 2.54) * 10) / 10;

export function normalizeChart(raw: unknown): SizeChartData {
  const r = (raw ?? {}) as { fields?: unknown; rows?: unknown };
  const fields = Array.isArray(r.fields)
    ? r.fields.filter((f): f is string => typeof f === "string" && !!f.trim())
    : [];
  const rows = Array.isArray(r.rows)
    ? r.rows
        .filter((x): x is SizeChartRow => !!x && typeof x === "object")
        .map((x) => ({
          size: typeof x.size === "string" ? x.size : "",
          values:
            x.values && typeof x.values === "object"
              ? Object.fromEntries(
                  Object.entries(x.values).map(([k, v]) => [k, Number(v) || 0]),
                )
              : {},
        }))
        .filter((x) => x.size)
    : [];
  return { fields, rows };
}

// A product's effective chart: its own, else its category default.
export async function getEffectiveSizeChart(product: {
  id: string;
  category: Category;
}): Promise<SizeChartData | null> {
  const own = await prisma.sizeChart.findUnique({
    where: { productId: product.id },
  });
  if (own) return normalizeChart(own);
  const def = await prisma.sizeChart.findUnique({
    where: { category: product.category },
  });
  return def ? normalizeChart(def) : null;
}
