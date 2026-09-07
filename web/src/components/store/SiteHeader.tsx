"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/store/CartProvider";

const NAV = [
  { href: "/shop?category=men", label: "Men" },
  { href: "/shop?category=women", label: "Women" },
  { href: "/shop?category=kids", label: "Kids" },
  { href: "/shop", label: "All" },
];

const ANNOUNCEMENTS = [
  "FREE DOORSTEP DELIVERY IN INDIA",
  "NEW DROP — RENDER 01 IS LIVE",
  "EASY 7-DAY RETURNS",
];

export function SiteHeader() {
  const { data: session } = useSession();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
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

      <header className="sticky top-0 z-40 bg-white border-b border-grey-200">
        <div className="max-w-container mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <button
            className="sm:hidden font-display text-lg"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            ☰
          </button>

          <Link href="/" className="font-display text-2xl leading-none">
            NEXORA
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            {NAV.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className="font-display text-xs tracking-button text-ink hover:text-grey-500 transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-xs font-display tracking-button">
            {session?.user?.role === "admin" && (
              <Link href="/admin" className="hover:text-grey-500 hidden sm:inline">
                Admin
              </Link>
            )}
            <Link
              href={session ? "/account" : "/login"}
              className="hover:text-grey-500"
            >
              {session ? "Account" : "Sign in"}
            </Link>
            <Link href="/cart" className="hover:text-grey-500 relative">
              Bag ({count})
            </Link>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="sm:hidden border-t border-grey-200 px-6 py-3 flex flex-col gap-3">
            {NAV.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                onClick={() => setOpen(false)}
                className="font-display text-sm tracking-button"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
