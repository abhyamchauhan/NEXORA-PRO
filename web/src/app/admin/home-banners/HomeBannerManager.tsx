"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminImageInput } from "@/components/admin/AdminImageInput";

export type HomeBannerRow = {
  id: string;
  heading: string | null;
  subtext: string | null;
  image: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  position: number;
  visible: boolean;
};

export function HomeBannerManager({ initial }: { initial: HomeBannerRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<HomeBannerRow[]>(
    [...initial].sort((a, b) => a.position - b.position),
  );

  async function add() {
    const res = await fetch("/api/admin/home-banners", { method: "POST" });
    if (res.ok) {
      const { banner } = await res.json();
      setRows((r) => [...r, banner]);
      router.refresh();
    }
  }

  async function patch(id: string, body: Partial<HomeBannerRow>) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...body } : x)));
    await fetch(`/api/admin/home-banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {});
  }

  async function del(id: string) {
    if (!confirm("Delete this slide?")) return;
    await fetch(`/api/admin/home-banners/${id}`, { method: "DELETE" }).catch(() => {});
    setRows((r) => r.filter((x) => x.id !== id));
    router.refresh();
  }

  function move(id: string, dir: -1 | 1) {
    const idx = rows.findIndex((r) => r.id === id);
    const swap = rows[idx + dir];
    if (!swap) return;
    const a = rows[idx];
    patch(a.id, { position: swap.position });
    patch(swap.id, { position: a.position });
    setRows((r) => {
      const copy = [...r];
      [copy[idx], copy[idx + dir]] = [copy[idx + dir], copy[idx]];
      return copy;
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-2xl">Homepage banner slider</h1>
        <button
          onClick={add}
          className="font-display text-xs tracking-button bg-ink text-white px-4 py-2 rounded-button hover:bg-black"
        >
          + Add slide
        </button>
      </div>
      <p className="text-sm text-grey-500 mb-6">
        These slides auto-rotate in a swipeable carousel at the very top of the
        homepage. Reorder with the arrows; toggle Visible to hide one.
      </p>

      {rows.length === 0 && (
        <p className="text-sm text-grey-500">No slides yet — add one to show a carousel on the homepage.</p>
      )}

      <div className="space-y-4">
        {rows.map((b, i) => (
          <div key={b.id} className="bg-white border border-grey-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-xs tracking-label text-grey-500">Slide {i + 1}</span>
              <div className="flex items-center gap-3">
                <label className="text-xs flex items-center gap-1.5">
                  <input type="checkbox" checked={b.visible} onChange={(e) => patch(b.id, { visible: e.target.checked })} />
                  Visible
                </label>
                <button onClick={() => move(b.id, -1)} className="px-1 text-grey-400 hover:text-ink">↑</button>
                <button onClick={() => move(b.id, 1)} className="px-1 text-grey-400 hover:text-ink">↓</button>
                <button onClick={() => del(b.id)} className="text-xs text-sale underline">Delete</button>
              </div>
            </div>
            <div className="flex gap-4">
              <AdminImageInput
                value={b.image}
                onChange={(url) => patch(b.id, { image: url })}
                label="Slide image"
                aspect="aspect-video"
              />
              <div className="flex-1 space-y-2">
                <Field label="Heading" value={b.heading} onSave={(v) => patch(b.id, { heading: v })} />
                <Field label="Subtext" value={b.subtext} onSave={(v) => patch(b.id, { subtext: v })} />
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Button text" value={b.buttonText} onSave={(v) => patch(b.id, { buttonText: v })} />
                  <Field label="Button link" value={b.buttonLink} onSave={(v) => patch(b.id, { buttonLink: v })} placeholder="/shop" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onSave,
  placeholder,
}: {
  label: string;
  value: string | null;
  onSave: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] text-grey-500">{label}</span>
      <input
        defaultValue={value ?? ""}
        placeholder={placeholder}
        onBlur={(e) => e.target.value !== (value ?? "") && onSave(e.target.value)}
        className="mt-0.5 block w-full border border-grey-200 px-2 py-1.5 text-sm outline-none focus:border-ink"
      />
    </label>
  );
}
