import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, ArrowLeft, ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
    <main className="relative min-h-screen overflow-hidden bg-[#08080a] text-white px-6 py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px circle at 50% -10%, rgba(255,255,255,0.06), transparent 60%)",
        }}
      />

      <div className="relative max-w-container mx-auto">
        <Link
          href="/account"
          className="group inline-flex items-center gap-1.5 text-sm text-white/45 hover:text-white transition-colors"
        >
          <ArrowLeft
            size={16}
            strokeWidth={1.6}
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1"
          />
          Account
        </Link>

        <div className="anim-fade-up mt-8 mb-10 flex items-baseline gap-3">
          <h1 className="font-lux-serif italic text-4xl sm:text-5xl leading-tight lux-glow-dark">
            Order history
          </h1>
          {orders.length > 0 && (
            <span className="font-display text-xs tracking-label text-white/40">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="anim-fade-up anim-delay-1 max-w-md mx-auto text-center py-16">
            <span className="lux-icon-ring h-16 w-16 mx-auto mb-6 flex">
              <Package size={26} strokeWidth={1.5} />
            </span>
            <h2 className="font-display text-xl text-white mb-3">No orders yet</h2>
            <p className="text-sm text-white/50 max-w-sm mx-auto">
              When you place an order, it&apos;ll show up here with its status and
              items.
            </p>
            <Link
              href="/shop"
              className="group mt-8 inline-flex items-center gap-2 bg-white text-[#0a0a0a] font-display text-sm tracking-button px-7 py-3 rounded-button transition-all duration-300 hover:shadow-[0_0_28px_-8px_rgba(255,255,255,0.5)]"
            >
              Start shopping
              <ArrowRight
                size={18}
                strokeWidth={1.6}
                className="transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              />
            </Link>
          </div>
        ) : (
          <div className="anim-fade-up anim-delay-1 space-y-4 max-w-3xl">
            {orders.map((o) => (
              <div
                key={o.id}
                className="premium-card is-dark p-6 sm:p-7"
                style={{ transform: "none" }}
              >
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-4">
                    <span className="lux-icon-ring h-11 w-11 shrink-0">
                      <Package size={19} strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="font-display text-sm text-white">
                        #{o.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {o.createdAt.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-sm text-white">
                      {inr(o.total)}
                    </p>
                    <span className="inline-block mt-1.5 text-[10px] uppercase tracking-label text-white/70 border border-white/15 rounded-full px-2.5 py-1">
                      {o.status}
                    </span>
                  </div>
                </div>
                <div className="h-px bg-white/8 mb-4" />
                <ul className="text-sm text-white/55 space-y-1.5">
                  {o.items.map((it) => (
                    <li key={it.id}>
                      <span className="text-white/80">{it.quantity} ×</span>{" "}
                      {it.productName}{" "}
                      <span className="text-white/35">
                        · {it.color} / {it.size}
                      </span>
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
