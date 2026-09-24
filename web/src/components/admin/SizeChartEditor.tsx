"use client";

import { useEffect, useState } from "react";
import { FIELD_PRESETS, type SizeChartRow } from "@/lib/size-chart";

// Self-contained size-chart editor. Loads and saves its own chart via the API
// (independent of the product form, so saving here never touches variants).
export function SizeChartEditor({
  productId,
  category,
  suggestedSizes = ["S", "M", "L", "XL", "XXL"],
}: {
  productId?: string;
  category?: string;
  suggestedSizes?: string[];
}) {
  const [fields, setFields] = useState<string[]>([]);
  const [rows, setRows] = useState<SizeChartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [newField, setNewField] = useState("");
  const [newSize, setNewSize] = useState("");

  const query = productId
    ? `productId=${productId}`
    : `category=${category}`;

  useEffect(() => {
    fetch(`/api/admin/size-chart?${query}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.chart) {
          setFields(d.chart.fields);
          setRows(d.chart.rows);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query]);

  function addField(name: string) {
    const f = name.trim();
    if (!f || fields.includes(f)) return;
    setFields((x) => [...x, f]);
    setNewField("");
  }
  function removeField(f: string) {
    setFields((x) => x.filter((v) => v !== f));
    setRows((rs) =>
      rs.map((r) => {
        const { [f]: _drop, ...rest } = r.values;
        void _drop;
        return { ...r, values: rest };
      }),
    );
  }
  function usePreset(name: string) {
    setFields(FIELD_PRESETS[name] ?? []);
  }
  function addRow(size: string) {
    const s = size.trim().toUpperCase();
    if (!s || rows.some((r) => r.size === s)) return;
    setRows((rs) => [...rs, { size: s, values: {} }]);
    setNewSize("");
  }
  function removeRow(size: string) {
    setRows((rs) => rs.filter((r) => r.size !== size));
  }
  function setVal(size: string, field: string, v: string) {
    const n = Number(v);
    setRows((rs) =>
      rs.map((r) =>
        r.size === size
          ? { ...r, values: { ...r.values, [field]: Number.isFinite(n) ? n : 0 } }
          : r,
      ),
    );
  }

  async function save() {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/size-chart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, category, fields, rows }),
    });
    setBusy(false);
    setMsg(res.ok ? "Saved." : "Could not save.");
  }

  if (loading)
    return <p className="text-sm text-grey-500">Loading size chart…</p>;

  return (
    <div className="space-y-4">
      {/* Fields */}
      <div>
        <p className="font-display text-xs tracking-label text-grey-500 mb-2">
          Measurement fields (stored in cm)
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          {fields.map((f) => (
            <span key={f} className="inline-flex items-center gap-1 border border-grey-300 px-2 py-1 text-xs">
              {f}
              <button type="button" onClick={() => removeField(f)} className="text-sale">×</button>
            </span>
          ))}
          <input
            value={newField}
            onChange={(e) => setNewField(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addField(newField))}
            placeholder="Add field…"
            className="border border-grey-300 px-2 py-1 text-xs outline-none focus:border-ink w-28"
          />
          <button type="button" onClick={() => addField(newField)} className="text-xs underline">
            Add
          </button>
        </div>
        <div className="flex gap-2 mt-2">
          {Object.keys(FIELD_PRESETS).map((p) => (
            <button key={p} type="button" onClick={() => usePreset(p)} className="text-[11px] text-grey-500 underline">
              Use {p} preset
            </button>
          ))}
        </div>
      </div>

      {/* Rows */}
      {fields.length > 0 && (
        <div className="overflow-x-auto border border-grey-200">
          <table className="w-full text-sm min-w-[420px]">
            <thead>
              <tr className="border-b border-grey-200 text-grey-500 text-left">
                <th className="px-3 py-2 font-display text-xs tracking-label font-normal">Size</th>
                {fields.map((f) => (
                  <th key={f} className="px-3 py-2 font-display text-xs tracking-label font-normal">
                    {f} (cm)
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-100">
              {rows.map((r) => (
                <tr key={r.size}>
                  <td className="px-3 py-2 font-display">{r.size}</td>
                  {fields.map((f) => (
                    <td key={f} className="px-3 py-2">
                      <input
                        type="number"
                        value={r.values[f] ?? ""}
                        onChange={(e) => setVal(r.size, f, e.target.value)}
                        className="w-20 border border-grey-300 px-2 py-1 text-sm outline-none focus:border-ink"
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right">
                    <button type="button" onClick={() => removeRow(r.size)} className="text-xs text-sale underline">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add size row */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-grey-500">Add size:</span>
        {suggestedSizes.map((s) => (
          <button key={s} type="button" onClick={() => addRow(s)} className="text-xs border border-grey-300 px-2 py-1 hover:border-ink">
            + {s}
          </button>
        ))}
        <input
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRow(newSize))}
          placeholder="Custom"
          className="border border-grey-300 px-2 py-1 text-xs outline-none focus:border-ink w-24"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="font-display text-sm tracking-button bg-ink text-white px-6 py-2.5 rounded-button hover:bg-black disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save size chart"}
        </button>
        {msg && <span className="text-sm text-grey-500">{msg}</span>}
      </div>
    </div>
  );
}
