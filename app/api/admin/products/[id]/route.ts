import { NextRequest, NextResponse } from "next/server";
import { products as staticProducts } from "@/data/products";
import { getCustomProducts, setCustomProducts, getDeletedIds, setDeletedIds } from "@/lib/kv";
import type { Product } from "@/lib/types";

const parseField = (val: unknown, fallback: string[]) =>
  typeof val === "string"
    ? val.split(",").map((s: string) => s.trim()).filter(Boolean)
    : Array.isArray(val) ? val : fallback;

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const isStatic = staticProducts.some((p) => p.id === id);

  if (isStatic) {
    // Mark as deleted
    const deleted = await getDeletedIds();
    if (!deleted.includes(id)) {
      await setDeletedIds([...deleted, id]);
    }
    // Also remove any override from custom
    const custom = await getCustomProducts();
    await setCustomProducts(custom.filter((p) => p.id !== id));
    return NextResponse.json({ ok: true });
  }

  // Custom-only product
  const custom = await getCustomProducts();
  const next = custom.filter((p) => p.id !== id);
  if (next.length === custom.length) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  await setCustomProducts(next);
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const isStatic = staticProducts.some((p) => p.id === id);
  const custom = await getCustomProducts();

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
      await setCustomProducts(custom.map((p) => (p.id === id ? updated : p)));
    } else {
      await setCustomProducts([...custom, updated]);
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

  await setCustomProducts(custom);
  return NextResponse.json({ product: custom[idx] });
}
