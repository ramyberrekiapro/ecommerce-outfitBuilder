import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";

export default function Home() {
  const featured = getFeaturedProducts(6);

  return (
    <>
      {/* HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 20%, #F5F0EB 0%, #E8E2DA 55%, #C9B99A 100%)",
          }}
        />
        <div className="px-6 text-center max-w-3xl">
          <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-6">
            Été 213 — Méditerranée
          </p>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl tracking-wider-2 text-ink leading-[0.95]">
            213
          </h1>
          <p className="font-display italic text-2xl md:text-3xl text-ink/80 mt-6">
            Linen, silk, the colors of the coast.
          </p>
          <p className="text-sm text-ink/70 mt-8 max-w-md mx-auto leading-relaxed">
            Editorial summer essentials made for sun and sea — with virtual
            try-on, so you see how it looks on you before you buy.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-ink text-sand uppercase tracking-wider-2 text-xs px-7 py-4 hover:bg-sea transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/try-on"
              className="inline-flex items-center justify-center bg-terracotta text-sand uppercase tracking-wider-2 text-xs px-7 py-4 hover:brightness-95 transition"
            >
              Try It On
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-3">
              Nouveautés
            </p>
            <h2 className="font-display text-4xl md:text-5xl tracking-wider-2">
              The Été Edit
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-block text-xs uppercase tracking-wider-2 text-ink hover:text-terracotta transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* BRAND STATEMENT ──────────────────────────────────────────── */}
      <section className="bg-mist">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-4">
              The House
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              From the Côte d&apos;Algérie, with a view of the sea.
            </h2>
          </div>
          <div className="space-y-4 text-ink/80 leading-relaxed">
            <p>
              213 is a Mediterranean wardrobe — quietly cut, slowly made,
              colored by salt, sun, and stone. Every piece is built to soften
              with wear.
            </p>
            <p>
              We believe a wardrobe should be tried before it&apos;s bought.
              Our virtual try-on places each garment on you, so you see how it
              moves with your shape — before anything is shipped.
            </p>
            <Link
              href="/try-on"
              className="inline-block mt-2 text-xs uppercase tracking-wider-2 text-terracotta hover:text-ink transition-colors"
            >
              Try a piece on →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
