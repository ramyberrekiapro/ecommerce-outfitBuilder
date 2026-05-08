import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Product } from "@/lib/types";
import { products as staticProducts } from "@/data/products";

const CUSTOM_PATH = path.join(process.cwd(), "data", "custom-products.json");
const DELETED_PATH = path.join(process.cwd(), "data", "deleted-products.json");

async function readCustom(): Promise<Product[]> {
  try { return JSON.parse(await readFile(CUSTOM_PATH, "utf-8")); } catch { return []; }
}

async function readDeleted(): Promise<string[]> {
  try { return JSON.parse(await readFile(DELETED_PATH, "utf-8")); } catch { return []; }
}

async function writeCustom(products: Product[]) {
  await writeFile(CUSTOM_PATH, JSON.stringify(products, null, 2), "utf-8");
}

export async function GET() {
  const [custom, deletedIds] = await Promise.all([readCustom(), readDeleted()]);
  const customById = new Map(custom.map((p) => [p.id, p]));
  const staticIdSet = new Set(staticProducts.map((p) => p.id));

  // Static products: skip deleted, apply overrides
  const merged = staticProducts
    .filter((p) => !deletedIds.includes(p.id))
    .map((p) => customById.get(p.id) ?? p);

  // New custom-only products
  const newCustom = custom.filter((p) => !staticIdSet.has(p.id));

  const all = [...merged, ...newCustom];
  return NextResponse.json({ products: all, staticIds: Array.from(staticIdSet) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { name, price, category, colors, sizes, description, material, images } = body;

  if (!name || !price || !category || !description || !material) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") + "-" + Date.now();

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

  const custom = await readCustom();
  custom.push(product);
  await writeCustom(custom);

  return NextResponse.json({ product }, { status: 201 });
}
