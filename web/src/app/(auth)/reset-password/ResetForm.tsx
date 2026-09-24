"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords don't match.");
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      setTimeout(() => router.push("/login"), 1800);
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Could not reset your password.");
    }
  }

  return (
    <main className="min-h-screen bg-grey-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-white border border-grey-200 p-8">
        <Link href="/" className="font-display text-2xl leading-none block mb-1">
          NEXORA
        </Link>
        <h1 className="font-display text-sm tracking-label text-grey-500 mb-8">
          Choose a new password
        </h1>

        {!token ? (
          <p className="text-sm text-sale">
            This reset link is missing its token. Request a new one from{" "}
            <Link href="/forgot-password" className="underline">forgot password</Link>.
          </p>
        ) : done ? (
          <p className="text-sm text-rating">
            Password updated ✓ Redirecting you to sign in…
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="font-display text-xs tracking-label text-grey-500">New password</span>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-grey-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </label>
            <label className="block">
              <span className="font-display text-xs tracking-label text-grey-500">Confirm password</span>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 w-full border border-grey-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </label>
            {error && <p className="text-sale text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-white font-display text-sm tracking-button py-3 rounded-button hover:bg-black transition-colors disabled:opacity-60"
            >
              {loading ? "Saving…" : "Set new password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
