"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/store/CartProvider";
import { useWishlist } from "@/components/store/WishlistProvider";
import { HeaderSearch } from "@/components/store/HeaderSearch";

const NAV = [
  { href: "/category/men", label: "Men" },
  { href: "/category/women", label: "Women" },
  { href: "/category/kids", label: "Kids" },
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
  const { ids: wishlistIds } = useWishlist();
  const wishCount = wishlistIds.size;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Bump a counter whenever the bag count increases → replays the cart icon
  // bounce + badge pop (clear feedback that "add to cart" registered).
  const [bump, setBump] = useState(0);
  const prevCount = useRef(count);
  useEffect(() => {
    if (count > prevCount.current) setBump((b) => b + 1);
    prevCount.current = count;
  }, [count]);

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

            {/* Right — icon cluster: search · account · wishlist · bag */}
            <div className="justify-self-end flex items-center gap-4 sm:gap-5">
              <HeaderSearch />

              {session?.user?.role === "admin" && (
                <RollLink href="/admin" label="Admin" className="hidden md:inline-block" />
              )}

              {/* Account / sign-in */}
              <Link
                href={session ? "/account" : "/login"}
                aria-label={session ? "Account" : "Sign in"}
                title={session ? "Account" : "Sign in"}
                className="hover:opacity-70 transition-opacity"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Link>

              {/* Wishlist — links to the logged-in customer's saved wishlist */}
              <Link
                href="/account/wishlist"
                aria-label="Wishlist"
                title="Wishlist"
                className="relative hover:opacity-70 transition-opacity"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 21s-7.5-4.6-10-9.2C.6 8.8 2.2 5.5 5.4 5.5c2 0 3.3 1.2 4.6 2.9 1.3-1.7 2.6-2.9 4.6-2.9 3.2 0 4.8 3.3 3.4 6.3C19.5 16.4 12 21 12 21z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
                {wishCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-pill bg-sale text-white text-[10px] font-display grid place-items-center">
                    {wishCount}
                  </span>
                )}
              </Link>

              {/* Cart / bag */}
              <Link
                href="/cart"
                aria-label={`Bag (${count})`}
                title="Bag"
                className="relative hover:opacity-70 transition-opacity"
              >
                <span key={`bag-${bump}`} className={bump ? "cart-bounce inline-block" : "inline-block"}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 8h12l-1 12H7L6 8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                {count > 0 && (
                  <span
                    key={`badge-${bump}`}
                    className={`absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-pill bg-ink text-white text-[10px] font-display grid place-items-center ${
                      bump ? "badge-pop" : ""
                    }`}
                  >
                    {count}
                  </span>
                )}
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
                href="/account/wishlist"
                onClick={() => setOpen(false)}
                className="font-display text-base tracking-button"
              >
                Wishlist{wishCount > 0 ? ` (${wishCount})` : ""}
              </Link>
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
