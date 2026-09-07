"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      router.refresh();
    } else {
      alert("Could not delete this product.");
    }
  }

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      className="text-xs text-sale underline disabled:opacity-50"
    >
      {busy ? "…" : "Delete"}
    </button>
  );
}
