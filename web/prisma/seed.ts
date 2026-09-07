import { PrismaClient, Category, DisplayMode } from "@prisma/client";

const prisma = new PrismaClient();

// A small starter catalogue adapted from the NEXORA mockup (nexora-data.js).
// Images are placeholder paths for now — real uploads land via Cloudinary in
// Step 3. This exists so Step 1 verification shows real rows in the tables.
const products = [
  {
    slug: "orbital-hoodie",
    name: "Orbital Hoodie",
    description:
      "The boxy, drop-shoulder hoodie the studio prototyped first. Heavyweight 380 GSM brushed cotton fleece, wide body, cropped-square hem.",
    price: 1899,
    category: Category.men,
    featured: true,
    variants: [
      { size: "M", color: "Black", colorHex: "#131313", stock: 12, displayMode: DisplayMode.static, images: ["/products/orbital-black-1.jpg", "/products/orbital-black-2.jpg"] },
      { size: "L", color: "Black", colorHex: "#131313", stock: 8, displayMode: DisplayMode.static, images: ["/products/orbital-black-1.jpg", "/products/orbital-black-2.jpg"] },
      { size: "M", color: "Concrete", colorHex: "#c4c4c4", stock: 5, displayMode: DisplayMode.static, images: ["/products/orbital-concrete-1.jpg"] },
    ],
  },
  {
    slug: "vector-jacket",
    name: "Vector Jacket",
    description:
      "Squared shoulder, hard-set collar, two-panel front. Built to sit like architecture. Cotton twill shell, taffeta lining.",
    price: 3299,
    category: Category.men,
    featured: true,
    variants: [
      // A 360° premium treatment example.
      { size: "M", color: "Black", colorHex: "#131313", stock: 6, displayMode: DisplayMode.rotation360, images: Array.from({ length: 16 }, (_, i) => `/products/vector-black-${i + 1}.jpg`) },
      { size: "L", color: "Slate", colorHex: "#6b6b6b", stock: 3, displayMode: DisplayMode.static, images: ["/products/vector-slate-1.jpg"] },
    ],
  },
  {
    slug: "luna-column-dress",
    name: "Luna Column Dress",
    description:
      "A single falling column from bust to calf. Matte satin, bias panels. Close through the bust, straight fall.",
    price: 2699,
    category: Category.women,
    featured: true,
    variants: [
      { size: "S", color: "Bone", colorHex: "#e9e5dd", stock: 7, displayMode: DisplayMode.static, images: ["/products/luna-bone-1.jpg"] },
      { size: "M", color: "Black", colorHex: "#131313", stock: 4, displayMode: DisplayMode.static, images: ["/products/luna-black-1.jpg"] },
    ],
  },
  {
    slug: "flow-pleat-skirt",
    name: "Flow Pleat Skirt",
    description:
      "Twenty-four knife pleats, cut mid-thigh. Recycled poly-twill with pressed pleats. High waist.",
    price: 1499,
    category: Category.women,
    featured: false,
    variants: [
      { size: "S", color: "Concrete", colorHex: "#c4c4c4", stock: 10, displayMode: DisplayMode.static, images: ["/products/flow-concrete-1.jpg"] },
      { size: "M", color: "Black", colorHex: "#131313", stock: 0, displayMode: DisplayMode.static, images: ["/products/flow-black-1.jpg"] },
    ],
  },
  {
    slug: "echo-kids-tee",
    name: "Echo Kids Tee",
    description:
      "The house boxy tee, scaled down and softened. 200 GSM cotton, built to survive being worn every day.",
    price: 599,
    category: Category.kids,
    featured: true,
    variants: [
      { size: "S", color: "Chalk", colorHex: "#f2f2f2", stock: 20, displayMode: DisplayMode.static, images: ["/products/echo-chalk-1.jpg"] },
      { size: "M", color: "Black", colorHex: "#131313", stock: 15, displayMode: DisplayMode.static, images: ["/products/echo-black-1.jpg"] },
    ],
  },
  {
    slug: "lumen-kids-hoodie",
    name: "Lumen Kids Hoodie",
    description:
      "Warm, wide and easy over the head. No drawcords. 320 GSM fleece, relaxed fit.",
    price: 1199,
    category: Category.kids,
    featured: false,
    variants: [
      { size: "S", color: "Concrete", colorHex: "#c4c4c4", stock: 9, displayMode: DisplayMode.static, images: ["/products/lumen-concrete-1.jpg"] },
    ],
  },
];

async function main() {
  console.log("Seeding NEXORA catalogue…");
  for (const p of products) {
    const { variants, ...data } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...data,
        variants: { create: variants },
      },
    });
    console.log(`  ✓ ${p.name} (${variants.length} variants)`);
  }
  const total = await prisma.product.count();
  console.log(`Done. ${total} products in the catalogue.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
