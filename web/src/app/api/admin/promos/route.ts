import type { Category } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
const cat = (v: unknown): Category | null =>
  v === "men" || v === "women" || v === "kids" ? v : null;

export async function GET() {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const promos = await prisma.promoCountdown.findMany({ orderBy: { endsAt: "asc" } });
  return Response.json({ promos });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return forbidden();

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const label = str(b.label);
  const endsAtRaw = typeof b.endsAt === "string" ? new Date(b.endsAt) : null;
  if (!label) return Response.json({ error: "Label is required." }, { status: 400 });
  if (!endsAtRaw || Number.isNaN(endsAtRaw.getTime()))
    return Response.json({ error: "A valid end date/time is required." }, { status: 400 });

  const promo = await prisma.promoCountdown.create({
    data: {
      label,
      endsAt: endsAtRaw,
      category: cat(b.category),
      buttonText: str(b.buttonText),
      buttonLink: str(b.buttonLink),
      visible: b.visible === false ? false : true,
    },
  });
  return Response.json({ promo }, { status: 201 });
}
