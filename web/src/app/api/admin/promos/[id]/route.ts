import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const { id } = await params;

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  if (typeof b.label === "string" && b.label.trim()) data.label = b.label.trim();
  if (typeof b.endsAt === "string") {
    const d = new Date(b.endsAt);
    if (!Number.isNaN(d.getTime())) data.endsAt = d;
  }
  for (const k of ["buttonText", "buttonLink"] as const)
    if (typeof b[k] === "string") data[k] = (b[k] as string).trim() || null;
  if (typeof b.visible === "boolean") data.visible = b.visible;

  try {
    const promo = await prisma.promoCountdown.update({ where: { id }, data });
    return Response.json({ promo });
  } catch {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const { id } = await params;
  try {
    await prisma.promoCountdown.delete({ where: { id } });
  } catch {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
