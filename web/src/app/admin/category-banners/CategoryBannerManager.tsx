"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminImageInput } from "@/components/admin/AdminImageInput";

export type BannerRow = {
  id: string;
  category: "men" | "women" | "kids";
  heading: string | null;
  subtext: string | null;
  image: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  position: number;
  visible: boolean;
};

const CATS: BannerRow["category"][] = ["men", "women", "kids"];
const CAT_LABEL = { men: "Men", women: "Women", kids: "Kids" } as const;

export function CategoryBannerManager({ initial }: { initial: BannerRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<BannerRow[]>(initial);
  const [tab, setTab] = useState<BannerRow["category"]>("men");
  const forTab = rows.filter((r) => r.category === tab).sort((a, b) => a.position - b.position);

  async function add() {
    const res = await fetch("/api/admin/category-banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: tab, heading: "New banner" }),
    });
    if (res.ok) {
      const { banner } = await res.json();
      setRows((r) => [...r, banner]);
      router.refresh();
    }
  }

  async function patch(id: string, body: Partial<BannerRow>) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...body } : x)));
    await fetch(`/api/admin/category-banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {});
  }

  async function del(id: string) {
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/admin/category-banners/${id}`, { method: "DELETE" }).catch(() => {});
    setRows((r) => r.filter((x) => x.id !== id));
    router.refresh();
  }

  function move(id: string, dir: -1 | 1) {
    const idx = forTab.findIndex((r) => r.id === id);
    const swap = forTab[idx + dir];
    if (!swap) return;
    const a = forTab[idx];
    patch(a.id, { position: swap.position });
    patch(swap.id, { position: a.position });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-2xl">Category banners</h1>
        <button
          onClick={add}
          className="font-display text-xs tracking-button bg-ink text-white px-4 py-2 rounded-button hover:bg-black"
        >
          + Add banner
        </button>
      </div>
      <p className="text-sm text-grey-500 mb-6">
        Shown in the sliding carousel at the top of each category landing page.
      </p>

      <div className="flex gap-2 mb-6">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setTab(c)}
            className={`font-display text-sm tracking-button px-4 py-2 border rounded-button ${
              tab === c ? "border-ink bg-ink text-white" : "border-grey-300 hover:border-ink"
            }`}
          >
            {CAT_LABEL[c]}
          </button>
        ))}
      </div>

      {forTab.length === 0 && (
        <p className="text-sm text-grey-500">No banners for {CAT_LABEL[tab]} yet — add one.</p>
      )}

      <div className="space-y-4">
        {forTab.map((b, i) => (
          <div key={b.id} className="bg-white border border-grey-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-xs tracking-label text-grey-500">
                Slide {i + 1}
              </span>
              <div className="flex items-center gap-3">
                <label className="text-xs flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={b.visible}
                    onChange={(e) => patch(b.id, { visible: e.target.checked })}
                  />
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
                label="Banner image"
                aspect="aspect-video"
              />
              <div className="flex-1 space-y-2">
                <Field label="Heading" value={b.heading} onSave={(v) => patch(b.id, { heading: v })} />
                <Field label="Subtext" value={b.subtext} onSave={(v) => patch(b.id, { subtext: v })} />
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Button text" value={b.buttonText} onSave={(v) => patch(b.id, { buttonText: v })} />
                  <Field label="Button link" value={b.buttonLink} onSave={(v) => patch(b.id, { buttonLink: v })} placeholder="/shop?category=men" />
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
