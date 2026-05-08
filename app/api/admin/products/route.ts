import { NextRequest, NextResponse } from "next/server";
import { products as staticProducts } from "@/data/products";
import { getCustomProducts, setCustomProducts, getDeletedIds } from "@/lib/kv";
import type { Product } from "@/lib/types";

export async function GET() {
  const [custom, deletedIds] = await Promise.all([getCustomProducts(), getDeletedIds()]);
  const customById = new Map(custom.map((p) => [p.id, p]));
  const staticIdSet = new Set(staticProducts.map((p) => p.id));

  // Static: skip deleted, apply overrides
  const merged = staticProducts
    .filter((p) => !deletedIds.includes(p.id))
    .map((p) => customById.get(p.id) ?? p);

  // New custom-only products
  const newCustom = custom.filter((p) => !staticIdSet.has(p.id));

  return NextResponse.json({ products: [...merged, ...newCustom], staticIds: [...staticIdSet] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, price, category, colors, sizes, description, material, images } = body;

  if (!name || !price || !category || !description || !material) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const id =
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
    "-" + Date.now();

  const product: Product = {
    id,
    name,
    price: Number(price),
    category,
    colors: Array.isArray(colors) ? colors : colors.split(",").map((c: string) => c.trim()).filter(Boolean),
    sizes: Array.isArray(sizes) ? sizes : sizes.split(",").map((s: string) => s.trim()).filter(Boolean),
    description,
    material,
    images: Array.isArray(images) ? images.filter(Boolean) : [images].filter(Boolean),
  };

  const custom = await getCustomProducts();
  await setCustomProducts([...custom, product]);

  return NextResponse.json({ product }, { status: 201 });
}
