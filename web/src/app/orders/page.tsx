import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/store/EmptyState";

export const dynamic = "force-dynamic";

const inr = (v: number) => "Rs. " + v.toLocaleString("en-IN");

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/orders");

  // Scoped to the signed-in user only — a customer can never see another
  // customer's orders.
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <main className="min-h-screen bg-grey-50 px-6 py-16">
      <div className="max-w-container mx-auto">
        <Link href="/account" className="text-sm text-grey-500 hover:text-ink">
          ← Account
        </Link>
        <h1 className="font-display text-2xl mt-2 mb-10">Order history</h1>

        {orders.length === 0 ? (
          <div className="max-w-xl">
            <EmptyState
              icon="❑"
              title="No orders yet"
              message="When you place an order, it'll show up here with its status and items."
              ctaLabel="Start shopping"
              ctaHref="/shop"
            />
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl">
            {orders.map((o) => (
              <div key={o.id} className="bg-white border border-grey-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-display text-sm">#{o.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-grey-400">
                      {o.createdAt.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-sm">{inr(o.total)}</p>
                    <p className="text-xs uppercase tracking-label text-grey-500">
                      {o.status}
                    </p>
                  </div>
                </div>
                <ul className="text-sm text-grey-500 space-y-1">
                  {o.items.map((it) => (
                    <li key={it.id}>
                      {it.quantity} × {it.productName} · {it.color} / {it.size}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
