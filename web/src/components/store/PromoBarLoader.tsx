"use client";

import { useEffect, useState } from "react";
import { PromoBar } from "./PromoBar";
import type { PromoView } from "@/lib/promo";

// Fetches the active site-wide promo on mount and renders the bar. Runs on
// every page (including statically-rendered ones like /cart, /terms), so the
// promo bar is truly global. Renders nothing until/unless a promo is active.
export function PromoBarLoader() {
  const [promo, setPromo] = useState<PromoView | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/promo/active")
      .then((r) => (r.ok ? r.json() : { promo: null }))
      .then((d) => alive && setPromo(d.promo ?? null))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!promo) return null;
  return <PromoBar promo={promo} />;
}
