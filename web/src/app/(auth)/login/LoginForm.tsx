"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { GoogleButton } from "@/components/GoogleButton";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    // Role-based redirect: admins → /admin, customers → callbackUrl or /account.
    const session = await getSession();
    if (session?.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push(callbackUrl || "/account");
    }
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-grey-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-white border border-grey-200 p-8">
        <Link
          href="/"
          className="font-display text-2xl leading-none block mb-1"
        >
          NEXORA
        </Link>
        <h1 className="font-display text-sm tracking-label text-grey-500 mb-8">
          Sign in
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            required
          />

          {error && <p className="text-sale text-sm">{error}</p>}

          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-grey-500 hover:text-ink underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-white font-display text-sm tracking-button py-3 rounded-button hover:bg-black transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <GoogleButton callbackUrl={callbackUrl || "/account"} />

        <p className="text-sm text-grey-500 mt-6">
          New here?{" "}
          <Link href="/register" className="text-ink underline">
            Create an account
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
