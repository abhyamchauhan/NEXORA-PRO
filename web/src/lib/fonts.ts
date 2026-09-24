// Curated Google Fonts the admin can choose for the site's headings (display)
// and body text. Loaded at runtime via a Google Fonts <link> in the root
// layout, so changing them needs no rebuild. `stack` is the CSS fallback.

export type FontOption = {
  name: string; // Google family name + the value used in CSS
  category: "sans" | "serif" | "display";
  stack: string; // fallback stack
  weights: number[]; // weights to request from Google
};

export const FONT_OPTIONS: FontOption[] = [
  // Sans — great for body or clean headings
  { name: "Instrument Sans", category: "sans", stack: "sans-serif", weights: [400, 500, 600, 700] },
  { name: "Inter", category: "sans", stack: "sans-serif", weights: [400, 500, 600, 700] },
  { name: "Manrope", category: "sans", stack: "sans-serif", weights: [400, 600, 700, 800] },
  { name: "Nunito", category: "sans", stack: "sans-serif", weights: [400, 600, 700, 800] },
  { name: "Work Sans", category: "sans", stack: "sans-serif", weights: [400, 500, 600, 700] },
  { name: "DM Sans", category: "sans", stack: "sans-serif", weights: [400, 500, 700] },
  { name: "Sora", category: "sans", stack: "sans-serif", weights: [400, 600, 700, 800] },
  { name: "Space Grotesk", category: "sans", stack: "sans-serif", weights: [400, 500, 700] },
  { name: "Rubik", category: "sans", stack: "sans-serif", weights: [400, 500, 700] },
  { name: "Outfit", category: "sans", stack: "sans-serif", weights: [400, 600, 700, 800] },
  // Display — punchy headings
  { name: "Archivo", category: "display", stack: "sans-serif", weights: [400, 600, 700, 800] },
  { name: "Anton", category: "display", stack: "sans-serif", weights: [400] },
  { name: "Bebas Neue", category: "display", stack: "sans-serif", weights: [400] },
  { name: "Oswald", category: "display", stack: "sans-serif", weights: [400, 500, 600, 700] },
  { name: "Syne", category: "display", stack: "sans-serif", weights: [400, 600, 700, 800] },
  { name: "Unbounded", category: "display", stack: "sans-serif", weights: [400, 600, 700, 800] },
  // Serif — editorial
  { name: "Fraunces", category: "serif", stack: "serif", weights: [400, 600, 700] },
  { name: "Playfair Display", category: "serif", stack: "serif", weights: [400, 600, 700, 800] },
  { name: "Lora", category: "serif", stack: "serif", weights: [400, 500, 600, 700] },
];

const byName = new Map(FONT_OPTIONS.map((f) => [f.name, f]));

export const isValidFont = (v: unknown): v is string =>
  typeof v === "string" && byName.has(v);

export const fontStack = (name: string): string => {
  const f = byName.get(name);
  return f ? `'${f.name}', ${f.stack}` : `'Instrument Sans', sans-serif`;
};

// Build the single Google Fonts stylesheet href for the two chosen families.
export function googleFontsHref(display: string, body: string): string {
  const families = Array.from(new Set([display, body]))
    .map((name) => byName.get(name))
    .filter((f): f is FontOption => !!f)
    .map((f) => `family=${f.name.replace(/ /g, "+")}:wght@${f.weights.join(";")}`);
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}
