"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/store/CartProvider";

const NAV = [
  { href: "/shop?category=men", label: "Men" },
  { href: "/shop?category=women", label: "Women" },
  { href: "/shop?category=kids", label: "Kids" },
];

const ANNOUNCEMENTS = [
  "FREE DOORSTEP DELIVERY IN INDIA",
  "NEW DROP — RENDER 01 IS LIVE",
  "EASY 7-DAY RETURNS",
];

function RollLink({
  href,
  label,
  onClick,
  className = "",
}: {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group/roll font-display text-sm tracking-button ${className}`}
    >
      <span className="roll">
        <span>{label}</span>
        <span aria-hidden>{label}</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const { data: session } = useSession();
  const { count } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  // Overlay the hero (transparent, light text) only at the top of the homepage.
  const overlay = isHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-40">
        {/* Announcement bar */}
        <div className="bg-black text-white text-[11px] tracking-label font-display overflow-hidden">
          <div className="max-w-container mx-auto px-6 h-8 flex items-center justify-center gap-8">
            {ANNOUNCEMENTS.map((a) => (
              <span key={a} className="whitespace-nowrap hidden sm:inline">
                {a}
              </span>
            ))}
            <span className="sm:hidden">{ANNOUNCEMENTS[0]}</span>
          </div>
        </div>

        <header
          className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            overlay
              ? "bg-gradient-to-b from-black/35 via-black/10 to-transparent border-b border-transparent text-white"
              : "bg-white/90 backdrop-blur-md border-b border-grey-200 shadow-[0_1px_20px_rgb(0_0_0/0.05)] text-ink"
          }`}
        >
          <div className="max-w-container mx-auto px-6 h-16 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* Left */}
            <div className="justify-self-start flex items-center">
              <button
                className="sm:hidden font-display text-xl leading-none"
                onClick={() => setOpen((o) => !o)}
                aria-label="Menu"
              >
                ☰
              </button>
              <nav className="hidden sm:flex items-center gap-7">
                {NAV.map((n) => (
                  <RollLink key={n.label} href={n.href} label={n.label} />
                ))}
              </nav>
            </div>

            {/* Center — brand, perfectly centered */}
            <Link
              href="/"
              className="justify-self-center font-display text-2xl sm:text-[1.7rem] leading-none tracking-[0.04em] font-bold"
            >
              NEXORA
            </Link>

            {/* Right */}
            <div className="justify-self-end flex items-center gap-5">
              <RollLink href="/shop" label="Shop all" className="hidden md:inline-block" />
              {session?.user?.role === "admin" && (
                <RollLink href="/admin" label="Admin" className="hidden sm:inline-block" />
              )}
              <RollLink
                href={session ? "/account" : "/login"}
                label={session ? "Account" : "Sign in"}
                className="hidden sm:inline-block"
              />
              <Link
                href="/cart"
                className="group/roll font-display text-sm tracking-button relative"
              >
                <span className="roll">
                  <span>Bag ({count})</span>
                  <span aria-hidden>Bag ({count})</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile nav */}
          {open && (
            <nav className="sm:hidden border-t border-grey-200 px-6 py-4 flex flex-col gap-4 bg-white text-ink">
              {[...NAV, { href: "/shop", label: "Shop all" }].map((n) => (
                <Link
                  key={n.label}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-base tracking-button active:scale-95 transition-transform"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                href={session ? "/account" : "/login"}
                onClick={() => setOpen(false)}
                className="font-display text-base tracking-button"
              >
                {session ? "Account" : "Sign in"}
              </Link>
            </nav>
          )}
        </header>
      </div>

      {/* Spacer so content clears the fixed bar — except the homepage, where the
          hero sits behind it for the overlay effect. */}
      {!isHome && <div aria-hidden className="h-24" />}
    </>
  );
}
