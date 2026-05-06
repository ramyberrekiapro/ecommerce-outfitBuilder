"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product, ProductCategory } from "@/lib/types";

interface ShopGridProps {
  products: Product[];
}

const CATEGORY_LABELS: Record<ProductCategory | "all", string> = {
  all: "All",
  top: "Tops",
  bottom: "Bottoms",
  dress: "Dresses",
  outerwear: "Outerwear",
};

export function ShopGrid({ products }: ShopGridProps) {
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const allColors = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.colors))).sort(),
    [products],
  );
  const allSizes = useMemo(
    () =>
      Array.from(new Set(products.flatMap((p) => p.sizes))).sort((a, b) => {
        const order = ["XS", "S", "M", "L", "XL", "XXL"];
        const ai = order.indexOf(a);
        const bi = order.indexOf(b);
        if (ai !== -1 && bi !== -1) return ai - bi;
        return a.localeCompare(b);
      }),
    [products],
  );

  const toggle = (
    list: string[],
    setList: (v: string[]) => void,
    val: string,
  ) =>
    list.includes(val)
      ? setList(list.filter((v) => v !== val))
      : setList([...list, val]);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (category !== "all" && p.category !== category) return false;
        if (
          selectedColors.length > 0 &&
          !p.colors.some((c) => selectedColors.includes(c))
        )
          return false;
        if (
          selectedSizes.length > 0 &&
          !p.sizes.some((s) => selectedSizes.includes(s))
        )
          return false;
        return true;
      }),
    [products, category, selectedColors, selectedSizes],
  );

  const clearAll = () => {
    setCategory("all");
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  const activeCount =
    (category !== "all" ? 1 : 0) + selectedColors.length + selectedSizes.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12">
      {/* Filter sidebar */}
      <aside className="lg:sticky lg:top-24 lg:self-start space-y-10">
        <FilterSection title="Category">
          <ul className="space-y-2">
            {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map(
              (key) => (
                <li key={key}>
                  <button
                    onClick={() => setCategory(key as ProductCategory | "all")}
                    className={`text-sm hover:text-terracotta transition-colors ${
                      category === key
                        ? "text-ink underline underline-offset-4"
                        : "text-ink/70"
                    }`}
                  >
                    {CATEGORY_LABELS[key]}
                  </button>
                </li>
              ),
            )}
          </ul>
        </FilterSection>

        <FilterSection title="Color">
          <div className="flex flex-wrap gap-2">
            {allColors.map((c) => (
              <button
                key={c}
                onClick={() => toggle(selectedColors, setSelectedColors, c)}
                className={`text-[10px] uppercase tracking-wider-2 px-3 py-1.5 border transition-colors ${
                  selectedColors.includes(c)
                    ? "bg-ink text-sand border-ink"
                    : "border-ink/30 text-ink/70 hover:border-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Size">
          <div className="flex flex-wrap gap-2">
            {allSizes.map((s) => (
              <button
                key={s}
                onClick={() => toggle(selectedSizes, setSelectedSizes, s)}
                className={`text-[10px] uppercase tracking-wider-2 w-10 h-9 border transition-colors ${
                  selectedSizes.includes(s)
                    ? "bg-ink text-sand border-ink"
                    : "border-ink/30 text-ink/70 hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </FilterSection>

        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs uppercase tracking-wider-2 text-terracotta hover:text-ink transition-colors"
          >
            Clear filters ({activeCount})
          </button>
        )}
      </aside>

      {/* Product grid */}
      <div>
        <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-6">
          {filtered.length} piece{filtered.length === 1 ? "" : "s"}
        </p>
        {filtered.length === 0 ? (
          <p className="text-sm text-ink/60 mt-8">
            No pieces match these filters. Try clearing one.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-wider-2 text-ink/60 mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}
