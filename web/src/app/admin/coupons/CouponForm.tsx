"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type CouponInitial = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number | null;
  expiresAt: string | null; // yyyy-mm-dd
  usageLimit: number | null;
  active: boolean;
};

export function CouponForm({ initial }: { initial?: CouponInitial }) {
  const router = useRouter();
  const editing = !!initial;

  const [code, setCode] = useState(initial?.code ?? "");
  const [type, setType] = useState<"percentage" | "fixed">(initial?.type ?? "percentage");
  const [value, setValue] = useState(initial ? String(initial.value) : "");
  const [minOrder, setMinOrder] = useState(initial?.minOrder != null ? String(initial.minOrder) : "");
  const [expiresAt, setExpiresAt] = useState(initial?.expiresAt ?? "");
  const [usageLimit, setUsageLimit] = useState(initial?.usageLimit != null ? String(initial.usageLimit) : "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const payload = { code, type, value, minOrder, expiresAt, usageLimit, active };
    const res = await fetch(
      editing ? `/api/admin/coupons/${initial!.id}` : "/api/admin/coupons",
      {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    setBusy(false);
    const d = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg({ ok: false, text: d.error || "Could not save." });
      return;
    }
    if (editing) {
      router.push("/admin/coupons");
      router.refresh();
    } else {
      setMsg({ ok: true, text: `Coupon ${d.coupon.code} created.` });
      setCode("");
      setValue("");
      setMinOrder("");
      setExpiresAt("");
      setUsageLimit("");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-grey-200 p-6 space-y-4">
      <h2 className="font-display text-sm tracking-label text-grey-500">
        {editing ? "Edit coupon" : "Create a coupon"}
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <L label="Code">
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="in" placeholder="WELCOME10" required />
        </L>
        <L label="Discount type">
          <select value={type} onChange={(e) => setType(e.target.value as "percentage" | "fixed")} className="in">
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed (₹)</option>
          </select>
        </L>
        <L label={type === "percentage" ? "Value (%)" : "Value (₹)"}>
          <input type="number" min={1} value={value} onChange={(e) => setValue(e.target.value)} className="in" required />
        </L>
        <L label="Min order (₹, optional)">
          <input type="number" min={0} value={minOrder} onChange={(e) => setMinOrder(e.target.value)} className="in" />
        </L>
        <L label="Expiry date (optional)">
          <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="in" />
        </L>
        <L label="Usage limit (optional)">
          <input type="number" min={1} value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} className="in" placeholder="e.g. 100" />
        </L>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Active
      </label>

      {msg && (
        <p className={`text-sm ${msg.ok ? "text-rating" : "text-sale"}`}>{msg.text}</p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="font-display text-sm tracking-button bg-ink text-white px-6 py-3 rounded-button hover:bg-black disabled:opacity-60"
      >
        {busy ? "Saving…" : editing ? "Save changes" : "Create coupon"}
      </button>

      <style jsx>{`
        :global(.in) {
          width: 100%;
          border: 1px solid #dddddd;
          background: #fff;
          padding: 0.55rem 0.65rem;
          font-size: 0.9rem;
          outline: none;
          margin-top: 0.25rem;
        }
        :global(.in:focus) {
          border-color: #1c1c1c;
        }
      `}</style>
    </form>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-display text-xs tracking-label text-grey-500">{label}</span>
      {children}
    </label>
  );
}
