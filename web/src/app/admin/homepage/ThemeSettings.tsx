"use client";

import { useState } from "react";
import type { ThemeSettings as Theme } from "@/lib/site-settings";

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const SCALES: { value: Theme["fontScale"]; label: string; note: string }[] = [
  { value: "small", label: "Small", note: "×0.92" },
  { value: "medium", label: "Medium", note: "default" },
  { value: "large", label: "Large", note: "×1.10" },
];

function ColorField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const safe = HEX_RE.test(value) ? value : "#000000";
  return (
    <div>
      <span className="font-display text-xs tracking-label text-grey-500">{label}</span>
      <div className="flex items-center gap-3 mt-1">
        <input
          type="color"
          value={safe.length === 4 ? "#000000" : safe}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 border border-grey-200 bg-white p-0.5 cursor-pointer"
          aria-label={`${label} colour wheel`}
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="w-32 border border-grey-200 px-2 py-2 text-sm font-mono outline-none focus:border-ink"
        />
        <span
          className="h-10 flex-1 max-w-[9rem] border border-grey-200"
          style={{ background: HEX_RE.test(value) ? value : "#fff" }}
          aria-hidden
        />
      </div>
      <p className="text-xs text-grey-400 mt-1">{hint}</p>
    </div>
  );
}

export function ThemeSettings({ initial }: { initial: Theme }) {
  const [t, setT] = useState<Theme>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const set = (patch: Partial<Theme>) => {
    setT((prev) => ({ ...prev, ...patch }));
    setMsg(null);
  };

  const invalid =
    !HEX_RE.test(t.bgColor) || !HEX_RE.test(t.textColor) || !HEX_RE.test(t.accentColor);

  async function save() {
    if (invalid) {
      setMsg("Enter valid hex colours (e.g. #1c1c1c).");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(t),
    });
    setSaving(false);
    setMsg(res.ok ? "Saved ✓ — refresh the store to see it." : "Could not save.");
  }

  function reset() {
    set({
      bgColor: "#ffffff",
      textColor: "#1c1c1c",
      accentColor: "#1c1c1c",
      fontScale: "medium",
    });
  }

  const scaleMul = t.fontScale === "small" ? 0.92 : t.fontScale === "large" ? 1.1 : 1;

  return (
    <section className="bg-white border border-grey-200 p-6 mb-8">
      <div className="flex items-start justify-between gap-4 mb-1">
        <h2 className="font-display text-xl">Theme settings</h2>
        <button type="button" onClick={reset} className="text-xs underline text-grey-500 hover:text-ink">
          Reset to defaults
        </button>
      </div>
      <p className="text-sm text-grey-500 mb-6">
        Site-wide colours &amp; type scale. Applied via CSS variables — changes
        take effect on the next page refresh, everywhere.
      </p>

      <div className="grid sm:grid-cols-3 gap-6">
        <ColorField
          label="Primary background"
          hint="Page background colour."
          value={t.bgColor}
          onChange={(v) => set({ bgColor: v })}
        />
        <ColorField
          label="Text colour"
          hint="Base body text."
          value={t.textColor}
          onChange={(v) => set({ textColor: v })}
        />
        <ColorField
          label="Accent colour"
          hint="Primary buttons & links."
          value={t.accentColor}
          onChange={(v) => set({ accentColor: v })}
        />
      </div>

      <div className="mt-6">
        <span className="font-display text-xs tracking-label text-grey-500">Base font size</span>
        <div className="flex gap-2 mt-2">
          {SCALES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => set({ fontScale: s.value })}
              className={`flex-1 border px-4 py-3 rounded-button text-left transition-colors ${
                t.fontScale === s.value ? "border-ink bg-grey-50" : "border-grey-200 hover:border-grey-400"
              }`}
            >
              <span className="block font-display text-sm tracking-button">{s.label}</span>
              <span className="block text-[11px] text-grey-500">{s.note}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live preview using the chosen values directly (independent of the site's
          current CSS variables). */}
      <div className="mt-6">
        <span className="font-display text-xs tracking-label text-grey-500">Preview</span>
        <div
          className="mt-2 border border-grey-200 p-6"
          style={{
            background: HEX_RE.test(t.bgColor) ? t.bgColor : "#fff",
            color: HEX_RE.test(t.textColor) ? t.textColor : "#1c1c1c",
            fontSize: `${scaleMul}rem`,
          }}
        >
          <p className="font-display uppercase tracking-button" style={{ fontSize: "1.6em" }}>
            NEXORA
          </p>
          <p style={{ opacity: 0.85, marginTop: 4 }}>
            Premium streetwear. Free doorstep delivery in India.
          </p>
          <button
            type="button"
            className="mt-4 font-display text-sm tracking-button text-white px-6 py-3 rounded-button"
            style={{ background: HEX_RE.test(t.accentColor) ? t.accentColor : "#1c1c1c" }}
          >
            Add to bag
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving || invalid}
          className="font-display text-sm tracking-button bg-ink text-white px-6 py-3 rounded-button hover:bg-black disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save theme"}
        </button>
        {msg && (
          <span className={`text-sm ${msg.includes("✓") ? "text-rating" : "text-sale"}`}>{msg}</span>
        )}
      </div>

      <p className="text-xs text-grey-400 mt-4">
        Note: the hero heading’s rise/settle animation is a fixed part of the
        design and is always on — there is no toggle for it.
      </p>
    </section>
  );
}
