import { products } from "@/data/products";
import type { Product, ProductCategory } from "@/lib/types";

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts(n = 6): Product[] {
  // Pick a balanced selection across categories.
  const order: ProductCategory[] = ["dress", "top", "outerwear", "bottom"];
  const out: Product[] = [];
  for (const cat of order) {
    const inCat = products.filter((p) => p.category === cat);
    out.push(...inCat.slice(0, Math.ceil(n / order.length)));
  }
  return out.slice(0, n);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}
