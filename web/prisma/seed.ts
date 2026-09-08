import { PrismaClient, Category, DisplayMode } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Demo accounts for verifying auth + role-based access. Change these before
// any real deployment.
const ADMIN_EMAIL = "admin@nexora.test";
const ADMIN_PASSWORD = "admin1234";
const CUSTOMER_EMAIL = "customer@nexora.test";
const CUSTOMER_PASSWORD = "customer1234";

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

async function seedUsers() {
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      name: "NEXORA Admin",
      role: "admin",
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12),
    },
  });
  await prisma.user.upsert({
    where: { email: CUSTOMER_EMAIL },
    update: {},
    create: {
      email: CUSTOMER_EMAIL,
      name: "Test Customer",
      role: "customer",
      passwordHash: await bcrypt.hash(CUSTOMER_PASSWORD, 12),
    },
  });
  console.log(`  ✓ admin:    ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`  ✓ customer: ${CUSTOMER_EMAIL} / ${CUSTOMER_PASSWORD}`);
}

async function seedHomepage() {
  const existing = await prisma.homepageSection.count();
  if (existing > 0) {
    console.log(`  · homepage already has ${existing} section(s), skipping`);
    return;
  }
  const featured = await prisma.product.findMany({
    where: { featured: true },
    select: { id: true },
    take: 8,
  });
  await prisma.homepageSection.createMany({
    data: [
      {
        type: "hero",
        position: 0,
        heading: "Streetwear, engineered clean.",
        subtext: "Render 01 — the season drop",
        buttonText: "Shop all",
        buttonLink: "/shop",
      },
      {
        type: "categoryShowcase",
        position: 1,
        heading: "Shop by category",
        categories: ["men", "women", "kids"],
      },
      {
        type: "featuredProducts",
        position: 2,
        heading: "Featured",
        productIds: featured.map((f) => f.id),
      },
    ],
  });
  console.log("  ✓ created 3 default homepage sections");
}

// Extra detail content per product (material/care/rating) so the product page
// shows review stars and a Product Details block on the demo catalogue.
const DETAILS: Record<
  string,
  { material: string; care: string; rating: number; reviewCount: number }
> = {
  "orbital-hoodie": { material: "380 GSM brushed cotton fleece", care: "Machine wash cold, tumble dry low, do not bleach.", rating: 4.8, reviewCount: 412 },
  "vector-jacket": { material: "Cotton twill shell, taffeta lining", care: "Dry clean only.", rating: 4.9, reviewCount: 96 },
  "luna-column-dress": { material: "Matte satin, bias panels", care: "Hand wash cold, hang to dry, cool iron.", rating: 4.8, reviewCount: 74 },
  "flow-pleat-skirt": { material: "Recycled poly-twill, pressed pleats", care: "Machine wash cold, hang dry to hold the pleats.", rating: 4.7, reviewCount: 208 },
  "echo-kids-tee": { material: "200 GSM combed cotton", care: "Machine wash warm, tumble dry low.", rating: 4.7, reviewCount: 121 },
  "lumen-kids-hoodie": { material: "320 GSM cotton fleece", care: "Machine wash cold, tumble dry low.", rating: 4.6, reviewCount: 88 },
};

async function seedCoupons() {
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "percentage",
      value: 10,
      minOrder: 999,
      active: true,
    },
  });
  console.log("  ✓ coupon WELCOME10 (10% off orders over Rs. 999)");
}

async function main() {
  console.log("Seeding NEXORA users…");
  await seedUsers();
  console.log("Seeding NEXORA catalogue…");
  for (const p of products) {
    const { variants, ...data } = p;
    const details = DETAILS[p.slug] ?? {};
    await prisma.product.upsert({
      where: { slug: p.slug },
      // Backfill detail fields on re-seed without disturbing name/price/variants.
      update: details,
      create: {
        ...data,
        ...details,
        variants: { create: variants },
      },
    });
    console.log(`  ✓ ${p.name} (${variants.length} variants)`);
  }
  console.log("Seeding NEXORA homepage…");
  await seedHomepage();
  console.log("Seeding NEXORA coupons…");
  await seedCoupons();
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
