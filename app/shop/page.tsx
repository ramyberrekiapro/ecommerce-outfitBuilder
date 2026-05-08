import { ShopGrid } from "@/components/ShopGrid";
import { getAllProducts } from "@/lib/products";

export const metadata = {
  title: "Shop — 213",
  description: "The Été 213 collection. Linen, silk, the colors of the coast.",
};

export default async function ShopPage() {
  const products = await getAllProducts();
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <header className="mb-12 md:mb-16">
        <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-3">
          Été 213
        </p>
        <h1 className="font-display text-5xl md:text-6xl tracking-wider-2">
          The Collection
        </h1>
        <p className="text-sm text-ink/70 mt-4 max-w-md">
          Made for sun and sea. Use the virtual try-on to see anything on you
          before you buy.
        </p>
      </header>

      <ShopGrid products={products} />
    </div>
  );
}
