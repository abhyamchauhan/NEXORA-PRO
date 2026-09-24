"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import { emitToast } from "@/lib/toast";

export type CartLine = {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  color: string;
  size: string;
  price: number;
  image?: string;
  maxStock: number;
  quantity: number;
};

type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  refresh: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "nexora.cart.v1";

// Cart persistence:
//  - Guest  → localStorage (survives refresh on this device).
//  - Logged in → the DB is the source of truth (follows the customer across
//    devices). On login the guest cart is merged into the DB cart.
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const mergedRef = useRef(false);

  const authed = status === "authenticated";

  // Load guest cart from localStorage on first mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  // On login: merge the local cart into the DB, then adopt the server cart.
  useEffect(() => {
    if (!ready) return;
    if (authed && !mergedRef.current) {
      mergedRef.current = true;
      (async () => {
        let guest: { variantId: string; quantity: number }[] = [];
        try {
          const raw = localStorage.getItem(KEY);
          if (raw)
            guest = (JSON.parse(raw) as CartLine[]).map((l) => ({
              variantId: l.variantId,
              quantity: l.quantity,
            }));
        } catch {
          /* ignore */
        }
        const res = await fetch("/api/cart/merge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines: guest }),
        });
        if (res.ok) {
          const data = await res.json();
          setLines(data.lines);
          try {
            localStorage.removeItem(KEY);
          } catch {
            /* ignore */
          }
        }
      })();
    }
    if (status === "unauthenticated") mergedRef.current = false;
  }, [authed, status, ready]);

  // Persist guest cart to localStorage (only while logged out).
  useEffect(() => {
    if (!ready || authed) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, ready, authed]);

  const refresh = useCallback(async () => {
    if (!authed) return;
    const res = await fetch("/api/cart");
    if (res.ok) setLines((await res.json()).lines);
  }, [authed]);

  const add = useCallback(
    (line: Omit<CartLine, "quantity">, qty = 1) => {
      emitToast("Added to bag");
      setLines((prev) => {
        const existing = prev.find((l) => l.variantId === line.variantId);
        if (existing)
          return prev.map((l) =>
            l.variantId === line.variantId
              ? { ...l, quantity: Math.min(l.quantity + qty, l.maxStock) }
              : l,
          );
        return [...prev, { ...line, quantity: Math.min(qty, line.maxStock) }];
      });
      if (authed)
        fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId: line.variantId, quantity: qty }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => d && setLines(d.lines))
          .catch(() => {});
    },
    [authed],
  );

  const setQty = useCallback(
    (variantId: string, qty: number) => {
      setLines((prev) =>
        prev
          .map((l) =>
            l.variantId === variantId
              ? { ...l, quantity: Math.max(0, Math.min(qty, l.maxStock)) }
              : l,
          )
          .filter((l) => l.quantity > 0),
      );
      if (authed)
        fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId, quantity: qty }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => d && setLines(d.lines))
          .catch(() => {});
    },
    [authed],
  );

  const remove = useCallback(
    (variantId: string) => {
      setLines((prev) => prev.filter((l) => l.variantId !== variantId));
      if (authed)
        fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId }),
        }).catch(() => {});
    },
    [authed],
  );

  const clear = useCallback(() => {
    setLines([]);
    if (authed)
      fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }).catch(() => {});
  }, [authed]);

  const count = lines.reduce((s, l) => s + l.quantity, 0);
  const subtotal = lines.reduce((s, l) => s + l.quantity * l.price, 0);

  return (
    <Ctx.Provider
      value={{ lines, count, subtotal, add, setQty, remove, clear, refresh }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
