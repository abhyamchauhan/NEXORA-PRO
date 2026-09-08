import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";
import { parseCouponInput } from "@/lib/coupon-input";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json({ coupons });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return forbidden();

  const parsed = parseCouponInput(await req.json().catch(() => ({})));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  try {
    const coupon = await prisma.coupon.create({ data: parsed.data });
    return Response.json({ coupon }, { status: 201 });
  } catch {
    return Response.json(
      { error: "A coupon with that code already exists." },
      { status: 409 },
    );
  }
}
