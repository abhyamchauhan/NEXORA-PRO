"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Countdown } from "./Countdown";
import type { PromoView } from "@/lib/promo";

// Slim promo bar with a flip countdown. Dismissible for the session; refreshes
// server state when the timer expires so the bar disappears.
export function PromoBar({ promo }: { promo: PromoView }) {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <div className="bg-sale text-white">
      <div className="max-w-container mx-auto px-6 py-2 flex items-center justify-center gap-4 flex-wrap">
        <span className="font-display text-xs sm:text-sm tracking-button uppercase">
          {promo.label}
        </span>
        <Countdown endsAt={promo.endsAt} size="sm" onExpire={() => router.refresh()} />
        {promo.buttonText && (
          <Link
            href={promo.buttonLink || "/shop"}
            className="font-display text-xs tracking-button underline underline-offset-2 hover:no-underline"
          >
            {promo.buttonText}
          </Link>
        )}
        <button
          aria-label="Dismiss"
          onClick={() => setHidden(true)}
          className="absolute right-4 sm:static sm:ml-2 opacity-80 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
