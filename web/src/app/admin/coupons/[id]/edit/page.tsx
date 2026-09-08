import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CouponForm } from "../../CouponForm";

export const dynamic = "force-dynamic";

export default async function EditCoupon({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await prisma.coupon.findUnique({ where: { id } });
  if (!c) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl mb-6">Edit coupon</h1>
      <CouponForm
        initial={{
          id: c.id,
          code: c.code,
          type: c.type,
          value: c.value,
          minOrder: c.minOrder,
          expiresAt: c.expiresAt ? c.expiresAt.toISOString().slice(0, 10) : null,
          usageLimit: c.usageLimit,
          active: c.active,
        }}
      />
    </div>
  );
}
