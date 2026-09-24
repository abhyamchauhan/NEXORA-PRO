"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWishlist } from "./WishlistProvider";

// Clean, symmetric heart (Lucide "heart"). Kept as a single path so the outline
// and filled states occupy the exact same geometry — no shift on toggle.
const HEART_PATH =
  "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z";

// Wishlist toggle. Logged-in → saves to the DB wishlist; guests → sent to login.
// Default: outlined heart. Active: filled brand red, with a subtle pop when
// added. The button centres the heart perfectly at any size (grid place-items).
export function WishlistButton({
  productId,
  className = "",
  size = 20,
}: {
  productId: string;
  className?: string;
  size?: number;
}) {
  const { status } = useSession();
  const router = useRouter();
  const { has, toggle } = useWishlist();
  const active = has(productId);
  const [popKey, setPopKey] = useState(0);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/account/wishlist`);
      return;
    }
    if (!active) setPopKey((k) => k + 1); // pop only when adding
    toggle(productId);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={`group inline-grid place-items-center leading-none transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 active:scale-95 ${className}`}
    >
      <svg
        key={popKey}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={active ? "#E8291C" : "none"}
        stroke={active ? "#E8291C" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={`block transition-[fill,stroke] duration-200 ${popKey ? "heart-pop" : ""}`}
      >
        <path d={HEART_PATH} />
      </svg>
    </button>
  );
}
