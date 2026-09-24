import { prisma } from "@/lib/prisma";

// Public list for the support widget's size/stock selector.
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, variants: { select: { size: true } } },
  });

  return Response.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      sizes: [...new Set(p.variants.map((v) => v.size))].sort(),
    })),
  });
}
