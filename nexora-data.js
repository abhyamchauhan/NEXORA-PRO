// NEXORA — catalog data. Swap/extend freely; the UI reads only from here.
// Prices in whole rupees. `garment` selects the parametric 3D build in nexora-3d.js.

export const CURRENCY = { code: "INR", format: (v) => "Rs. " + Math.round(v).toLocaleString("en-IN") };

export const CATEGORIES = [
  { id: "men", label: "Men", subs: ["Tees & Vests", "Shirts", "Hoodies", "Jackets", "Pants", "Jeans", "Shorts", "Accessories"] },
  { id: "women", label: "Women", subs: ["Tees & Vests", "Tops", "Dresses", "Hoodies", "Jackets", "Jeans", "Pants", "Skirts", "Accessories"] },
  { id: "kids", label: "Kids", subs: ["Tees & Vests", "Hoodies", "Pants", "Sets", "Accessories"] },
  { id: "unisex", label: "Unisex", subs: ["Hoodies", "Jackets", "Tees & Vests", "Accessories"] },
];

export const COLLECTIONS = ["Core", "Render 01", "Winter 26", "Studio Lab", "Summer 26", "Crochet", "Embroidered", "Kurta Drips", "Timeless Linen", "Textured Fits"];

// Campaign photography (shot imagery, not 3D). Drives the collection tiles,
// the lookbook bands and the per-collection banners.
export const CAMPAIGNS = [
  { id: "summer", title: "Summer '26", eyebrow: "The season campaign", collection: "Summer 26",
    copy: "Sheer stripes, open collars, nothing that needs ironing.",
    portrait: true,
    wide: "assets/campaign-summer-tall.jpg", tall: "assets/campaign-summer-tall.jpg", tile: "assets/campaign-summer26-tile.jpg" },
  { id: "crochet", title: "Crochet Shirts", eyebrow: "Hand-knit open weave", collection: "Crochet",
    copy: "Chevron crochet knit, camp collar, worn open over everything.",
    wide: "assets/campaign-crochet-wide.jpg", tall: "assets/campaign-crochet-tall.jpg", tile: "assets/campaign-crochet-tile.jpg" },
  { id: "embroidered", title: "Embroidered Shirts", eyebrow: "Thread on linen", collection: "Embroidered",
    copy: "Floral run-stitch across washed linen, done by hand.",
    wide: "assets/campaign-embroidered-wide.jpg", tall: "assets/campaign-embroidered-tall.jpg", tile: "assets/campaign-embroidered-tall.jpg" },
  { id: "polo", title: "Polos", eyebrow: "Introducing", collection: "Core",
    copy: "Knit polos with a zip placket and a hard-set collar.",
    wide: "assets/campaign-polo-wide.jpg", tall: "assets/campaign-polo-tall.jpg", tile: "assets/campaign-polo-tall.jpg" },
  { id: "fresh", title: "Fresh Arrivals", eyebrow: "Just dropped", collection: "Render 01",
    copy: "The wide-leg block and the shirts cut to sit over it.",
    wide: "assets/campaign-fresh-wide.jpg", tall: "assets/campaign-fresh-tall.jpg", tile: "assets/campaign-fresh-tall.jpg" },
  { id: "kurta", title: "Kurta Drips", eyebrow: "Homegrown silhouette", collection: "Kurta Drips",
    copy: "Band-collar kurta shirts in woven stripe, cut long.",
    wide: "assets/campaign-kurta-wide.jpg", tall: "assets/campaign-kurta-tall.jpg", tile: "assets/campaign-kurta-tile.jpg" },
  { id: "linen", title: "Timeless Linen", eyebrow: "Pure linen", collection: "Timeless Linen",
    copy: "Garment-dyed linen that gets better the more you crush it.",
    wide: "assets/campaign-linen-wide.jpg", tall: "assets/campaign-linen-tall.jpg", tile: "assets/campaign-linen-tile.jpg" },
  { id: "textured", title: "Textured Fits", eyebrow: "Surface first", collection: "Textured Fits",
    copy: "Crinkle weaves and seersucker, boxy through the body.",
    wide: "assets/campaign-textured-wide.jpg", tall: "assets/campaign-textured-tall.jpg", tile: "assets/campaign-textured-tile.jpg" },
];

export const findCampaign = (id) => CAMPAIGNS.find((c) => c.id === id);
export const FABRICS = ["Cotton", "Fleece", "Denim", "Twill", "Leather", "Satin"];
export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const C = {
  black: { name: "Black", hex: "#131313" },
  ink: { name: "Ink", hex: "#1c1c1c" },
  bone: { name: "Bone", hex: "#e9e5dd" },
  concrete: { name: "Concrete", hex: "#c4c4c4" },
  slate: { name: "Slate", hex: "#6b6b6b" },
  chalk: { name: "Chalk", hex: "#f2f2f2" },
  clay: { name: "Clay", hex: "#a89b8c" },
  indigo: { name: "Raw Indigo", hex: "#3c4655" },
};

const p = (o) => ({ rating: 4.6, reviewCount: 128, inStock: true, sizes: SIZES, ...o });

export const PRODUCTS = [
  p({ id: "orbital-hood", name: "Orbital Hoodie", price: 1899, compareAt: 2799, category: "unisex", subCategory: "Hoodies", collection: "Render 01",
    garment: "hoodie", fabric: "Fleece", colors: [C.black, C.concrete, C.bone], rating: 4.8, reviewCount: 412,
    description: "The boxy, drop-shoulder hoodie the studio prototyped first. Heavyweight fleece, wide body, cropped-square hem that holds its shape on the render and off it.",
    material: "380 GSM brushed cotton fleece", fit: "Boxy oversized — size down for a regular fit",
    isNew: true, isBestSeller: true, isTrending: true, onSale: true }),

  p({ id: "flow-skirt", name: "Flow Pleat Skirt", price: 1499, compareAt: 1999, category: "women", subCategory: "Skirts", collection: "Render 01",
    garment: "skirt", fabric: "Twill", colors: [C.concrete, C.black, C.slate], rating: 4.7, reviewCount: 208,
    description: "Twenty-four knife pleats, cut mid-thigh. Modelled panel by panel so the swing reads true in the 3D twin.",
    material: "Recycled poly-twill, pressed pleats", fit: "High waist, mid-thigh", isNew: true, isTrending: true, onSale: true }),

  p({ id: "vector-jacket", name: "Vector Jacket", price: 3299, compareAt: 4499, category: "men", subCategory: "Jackets", collection: "Winter 26",
    garment: "jacket", fabric: "Twill", colors: [C.black, C.slate], rating: 4.9, reviewCount: 96,
    description: "Squared shoulder, hard-set collar, two-panel front. Built to sit like architecture rather than clothing.",
    material: "Cotton twill shell, taffeta lining", fit: "Relaxed, straight body", isBestSeller: true, onSale: true }),

  p({ id: "drift-pants", name: "Drift Baggy Pants", price: 2199, category: "men", subCategory: "Pants", collection: "Core",
    garment: "pants", fabric: "Cotton", colors: [C.black, C.clay, C.concrete], rating: 4.6, reviewCount: 331,
    description: "Wide through the thigh, heavy break at the ankle. The pattern our whole baggy block is derived from.",
    material: "Heavy cotton canvas", fit: "Baggy, low rise", isBestSeller: true, isTrending: true }),

  p({ id: "nimbus-tee", name: "Nimbus Boxy Tee", price: 899, compareAt: 1299, category: "unisex", subCategory: "Tees & Vests", collection: "Core",
    garment: "tee", fabric: "Cotton", colors: [C.chalk, C.black, C.concrete, C.slate], rating: 4.5, reviewCount: 640,
    description: "The house tee. Square body, wide neck rib, sleeves cut just past the shoulder point.",
    material: "240 GSM combed cotton", fit: "Boxy, true to size", isBestSeller: true, onSale: true }),

  p({ id: "axiom-vest", name: "Axiom Vest", price: 799, category: "men", subCategory: "Tees & Vests", collection: "Core",
    garment: "vest", fabric: "Cotton", colors: [C.black, C.chalk], rating: 4.4, reviewCount: 187,
    description: "Deep armhole, ribbed edge, layered under everything else in the drop.", material: "220 GSM cotton rib", fit: "Boxy, cropped", isNew: true }),

  p({ id: "luna-dress", name: "Luna Column Dress", price: 2699, compareAt: 3399, category: "women", subCategory: "Dresses", collection: "Render 01",
    garment: "dress", fabric: "Satin", colors: [C.bone, C.black, C.slate], rating: 4.8, reviewCount: 74,
    description: "A single falling column from bust to calf. The drape was solved in simulation before it was ever cut.",
    material: "Matte satin, bias panels", fit: "Close through bust, straight fall", isNew: true, isTrending: true, onSale: true }),

  p({ id: "meridian-hood", name: "Meridian Zip Hoodie", price: 2099, category: "women", subCategory: "Hoodies", collection: "Winter 26",
    garment: "hoodie", fabric: "Fleece", colors: [C.concrete, C.ink, C.bone], rating: 4.7, reviewCount: 152,
    description: "Full-zip, high hood, cropped body. Cut for layering over the Flow skirt.", material: "340 GSM cotton fleece", fit: "Cropped boxy", isNew: true }),

  p({ id: "tessera-jeans", name: "Tessera Wide Jeans", price: 2499, compareAt: 3199, category: "women", subCategory: "Jeans", collection: "Core",
    garment: "pants", fabric: "Denim", colors: [C.indigo, C.black, C.concrete], rating: 4.6, reviewCount: 289,
    description: "Rigid wide-leg denim with a flat front and a long, heavy fall.", material: "13.5 oz rigid denim", fit: "Wide leg, high rise", isBestSeller: true, onSale: true }),

  p({ id: "echo-tee-kids", name: "Echo Kids Tee", price: 599, category: "kids", subCategory: "Tees & Vests", collection: "Core",
    garment: "tee", fabric: "Cotton", colors: [C.chalk, C.concrete, C.black], rating: 4.7, reviewCount: 121,
    description: "The Nimbus block, scaled down and softened. Built to survive being worn every day.", material: "200 GSM cotton", fit: "Relaxed", sizes: ["XS", "S", "M", "L"] }),

  p({ id: "lumen-hood-kids", name: "Lumen Kids Hoodie", price: 1199, compareAt: 1599, category: "kids", subCategory: "Hoodies", collection: "Winter 26",
    garment: "hoodie", fabric: "Fleece", colors: [C.concrete, C.black], rating: 4.6, reviewCount: 88,
    description: "Warm, wide and easy over the head. No drawcords.", material: "320 GSM fleece", fit: "Relaxed", sizes: ["XS", "S", "M", "L"], onSale: true, isNew: true }),

  p({ id: "cinder-pants-kids", name: "Cinder Kids Pants", price: 999, category: "kids", subCategory: "Pants", collection: "Core",
    garment: "pants", fabric: "Cotton", colors: [C.black, C.clay], rating: 4.5, reviewCount: 64,
    description: "Straight, roomy, elastic waist. The baggy block for small people.", material: "Cotton canvas", fit: "Roomy straight", sizes: ["XS", "S", "M", "L"] }),

  p({ id: "prism-shirt", name: "Prism Overshirt", price: 1999, category: "men", subCategory: "Shirts", collection: "Studio Lab",
    garment: "jacket", fabric: "Cotton", colors: [C.concrete, C.bone, C.black], rating: 4.5, reviewCount: 73,
    description: "Shirt cut with jacket weight — boxy, square pockets, worn open over the Nimbus tee.", material: "Heavy cotton poplin", fit: "Boxy overshirt", isNew: true }),

  p({ id: "solstice-top", name: "Solstice Baby Tee", price: 749, category: "women", subCategory: "Tops", collection: "Core",
    garment: "tee", fabric: "Cotton", colors: [C.chalk, C.black, C.slate], rating: 4.4, reviewCount: 240,
    description: "Short, snug, high neck. The counterweight to everything baggy.", material: "200 GSM cotton rib", fit: "Fitted, cropped", isTrending: true }),

  p({ id: "parallax-cap", name: "Parallax Cap", price: 699, compareAt: 999, category: "unisex", subCategory: "Accessories", collection: "Core",
    garment: "cap", fabric: "Cotton", colors: [C.black, C.concrete, C.bone], rating: 4.6, reviewCount: 310,
    description: "Six-panel, mid crown, flat brim. Modelled on a plinth because it deserves one.", material: "Cotton drill", fit: "One size, adjustable", sizes: ["OS"], onSale: true, isBestSeller: true }),

  p({ id: "quanta-bag", name: "Quanta Tote", price: 1099, category: "unisex", subCategory: "Accessories", collection: "Studio Lab",
    garment: "bag", fabric: "Cotton", colors: [C.bone, C.black], rating: 4.5, reviewCount: 97,
    description: "Squared canvas tote with a flat base and long straps. Carries a laptop and a full grocery run.", material: "16 oz cotton canvas", fit: "One size", sizes: ["OS"], isNew: true }),
];

PRODUCTS.push(
  p({ id: "meridian-crochet", name: "Meridian Crochet Shirt", price: 2299, compareAt: 2999, category: "men", subCategory: "Shirts", collection: "Crochet",
    garment: "jacket", fabric: "Cotton", colors: [{ name: "Sand Chevron", hex: "#c9b79c" }, { name: "Navy Chevron", hex: "#37415c" }],
    rating: 4.8, reviewCount: 164, lifestyle: "assets/campaign-crochet-tall.jpg", campaign: "crochet",
    description: "Open chevron crochet knit with a camp collar and a boxy body. Shot in Italy for the Crochet campaign; modelled here as its 3D twin.",
    material: "Hand-loom cotton crochet knit", fit: "Boxy, relaxed through the body", isNew: true, isTrending: true, onSale: true }),

  p({ id: "vellum-embroidered", name: "Vellum Embroidered Shirt", price: 2499, category: "men", subCategory: "Shirts", collection: "Embroidered",
    garment: "jacket", fabric: "Cotton", colors: [{ name: "Plum Wash", hex: "#6d5673" }, { name: "Chalk", hex: "#f2f2f2" }],
    rating: 4.7, reviewCount: 91, lifestyle: "assets/campaign-embroidered-tall.jpg", campaign: "embroidered",
    description: "Run-stitch floral embroidery across washed linen, worked in vertical repeats. Long sleeve, full placket, rolled cuff.",
    material: "Washed linen, hand embroidery", fit: "Regular, straight hem", isNew: true }),

  p({ id: "cadence-polo", name: "Cadence Knit Polo", price: 1799, compareAt: 2299, category: "men", subCategory: "Tees & Vests", collection: "Core",
    garment: "tee", fabric: "Cotton", colors: [{ name: "Rust Stripe", hex: "#a4552a" }, { name: "Ink", hex: "#1c1c1c" }],
    rating: 4.8, reviewCount: 212, lifestyle: "assets/campaign-polo-tall.jpg", campaign: "polo",
    description: "Zip-placket knit polo in a vertical rib stripe, with banded sleeves. The one piece in the drop that tucks.",
    material: "Cotton rib knit", fit: "Regular, short sleeve", isBestSeller: true, onSale: true }),

  p({ id: "ambar-kurta", name: "Ambar Kurta Shirt", price: 1999, category: "men", subCategory: "Shirts", collection: "Kurta Drips",
    garment: "jacket", fabric: "Cotton", colors: [{ name: "Terracotta Stripe", hex: "#b4675e" }, { name: "Sand", hex: "#d8c9ac" }],
    rating: 4.6, reviewCount: 143, lifestyle: "assets/campaign-kurta-tall.jpg", campaign: "kurta",
    description: "Band-collar kurta shirt in a woven stripe, cut long with a half placket. Homegrown silhouette, everyday weight.",
    material: "Handwoven cotton stripe", fit: "Relaxed, longline", isTrending: true }),

  p({ id: "halo-linen", name: "Halo Linen Shirt", price: 2199, compareAt: 2799, category: "men", subCategory: "Shirts", collection: "Timeless Linen",
    garment: "jacket", fabric: "Cotton", colors: [{ name: "Ochre", hex: "#d2a03c" }, { name: "Chalk", hex: "#f2f2f2" }, { name: "Slate", hex: "#6b6b6b" }],
    rating: 4.9, reviewCount: 276, lifestyle: "assets/campaign-linen-tall.jpg", campaign: "linen",
    description: "Garment-dyed pure linen with a patch pocket and a soft collar. Creases on purpose.",
    material: "100% garment-dyed linen", fit: "Relaxed, cropped body", isBestSeller: true, onSale: true }),

  p({ id: "umber-textured", name: "Umber Textured Shirt", price: 2099, category: "men", subCategory: "Shirts", collection: "Textured Fits",
    garment: "jacket", fabric: "Twill", colors: [{ name: "Cocoa", hex: "#5a3a2e" }, { name: "Chalk", hex: "#f2f2f2" }],
    rating: 4.7, reviewCount: 118, lifestyle: "assets/campaign-textured-tall.jpg", campaign: "textured",
    description: "Crinkle-weave shirt with a dropped shoulder and a single chest pocket. The surface does the work.",
    material: "Crinkle cotton seersucker", fit: "Boxy, dropped shoulder", isNew: true }),
);

export const findProduct = (id) => PRODUCTS.find((x) => x.id === id);

export const ANNOUNCEMENTS = [
  "FREE DOORSTEP DELIVERY IN INDIA",
  "EVERY GARMENT SHIPS WITH ITS 3D TWIN",
  "NEW DROP — RENDER 01 IS LIVE",
];
