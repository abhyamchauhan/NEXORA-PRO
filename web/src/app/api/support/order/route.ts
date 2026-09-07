import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Order status lookup by Order ID. Returns only non-personal status info.
// If the visitor is logged in, they can only look up their OWN orders.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("id")?.trim() ?? "";
  if (!raw) return Response.json({ error: "Enter an Order ID." }, { status: 400 });

  // Accept either the full id or the short code shown to customers (last 8).
  const session = await auth();
  const order = await prisma.order.findFirst({
    where: raw.length >= 20 ? { id: raw } : { id: { endsWith: raw.toLowerCase() } },
    select: {
      id: true,
      status: true,
      total: true,
      createdAt: true,
      userId: true,
      items: { select: { quantity: true } },
    },
  });

  if (!order) return Response.json({ found: false });

  // Logged-in visitors only see their own orders.
  if (session?.user && order.userId !== session.user.id)
    return Response.json({ found: false });

  return Response.json({
    found: true,
    code: order.id.slice(-8).toUpperCase(),
    status: order.status,
    total: order.total,
    createdAt: order.createdAt,
    itemCount: order.items.reduce((s, i) => s + i.quantity, 0),
  });
}
