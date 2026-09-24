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
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-ink flex items-center justify-center lg:justify-end px-5 sm:px-8 lg:px-16 py-10">
      {/* Full-bleed looping brand video behind everything (dark fallback via
          bg-ink so it never renders blank if the file is missing). */}
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

      {/* Scrim that blends the scene left → right so the video reads as one
          piece with the card side (no hard split), and keeps text legible. */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/45 to-black/75" />
      <div className="absolute inset-0 bg-black/15" />

      {/* Brand copy over the video (desktop) */}
      <div className="absolute left-10 lg:left-16 top-1/2 -translate-y-1/2 max-w-md text-white hidden lg:block pointer-events-none">
        <p className="font-display text-xs tracking-label text-white/70 mb-3">
          NEXORA
        </p>
        <h2 className="font-display text-5xl leading-[1.05]">
          Premium streetwear, engineered clean.
        </h2>
        <p className="mt-5 text-white/75 text-sm max-w-sm">
          Sign in to track orders, save your wishlist, and check out faster.
        </p>
      </div>

      {/* Premium frosted card — floats over the video, blending the two sides */}
      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-white/40 bg-white/90 backdrop-blur-xl shadow-[0_24px_70px_-20px_rgba(0,0,0,0.6)] p-7 sm:p-9 [&>section]:w-full">
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
          <p className="mt-6 text-center text-sm text-neutral-600">
            New here?{" "}
            <a href="/register" className="text-ink underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
