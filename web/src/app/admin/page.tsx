import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const inr = (v: number) => "Rs. " + v.toLocaleString("en-IN");

export default async function AdminHome() {
  const [products, orders, customers, revenueAgg, recent] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "customer" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["paid", "processing", "shipped", "delivered"] } },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { email: true } } },
    }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <Stat label="Products" value={String(products)} href="/admin/products" />
        <Stat label="Orders" value={String(orders)} href="/admin/orders" />
        <Stat label="Customers" value={String(customers)} />
        <Stat label="Revenue" value={inr(revenueAgg._sum.total ?? 0)} />
      </div>

      <div className="bg-white border border-grey-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-grey-200">
          <h2 className="font-display text-sm tracking-label text-grey-500">
            Recent orders
          </h2>
          <Link href="/admin/orders" className="text-xs text-ink underline">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-8 text-sm text-grey-500">No orders yet.</p>
        ) : (
          <ul className="divide-y divide-grey-100">
            {recent.map((o) => (
              <li
                key={o.id}
                className="px-5 py-3 flex items-center justify-between text-sm"
              >
                <span className="font-mono text-xs">
                  #{o.id.slice(-8).toUpperCase()}
                </span>
                <span className="text-grey-500 hidden sm:block">
                  {o.user?.email ?? o.guestEmail ?? "Guest"}
                </span>
                <span className="uppercase tracking-label text-xs text-grey-500">
                  {o.status}
                </span>
                <span className="font-display">{inr(o.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="bg-white border border-grey-200 p-6 h-full hover:border-ink transition-colors">
      <p className="font-display text-3xl">{value}</p>
      <p className="font-display text-xs tracking-label text-grey-500 mt-2">
        {label}
      </p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
