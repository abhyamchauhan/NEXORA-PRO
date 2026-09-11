"use client";

import { useState } from "react";

export function SecurityForm({ hasPassword }: { hasPassword: boolean }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [already, setAlready] = useState(hasPassword);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (next.length < 8) return setMsg({ ok: false, text: "New password must be at least 8 characters." });
    if (next !== confirm) return setMsg({ ok: false, text: "Passwords don't match." });
    setLoading(true);
    const res = await fetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    setLoading(false);
    const d = await res.json().catch(() => ({}));
    if (res.ok) {
      setMsg({ ok: true, text: already ? "Password updated ✓" : "Password set ✓ You can now sign in with email + password too." });
      setAlready(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } else {
      setMsg({ ok: false, text: d.error || "Could not update password." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-md">
      {!already && (
        <p className="text-sm text-grey-500">
          Your account uses Google sign-in and has no password yet. Set one here to
          also sign in with email + password.
        </p>
      )}
      {already && (
        <label className="block">
          <span className="font-display text-xs tracking-label text-grey-500">Current password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="mt-1 w-full border border-grey-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
        </label>
      )}
      <label className="block">
        <span className="font-display text-xs tracking-label text-grey-500">New password</span>
        <input
          type="password"
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className="mt-1 w-full border border-grey-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
        />
      </label>
      <label className="block">
        <span className="font-display text-xs tracking-label text-grey-500">Confirm new password</span>
        <input
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mt-1 w-full border border-grey-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
        />
      </label>
      {msg && <p className={`text-sm ${msg.ok ? "text-rating" : "text-sale"}`}>{msg.text}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-ink text-white font-display text-sm tracking-button px-6 py-3 rounded-button hover:bg-black transition-colors disabled:opacity-60"
      >
        {loading ? "Saving…" : already ? "Change password" : "Set password"}
      </button>
    </form>
  );
}
