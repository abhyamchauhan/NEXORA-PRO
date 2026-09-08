"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWishlist } from "./WishlistProvider";

// Heart toggle. Logged-in → saves to the DB wishlist; guests → sent to login.
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

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/account/wishlist`);
      return;
    }
    toggle(productId);
  }

  return (
    <button
      onClick={onClick}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={`grid place-items-center transition-transform duration-300 hover:scale-110 active:scale-90 ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={active ? "#c5312d" : "none"}
        stroke={active ? "#c5312d" : "currentColor"}
        strokeWidth="2"
        aria-hidden
      >
        <path d="M12 21s-7.5-4.6-10-9.2C.6 8.8 2.2 5.5 5.4 5.5c2 0 3.3 1.2 4.6 2.9 1.3-1.7 2.6-2.9 4.6-2.9 3.2 0 4.8 3.3 3.4 6.3C19.5 16.4 12 21 12 21z" />
      </svg>
    </button>
  );
}
