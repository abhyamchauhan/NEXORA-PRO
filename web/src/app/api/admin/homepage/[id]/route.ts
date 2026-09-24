import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";

type Ctx = { params: Promise<{ id: string }> };

const asString = (v: unknown) => (typeof v === "string" ? v : undefined);
const asStringArray = (v: unknown) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : undefined;

export async function GET(_req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const { id } = await params;
  const section = await prisma.homepageSection.findUnique({ where: { id } });
  if (!section) return Response.json({ error: "Not found." }, { status: 404 });
  return Response.json({ section });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const { id } = await params;

  const b = await req.json().catch(() => ({}));
  // Only content fields are updatable; type/position handled elsewhere.
  const data = {
    heading: asString(b.heading),
    subtext: asString(b.subtext),
    image: asString(b.image),
    buttonText: asString(b.buttonText),
    buttonLink: asString(b.buttonLink),
    productIds: asStringArray(b.productIds),
    categories: asStringArray(b.categories),
    visible: typeof b.visible === "boolean" ? b.visible : undefined,
  };
  // Strip undefined so we only touch provided fields.
  Object.keys(data).forEach(
    (k) => data[k as keyof typeof data] === undefined && delete data[k as keyof typeof data],
  );

  try {
    const section = await prisma.homepageSection.update({ where: { id }, data });
    return Response.json({ section });
  } catch {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const { id } = await params;
  try {
    await prisma.homepageSection.delete({ where: { id } });
  } catch {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
