import { prisma } from "@/lib/prisma";
import { OrderStatusSelect } from "./OrderStatusSelect";

export const dynamic = "force-dynamic";

const inr = (v: number) => "Rs. " + v.toLocaleString("en-IN");

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      user: { select: { email: true, name: true } },
    },
  });

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white border border-grey-200 p-10 text-center text-sm text-grey-500">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="bg-white border border-grey-200 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-sm">
                    #{o.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-grey-400">
                    {o.createdAt.toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-xs text-grey-500 mt-1">
                    {o.user.name ? `${o.user.name} · ` : ""}
                    {o.user.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display">{inr(o.total)}</p>
                  <div className="mt-1">
                    <OrderStatusSelect id={o.id} status={o.status} />
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-grey-100 pt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="font-display text-[11px] tracking-label text-grey-400 mb-1">
                    Items
                  </p>
                  <ul className="text-sm text-grey-600 space-y-0.5">
                    {o.items.map((it) => (
                      <li key={it.id}>
                        {it.quantity} × {it.productName} · {it.color}/{it.size}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-display text-[11px] tracking-label text-grey-400 mb-1">
                    Ship to
                  </p>
                  <p className="text-sm text-grey-600">
                    {o.shippingName}, {o.shippingPhone}
                    <br />
                    {o.shippingAddress}, {o.shippingCity}, {o.shippingState} –{" "}
                    {o.shippingPincode}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
