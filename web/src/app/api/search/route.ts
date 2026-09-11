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

  const subRows = await prisma.subCategory.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    orderBy: { position: "asc" },
    take: 5,
    select: { name: true, slug: true, group: true, category: true },
  });

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

  // Category suggestions: matching sub-categories first (e.g. "jog" → Joggers),
  // then any top-level category whose label matches the query.
  const subSuggestions = subRows.map((s) => ({
    label: `${s.name} · ${CATEGORY_LABELS[s.category] ?? s.category}`,
    href: `/shop?category=${s.category}&sub=${encodeURIComponent(s.slug)}`,
  }));
  const topSuggestions = Object.entries(CATEGORY_LABELS)
    .filter(([, label]) => label.toLowerCase().includes(q.toLowerCase()))
    .map(([slug, label]) => ({ label, href: `/category/${slug}` }));

  const categories = [...subSuggestions, ...topSuggestions].slice(0, 6);

  return Response.json({ products, categories });
}
