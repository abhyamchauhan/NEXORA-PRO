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
        <p className="text-sm text-white/50">
          Your account uses Google sign-in and has no password yet. Set one here to
          also sign in with email + password.
        </p>
      )}
      {already && (
        <label className="block">
          <span className="font-display text-xs tracking-label text-white/50">Current password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="mt-1.5 w-full border border-white/15 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/50"
          />
        </label>
      )}
      <label className="block">
        <span className="font-display text-xs tracking-label text-white/50">New password</span>
        <input
          type="password"
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className="mt-1.5 w-full border border-white/15 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/50"
        />
      </label>
      <label className="block">
        <span className="font-display text-xs tracking-label text-white/50">Confirm new password</span>
        <input
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mt-1.5 w-full border border-white/15 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/50"
        />
      </label>
      {msg && <p className={`text-sm ${msg.ok ? "text-rating" : "text-sale"}`}>{msg.text}</p>}
      <button
        type="submit"
        disabled={loading}
        className="group inline-flex items-center gap-2 bg-white text-[#0a0a0a] font-display text-sm tracking-button px-6 py-3 rounded-button transition-all duration-300 hover:shadow-[0_0_28px_-8px_rgba(255,255,255,0.5)] disabled:opacity-60"
      >
        <span>{loading ? "Saving…" : already ? "Change password" : "Set password"}</span>
        <span
          aria-hidden="true"
          className="transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
        >
          &rarr;
        </span>
      </button>
    </form>
  );
}
