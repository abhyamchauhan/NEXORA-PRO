import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";

// POST { ids: [...] } — persist the new order (index becomes position).
export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return forbidden();

  const b = await req.json().catch(() => ({}));
  const ids: string[] = Array.isArray(b?.ids)
    ? b.ids.filter((x: unknown): x is string => typeof x === "string")
    : [];
  if (ids.length === 0)
    return Response.json({ error: "No ids provided." }, { status: 400 });

  await prisma.$transaction(
    ids.map((id, i) =>
      prisma.homepageSection.update({ where: { id }, data: { position: i } }),
    ),
  );
  return Response.json({ ok: true });
}
