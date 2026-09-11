import { prisma } from "@/lib/prisma";
import { inr } from "@/lib/format";
import { CouponForm } from "./CouponForm";
import { CouponRowActions } from "./CouponRowActions";

export const dynamic = "force-dynamic";

function statusOf(c: {
  active: boolean;
  expiresAt: Date | null;
  usageLimit: number | null;
  usedCount: number;
}) {
  if (!c.active) return { label: "INACTIVE", cls: "text-grey-500" };
  if (c.expiresAt && c.expiresAt.getTime() < Date.now())
    return { label: "EXPIRED", cls: "text-sale" };
  if (c.usageLimit != null && c.usedCount >= c.usageLimit)
    return { label: "USED UP", cls: "text-sale" };
  return { label: "ACTIVE", cls: "text-rating" };
}

export default async function AdminCoupons() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Coupons</h1>

      <div className="max-w-2xl mb-10">
        <CouponForm />
      </div>

      <div className="bg-white border border-grey-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left border-b border-grey-200 text-grey-500">
              <Th>Code</Th>
              <Th>Discount</Th>
              <Th>Min order</Th>
              <Th>Expires</Th>
              <Th>Usage</Th>
              <Th>Status</Th>
              <Th> </Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-100">
            {coupons.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-grey-500">
                  No coupons yet. Create one above.
                </td>
              </tr>
            )}
            {coupons.map((c) => {
              const s = statusOf(c);
              return (
                <tr key={c.id} className="hover:bg-grey-50">
                  <td className="px-4 py-3 font-display tracking-button">{c.code}</td>
                  <td className="px-4 py-3">
                    {c.type === "percentage" ? `${c.value}%` : inr(c.value)}
                  </td>
                  <td className="px-4 py-3 text-grey-500">
                    {c.minOrder != null ? inr(c.minOrder) : "—"}
                  </td>
                  <td className="px-4 py-3 text-grey-500">
                    {c.expiresAt
                      ? c.expiresAt.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-grey-500">
                    {c.usedCount}
                    {c.usageLimit != null ? ` / ${c.usageLimit}` : ""}
                  </td>
                  <td className={`px-4 py-3 text-xs font-display tracking-label ${s.cls}`}>
                    {s.label}
                  </td>
                  <td className="px-4 py-3">
                    <CouponRowActions id={c.id} code={c.code} active={c.active} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 font-display text-xs tracking-label font-normal">
      {children}
    </th>
  );
}
