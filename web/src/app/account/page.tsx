import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ShieldCheck,
  Package,
  Heart,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/SignOutButton";
import { PremiumCard } from "@/components/store/PremiumCard";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  // Defence in depth — middleware already guards this route.
  if (!session?.user) redirect("/login?callbackUrl=/account");

  const name = session.user.name || "—";
  const email = session.user.email || "";
  const role = (session.user.role || "customer").toString();
  const isAdmin = role.toLowerCase() === "admin";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08080a] text-white px-6 py-16 sm:py-20">
      {/* Ambient vignette + faint top-centre light bloom behind the content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px circle at 50% -10%, rgba(255,255,255,0.06), transparent 60%), radial-gradient(1200px circle at 50% 120%, rgba(255,255,255,0.03), transparent 55%)",
        }}
      />

      <div className="relative max-w-container mx-auto">
        {/* Header */}
        <div className="anim-fade-up flex items-start justify-between gap-6">
          <div>
            <Link
              href="/"
              className="font-display text-3xl sm:text-4xl leading-none lux-brand inline-block"
            >
              NEXORA
            </Link>
            <h1 className="font-display text-xs tracking-label text-white/45 mt-3">
              My account
            </h1>
          </div>
          <SignOutButton />
        </div>

        {/* Branded headline block */}
        <div className="anim-fade-up anim-delay-1 mt-16 sm:mt-20 mb-12 sm:mb-14 text-center">
          <span className="inline-block font-display text-[10px] tracking-[0.32em] text-white/40 border border-white/12 rounded-full px-4 py-1.5">
            YOUR ACCOUNT
          </span>
          <h2 className="mt-7 flex flex-wrap items-baseline justify-center gap-x-3 sm:gap-x-4 leading-[1.05]">
            <span className="font-lux-serif italic text-5xl sm:text-6xl text-white/90">
              Your
            </span>
            <span className="font-display not-italic text-4xl sm:text-5xl tracking-tight text-white lux-glow-strong">
              NEXORA
            </span>
            <span className="font-lux-serif italic text-5xl sm:text-6xl text-white/90">
              World
            </span>
          </h2>
          <p className="text-sm sm:text-base text-white/50 mt-5 max-w-lg mx-auto">
            Manage your account, orders, wishlist, and preferences in one place.
          </p>
        </div>

        {/* Editorial asymmetric grid — Account left, Orders + Wishlist stacked right */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-[1.45fr_1fr] md:items-start max-w-4xl mx-auto">
          {/* Account & Security — anchor card */}
          <PremiumCard
            href="/account/security"
            className="is-dark anim-fade-up anim-delay-1 p-8 sm:p-10 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <span className="lux-icon-ring h-14 w-14">
                <ShieldCheck size={24} strokeWidth={1.5} />
              </span>
              <span className="font-display text-[10px] tracking-label text-white/40">
                Account &amp; security
              </span>
            </div>

            <div className="mt-9">
              <p className="font-display text-2xl sm:text-3xl leading-tight text-white lux-glow-dark">
                {name}
              </p>
              <p className="text-sm text-white/50 mt-2 break-all">{email}</p>
              <p className="text-[10px] text-white/35 mt-4 uppercase tracking-label">
                {isAdmin ? "Administrator" : "Customer"}
              </p>
            </div>

            {/* Hairline divider */}
            <div className="h-px bg-white/10 my-8" />

            <div className="mt-auto flex items-end justify-between gap-4">
              <div className="flex items-start gap-3">
                <LockKeyhole
                  size={18}
                  strokeWidth={1.5}
                  className="text-white/55 mt-0.5"
                />
                <div>
                  <p className="font-display text-xs tracking-label text-white/85">
                    Security
                  </p>
                  <p className="text-sm text-white/45 mt-1.5 max-w-xs">
                    Manage your password and account security.
                  </p>
                </div>
              </div>
              <ArrowRight
                size={20}
                strokeWidth={1.5}
                className="shrink-0 text-white/70 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 group-hover:text-white"
              />
            </div>
          </PremiumCard>

          {/* Right column — Orders on top, Wishlist directly beneath it */}
          <div className="flex flex-col gap-5 sm:gap-6">
          {/* Orders */}
          <PremiumCard
            href="/orders"
            className="is-dark anim-fade-up anim-delay-2 p-8 flex flex-col justify-between min-h-[11rem]"
          >
            <div className="flex items-center justify-between">
              <span className="lux-icon-ring h-12 w-12">
                <Package size={22} strokeWidth={1.5} />
              </span>
              <span className="font-display text-[10px] tracking-label text-white/40">
                Orders
              </span>
            </div>
            <div className="mt-6 flex items-end justify-between gap-4">
              <p className="text-sm text-white/55">View your order history</p>
              <ArrowRight
                size={20}
                strokeWidth={1.5}
                className="shrink-0 text-white/70 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 group-hover:text-white"
              />
            </div>
          </PremiumCard>

          {/* Wishlist */}
          <PremiumCard
            href="/account/wishlist"
            className="is-dark anim-fade-up anim-delay-3 p-8 flex flex-col justify-between min-h-[11rem]"
          >
            <div className="flex items-center justify-between">
              <span className="lux-icon-ring h-12 w-12">
                <Heart size={22} strokeWidth={1.5} />
              </span>
              <span className="font-display text-[10px] tracking-label text-white/40">
                Wishlist
              </span>
            </div>
            <div className="mt-6 flex items-end justify-between gap-4">
              <p className="text-sm text-white/55">View saved products</p>
              <ArrowRight
                size={20}
                strokeWidth={1.5}
                className="shrink-0 text-white/70 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 group-hover:text-white"
              />
            </div>
          </PremiumCard>
          </div>
        </div>
      </div>
    </main>
  );
}
