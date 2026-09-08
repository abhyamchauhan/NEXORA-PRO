"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/homepage", label: "Homepage" },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <header className="bg-ink text-white">
      <div className="max-w-container mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="font-display text-lg leading-none">
            NEXORA<span className="text-concrete"> · Admin</span>
          </Link>
          <nav className="flex items-center gap-1">
            {LINKS.map((l) => {
              const active =
                l.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`font-display text-xs tracking-button px-3 py-2 rounded-button transition-colors ${
                    active
                      ? "bg-white text-ink"
                      : "text-grey-400 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs text-grey-400 hover:text-white">
            View store ↗
          </Link>
          <span className="hidden sm:inline text-xs text-grey-500">{email}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="font-display text-xs tracking-button border border-graphite px-3 py-1.5 rounded-button hover:border-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
