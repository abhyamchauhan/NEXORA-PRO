// NEXORA 3D Studio — photo → parametric garment spec.
// Two layers, both real: (1) local canvas analysis (dominant colour, silhouette
// metrics, weave/contrast estimate) always runs; (2) Claude is asked to classify
// the garment, with the local metrics as the fallback when it is unavailable.
// No server-side mesh reconstruction — the output drives the parametric builder
// in nexora-3d.js, so the geometry is stylized, not a photogrammetric scan.

const GARMENTS = ["hoodie", "jacket", "tee", "vest", "pants", "skirt", "dress", "cap", "bag"];
const FABRICS = ["Cotton", "Fleece", "Denim", "Twill", "Leather", "Satin"];

export function readFileAsDataURL(file) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => rej(new Error("Could not read that file"));
    fr.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => rej(new Error("Not a readable image"));
    im.src = src;
  });
}

const hex = (r, g, b) => "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");

function nameColour(r, g, b) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, sat = max - min;
  if (sat < 26) {
    if (l < 46) return "Black";
    if (l < 96) return "Ink";
    if (l < 150) return "Slate";
    if (l < 205) return "Concrete";
    return "Chalk";
  }
  if (b > r && b > g) return l < 110 ? "Raw Indigo" : "Wash Blue";
  if (r > g && r > b) return l < 110 ? "Oxblood" : "Clay";
  if (g > r && g > b) return "Moss";
  return l < 120 ? "Ink" : "Bone";
}

// Dominant garment colour + silhouette metrics, computed on a 72px thumbnail.
export async function analyseLocally(dataUrl) {
  const im = await loadImage(dataUrl);
  const N = 72;
  const c = document.createElement("canvas");
  c.width = N; c.height = N;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(im, 0, 0, N, N);
  const d = ctx.getImageData(0, 0, N, N).data;

  // background estimate = mean of the four corners
  const at = (x, y) => { const i = (y * N + x) * 4; return [d[i], d[i + 1], d[i + 2]]; };
  const corners = [at(1, 1), at(N - 2, 1), at(1, N - 2), at(N - 2, N - 2)];
  const bg = corners.reduce((a, p) => [a[0] + p[0] / 4, a[1] + p[1] / 4, a[2] + p[2] / 4], [0, 0, 0]);

  const buckets = new Map();
  const rows = new Array(N).fill(0);
  let subject = 0, lumaSum = 0, lumaSq = 0;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const [r, g, b] = at(x, y);
      const dist = Math.abs(r - bg[0]) + Math.abs(g - bg[1]) + Math.abs(b - bg[2]);
      if (dist < 42) continue;
      subject++; rows[y]++;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      lumaSum += lum; lumaSq += lum * lum;
      const k = ((r >> 5) << 10) | ((g >> 5) << 5) | (b >> 5);
      const e = buckets.get(k) || [0, 0, 0, 0];
      buckets.set(k, [e[0] + r, e[1] + g, e[2] + b, e[3] + 1]);
    }
  }
  const top = [...buckets.entries()].sort((a, b) => b[1][3] - a[1][3]).slice(0, 3)
    .map(([, v]) => ({ hex: hex(v[0] / v[3], v[1] / v[3], v[2] / v[3]), rgb: [v[0] / v[3], v[1] / v[3], v[2] / v[3]], share: v[3] / Math.max(1, subject) }));
  const main = top[0] || { hex: "#1c1c1c", rgb: [28, 28, 28], share: 1 };

  const band = (a, b) => rows.slice(Math.round(N * a), Math.round(N * b)).reduce((x, y) => x + y, 0) / Math.max(1, Math.round(N * (b - a)));
  const upper = band(0.08, 0.38), mid = band(0.38, 0.66), lower = band(0.66, 0.94);
  const widest = Math.max(upper, mid, lower) || 1;
  const mean = lumaSum / Math.max(1, subject);
  const texture = Math.sqrt(Math.max(0, lumaSq / Math.max(1, subject) - mean * mean)) / 64;

  return {
    palette: top,
    color: main.hex,
    colorName: nameColour(main.rgb[0], main.rgb[1], main.rgb[2]),
    aspect: +(im.naturalWidth / im.naturalHeight).toFixed(2),
    coverage: +(subject / (N * N)).toFixed(2),
    profile: { upper: +(upper / widest).toFixed(2), mid: +(mid / widest).toFixed(2), lower: +(lower / widest).toFixed(2) },
    texture: +texture.toFixed(2),
    brightness: Math.round(mean),
  };
}

function heuristicGarment(m) {
  const { upper, mid, lower } = m.profile;
  const tall = m.aspect < 0.85;
  if (lower > 1.05 * upper && lower > 0.9) return tall ? "dress" : "skirt";
  if (upper > 1.15 * lower && mid < 0.8) return "cap";
  if (tall && upper < 0.75 && lower > 0.85) return "pants";
  if (m.texture > 0.34) return "jacket";
  if (m.coverage < 0.3) return "cap";
  return upper > 0.92 && mid > 0.9 ? "hoodie" : "tee";
}

function heuristicFabric(m) {
  if (m.texture > 0.4) return "Denim";
  if (m.texture > 0.28) return "Twill";
  if (m.brightness > 190 && m.texture < 0.13) return "Satin";
  if (m.brightness < 60 && m.texture < 0.12) return "Leather";
  return m.texture < 0.2 ? "Cotton" : "Fleece";
}

const TITLES = ["Orbital", "Vector", "Drift", "Nimbus", "Axiom", "Prism", "Tessera", "Meridian", "Echo", "Lumen", "Quanta", "Parallax", "Solstice", "Halo"];
const LABEL = { hoodie: "Hoodie", jacket: "Jacket", tee: "Boxy Tee", vest: "Vest", pants: "Baggy Pants", skirt: "Pleat Skirt", dress: "Column Dress", cap: "Cap", bag: "Tote" };
const priceFor = (g) => ({ hoodie: 1899, jacket: 3299, tee: 899, vest: 799, pants: 2199, skirt: 1499, dress: 2699, cap: 699, bag: 1099 }[g] || 1499);

function localSpec(m) {
  const garment = heuristicGarment(m);
  const fabric = heuristicFabric(m);
  return {
    garment, fabric, color: m.color, colorName: m.colorName,
    name: TITLES[Math.floor(Math.random() * TITLES.length)] + " " + LABEL[garment],
    category: garment === "skirt" || garment === "dress" ? "women" : "unisex",
    subCategory: { hoodie: "Hoodies", jacket: "Jackets", tee: "Tees & Vests", vest: "Tees & Vests", pants: "Pants", skirt: "Skirts", dress: "Dresses", cap: "Accessories", bag: "Accessories" }[garment],
    price: priceFor(garment),
    silhouette: m.profile.lower > m.profile.upper ? "A-line, volume at the hem" : "Boxy, square shoulder",
    material: fabric === "Denim" ? "Rigid denim" : fabric + " face, unbrushed",
    fit: m.coverage > 0.42 ? "Oversized" : "Regular",
    description: "Reconstructed from your reference photo: a " + m.colorName.toLowerCase() + " " + LABEL[garment].toLowerCase() + " in " + fabric.toLowerCase() + ", built as a parametric block.",
    source: "local", confidence: 0.55,
  };
}

const clampSpec = (raw, m) => {
  const base = localSpec(m);
  if (!raw || typeof raw !== "object") return base;
  const g = GARMENTS.includes(raw.garment) ? raw.garment : base.garment;
  return {
    ...base,
    garment: g,
    fabric: FABRICS.includes(raw.fabric) ? raw.fabric : base.fabric,
    color: /^#[0-9a-f]{6}$/i.test(raw.color || "") ? raw.color : base.color,
    colorName: (raw.colorName || base.colorName).toString().slice(0, 24),
    name: (raw.name || base.name).toString().slice(0, 40),
    category: ["men", "women", "kids", "unisex"].includes(raw.category) ? raw.category : base.category,
    subCategory: (raw.subCategory || base.subCategory).toString().slice(0, 28),
    price: Number.isFinite(+raw.price) ? Math.max(199, Math.min(19999, Math.round(+raw.price / 10) * 10)) : base.price,
    silhouette: (raw.silhouette || base.silhouette).toString().slice(0, 90),
    material: (raw.material || base.material).toString().slice(0, 90),
    fit: (raw.fit || base.fit).toString().slice(0, 60),
    description: (raw.description || base.description).toString().slice(0, 320),
    source: "claude", confidence: 0.88,
  };
};

const SYSTEM = "You are NEXORA's garment technologist. You classify a single garment photo into a parametric spec our 3D block library can build. Reply with ONE JSON object and nothing else.";

const SCHEMA = `{"garment":"hoodie|jacket|tee|vest|pants|skirt|dress|cap|bag","fabric":"Cotton|Fleece|Denim|Twill|Leather|Satin","color":"#rrggbb","colorName":"short name","name":"Two-word product name, first word a one-word mythic/technical codename","category":"men|women|kids|unisex","subCategory":"e.g. Hoodies","price":INR whole number 599-4999,"silhouette":"one clause","material":"one clause","fit":"one clause","description":"two sentences, editorial, no hype"}`;

// Returns a spec plus the local metrics. Never throws — falls back to local analysis.
export async function analyseGarment(dataUrl, hint) {
  const metrics = await analyseLocally(dataUrl);
  const note = [
    "Local image analysis of the photo:",
    "dominant colours " + metrics.palette.map((p) => p.hex + " (" + Math.round(p.share * 100) + "%)").join(", "),
    "image aspect " + metrics.aspect + ", subject coverage " + metrics.coverage,
    "silhouette width profile — upper " + metrics.profile.upper + ", middle " + metrics.profile.mid + ", hem " + metrics.profile.lower,
    "surface variance " + metrics.texture + ", mean luma " + metrics.brightness,
    hint ? "Designer note: " + hint : "",
  ].filter(Boolean).join("\n");

  if (!(window.claude && typeof window.claude.complete === "function")) {
    return { spec: { ...localSpec(metrics), source: "local", note: "Claude is unavailable in this context — spec derived from local image analysis." }, metrics };
  }

  const b64 = (dataUrl.split(",")[1] || "").slice(0);
  const media = (dataUrl.match(/^data:([^;]+);/) || [, "image/jpeg"])[1];
  const ask = "Classify this garment for our 3D block library.\n\n" + note + "\n\nReturn exactly this shape:\n" + SCHEMA;

  const parse = (text) => {
    const m = (text || "").match(/\{[\s\S]*\}/);
    if (!m) throw new Error("no json");
    return JSON.parse(m[0]);
  };

  try {
    const text = await window.claude.complete({
      model: "claude-sonnet-4-5",
      max_tokens: 700,
      system: SYSTEM,
      messages: [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: media, data: b64 } }, { type: "text", text: ask }] }],
    });
    return { spec: clampSpec(parse(text), metrics), metrics };
  } catch (e) {
    try {
      const text = await window.claude.complete({
        max_tokens: 700, system: SYSTEM,
        messages: [{ role: "user", content: "I cannot show you the photo, only measurements taken from it.\n\n" + note + "\n\nInfer the most likely garment and return exactly this shape:\n" + SCHEMA }],
      });
      const spec = clampSpec(parse(text), metrics);
      spec.note = "Vision unavailable — Claude inferred this from local image measurements.";
      spec.confidence = 0.7;
      return { spec, metrics };
    } catch (e2) {
      return { spec: { ...localSpec(metrics), note: "Claude could not be reached — spec derived from local image analysis only." }, metrics };
    }
  }
}
