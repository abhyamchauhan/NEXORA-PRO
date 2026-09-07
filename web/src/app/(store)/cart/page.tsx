"use client";

import Link from "next/link";
import { useCart } from "@/components/store/CartProvider";
import { ProductImage } from "@/components/store/ProductImage";
import { inr } from "@/lib/format";

export default function CartPage() {
  const { lines, subtotal, setQty, remove } = useCart();

  if (lines.length === 0) {
    return (
      <div className="max-w-container mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-2xl mb-3">Your bag is empty</h1>
        <Link
          href="/shop"
          className="inline-block font-display text-sm tracking-button bg-ink text-white px-7 py-3 rounded-button"
        >
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-6 py-10 grid lg:grid-cols-[1fr_320px] gap-10">
      <div>
        <h1 className="font-display text-2xl mb-6">Bag ({lines.length})</h1>
        <ul className="divide-y divide-grey-200 border-y border-grey-200">
          {lines.map((l) => (
            <li key={l.variantId} className="py-4 flex gap-4">
              <Link
                href={`/product/${l.slug}`}
                className="relative w-20 h-24 bg-grey-50 shrink-0"
              >
                <ProductImage src={l.image} alt={l.name} sizes="80px" />
              </Link>
              <div className="flex-1">
                <div className="flex justify-between">
                  <Link href={`/product/${l.slug}`} className="font-display text-sm">
                    {l.name}
                  </Link>
                  <span className="text-sm">{inr(l.price * l.quantity)}</span>
                </div>
                <p className="text-xs text-grey-500 mt-1">
                  {l.color} · {l.size}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border border-grey-300">
                    <button
                      onClick={() => setQty(l.variantId, l.quantity - 1)}
                      className="px-3 py-1 hover:bg-grey-50"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="px-3 text-sm">{l.quantity}</span>
                    <button
                      onClick={() => setQty(l.variantId, l.quantity + 1)}
                      disabled={l.quantity >= l.maxStock}
                      className="px-3 py-1 hover:bg-grey-50 disabled:opacity-30"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => remove(l.variantId)}
                    className="text-xs text-sale underline"
                  >
                    Remove
                  </button>
                </div>
                {l.quantity >= l.maxStock && (
                  <p className="text-xs text-grey-400 mt-1">Max stock reached</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="h-fit border border-grey-200 p-6">
        <h2 className="font-display text-sm tracking-label text-grey-500 mb-4">
          Summary
        </h2>
        <div className="flex justify-between text-sm mb-2">
          <span>Subtotal</span>
          <span>{inr(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-grey-500 mb-4">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between font-display border-t border-grey-200 pt-4">
          <span>Total</span>
          <span>{inr(subtotal)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-5 block text-center font-display text-sm tracking-button bg-ink text-white py-3 rounded-button hover:bg-black transition-colors"
        >
          Checkout
        </Link>
        <Link
          href="/shop"
          className="mt-2 block text-center text-xs text-grey-500 hover:text-ink"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
