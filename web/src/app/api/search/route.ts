import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS } from "@/lib/format";

// Public predictive-search endpoint used by the header dropdown.
// GET /api/search?q=term  → { products: [...], categories: [...] }
// Products are matched by name/description; categories by their label. Kept
// intentionally small and fast (top 6) for a type-ahead experience.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return Response.json({ products: [], categories: [] });
  }

  const rows = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 6,
    select: {
      slug: true,
      name: true,
      price: true,
      category: true,
      variants: { select: { images: true }, take: 3 },
    },
  });

  const products = rows.map((p) => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    category: p.category,
    image: p.variants.flatMap((v) => v.images).find(Boolean) ?? null,
  }));

  // Category suggestions: any top-level category whose label matches the query.
  const categories = Object.entries(CATEGORY_LABELS)
    .filter(([, label]) => label.toLowerCase().includes(q.toLowerCase()))
    .map(([slug, label]) => ({ label, href: `/shop?category=${slug}` }));

  return Response.json({ products, categories });
}
