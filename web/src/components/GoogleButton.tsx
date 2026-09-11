"use client";

import { signIn } from "next-auth/react";

// "Continue with Google" following Google's official button guidance: white
// surface, neutral border, the four-colour "G" mark, and a neutral system
// label (not the site's display font). Only renders when Google OAuth is
// configured (NEXT_PUBLIC_GOOGLE_ENABLED=true alongside the server-side
// GOOGLE_CLIENT_ID/SECRET), so it never appears broken when unset.
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
        aria-label="Continue with Google"
        className="w-full flex items-center justify-center gap-3 bg-white text-[#1f1f1f] border border-[#747775] rounded-button h-11 px-3 transition-colors hover:bg-[#f8f9fa] active:scale-[0.99]"
        style={{ fontFamily: "'Roboto', system-ui, -apple-system, sans-serif", fontWeight: 500, fontSize: "14px" }}
      >
        <GoogleG />
        <span>Continue with Google</span>
      </button>
    </>
  );
}

// The official four-colour Google "G" mark.
function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden focusable="false">
      <path
        fill="#4285F4"
        d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9086c1.7018-1.5668 2.6836-3.874 2.6836-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9086-2.2581c-.8059.54-1.8368.859-3.0478.859-2.344 0-4.3282-1.5831-5.036-3.7104H.9573v2.3318C2.4382 15.9832 5.4818 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2822-1.71V4.9582H.9573C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9573 4.0418L3.964 10.71z"
      />
      <path
        fill="#EA4335"
        d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.426 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.656 3.5795 9 3.5795z"
      />
    </svg>
  );
}
