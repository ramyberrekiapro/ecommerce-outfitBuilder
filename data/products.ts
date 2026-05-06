import type { Product } from "@/lib/types";

const SIZES_STD = ["XS", "S", "M", "L", "XL"];
const SIZES_NUM = ["36", "38", "40", "42", "44"];

// Placeholder images — palette-coloured, brand-styled. Swap with real product
// photography in production.
const ph = (label: string, bg = "F5F0EB", fg = "1A1A1A") =>
  `https://placehold.co/800x1000.png/${bg}/${fg}?text=${encodeURIComponent(label)}&font=playfair`;

export const products: Product[] = [
  // ── TOPS ────────────────────────────────────────────────────────────
  {
    id: "linen-camisa",
    name: "Linen Camisa",
    price: 120,
    category: "top",
    colors: ["White", "Sand", "Navy"],
    sizes: SIZES_STD,
    images: [ph("Linen Camisa"), ph("Linen Camisa · Detail", "E8E2DA")],
    description:
      "A featherweight linen shirt cut for the heat. Drop shoulder, mother-of-pearl buttons, gently relaxed fit.",
    material: "100% European linen",
  },
  {
    id: "silk-marin-tee",
    name: "Silk Marin Tee",
    price: 95,
    category: "top",
    colors: ["Cream", "Terracotta"],
    sizes: SIZES_STD,
    images: [ph("Silk Marin Tee", "E8E2DA"), ph("Silk Marin Tee · Back")],
    description:
      "A short-sleeve silk tee with the hand of vintage swimwear. Wear it to lunch on the rocks.",
    material: "92% silk, 8% elastane",
  },
  {
    id: "cotton-crochet-top",
    name: "Cotton Crochet Top",
    price: 85,
    category: "top",
    colors: ["Natural"],
    sizes: SIZES_STD,
    images: [ph("Cotton Crochet"), ph("Cotton Crochet · Detail", "C9B99A", "1A1A1A")],
    description:
      "Hand-crocheted in fine cotton with a square neckline. A summer essential, a year-round souvenir.",
    material: "100% cotton",
  },

  // ── BOTTOMS ─────────────────────────────────────────────────────────
  {
    id: "pantalon-de-plage",
    name: "Pantalon de Plage",
    price: 140,
    category: "bottom",
    colors: ["Sand", "White"],
    sizes: SIZES_NUM,
    images: [ph("Pantalon de Plage", "C9B99A"), ph("Pantalon · Side", "E8E2DA")],
    description:
      "A drawstring linen trouser, made for sand between toes and Aperol on terraces. Softly tapered.",
    material: "100% washed linen",
  },
  {
    id: "linen-wide-trousers",
    name: "Linen Wide Trousers",
    price: 160,
    category: "bottom",
    colors: ["Cream", "Navy"],
    sizes: SIZES_NUM,
    images: [ph("Wide Linen"), ph("Wide Linen · Hem", "E8E2DA")],
    description:
      "High-waisted, full-leg linen with a half-belt back. The kind of trouser that improves with every wash.",
    material: "100% linen",
  },
  {
    id: "cote-shorts",
    name: "Côte Shorts",
    price: 90,
    category: "bottom",
    colors: ["Sand"],
    sizes: SIZES_STD,
    images: [ph("Côte Shorts", "C9B99A"), ph("Côte Shorts · Pocket", "E8E2DA")],
    description:
      "Mid-length cotton shorts with a softly turned hem. Pair with the Linen Camisa for a complete coastal look.",
    material: "100% organic cotton",
  },

  // ── DRESSES ─────────────────────────────────────────────────────────
  {
    id: "robe-mediterranee",
    name: "Robe Méditerranée",
    price: 240,
    category: "dress",
    colors: ["White", "Sand"],
    sizes: SIZES_STD,
    images: [ph("Robe Méditerranée"), ph("Robe · Detail", "E8E2DA")],
    description:
      "A long linen dress with smocked back and tie shoulders. Cut for the breeze; designed to outlast trends.",
    material: "100% linen",
  },
  {
    id: "silk-slip-dress",
    name: "Silk Slip Dress",
    price: 280,
    category: "dress",
    colors: ["Cream"],
    sizes: SIZES_STD,
    images: [ph("Silk Slip", "E8E2DA"), ph("Silk Slip · Back")],
    description:
      "Bias-cut silk that pours. A dinner dress you can fold into a small bag and forget about until evening.",
    material: "100% silk crêpe de chine",
  },
  {
    id: "cotton-marina-dress",
    name: "Cotton Marina Dress",
    price: 180,
    category: "dress",
    colors: ["Navy Stripe"],
    sizes: SIZES_STD,
    images: [ph("Marina Dress", "0D1B2A", "F5F0EB"), ph("Marina · Detail", "E8E2DA")],
    description:
      "A nautical striped midi with a crew neckline and short cuffed sleeves. Easy, elegant, unending.",
    material: "100% cotton jersey",
  },

  // ── OUTERWEAR ───────────────────────────────────────────────────────
  {
    id: "linen-blazer",
    name: "Linen Blazer",
    price: 320,
    category: "outerwear",
    colors: ["Sand"],
    sizes: SIZES_STD,
    images: [ph("Linen Blazer", "C9B99A"), ph("Blazer · Lapel", "E8E2DA")],
    description:
      "An unstructured linen blazer cut for evenings at port. Two-button closure, single-vent back.",
    material: "100% Italian linen",
  },
  {
    id: "beach-cardigan",
    name: "Beach Cardigan",
    price: 170,
    category: "outerwear",
    colors: ["Cream"],
    sizes: SIZES_STD,
    images: [ph("Beach Cardigan", "E8E2DA"), ph("Cardigan · Knit")],
    description:
      "A loose, hand-finished cotton knit. Throw it on as the wind picks up at sundown.",
    material: "100% cotton",
  },
  {
    id: "light-trench",
    name: "Light Trench",
    price: 380,
    category: "outerwear",
    colors: ["Sand"],
    sizes: SIZES_STD,
    images: [ph("Light Trench", "C9B99A"), ph("Trench · Belt", "E8E2DA")],
    description:
      "A summer-weight trench in a feather cotton-linen blend. Tied, never buttoned.",
    material: "60% cotton, 40% linen",
  },
];
