"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { GoogleButton } from "@/components/GoogleButton";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not create your account.");
      setLoading(false);
      return;
    }

    // Auto sign-in after successful registration, then to the account page.
    await signIn("credentials", { email, password, redirect: false });
    router.push("/account");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-grey-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-white border border-grey-200 p-8">
        <Link href="/" className="font-display text-2xl leading-none block mb-1">
          NEXORA
        </Link>
        <h1 className="font-display text-sm tracking-label text-grey-500 mb-8">
          Create account
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Name" type="text" value={name} onChange={setName} autoComplete="name" />
          <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
          <Field
            label="Password (min 8 characters)"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            required
          />

          {error && <p className="text-sale text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-white font-display text-sm tracking-button py-3 rounded-button hover:bg-black transition-colors disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>

        <GoogleButton callbackUrl="/account" />

        <p className="text-sm text-grey-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-ink underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  required,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-display text-xs tracking-label text-grey-500">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-grey-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
      />
    </label>
  );
}
