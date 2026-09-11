"use client";

import { useState } from "react";

export function EmailTest({ configured }: { configured: boolean }) {
  const [to, setTo] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function send() {
    if (!to.trim()) return;
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/email-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    setMsg(
      d.sent
        ? { ok: true, text: `Sent to ${to}. Check the inbox.` }
        : { ok: false, text: d.reason || "Could not send." },
    );
  }

  return (
    <div className="bg-white border border-grey-200 p-5 mb-6">
      <p className="font-display text-sm tracking-label text-grey-500 mb-3">
        Send a test email
      </p>
      {!configured && (
        <p className="text-sm text-sale mb-3">
          RESEND_API_KEY is not set — add it to <code>web/.env</code> and restart
          to enable sending. (Resend's test domain only delivers to the email you
          signed up with.)
        </p>
      )}
      <div className="flex gap-2 max-w-md">
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 border border-grey-300 px-3 py-2 text-sm outline-none focus:border-ink"
        />
        <button
          onClick={send}
          disabled={busy || !configured}
          className="font-display text-xs tracking-button bg-ink text-white px-5 rounded-button hover:bg-black disabled:opacity-50"
        >
          {busy ? "Sending…" : "Send test"}
        </button>
      </div>
      {msg && (
        <p className={`text-sm mt-2 ${msg.ok ? "text-rating" : "text-sale"}`}>{msg.text}</p>
      )}
    </div>
  );
}
