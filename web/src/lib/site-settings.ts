import { prisma } from "./prisma";

export type ThemeSettings = {
  bgColor: string;
  textColor: string;
  accentColor: string;
  fontScale: "small" | "medium" | "large";
};

export const DEFAULT_THEME: ThemeSettings = {
  bgColor: "#ffffff",
  textColor: "#1c1c1c",
  accentColor: "#1c1c1c",
  fontScale: "medium",
};

// Root-font multipliers for the base font-scale presets. The whole rem-based
// type system scales from the <html> font-size, so one number retunes all copy.
export const FONT_SCALES: Record<ThemeSettings["fontScale"], number> = {
  small: 0.92,
  medium: 1,
  large: 1.1,
};

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const isHex = (v: unknown): v is string =>
  typeof v === "string" && HEX_RE.test(v.trim());
const isScale = (v: unknown): v is ThemeSettings["fontScale"] =>
  v === "small" || v === "medium" || v === "large";

// Coerce arbitrary input (DB row or request body) to a valid, safe theme.
export function normaliseTheme(raw: Record<string, unknown> | null | undefined): ThemeSettings {
  const r = raw ?? {};
  return {
    bgColor: isHex(r.bgColor) ? r.bgColor.trim() : DEFAULT_THEME.bgColor,
    textColor: isHex(r.textColor) ? r.textColor.trim() : DEFAULT_THEME.textColor,
    accentColor: isHex(r.accentColor) ? r.accentColor.trim() : DEFAULT_THEME.accentColor,
    fontScale: isScale(r.fontScale) ? r.fontScale : DEFAULT_THEME.fontScale,
  };
}

// Read the singleton theme. Never throws — falls back to defaults so the site
// (and the build, which has no DB) always renders.
export async function getSiteTheme(): Promise<ThemeSettings> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { id: "singleton" } });
    return normaliseTheme(row);
  } catch {
    return DEFAULT_THEME;
  }
}

// The :root override string injected into the document head.
export function themeCssVars(t: ThemeSettings): string {
  return [
    `--surface-page:${t.bgColor}`,
    `--text-body:${t.textColor}`,
    `--accent:${t.accentColor}`,
    `--font-scale:${FONT_SCALES[t.fontScale]}`,
  ].join(";");
}
