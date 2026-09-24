"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="group relative inline-flex items-center gap-2 overflow-hidden border border-white/20 bg-white/[0.02] px-5 py-2.5 rounded-button font-display text-xs tracking-button text-white/85 transition-[border-color,color,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/50 hover:text-white hover:bg-white/[0.05] hover:shadow-[0_0_28px_-8px_rgba(255,255,255,0.35)]"
    >
      <span className="relative z-10">Sign out</span>
      <LogOut
        size={15}
        strokeWidth={1.6}
        className="relative z-10 transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5"
      />
    </button>
  );
}
