"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";

type WishlistCtx = {
  ids: Set<string>;
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  ready: boolean;
};

const Ctx = createContext<WishlistCtx | null>(null);

// Loads the logged-in customer's wishlist ids once and toggles optimistically.
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      setIds(new Set());
      setReady(status === "unauthenticated");
      return;
    }
    fetch("/api/wishlist")
      .then((r) => (r.ok ? r.json() : { productIds: [] }))
      .then((d) => setIds(new Set(d.productIds ?? [])))
      .catch(() => {})
      .finally(() => setReady(true));
  }, [status]);

  const has = useCallback((id: string) => ids.has(id), [ids]);

  const toggle = useCallback(
    (id: string) => {
      setIds((prev) => {
        const next = new Set(prev);
        const adding = !next.has(id);
        if (adding) next.add(id);
        else next.delete(id);
        fetch("/api/wishlist", {
          method: adding ? "POST" : "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }),
        }).catch(() => {});
        return next;
      });
    },
    [],
  );

  return (
    <Ctx.Provider value={{ ids, has, toggle, ready }}>{children}</Ctx.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
