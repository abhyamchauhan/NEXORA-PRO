"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SectionMiniPreview, typeLabel, type SectionRow } from "./SectionMiniPreview";

const ADD_TYPES = [
  { type: "hero", label: "Hero" },
  { type: "banner", label: "Banner" },
  { type: "featuredProducts", label: "Featured products" },
  { type: "categoryShowcase", label: "Category showcase" },
];

export function HomepageList({ initial }: { initial: SectionRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<SectionRow[]>(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function persistOrder(next: SectionRow[]) {
    setSaving(true);
    await fetch("/api/admin/homepage/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((r) => r.id) }),
    }).catch(() => {});
    setSaving(false);
    router.refresh();
  }

  function reorder(from: number, to: number) {
    if (to < 0 || to >= rows.length || from === to) return;
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setRows(next);
    persistOrder(next);
  }

  function onDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const from = rows.findIndex((r) => r.id === dragId);
    const to = rows.findIndex((r) => r.id === targetId);
    reorder(from, to);
    setDragId(null);
  }

  async function addSection(type: string) {
    const res = await fetch("/api/admin/homepage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    if (res.ok) {
      const { section } = await res.json();
      router.push(`/admin/homepage/${section.id}/edit`);
    }
  }

  async function toggleVisible(row: SectionRow) {
    setRows((rs) =>
      rs.map((r) => (r.id === row.id ? { ...r, visible: !r.visible } : r)),
    );
    await fetch(`/api/admin/homepage/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !row.visible }),
    }).catch(() => {});
    router.refresh();
  }

  async function remove(row: SectionRow) {
    if (!confirm(`Delete this ${typeLabel(row.type)} section?`)) return;
    setRows((rs) => rs.filter((r) => r.id !== row.id));
    await fetch(`/api/admin/homepage/${row.id}`, { method: "DELETE" }).catch(() => {});
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl">Homepage editor</h1>
          <p className="text-sm text-grey-500">
            Drag to reorder. Changes show on the live homepage immediately.
            {saving && <span className="ml-2 text-grey-400">Saving…</span>}
          </p>
        </div>
        <Link href="/" className="text-xs text-ink underline" target="_blank">
          View live homepage ↗
        </Link>
      </div>

      {/* Add section */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="font-display text-xs tracking-label text-grey-500 self-center">
          Add:
        </span>
        {ADD_TYPES.map((t) => (
          <button
            key={t.type}
            onClick={() => addSection(t.type)}
            className="font-display text-xs tracking-button border border-grey-300 px-3 py-1.5 rounded-button hover:border-ink"
          >
            + {t.label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="border border-grey-200 p-10 text-center text-grey-500 text-sm">
          No sections yet. Add one above to start building the homepage.
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((row, i) => (
            <li
              key={row.id}
              draggable
              onDragStart={() => setDragId(row.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(row.id)}
              className={`bg-white border p-3 flex items-center gap-4 ${
                dragId === row.id ? "border-ink opacity-60" : "border-grey-200"
              } ${!row.visible ? "opacity-60" : ""}`}
            >
              <span className="cursor-grab text-grey-400 select-none" title="Drag to reorder">
                ⠿
              </span>
              <SectionMiniPreview s={row} />
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm tracking-button">
                  {typeLabel(row.type)}
                  {!row.visible && (
                    <span className="ml-2 text-[10px] text-grey-400">HIDDEN</span>
                  )}
                </p>
                <p className="text-sm text-grey-500 truncate">
                  {row.heading || <span className="text-grey-400">No heading</span>}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <IconBtn onClick={() => reorder(i, i - 1)} disabled={i === 0} title="Move up">↑</IconBtn>
                <IconBtn onClick={() => reorder(i, i + 1)} disabled={i === rows.length - 1} title="Move down">↓</IconBtn>
              </div>
              <button
                onClick={() => toggleVisible(row)}
                className="text-xs font-display tracking-button text-grey-500 hover:text-ink"
              >
                {row.visible ? "Hide" : "Show"}
              </button>
              <Link
                href={`/admin/homepage/${row.id}/edit`}
                className="text-xs underline"
              >
                Edit
              </Link>
              <button
                onClick={() => remove(row)}
                className="text-xs text-sale underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function IconBtn({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-6 h-6 border border-grey-300 rounded-button text-xs hover:border-ink disabled:opacity-30"
    >
      {children}
    </button>
  );
}
