import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";
import { slugify } from "@/lib/category";

type Ctx = { params: Promise<{ id: string }> };

// PATCH — update name / group / image / position (used for edits + reorder).
export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const { id } = await params;

  const existing = await prisma.subCategory.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Not found." }, { status: 404 });

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const data: Record<string, unknown> = {};

  if (typeof b.name === "string" && b.name.trim()) {
    data.name = b.name.trim();
    // Keep the slug in sync but unique within the category.
    const base = slugify(b.name) || "item";
    let slug = base;
    let n = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const clash = await prisma.subCategory.findFirst({
        where: { category: existing.category, slug, id: { not: id } },
        select: { id: true },
      });
      if (!clash) break;
      n += 1;
      slug = `${base}-${n}`;
    }
    data.slug = slug;
  }
  if (typeof b.group === "string" && b.group.trim()) data.group = b.group.trim();
  if (typeof b.image === "string") data.image = b.image.trim() || null;
  if (b.image === null) data.image = null;
  if (typeof b.position === "number" && Number.isFinite(b.position))
    data.position = Math.round(b.position);

  const sub = await prisma.subCategory.update({ where: { id }, data });
  return Response.json({ subCategory: sub });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const { id } = await params;
  try {
    await prisma.subCategory.delete({ where: { id } });
  } catch {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
