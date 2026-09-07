import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";

type Ctx = { params: Promise<{ id: string }> };

const STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

// PATCH /api/admin/orders/:id  — update order status.
export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return forbidden();

  const { id } = await params;
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const status = (raw as { status?: string })?.status as OrderStatus;
  if (!STATUSES.includes(status))
    return Response.json({ error: "Invalid status." }, { status: 400 });

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return Response.json({ order });
  } catch {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
}
