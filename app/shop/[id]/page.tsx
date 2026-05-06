import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductCard } from "@/components/ProductCard";
import { getAllProducts, getProductById } from "@/lib/products";
import type { Metadata } from "next";

interface Params {
  params: { id: string };
}

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: Params): Metadata {
  const product = getProductById(params.id);
  if (!product) return { title: "Not found — 213" };
  return {
    title: `${product.name} — 213`,
    description: product.description,
  };
}

export default function ProductPage({ params }: Params) {
  const product = getProductById(params.id);
  if (!product) notFound();

  const related = getAllProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
      <nav className="text-xs uppercase tracking-wider-2 text-ink/60 mb-10">
        <Link href="/shop" className="hover:text-terracotta transition-colors">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mt-32">
          <h2 className="font-display text-3xl md:text-4xl mb-10">
            You may also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
