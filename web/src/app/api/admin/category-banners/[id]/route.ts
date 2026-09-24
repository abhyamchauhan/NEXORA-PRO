import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";

type Ctx = { params: Promise<{ id: string }> };

const str = (v: unknown) => (typeof v === "string" ? v.trim() || null : undefined);

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const { id } = await params;

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  for (const k of ["heading", "subtext", "image", "buttonText", "buttonLink"] as const) {
    const v = str(b[k]);
    if (v !== undefined) data[k] = v;
  }
  if (typeof b.visible === "boolean") data.visible = b.visible;
  if (typeof b.position === "number" && Number.isFinite(b.position))
    data.position = Math.round(b.position);

  try {
    const banner = await prisma.categoryBanner.update({ where: { id }, data });
    return Response.json({ banner });
  } catch {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const { id } = await params;
  try {
    await prisma.categoryBanner.delete({ where: { id } });
  } catch {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
