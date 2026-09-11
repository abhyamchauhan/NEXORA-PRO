"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminImageInput } from "@/components/admin/AdminImageInput";

export type SubRow = {
  id: string;
  category: "men" | "women" | "kids";
  group: string;
  name: string;
  slug: string;
  image: string | null;
  position: number;
};

const CATS: SubRow["category"][] = ["men", "women", "kids"];
const CAT_LABEL = { men: "Men", women: "Women", kids: "Kids" } as const;

export function SubCategoryManager({ initial }: { initial: SubRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<SubRow[]>(initial);
  const [tab, setTab] = useState<SubRow["category"]>("men");

  // New-row form
  const [group, setGroup] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const forTab = rows.filter((r) => r.category === tab);
  const groups = [...new Set(forTab.map((r) => r.group))];

  async function add() {
    if (!group.trim() || !name.trim()) {
      setMsg("Group and name are required.");
      return;
    }
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/subcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: tab, group: group.trim(), name: name.trim(), image }),
    });
    setBusy(false);
    if (res.ok) {
      const { subCategory } = await res.json();
      setRows((r) => [...r, subCategory]);
      setName("");
      setImage(null);
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error || "Could not add.");
    }
  }

  async function patch(id: string, body: Partial<SubRow>) {
    const res = await fetch(`/api/admin/subcategories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const { subCategory } = await res.json();
      setRows((r) => r.map((x) => (x.id === id ? subCategory : x)));
    }
  }

  async function del(id: string) {
    if (!confirm("Delete this sub-category? Products keep existing but lose this tag.")) return;
    await fetch(`/api/admin/subcategories/${id}`, { method: "DELETE" }).catch(() => {});
    setRows((r) => r.filter((x) => x.id !== id));
    router.refresh();
  }

  function move(id: string, dir: -1 | 1) {
    const sameGroup = forTab
      .filter((r) => r.group === rows.find((x) => x.id === id)?.group)
      .sort((a, b) => a.position - b.position);
    const idx = sameGroup.findIndex((r) => r.id === id);
    const swap = sameGroup[idx + dir];
    if (!swap) return;
    const a = sameGroup[idx];
    patch(a.id, { position: swap.position });
    patch(swap.id, { position: a.position });
    setRows((r) =>
      r.map((x) =>
        x.id === a.id ? { ...x, position: swap.position } : x.id === swap.id ? { ...x, position: a.position } : x,
      ),
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Sub-categories</h1>
      </div>

      {/* Category tabs */}
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

      {/* Add form */}
      <div className="bg-grey-50 border border-grey-200 p-4 mb-8">
        <p className="font-display text-xs tracking-label text-grey-500 mb-3">
          Add to {CAT_LABEL[tab]}
        </p>
        <div className="flex flex-wrap gap-4 items-end">
          <label className="block">
            <span className="text-[11px] text-grey-500">Group</span>
            <input
              list="groups"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              placeholder="Topwear"
              className="mt-1 block border border-grey-300 px-3 py-2 text-sm w-40 outline-none focus:border-ink"
            />
            <datalist id="groups">
              {groups.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
          </label>
          <label className="block">
            <span className="text-[11px] text-grey-500">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Joggers"
              className="mt-1 block border border-grey-300 px-3 py-2 text-sm w-40 outline-none focus:border-ink"
            />
          </label>
          <AdminImageInput value={image} onChange={setImage} label="Tile image (optional)" />
          <button
            onClick={add}
            disabled={busy}
            className="font-display text-xs tracking-button bg-ink text-white px-5 py-2.5 rounded-button hover:bg-black disabled:opacity-50"
          >
            {busy ? "Adding…" : "Add"}
          </button>
        </div>
        {msg && <p className="text-xs text-sale mt-2">{msg}</p>}
        <p className="text-xs text-grey-400 mt-2">
          No image? The tile auto-uses the first product photo tagged to this sub-category.
        </p>
      </div>

      {/* Existing, grouped */}
      {groups.length === 0 && (
        <p className="text-sm text-grey-500">No sub-categories for {CAT_LABEL[tab]} yet.</p>
      )}
      {groups.map((g) => (
        <div key={g} className="mb-8">
          <h2 className="font-display text-lg mb-3">{g}</h2>
          <div className="space-y-2">
            {forTab
              .filter((r) => r.group === g)
              .sort((a, b) => a.position - b.position)
              .map((r) => (
                <div key={r.id} className="flex items-center gap-3 bg-white border border-grey-200 p-2">
                  <span className="relative w-10 h-12 bg-grey-50 overflow-hidden shrink-0">
                    {r.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-[10px] text-grey-400">auto</span>
                    )}
                  </span>
                  <input
                    defaultValue={r.name}
                    onBlur={(e) => e.target.value.trim() && e.target.value !== r.name && patch(r.id, { name: e.target.value.trim() })}
                    className="flex-1 border border-transparent hover:border-grey-200 focus:border-ink px-2 py-1 text-sm outline-none"
                  />
                  <span className="text-xs text-grey-400 font-mono">/{r.slug}</span>
                  <button onClick={() => move(r.id, -1)} className="px-1 text-grey-400 hover:text-ink">↑</button>
                  <button onClick={() => move(r.id, 1)} className="px-1 text-grey-400 hover:text-ink">↓</button>
                  <button onClick={() => del(r.id)} className="text-xs text-sale underline px-1">Delete</button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
