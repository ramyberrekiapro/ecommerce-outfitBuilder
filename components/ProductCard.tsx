import Link from "next/link";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [front, alt] = product.images;
  return (
    <article className="group">
      <div className="relative aspect-[4/5] bg-mist overflow-hidden">
        <Link
          href={`/shop/${product.id}`}
          className="block absolute inset-0"
          aria-label={product.name}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={front}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            loading="lazy"
          />
          {alt && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={alt}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              loading="lazy"
            />
          )}
        </Link>

        <Link
          href={`/try-on?product=${product.id}`}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-terracotta text-sand text-[10px] uppercase tracking-wider-2 px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:brightness-95"
        >
          Try On
        </Link>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <Link
          href={`/shop/${product.id}`}
          className="font-display text-lg leading-tight hover:text-terracotta transition-colors"
        >
          {product.name}
        </Link>
        <span className="text-sm text-ink/70 tabular-nums">€{product.price}</span>
      </div>
    </article>
  );
}
