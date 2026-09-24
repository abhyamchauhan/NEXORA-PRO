"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import {
  Ripple,
  TechOrbitDisplay,
  AnimatedForm,
} from "@/components/ui/modern-animated-sign-in";

const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true";

// Orbiting brand/tech marks for the animated left panel.
type OrbitIcon = {
  component: () => ReactNode;
  className: string;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  reverse?: boolean;
};

const orbitImg = (src: string, alt: string) => () => (
  <Image width={100} height={100} src={src} alt={alt} />
);

const iconsArray: OrbitIcon[] = [
  { component: orbitImg("https://cdn.21st.dev/assets/mirror/34/34826e5b3315daadf4fa15f723a3c1d5ba4a89277bfd94e22ac4d7d3d54338c5.svg", "HTML5"), className: "size-[30px] border-none bg-transparent", duration: 20, delay: 20, radius: 100, path: false, reverse: false },
  { component: orbitImg("https://cdn.21st.dev/assets/mirror/36/36b7d94b657d571d3f94042acbf6a4c86a5301a222f83f4b4583ad2acf6e297d.svg", "CSS3"), className: "size-[30px] border-none bg-transparent", duration: 20, delay: 10, radius: 100, path: false, reverse: false },
  { component: orbitImg("https://cdn.21st.dev/assets/mirror/c9/c9191199f4049920c2fc19035b8a6664f37f4689fcd9e8434e786097e78863f0.svg", "TypeScript"), className: "size-[50px] border-none bg-transparent", radius: 210, duration: 20, path: false, reverse: false },
  { component: orbitImg("https://cdn.21st.dev/assets/mirror/06/0656ff65fc8eeacda5c78d7f9ffe91ec1eb919db64f56e0b7dcd460af4bbd36c.svg", "JavaScript"), className: "size-[50px] border-none bg-transparent", radius: 210, duration: 20, delay: 20, path: false, reverse: false },
  { component: orbitImg("https://cdn.21st.dev/assets/mirror/f8/f8cec54589553807eb603bcaf4e056aa090196211698b056542e3cc62a2f3448.svg", "TailwindCSS"), className: "size-[30px] border-none bg-transparent", duration: 20, delay: 20, radius: 150, path: false, reverse: true },
  { component: orbitImg("https://cdn.21st.dev/assets/mirror/d9/d9435c4ede7133b376c0173a80226bb3856729366707cd96e9a66e39448d0288.svg", "Nextjs"), className: "size-[30px] border-none bg-transparent", duration: 20, delay: 10, radius: 150, path: false, reverse: true },
  { component: orbitImg("https://cdn.21st.dev/assets/mirror/58/5825b649c8c04dec13ecf01d0182401bd0ec71789d2fa06224866d882cd1515f.svg", "React"), className: "size-[50px] border-none bg-transparent", radius: 270, duration: 20, path: false, reverse: true },
  { component: orbitImg("https://cdn.21st.dev/assets/mirror/71/717a57ea97bf7e86de721dab3e68afac66332a10676d5c9abce4ae6a5a9c9983.svg", "Git"), className: "size-[50px] border-none bg-transparent", radius: 320, duration: 20, delay: 20, path: false, reverse: false },
];

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
      {/* Left — animated orbit panel */}
      <span className="relative flex flex-col justify-center w-1/2 max-lg:hidden">
        <Ripple mainCircleSize={100} />
        <TechOrbitDisplay iconsArray={iconsArray} text="NEXORA" />
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
