import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const banners = await prisma.homeBanner.findMany({ orderBy: { position: "asc" } });
  return Response.json({ banners });
}

export async function POST() {
  const session = await getAdminSession();
  if (!session) return forbidden();
  const last = await prisma.homeBanner.findFirst({
    orderBy: { position: "desc" },
    select: { position: true },
  });
  const banner = await prisma.homeBanner.create({
    data: { heading: "New slide", position: (last?.position ?? -1) + 1 },
  });
  return Response.json({ banner }, { status: 201 });
}
