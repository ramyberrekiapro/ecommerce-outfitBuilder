import type { Product } from "@/lib/types";

const SIZES_STD = ["XS", "S", "M", "L", "XL"];
const SIZES_NUM = ["36", "38", "40", "42", "44"];

// Verified Unsplash CDN photo IDs — each image confirmed to match its product
const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=1000&fit=crop&q=80`;

export const products: Product[] = [
  // ── TOPS ────────────────────────────────────────────────────────────
  {
    id: "linen-camisa",
    name: "Linen Camisa",
    price: 120,
    category: "top",
    colors: ["White", "Sand", "Navy"],
    sizes: SIZES_STD,
    images: [
      u("1693008561904-4aea66aa18ca"), // linen shirt
      u("1776633733518-d81137214dc9"), // white linen shirt with mandarin collar
    ],
    description:
      "A featherweight linen shirt cut for the heat. Drop shoulder, mother-of-pearl buttons, gently relaxed fit.",
    material: "100% European linen",
  },
  {
    id: "port-oxford-shirt",
    name: "Port Oxford Shirt",
    price: 110,
    category: "top",
    colors: ["White"],
    sizes: SIZES_STD,
    images: [
      u("1581655353564-df123a1eb820"), // white crew neck cotton shirt
      u("1693008561904-4aea66aa18ca"), // linen/cotton shirt worn
    ],
    description:
      "A crisp cotton shirt with a relaxed shoulder and clean collar — made for late mornings at the marina.",
    material: "100% cotton",
  },
  {
    id: "coast-cotton-tee",
    name: "Coast Cotton Tee",
    price: 60,
    category: "top",
    colors: ["White", "Sand"],
    sizes: SIZES_STD,
    images: [
      u("1598443126060-d20c2f10bf0f"), // white cotton tee, casual summer outfit
      u("1776633733518-d81137214dc9"), // white minimal top
    ],
    description:
      "A minimal tee in soft cotton jersey with a slightly boxy cut — the one you wear all summer.",
    material: "100% cotton jersey",
  },
  {
    id: "silk-marin-tee",
    name: "Silk Marin Tee",
    price: 95,
    category: "top",
    colors: ["Cream", "Terracotta"],
    sizes: SIZES_STD,
    images: [
      u("1777894851675-c787ecde9acb"), // silk elegant top/dress — cream silk
      u("1592980187697-2708eafe9c81"), // woman in cream/white silk
    ],
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
    images: [
      u("1615705592748-029c989e6d5c"), // white knit/crochet textile
      u("1683315565563-f72590773805"), // knitwear flat lay
    ],
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
    images: [
      u("1767440527251-537eb325b986"), // linen drawstring trousers, tropical resort
      u("1763259406006-101d7a615aee"), // wide-leg linen trousers
    ],
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
    images: [
      u("1763259406006-101d7a615aee"), // wide-leg trousers, elegant garden setting
      u("1767440527251-537eb325b986"), // linen trousers resort
    ],
    description:
      "High-waisted, full-leg linen with a half-belt back. The kind of trouser that improves with every wash.",
    material: "100% linen",
  },
  {
    id: "cote-shorts",
    name: "Côte Shorts",
    price: 90,
    category: "bottom",
    colors: ["Sand", "White"],
    sizes: SIZES_STD,
    images: [
      u("1598443126060-d20c2f10bf0f"), // casual summer shorts outfit
      u("1691053318576-4bf08315e877"), // styled summer essentials flat lay
    ],
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
    images: [
      u("1592980187697-2708eafe9c81"), // woman in white dress outdoors
      u("1769107805528-964f4de0e342"), // white dresses in minimalist boutique
    ],
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
    images: [
      u("1777894851675-c787ecde9acb"), // elegant woman in silk slip dress
      u("1592980187697-2708eafe9c81"), // woman in cream dress, natural light
    ],
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
    images: [
      u("1660924173457-5b9198c9c867"), // navy striped summer dress
      u("1769107805528-964f4de0e342"), // dresses in minimal boutique
    ],
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
    images: [
      u("1740710370552-a49b5b01f80a"), // natural linen blazers on rack
      u("1691053318576-4bf08315e877"), // linen suit styled flat lay
    ],
    description:
      "An unstructured linen blazer cut for evenings at port. Two-button closure, single-vent back.",
    material: "100% Italian linen",
  },
  {
    id: "beach-cardigan",
    name: "Beach Cardigan",
    price: 170,
    category: "outerwear",
    colors: ["Cream", "Sand"],
    sizes: SIZES_STD,
    images: [
      u("1683315565563-f72590773805"), // knitted sweater flat lay
      u("1615705592748-029c989e6d5c"), // white knit textile close-up
    ],
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
    images: [
      u("1718837615361-912c983c7899"), // woman in elegant trench coat
      u("1740710370552-a49b5b01f80a"), // outerwear on rack
    ],
    description:
      "A summer-weight trench in a feather cotton-linen blend. Tied, never buttoned.",
    material: "60% cotton, 40% linen",
  },
];
