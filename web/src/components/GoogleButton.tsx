"use client";

import { signIn } from "next-auth/react";

// Only renders when Google OAuth is configured (NEXT_PUBLIC_GOOGLE_ENABLED=true
// alongside the server-side GOOGLE_CLIENT_ID/SECRET). Keeps the button from
// appearing broken when Google isn't set up.
export function GoogleButton({ callbackUrl = "/account" }: { callbackUrl?: string }) {
  if (process.env.NEXT_PUBLIC_GOOGLE_ENABLED !== "true") return null;

  return (
    <>
      <div className="flex items-center gap-3 my-5">
        <span className="h-px flex-1 bg-grey-200" />
        <span className="text-xs text-grey-400 uppercase tracking-label">or</span>
        <span className="h-px flex-1 bg-grey-200" />
      </div>
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl })}
        className="w-full border border-grey-300 font-display text-sm tracking-button py-3 rounded-button hover:border-ink transition-colors"
      >
        Continue with Google
      </button>
    </>
  );
}
