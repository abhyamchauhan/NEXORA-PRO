"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CouponRowActions({
  id,
  code,
  active,
}: {
  id: string;
  code: string;
  active: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    }).catch(() => {});
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm(`Delete coupon ${code}?`)) return;
    setBusy(true);
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" }).catch(() => {});
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 justify-end whitespace-nowrap">
      <Link href={`/admin/coupons/${id}/edit`} className="text-xs underline">
        Edit
      </Link>
      <button onClick={toggle} disabled={busy} className="text-xs underline text-grey-600">
        {active ? "Deactivate" : "Activate"}
      </button>
      <button onClick={remove} disabled={busy} className="text-xs underline text-sale">
        Delete
      </button>
    </div>
  );
}
