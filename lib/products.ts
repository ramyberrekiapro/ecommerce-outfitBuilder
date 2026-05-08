import { products as staticProducts } from "@/data/products";
import { getCustomProducts, getDeletedIds } from "@/lib/kv";
import type { Product, ProductCategory } from "@/lib/types";

export async function getAllProducts(): Promise<Product[]> {
  const [custom, deletedIds] = await Promise.all([getCustomProducts(), getDeletedIds()]);
  const customById = new Map(custom.map((p) => [p.id, p]));
  const staticIds = new Set(staticProducts.map((p) => p.id));

  // Static products: skip deleted, apply overrides from custom
  const merged = staticProducts
    .filter((p) => !deletedIds.includes(p.id))
    .map((p) => customById.get(p.id) ?? p);

  // New custom-only products (ID not in static set)
  const newCustom = custom.filter((p) => !staticIds.has(p.id));

  return [...merged, ...newCustom];
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const all = await getAllProducts();
  return all.find((p) => p.id === id);
}

export async function getFeaturedProducts(n = 6): Promise<Product[]> {
  const all = await getAllProducts();
  const order: ProductCategory[] = ["dress", "top", "outerwear", "bottom"];
  const out: Product[] = [];
  for (const cat of order) {
    const inCat = all.filter((p) => p.category === cat);
    out.push(...inCat.slice(0, Math.ceil(n / order.length)));
  }
  return out.slice(0, n);
}

export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.category === category);
}

export async function getAllStaticProductIds(): Promise<string[]> {
  return staticProducts.map((p) => p.id);
}
