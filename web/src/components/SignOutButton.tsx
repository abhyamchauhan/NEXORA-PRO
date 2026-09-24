"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="group relative inline-flex items-center gap-2 overflow-hidden border border-grey-300 px-5 py-2.5 rounded-button font-display text-xs tracking-button text-ink transition-[border-color,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-ink hover:text-white"
    >
      {/* Ink fill that wipes in on hover — smooth, no bounce. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-0 origin-left scale-x-0 bg-ink transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />
      <span className="relative z-10">Sign out</span>
      <span className="relative z-10 transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
        &rarr;
      </span>
    </button>
  );
}
