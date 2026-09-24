import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";
import { getSiteTheme, normaliseTheme } from "@/lib/site-settings";

// GET /api/admin/theme — current theme (defaults if unset).
export async function GET() {
  const session = await getAdminSession();
  if (!session) return forbidden();
  return Response.json({ theme: await getSiteTheme() });
}

// PUT /api/admin/theme — upsert the singleton theme row.
export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return forbidden();

  const raw = await req.json().catch(() => null);
  const theme = normaliseTheme(raw);

  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...theme },
    update: theme,
  });

  return Response.json({ theme });
}
