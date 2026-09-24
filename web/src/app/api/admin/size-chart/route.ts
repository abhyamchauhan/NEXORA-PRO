import type { Category, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";
import { normalizeChart } from "@/lib/size-chart";

const CATEGORIES = ["men", "women", "kids"];

// GET ?productId=…  or  ?category=men  → the chart, or { chart: null }
export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const category = searchParams.get("category");

  const chart = productId
    ? await prisma.sizeChart.findUnique({ where: { productId } })
    : category && CATEGORIES.includes(category)
      ? await prisma.sizeChart.findUnique({ where: { category: category as Category } })
      : null;

  return Response.json({ chart: chart ? normalizeChart(chart) : null });
}

// PUT { productId?|category?, fields, rows } — upsert. Empty fields deletes it.
export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return forbidden();

  const body = await req.json().catch(() => ({}));
  const productId = typeof body?.productId === "string" ? body.productId : null;
  const category =
    typeof body?.category === "string" && CATEGORIES.includes(body.category)
      ? (body.category as Category)
      : null;
  if (!productId && !category)
    return Response.json({ error: "Target required." }, { status: 400 });

  const { fields, rows } = normalizeChart(body);

  // No fields → remove the chart entirely.
  if (fields.length === 0) {
    await prisma.sizeChart.deleteMany({
      where: productId ? { productId } : { category },
    });
    return Response.json({ chart: null });
  }

  const data = { fields, rows: rows as unknown as Prisma.InputJsonValue };
  const chart = productId
    ? await prisma.sizeChart.upsert({
        where: { productId },
        update: data,
        create: { productId, ...data },
      })
    : await prisma.sizeChart.upsert({
        where: { category: category as Category },
        update: data,
        create: { category, ...data },
      });

  return Response.json({ chart: normalizeChart(chart) });
}
