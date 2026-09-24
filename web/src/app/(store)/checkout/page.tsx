"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/store/CartProvider";
import { inr } from "@/lib/format";
import { emitToast } from "@/lib/toast";

type Shipping = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { interface Window { Razorpay: any } }

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { lines, subtotal, clear } = useCart();
  const isGuest = !session?.user;

  const [ship, setShip] = useState<Shipping>({
    name: "", phone: "", address: "", city: "", state: "", pincode: "",
  });
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"razorpay" | "cod">("razorpay");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Coupon
  const [couponInput, setCouponInput] = useState("");
  const [applied, setApplied] = useState<{ code: string; discount: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [couponBusy, setCouponBusy] = useState(false);

  const set = (k: keyof Shipping) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setShip((s) => ({ ...s, [k]: e.target.value }));

  const items = lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity }));
  const discount = applied?.discount ?? 0;
  const total = Math.max(0, subtotal - discount);

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setCouponBusy(true);
    setCouponMsg(null);
    const res = await fetch("/api/checkout/coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponInput, items }),
    });
    const d = await res.json().catch(() => ({}));
    setCouponBusy(false);
    if (d.ok) {
      setApplied({ code: d.code, discount: d.discount });
      setCouponMsg({ ok: true, text: d.message });
      emitToast("Coupon applied");
    } else {
      setApplied(null);
      setCouponMsg({ ok: false, text: d.message || "Invalid coupon." });
    }
  }

  function removeCoupon() {
    setApplied(null);
    setCouponInput("");
    setCouponMsg(null);
  }

  async function onSuccess(orderId: string) {
    clear();
    router.push(`/order/${orderId}`);
  }

  function basePayload() {
    return {
      shipping: ship,
      items,
      couponCode: applied?.code ?? null,
      ...(isGuest ? { email } : {}),
    };
  }

  async function placeCod() {
    const res = await fetch("/api/checkout/cod", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(basePayload()),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Could not place order.");
    await onSuccess(data.orderId);
  }

  async function payWithRazorpay() {
    const res = await fetch("/api/checkout/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(basePayload()),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Could not start payment.");
    if (!window.Razorpay)
      throw new Error("Payment library still loading — try again in a moment.");

    return new Promise<void>((resolve) => {
      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,
        name: "NEXORA",
        description: "Order payment",
        prefill: {
          name: ship.name,
          contact: ship.phone,
          email: session?.user?.email ?? email,
        },
        theme: { color: "#1c1c1c" },
        handler: async (resp: Record<string, string>) => {
          try {
            const v = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...resp, ...basePayload() }),
            });
            const vd = await v.json().catch(() => ({}));
            if (!v.ok) throw new Error(vd.error || "Verification failed.");
            await onSuccess(vd.orderId);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Payment failed.");
            setBusy(false);
          }
          resolve();
        },
        modal: { ondismiss: () => { setBusy(false); resolve(); } },
      });
      rzp.on("payment.failed", () => {
        setError("Payment failed. No money was deducted — please try again.");
        setBusy(false);
      });
      rzp.open();
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (method === "cod") await placeCod();
      else await payWithRazorpay();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="max-w-container mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-2xl mb-3">Your bag is empty</h1>
        <Link href="/shop" className="underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-6 py-10">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <h1 className="font-display text-2xl mb-2">Checkout</h1>
      {isGuest && (
        <p className="text-sm text-grey-500 mb-8">
          Checking out as a guest.{" "}
          <Link href="/login?callbackUrl=/checkout" className="underline">
            Sign in
          </Link>{" "}
          for faster checkout and order history.
        </p>
      )}

      <form onSubmit={onSubmit} className="grid lg:grid-cols-[1fr_360px] gap-10 mt-2">
        <div className="space-y-8">
          {isGuest && (
            <section>
              <h2 className="font-display text-sm tracking-label text-grey-500 mb-4">
                Contact
              </h2>
              <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </section>
          )}

          <section>
            <h2 className="font-display text-sm tracking-label text-grey-500 mb-4">
              Shipping details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" value={ship.name} onChange={set("name")} />
              <Field label="Mobile (10-digit)" value={ship.phone} onChange={set("phone")} inputMode="numeric" />
              <div className="sm:col-span-2">
                <Field label="Address" value={ship.address} onChange={set("address")} />
              </div>
              <Field label="City" value={ship.city} onChange={set("city")} />
              <Field label="State" value={ship.state} onChange={set("state")} />
              <Field label="PIN code" value={ship.pincode} onChange={set("pincode")} inputMode="numeric" />
            </div>
          </section>

          <section>
            <h2 className="font-display text-sm tracking-label text-grey-500 mb-4">Payment</h2>
            <div className="space-y-2">
              <Radio checked={method === "razorpay"} onChange={() => setMethod("razorpay")} title="Pay online (Razorpay)" sub="Card · UPI · Netbanking — test mode" />
              <Radio checked={method === "cod"} onChange={() => setMethod("cod")} title="Cash on Delivery" sub="Pay when your order arrives" />
            </div>
          </section>

          {error && <p className="text-sale text-sm">{error}</p>}
        </div>

        <aside className="h-fit border border-grey-200 p-6">
          <h2 className="font-display text-sm tracking-label text-grey-500 mb-4">
            Order summary
          </h2>
          <ul className="space-y-2 text-sm mb-4">
            {lines.map((l) => (
              <li key={l.variantId} className="flex justify-between gap-2">
                <span className="text-grey-600">
                  {l.quantity} × {l.name}
                  <span className="text-grey-400"> · {l.color}/{l.size}</span>
                </span>
                <span>{inr(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>

          {/* Coupon */}
          <div className="border-t border-grey-200 pt-4">
            {applied ? (
              <div className="flex items-center justify-between text-sm">
                <span className="text-rating">
                  {applied.code} applied
                </span>
                <button type="button" onClick={removeCoupon} className="text-xs text-sale underline">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="flex-1 border border-grey-300 px-3 py-2 text-sm outline-none focus:border-ink"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponBusy}
                  className="font-display text-xs tracking-button border border-ink px-3 rounded-button hover:bg-ink hover:text-white transition-colors disabled:opacity-50"
                >
                  {couponBusy ? "…" : "Apply"}
                </button>
              </div>
            )}
            {couponMsg && (
              <p className={`text-xs mt-2 ${couponMsg.ok ? "text-rating" : "text-sale"}`}>
                {couponMsg.text}
              </p>
            )}
          </div>

          <div className="flex justify-between text-sm mt-4">
            <span>Subtotal</span>
            <span>{inr(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-rating mt-1">
              <span>Discount</span>
              <span>− {inr(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-grey-500 mt-1">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-display border-t border-grey-200 mt-3 pt-3">
            <span>Total</span>
            <span>{inr(total)}</span>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="mt-5 w-full font-display text-sm tracking-button bg-accent text-white py-3.5 rounded-button transition-all duration-300 hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
          >
            {busy ? "Processing…" : method === "cod" ? "Place order" : `Pay ${inr(total)}`}
          </button>
          <Link href="/cart" className="mt-2 block text-center text-xs text-grey-500 hover:text-ink">
            ← Back to bag
          </Link>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label, value, onChange, inputMode, type,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputMode?: "text" | "numeric";
  type?: string;
}) {
  return (
    <label className="block">
      <span className="font-display text-xs tracking-label text-grey-500">{label}</span>
      <input
        type={type ?? "text"}
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        required
        className="mt-1 w-full border border-grey-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
      />
    </label>
  );
}

function Radio({
  checked, onChange, title, sub,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  sub: string;
}) {
  return (
    <label className={`flex items-start gap-3 border p-3 cursor-pointer ${checked ? "border-ink bg-grey-50" : "border-grey-200"}`}>
      <input type="radio" checked={checked} onChange={onChange} className="mt-1" />
      <span>
        <span className="block font-display text-sm tracking-button">{title}</span>
        <span className="block text-xs text-grey-500">{sub}</span>
      </span>
    </label>
  );
}
