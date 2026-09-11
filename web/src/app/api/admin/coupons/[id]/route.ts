import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";
import { parseCouponInput } from "@/lib/coupon-input";

type Ctx = { params: Promise<{ id: string }> };

// PATCH — either a quick { active } toggle, or a full update.
export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  // Quick active toggle
  if (
    typeof body?.active === "boolean" &&
    Object.keys(body).length === 1
  ) {
    try {
      const coupon = await prisma.coupon.update({
        where: { id },
        data: { active: body.active },
      });
      return Response.json({ coupon });
    } catch {
      return Response.json({ error: "Not found." }, { status: 404 });
    }
  }

  const parsed = parseCouponInput(body);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  try {
    const coupon = await prisma.coupon.update({ where: { id }, data: parsed.data });
    return Response.json({ coupon });
  } catch {
    return Response.json(
      { error: "Could not update (code may already exist)." },
      { status: 409 },
    );
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const { id } = await params;
  try {
    await prisma.coupon.delete({ where: { id } });
  } catch {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
