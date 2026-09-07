import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { inr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OrderConfirmation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/order/${id}`);

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  // A customer can only ever view their own order.
  if (!order || order.userId !== session.user.id) notFound();

  const paid = order.status !== "pending";

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-pill bg-rating/15 text-rating grid place-items-center mx-auto mb-4 text-2xl">
          ✓
        </div>
        <h1 className="font-display text-3xl">Order confirmed</h1>
        <p className="text-grey-500 text-sm mt-2">
          Thank you. Order{" "}
          <span className="font-mono">#{order.id.slice(-8).toUpperCase()}</span>{" "}
          is {paid ? "placed and paid" : "placed (Cash on Delivery)"}.
        </p>
      </div>

      <div className="border border-grey-200">
        <div className="px-5 py-4 border-b border-grey-200 flex justify-between text-sm">
          <span className="font-display tracking-label text-grey-500">Items</span>
          <span className="uppercase tracking-label text-xs text-grey-500">
            {order.status}
          </span>
        </div>
        <ul className="divide-y divide-grey-100">
          {order.items.map((it) => (
            <li key={it.id} className="px-5 py-3 flex justify-between text-sm">
              <span>
                {it.quantity} × {it.productName}
                <span className="text-grey-400"> · {it.color}/{it.size}</span>
              </span>
              <span>{inr(it.price * it.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="px-5 py-4 border-t border-grey-200 flex justify-between font-display">
          <span>Total</span>
          <span>{inr(order.total)}</span>
        </div>
      </div>

      <div className="mt-6 text-sm text-grey-600">
        <p className="font-display text-xs tracking-label text-grey-400 mb-1">
          Shipping to
        </p>
        <p>
          {order.shippingName}, {order.shippingPhone}
          <br />
          {order.shippingAddress}, {order.shippingCity}, {order.shippingState} –{" "}
          {order.shippingPincode}
        </p>
      </div>

      <div className="flex gap-3 mt-8">
        <Link
          href="/orders"
          className="font-display text-sm tracking-button bg-ink text-white px-6 py-3 rounded-button hover:bg-black"
        >
          View my orders
        </Link>
        <Link
          href="/shop"
          className="font-display text-sm tracking-button border border-grey-300 px-6 py-3 rounded-button hover:border-ink"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
