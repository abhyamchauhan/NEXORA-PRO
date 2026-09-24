"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWishlist } from "./WishlistProvider";

// Heart toggle. Logged-in → saves to the DB wishlist; guests → sent to login.
// Hover gives a red glow + pop; toggling on plays a heart-pop animation. An
// optional tooltip label shows on hover.
export function WishlistButton({
  productId,
  className = "",
  size = 20,
  label,
}: {
  productId: string;
  className?: string;
  size?: number;
  label?: string; // optional hover tooltip (e.g. "Wishlist")
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
      onClick={onClick}
      aria-label={active ? "Remove from wishlist" : label || "Add to wishlist"}
      aria-pressed={active}
      title={label}
      className={`group relative grid place-items-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.15] active:scale-90 ${className}`}
    >
      <svg
        key={popKey}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={active ? "#E8291C" : "none"}
        stroke={active ? "#E8291C" : "currentColor"}
        strokeWidth="2.2"
        strokeLinejoin="round"
        aria-hidden
        className={`overflow-visible transition-[fill,stroke] duration-200 ${
          popKey ? "heart-pop" : ""
        }`}
      >
        <path d="M12 21s-7.5-4.6-10-9.2C.6 8.8 2.2 5.5 5.4 5.5c2 0 3.3 1.2 4.6 2.9 1.3-1.7 2.6-2.9 4.6-2.9 3.2 0 4.8 3.3 3.4 6.3C19.5 16.4 12 21 12 21z" />
      </svg>

      {label && (
        <span className="pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-ink text-white text-[10px] font-display tracking-button px-2 py-1 rounded-button opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
          {label}
        </span>
      )}
    </button>
  );
}
