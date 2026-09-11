// Tiny event-based toast bus. Any client code can call emitToast(...) without
// wiring context; the <Toaster/> mounted in the store layout listens and
// renders. Kept decoupled so providers (cart, wishlist) and pages can all use it.
export type ToastVariant = "default" | "success";

export type ToastDetail = {
  message: string;
  variant?: ToastVariant;
};

const EVENT = "nexora:toast";

export function emitToast(message: string, variant: ToastVariant = "success") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ToastDetail>(EVENT, { detail: { message, variant } }),
  );
}

export const TOAST_EVENT = EVENT;
