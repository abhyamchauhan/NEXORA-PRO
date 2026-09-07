"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

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
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "nexora.cart.v1";

// Step 4: client cart persisted to localStorage so "Add to bag", the bag count
// and the cart page all work now. Step 5 syncs this to the DB for logged-in
// customers so it follows them across devices.
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, ready]);

  const add = useCallback((line: Omit<CartLine, "quantity">, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === line.variantId);
      if (existing) {
        return prev.map((l) =>
          l.variantId === line.variantId
            ? { ...l, quantity: Math.min(l.quantity + qty, l.maxStock) }
            : l,
        );
      }
      return [...prev, { ...line, quantity: Math.min(qty, line.maxStock) }];
    });
  }, []);

  const setQty = useCallback((variantId: string, qty: number) => {
    setLines((prev) =>
      prev
        .map((l) =>
          l.variantId === variantId
            ? { ...l, quantity: Math.max(0, Math.min(qty, l.maxStock)) }
            : l,
        )
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const remove = useCallback((variantId: string) => {
    setLines((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = lines.reduce((s, l) => s + l.quantity, 0);
  const subtotal = lines.reduce((s, l) => s + l.quantity * l.price, 0);

  return (
    <Ctx.Provider value={{ lines, count, subtotal, add, setQty, remove, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
