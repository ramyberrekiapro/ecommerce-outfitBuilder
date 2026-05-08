import { OutfitBuilder } from "@/components/OutfitBuilder";
import { getAllProducts } from "@/lib/products";

export const metadata = {
  title: "Outfit Builder — 213",
  description: "Build a full outfit and see it on you with AI virtual try-on.",
};

export default async function OutfitBuilderPage() {
  const products = await getAllProducts();
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-20">
      <header className="mb-12 max-w-2xl">
        <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-3">
          Outfit Builder
        </p>
        <h1 className="font-display text-5xl md:text-6xl leading-tight">
          Build a look. See it on you.
        </h1>
        <p className="text-sm text-ink/70 mt-5 leading-relaxed">
          Pick pieces from the collection, upload a selfie, and generate a
          full outfit preview — on your body, in Mediterranean light.
        </p>
      </header>

      <OutfitBuilder products={products} />
    </div>
  );
}
