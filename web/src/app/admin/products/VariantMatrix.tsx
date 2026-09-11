"use client";

import { useEffect, useState } from "react";
import { ImageUploader } from "./ImageUploader";

export type VariantRow = {
  id?: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  displayMode: "static" | "rotation360";
  images: string[];
  imageLabels: string[];
  _busy?: boolean;
  _dirty?: boolean;
  _msg?: string;
};

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL", "OS"];

export function VariantMatrix({
  productId,
  initial,
  onLocalChange,
}: {
  productId?: string;
  initial: VariantRow[];
  onLocalChange?: (rows: VariantRow[]) => void;
}) {
  const live = !!productId; // edit mode → per-row save/delete via API
  const [rows, setRows] = useState<VariantRow[]>(initial);
  const [sizes, setSizes] = useState<string[]>([]);
  const [customSize, setCustomSize] = useState("");
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([]);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("");

  useEffect(() => {
    if (!live) onLocalChange?.(rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  function toggleSize(s: string) {
    setSizes((x) => (x.includes(s) ? x.filter((v) => v !== s) : [...x, s]));
  }
  function addColor() {
    const n = colorName.trim();
    if (!n || colors.some((c) => c.name.toLowerCase() === n.toLowerCase())) return;
    setColors((x) => [...x, { name: n, hex: colorHex.trim() }]);
    setColorName("");
    setColorHex("");
  }

  function generate() {
    const chosen = [...sizes];
    if (customSize.trim()) chosen.push(customSize.trim().toUpperCase());
    if (chosen.length === 0 || colors.length === 0) return;
    setRows((prev) => {
      const additions: VariantRow[] = [];
      for (const c of colors)
        for (const s of chosen) {
          const dup =
            prev.some((r) => r.size === s && r.color.toLowerCase() === c.name.toLowerCase()) ||
            additions.some((a) => a.size === s && a.color === c.name);
          if (dup) continue;
          additions.push({
            size: s,
            color: c.name,
            colorHex: c.hex,
            stock: 0,
            displayMode: "static",
            images: [],
            imageLabels: [],
            _dirty: true,
          });
        }
      return [...prev, ...additions];
    });
    setCustomSize("");
  }

  function patchRow(i: number, patch: Partial<VariantRow>) {
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, ...patch, _dirty: true, _msg: undefined } : r)),
    );
  }

  async function saveRow(i: number) {
    const r = rows[i];
    if (!r.size || !r.color) {
      patchRow(i, { _msg: "Size & colour required." });
      return;
    }
    setRows((prev) => prev.map((row, idx) => (idx === i ? { ...row, _busy: true, _msg: undefined } : row)));
    const payload = {
      size: r.size,
      color: r.color,
      colorHex: r.colorHex || null,
      stock: r.stock,
      displayMode: r.displayMode,
      images: r.images,
      imageLabels: r.imageLabels,
    };
    const res = r.id
      ? await fetch(`/api/admin/variants/${r.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch(`/api/admin/products/${productId}/variants`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    const d = await res.json().catch(() => ({}));
    setRows((prev) =>
      prev.map((row, idx) =>
        idx === i
          ? res.ok
            ? { ...row, id: row.id ?? d.variant?.id, _busy: false, _dirty: false, _msg: "Saved ✓" }
            : { ...row, _busy: false, _msg: d.error || "Could not save." }
          : row,
      ),
    );
  }

  async function deleteRow(i: number) {
    const r = rows[i];
    if (r.id) {
      if (!confirm(`Delete variant ${r.color} / ${r.size}?`)) return;
      await fetch(`/api/admin/variants/${r.id}`, { method: "DELETE" }).catch(() => {});
    }
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      {/* Pick sizes & colours */}
      <div className="bg-grey-50 border border-grey-200 p-4 space-y-4">
        <div>
          <p className="font-display text-xs tracking-label text-grey-500 mb-2">Available sizes</p>
          <div className="flex flex-wrap gap-2 items-center">
            {SIZE_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSize(s)}
                className={`min-w-11 px-3 py-1.5 border text-sm font-display tracking-button ${
                  sizes.includes(s) ? "border-ink bg-ink text-white" : "border-grey-300 hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
            <input
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              placeholder="Custom"
              className="border border-grey-300 px-2 py-1.5 text-sm w-24 outline-none focus:border-ink"
            />
          </div>
        </div>

        <div>
          <p className="font-display text-xs tracking-label text-grey-500 mb-2">Available colours</p>
          <div className="flex flex-wrap gap-2 items-center">
            {colors.map((c) => (
              <span key={c.name} className="inline-flex items-center gap-1.5 border border-grey-300 px-2 py-1 text-sm">
                <span className="w-3 h-3 rounded-pill border border-grey-300" style={{ background: c.hex || "#c4c4c4" }} />
                {c.name}
                <button type="button" onClick={() => setColors((x) => x.filter((v) => v.name !== c.name))} className="text-sale">×</button>
              </span>
            ))}
            <input
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
              placeholder="Colour name"
              className="border border-grey-300 px-2 py-1.5 text-sm w-32 outline-none focus:border-ink"
            />
            <input
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              placeholder="#hex"
              className="border border-grey-300 px-2 py-1.5 text-sm w-24 outline-none focus:border-ink"
            />
            <button type="button" onClick={addColor} className="text-xs underline">Add colour</button>
          </div>
        </div>

        <button
          type="button"
          onClick={generate}
          disabled={sizes.length + (customSize ? 1 : 0) === 0 || colors.length === 0}
          className="font-display text-xs tracking-button bg-ink text-white px-5 py-2.5 rounded-button hover:bg-black disabled:opacity-40"
        >
          Generate {(sizes.length + (customSize ? 1 : 0)) * colors.length || ""} combinations
        </button>
      </div>

      {/* Grid of variant rows */}
      <div className="mt-4 space-y-3">
        {rows.length === 0 && (
          <p className="text-sm text-grey-500">
            No variants yet. Pick sizes + colours above and generate the grid.
          </p>
        )}
        {rows.map((r, i) => (
          <div key={r.id ?? `${r.size}-${r.color}-${i}`} className="bg-white border border-grey-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-pill border border-grey-300" style={{ background: r.colorHex || "#c4c4c4" }} />
                <span className="font-display text-sm tracking-button">
                  {r.color} · {r.size}
                </span>
                {r._dirty && live && <span className="text-[10px] text-grey-400">unsaved</span>}
              </div>
              <button type="button" onClick={() => deleteRow(i)} className="text-xs text-sale underline">
                Delete
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <L label="Colour">
                <input value={r.color} onChange={(e) => patchRow(i, { color: e.target.value })} className="vin" />
              </L>
              <L label="Hex">
                <input value={r.colorHex} onChange={(e) => patchRow(i, { colorHex: e.target.value })} placeholder="#131313" className="vin" />
              </L>
              <L label="Size">
                <input value={r.size} onChange={(e) => patchRow(i, { size: e.target.value })} className="vin" />
              </L>
              <L label="Stock">
                <input type="number" min={0} value={r.stock} onChange={(e) => patchRow(i, { stock: Number(e.target.value) })} className="vin" />
              </L>
            </div>

            <div className="mt-3">
              <span className="font-display text-xs tracking-label text-grey-500">Photo mode</span>
              <div className="flex gap-2 mt-1">
                <ModeBtn active={r.displayMode === "static"} onClick={() => patchRow(i, { displayMode: "static" })} title="Static" sub="4–6 · default" />
                <ModeBtn active={r.displayMode === "rotation360"} onClick={() => patchRow(i, { displayMode: "rotation360" })} title="360°" sub="12–16 · premium" />
              </div>
            </div>

            <div className="mt-3">
              <ImageUploader
                mode={r.displayMode}
                images={r.images}
                labels={r.imageLabels}
                onChange={(images, imageLabels) => patchRow(i, { images, imageLabels })}
              />
            </div>

            {live && (
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => saveRow(i)}
                  disabled={r._busy}
                  className="font-display text-xs tracking-button bg-ink text-white px-4 py-2 rounded-button hover:bg-black disabled:opacity-50"
                >
                  {r._busy ? "Saving…" : r.id ? "Save changes" : "Save variant"}
                </button>
                {r._msg && (
                  <span className={`text-xs ${r._msg.includes("✓") ? "text-rating" : "text-sale"}`}>{r._msg}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        :global(.vin) {
          width: 100%;
          border: 1px solid #dddddd;
          background: #fff;
          padding: 0.5rem 0.6rem;
          font-size: 0.85rem;
          outline: none;
          margin-top: 0.25rem;
        }
        :global(.vin:focus) {
          border-color: #1c1c1c;
        }
      `}</style>
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-display text-[11px] tracking-label text-grey-500">{label}</span>
      {children}
    </label>
  );
}

function ModeBtn({ active, onClick, title, sub }: { active: boolean; onClick: () => void; title: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 text-left border px-3 py-2 rounded-button ${active ? "border-ink bg-grey-50" : "border-grey-200 hover:border-grey-400"}`}
    >
      <span className="block font-display text-xs tracking-button">{title}</span>
      <span className="block text-[11px] text-grey-500">{sub}</span>
    </button>
  );
}
