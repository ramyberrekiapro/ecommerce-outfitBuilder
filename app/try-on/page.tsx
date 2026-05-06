import { TryOnFlow } from "@/components/TryOnFlow";
import { getAllProducts } from "@/lib/products";

export const metadata = {
  title: "Virtual Try-On — 213",
  description:
    "See any 213 piece on you, from your own selfie. Powered by AI.",
};

interface SearchParams {
  searchParams: { product?: string };
}

export default function TryOnPage({ searchParams }: SearchParams) {
  const products = getAllProducts();
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-20">
      <header className="mb-12 max-w-2xl">
        <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-3">
          Virtual Try-On
        </p>
        <h1 className="font-display text-5xl md:text-6xl leading-tight">
          See it on you, before you buy.
        </h1>
        <p className="text-sm text-ink/70 mt-5 leading-relaxed">
          Upload a selfie, share your height and weight, and choose a piece.
          Our AI generates a photoreal image of you wearing it. Selfies are
          processed in-memory and never stored.
        </p>
      </header>

      <TryOnFlow
        products={products}
        initialProductId={searchParams.product}
      />
    </div>
  );
}
