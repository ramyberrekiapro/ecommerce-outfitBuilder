import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { products as staticProducts } from "@/data/products";
import type { Product } from "@/lib/types";

const CUSTOM_PATH = path.join(process.cwd(), "data", "custom-products.json");
const DELETED_PATH = path.join(process.cwd(), "data", "deleted-products.json");

async function readCustom(): Promise<Product[]> {
  try { return JSON.parse(await readFile(CUSTOM_PATH, "utf-8")); } catch { return []; }
}

async function writeCustom(products: Product[]) {
  await writeFile(CUSTOM_PATH, JSON.stringify(products, null, 2), "utf-8");
}

async function readDeleted(): Promise<string[]> {
  try { return JSON.parse(await readFile(DELETED_PATH, "utf-8")); } catch { return []; }
}

async function writeDeleted(ids: string[]) {
  await writeFile(DELETED_PATH, JSON.stringify(ids, null, 2), "utf-8");
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const isStatic = staticProducts.some((p) => p.id === id);

  if (isStatic) {
    // Mark static product as deleted
    const deleted = await readDeleted();
    if (!deleted.includes(id)) {
      await writeDeleted([...deleted, id]);
    }
    // Also remove any override from custom
    const custom = await readCustom();
    await writeCustom(custom.filter((p) => p.id !== id));
    return NextResponse.json({ ok: true });
  }

  // Custom-only product
  const custom = await readCustom();
  const next = custom.filter((p) => p.id !== id);
  if (next.length === custom.length) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  await writeCustom(next);
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const isStatic = staticProducts.some((p) => p.id === id);
  const custom = await readCustom();

  const parseField = (val: unknown, fallback: string[]) =>
    typeof val === "string"
      ? val.split(",").map((s: string) => s.trim()).filter(Boolean)
      : Array.isArray(val) ? val : fallback;

  if (isStatic) {
    const original = staticProducts.find((p) => p.id === id)!;
    const existing = custom.find((p) => p.id === id);
    const base = existing ?? original;

    const updated: Product = {
      ...base,
      ...body,
      id,
      price: Number(body.price ?? base.price),
      colors: parseField(body.colors, base.colors),
      sizes: parseField(body.sizes, base.sizes),
      images: parseField(body.images, base.images),
    };

    if (existing) {
      await writeCustom(custom.map((p) => (p.id === id ? updated : p)));
    } else {
      await writeCustom([...custom, updated]);
    }
    return NextResponse.json({ product: updated });
  }

  // Custom-only product
  const idx = custom.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  custom[idx] = {
    ...custom[idx],
    ...body,
    id,
    price: Number(body.price ?? custom[idx].price),
    colors: parseField(body.colors, custom[idx].colors),
    sizes: parseField(body.sizes, custom[idx].sizes),
    images: parseField(body.images, custom[idx].images),
  };

  await writeCustom(custom);
  return NextResponse.json({ product: custom[idx] });
}
