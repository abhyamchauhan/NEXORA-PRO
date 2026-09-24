"use client";

import { useState } from "react";
import { cmToInch, type SizeChartData } from "@/lib/size-chart";

export function SizeGuide({ chart }: { chart: SizeChartData | null }) {
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState<"cm" | "in">("cm");

  if (!chart || chart.fields.length === 0 || chart.rows.length === 0) return null;

  const fmt = (cm: number) => (unit === "cm" ? cm : cmToInch(cm));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-display text-xs tracking-button underline text-grey-600 hover:text-ink"
      >
        Size guide
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg max-h-[85vh] overflow-auto shadow-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-grey-200">
              <h3 className="font-display text-lg">Size guide</h3>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-xl leading-none">
                ✕
              </button>
            </div>

            <div className="px-5 py-4">
              {/* CM / INCH toggle */}
              <div className="inline-flex border border-grey-300 rounded-button overflow-hidden mb-4">
                {(["cm", "in"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`px-4 py-1.5 font-display text-xs tracking-button ${
                      unit === u ? "bg-ink text-white" : "bg-white text-ink"
                    }`}
                  >
                    {u === "cm" ? "CM" : "INCH"}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[360px]">
                  <thead>
                    <tr className="text-left border-b border-grey-200 text-grey-500">
                      <th className="px-3 py-2 font-display text-xs tracking-label font-normal">Size</th>
                      {chart.fields.map((f) => (
                        <th key={f} className="px-3 py-2 font-display text-xs tracking-label font-normal">
                          {f}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-grey-100">
                    {chart.rows.map((r) => (
                      <tr key={r.size}>
                        <td className="px-3 py-2 font-display">{r.size}</td>
                        {chart.fields.map((f) => (
                          <td key={f} className="px-3 py-2 text-grey-700">
                            {r.values[f] != null ? fmt(r.values[f]) : "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-grey-400 mt-3">
                Measurements are approximate ({unit === "cm" ? "centimetres" : "inches"}).
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
