"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/store/CartProvider";
import { WishlistProvider } from "@/components/store/WishlistProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WishlistProvider>
        <CartProvider>{children}</CartProvider>
      </WishlistProvider>
    </SessionProvider>
  );
}
