import { prisma } from "@/lib/prisma";

// Stock / size availability lookup (public catalogue info).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId")?.trim();
  const size = searchParams.get("size")?.trim();
  if (!productId)
    return Response.json({ error: "Select a product." }, { status: 400 });

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      name: true,
      variants: {
        where: size ? { size } : undefined,
        select: { color: true, size: true, stock: true },
        orderBy: [{ size: "asc" }, { color: "asc" }],
      },
    },
  });

  if (!product) return Response.json({ found: false });

  return Response.json({
    found: true,
    product: product.name,
    variants: product.variants,
  });
}
