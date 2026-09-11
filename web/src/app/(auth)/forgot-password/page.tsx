"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => {});
    setLoading(false);
    setSent(true);
  }

  return (
    <main className="min-h-screen bg-grey-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-white border border-grey-200 p-8">
        <Link href="/" className="font-display text-2xl leading-none block mb-1">
          NEXORA
        </Link>
        <h1 className="font-display text-sm tracking-label text-grey-500 mb-8">
          Reset password
        </h1>

        {sent ? (
          <div>
            <p className="text-sm">
              If an account exists for <strong>{email}</strong>, a reset link is on
              its way. The link expires in 1 hour.
            </p>
            <p className="text-sm text-grey-500 mt-4">
              Didn&apos;t get it? Check spam, or{" "}
              <button onClick={() => setSent(false)} className="text-ink underline">
                try another email
              </button>
              .
            </p>
            <Link href="/login" className="inline-block mt-6 text-sm text-ink underline">
              ← Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <p className="text-sm text-grey-500">
              Enter your email and we&apos;ll send you a link to set a new password.
            </p>
            <label className="block">
              <span className="font-display text-xs tracking-label text-grey-500">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border border-grey-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-white font-display text-sm tracking-button py-3 rounded-button hover:bg-black transition-colors disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
            <p className="text-sm text-grey-500">
              Remembered it?{" "}
              <Link href="/login" className="text-ink underline">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
