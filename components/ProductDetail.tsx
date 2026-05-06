"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cart";
import type { Product } from "@/lib/types";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.open);

  const handleAdd = () => {
    if (!size) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size,
      color,
      qty,
    });
    setJustAdded(true);
    openCart();
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
      {/* Gallery */}
      <div>
        <div className="relative aspect-[4/5] bg-mist overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[activeImage]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-3 mt-3">
            {product.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActiveImage(i)}
                className={`relative aspect-[4/5] bg-mist overflow-hidden border ${
                  i === activeImage ? "border-ink" : "border-transparent"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="md:sticky md:top-24 md:self-start">
        <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-3">
          {product.category === "outerwear" ? "Outerwear" : `${product.category}s`}
        </p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight">
          {product.name}
        </h1>
        <p className="text-lg mt-3">€{product.price}</p>

        <p className="text-sm text-ink/80 leading-relaxed mt-6">
          {product.description}
        </p>
        <p className="text-xs uppercase tracking-wider-2 text-ink/60 mt-4">
          {product.material}
        </p>

        {/* Color */}
        <div className="mt-8">
          <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-3">
            Color — <span className="text-ink">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`text-[10px] uppercase tracking-wider-2 px-3 py-1.5 border transition-colors ${
                  color === c
                    ? "bg-ink text-sand border-ink"
                    : "border-ink/30 text-ink/70 hover:border-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="mt-6">
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-xs uppercase tracking-wider-2 text-ink/60">
              Size {size && <span className="text-ink">— {size}</span>}
            </p>
            <Link
              href={`/try-on?product=${product.id}`}
              className="text-[10px] uppercase tracking-wider-2 text-terracotta hover:text-ink"
            >
              Not sure? Use Try On →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`text-[10px] uppercase tracking-wider-2 w-12 h-10 border transition-colors ${
                  size === s
                    ? "bg-ink text-sand border-ink"
                    : "border-ink/30 text-ink/70 hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Qty */}
        <div className="mt-6 flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider-2 text-ink/60">
            Qty
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-8 h-8 border border-ink/30 hover:border-ink"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-sm">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-8 h-8 border border-ink/30 hover:border-ink"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <button
            onClick={handleAdd}
            disabled={!size}
            className="w-full inline-flex items-center justify-center bg-ink text-sand uppercase tracking-wider-2 text-xs px-7 py-4 hover:bg-sea transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {justAdded
              ? "Added ✓"
              : size
                ? "Add to Panier"
                : "Select a size"}
          </button>
          <Link
            href={`/try-on?product=${product.id}`}
            className="w-full inline-flex items-center justify-center bg-terracotta text-sand uppercase tracking-wider-2 text-xs px-7 py-4 hover:brightness-95 transition"
          >
            Try It On
          </Link>
        </div>
      </div>
    </div>
  );
}
