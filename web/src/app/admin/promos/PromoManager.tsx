"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type PromoRow = {
  id: string;
  category: "men" | "women" | "kids" | null;
  label: string;
  endsAt: string; // ISO
  buttonText: string | null;
  buttonLink: string | null;
  visible: boolean;
};

function toLocal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

const SCOPE_LABEL = (c: PromoRow["category"]) =>
  c === null ? "Site-wide" : c[0].toUpperCase() + c.slice(1);

export function PromoManager({ initial }: { initial: PromoRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<PromoRow[]>(initial);

  // New promo form
  const [scope, setScope] = useState<"site" | "men" | "women" | "kids">("site");
  const [label, setLabel] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function add() {
    if (!label.trim() || !endsAt) {
      setMsg("Label and end time are required.");
      return;
    }
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/promos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: label.trim(),
        endsAt: new Date(endsAt).toISOString(),
        category: scope === "site" ? null : scope,
        buttonText: buttonText.trim() || null,
        buttonLink: buttonLink.trim() || null,
      }),
    });
    setBusy(false);
    if (res.ok) {
      const { promo } = await res.json();
      setRows((r) => [...r, promo]);
      setLabel("");
      setEndsAt("");
      setButtonText("");
      setButtonLink("");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error || "Could not add.");
    }
  }

  async function patch(id: string, body: Partial<PromoRow>) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...body } : x)));
    await fetch(`/api/admin/promos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {});
  }

  async function del(id: string) {
    if (!confirm("Delete this promo countdown?")) return;
    await fetch(`/api/admin/promos/${id}`, { method: "DELETE" }).catch(() => {});
    setRows((r) => r.filter((x) => x.id !== id));
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-display text-2xl mb-1">Promo countdowns</h1>
      <p className="text-sm text-grey-500 mb-6">
        Site-wide banners appear under the header; category ones on that category
        landing page. They hide automatically once the timer ends.
      </p>

      {/* Add */}
      <div className="bg-grey-50 border border-grey-200 p-4 mb-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[11px] text-grey-500">Scope</span>
            <select value={scope} onChange={(e) => setScope(e.target.value as typeof scope)} className="mt-1 block w-full border border-grey-300 px-3 py-2 text-sm outline-none focus:border-ink">
              <option value="site">Site-wide</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[11px] text-grey-500">Ends at</span>
            <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="mt-1 block w-full border border-grey-300 px-3 py-2 text-sm outline-none focus:border-ink" />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[11px] text-grey-500">Label</span>
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Winter Sale ends in" className="mt-1 block w-full border border-grey-300 px-3 py-2 text-sm outline-none focus:border-ink" />
          </label>
          <label className="block">
            <span className="text-[11px] text-grey-500">Button text (optional)</span>
            <input value={buttonText} onChange={(e) => setButtonText(e.target.value)} placeholder="Shop the sale" className="mt-1 block w-full border border-grey-300 px-3 py-2 text-sm outline-none focus:border-ink" />
          </label>
          <label className="block">
            <span className="text-[11px] text-grey-500">Button link (optional)</span>
            <input value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} placeholder="/shop" className="mt-1 block w-full border border-grey-300 px-3 py-2 text-sm outline-none focus:border-ink" />
          </label>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={add} disabled={busy} className="font-display text-xs tracking-button bg-ink text-white px-5 py-2.5 rounded-button hover:bg-black disabled:opacity-50">
            {busy ? "Adding…" : "Add promo"}
          </button>
          {msg && <span className="text-xs text-sale">{msg}</span>}
        </div>
      </div>

      {/* Existing */}
      {rows.length === 0 && <p className="text-sm text-grey-500">No promo countdowns yet.</p>}
      <div className="space-y-2">
        {rows.map((p) => {
          const ended = new Date(p.endsAt).getTime() <= Date.now();
          return (
            <div key={p.id} className="flex items-center gap-3 bg-white border border-grey-200 p-3">
              <span className="font-display text-[10px] tracking-button bg-grey-100 px-2 py-1">{SCOPE_LABEL(p.category)}</span>
              <span className="flex-1 text-sm">{p.label}</span>
              <input
                type="datetime-local"
                defaultValue={toLocal(p.endsAt)}
                onBlur={(e) => e.target.value && patch(p.id, { endsAt: new Date(e.target.value).toISOString() })}
                className="border border-grey-200 px-2 py-1 text-xs outline-none focus:border-ink"
              />
              {ended && <span className="text-[10px] text-grey-400">ended</span>}
              <label className="text-xs flex items-center gap-1.5">
                <input type="checkbox" checked={p.visible} onChange={(e) => patch(p.id, { visible: e.target.checked })} />
                Visible
              </label>
              <button onClick={() => del(p.id)} className="text-xs text-sale underline">Delete</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
