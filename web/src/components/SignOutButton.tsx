"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="font-display text-xs tracking-button border border-grey-300 px-4 py-2 rounded-button hover:border-ink transition-colors"
    >
      Sign out
    </button>
  );
}
