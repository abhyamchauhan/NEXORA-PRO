import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";

// GET /api/admin/orders?status=  — all orders (admin view).
export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) return forbidden();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status")?.trim();

  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      user: { select: { email: true, name: true } },
    },
  });

  return Response.json({ orders });
}
