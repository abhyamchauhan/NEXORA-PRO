"use client";

import { useEffect, useState, useCallback } from "react";
import { TOAST_EVENT, type ToastDetail } from "@/lib/toast";

type Toast = ToastDetail & { id: number };

// Global toast host. Listens for nexora:toast events and shows stacked toasts
// bottom-right; each slides in, auto-dismisses after 2.6s with a fade-out.
export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [leaving, setLeaving] = useState<Set<number>>(new Set());

  const dismiss = useCallback((id: number) => {
    setLeaving((s) => new Set(s).add(id));
    // remove after the fade-out animation
    setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
      setLeaving((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }, 280);
  }, []);

  useEffect(() => {
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent<ToastDetail>).detail;
      if (!detail?.message) return;
      const id = Date.now() + Math.random();
      setToasts((list) => [...list.slice(-2), { ...detail, id }]);
      setTimeout(() => dismiss(id), 2600);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, [dismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto flex items-center gap-3 bg-ink text-white pl-4 pr-5 py-3 shadow-drawer rounded-button min-w-[220px] ${
            leaving.has(t.id) ? "toast-out" : "toast-in"
          }`}
        >
          <span
            aria-hidden
            className="grid place-items-center w-5 h-5 rounded-pill bg-rating text-white shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="font-display text-xs tracking-button">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
