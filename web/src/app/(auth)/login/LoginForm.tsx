"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { AnimatedForm } from "@/components/ui/modern-animated-sign-in";

const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    // Role-based redirect: admins → /admin, customers → callbackUrl or /account.
    const session = await getSession();
    router.push(
      session?.user?.role === "admin" ? "/admin" : callbackUrl || "/account",
    );
    router.refresh();
  }

  const formFields = {
    header: "Welcome back",
    subHeader: "Sign in to your NEXORA account",
    fields: [
      {
        label: "Email",
        required: true,
        type: "email" as const,
        placeholder: "Enter your email address",
        onChange: (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
      },
      {
        label: "Password",
        required: true,
        type: "password" as const,
        placeholder: "Enter your password",
        onChange: (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
      },
    ],
    submitButton: loading ? "Signing in…" : "Sign in",
    textVariantButton: "Forgot password?",
  };

  return (
    <section className="flex max-lg:justify-center min-h-[100dvh]">
      {/* Left — full-bleed looping brand video (falls back to a dark panel if
          the video file is missing, so it never renders blank/white). */}
      <span className="relative w-1/2 h-[100dvh] overflow-hidden max-lg:hidden bg-ink">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/login-hero.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* Drop your clip at web/public/login-hero.mp4 (webm optional). */}
          <source src="/login-hero.webm" type="video/webm" />
          <source src="/login-hero.mp4" type="video/mp4" />
        </video>

        {/* Gradient for legible overlay text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/40" />

        {/* Brand overlay */}
        <div className="relative h-full flex flex-col justify-end p-12 text-white">
          <p className="font-display text-xs tracking-label text-white/70 mb-2">
            NEXORA
          </p>
          <h2 className="font-display text-4xl leading-tight max-w-sm">
            Premium streetwear, engineered clean.
          </h2>
        </div>
      </span>

      {/* Right — the real login form */}
      <span className="w-1/2 h-[100dvh] flex flex-col justify-center items-center max-lg:w-full max-lg:px-[10%]">
        <AnimatedForm
          {...formFields}
          errorField={error}
          fieldPerRow={1}
          onSubmit={handleSubmit}
          goTo={(e) => {
            e.preventDefault();
            router.push("/forgot-password");
          }}
          googleLogin={googleEnabled ? "Continue with Google" : undefined}
          onGoogleLogin={() =>
            signIn("google", { callbackUrl: callbackUrl || "/account" })
          }
        />
        <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-300">
          New here?{" "}
          <a href="/register" className="text-ink underline">
            Create an account
          </a>
        </p>
      </span>
    </section>
  );
}
