"use client";

import { useState } from "react";
import { SelfieUploader } from "@/components/SelfieUploader";
import { TryOnLoading } from "@/components/TryOnLoading";
import type { Product, ProductCategory } from "@/lib/types";

interface OutfitBuilderProps {
  products: Product[];
}

const CATEGORIES: { key: ProductCategory; label: string }[] = [
  { key: "top", label: "Top" },
  { key: "bottom", label: "Bottom" },
  { key: "dress", label: "Dress" },
  { key: "outerwear", label: "Outerwear" },
];

const ERROR_COPY: Record<string, string> = {
  missing_fields: "Please add at least one garment and complete all fields.",
  measurements_out_of_range: "Height must be 140–220cm and weight 40–180kg.",
  selfie_too_large: "Your selfie is too large. Try one under 10MB.",
  selfie_invalid_format: "Please upload a JPEG, PNG, or WEBP image.",
  selfie_too_small: "Selfie resolution is too small. Use at least 400×400.",
  garment_unavailable: "We couldn't load a garment image. Try again.",
  service_unavailable: "The try-on service is temporarily unavailable.",
  rate_limited: "We're at capacity. Please try again in a minute.",
  generation_failed: "Generation failed. Please try a different selfie.",
  network: "Network error. Check your connection and try again.",
};

export function OutfitBuilder({ products }: OutfitBuilderProps) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("top");
  const [selected, setSelected] = useState<Partial<Record<ProductCategory, Product>>>({});
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [selfie, setSelfie] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const byCategory = (cat: ProductCategory) =>
    products.filter((p) => p.category === cat);

  const selectedList = CATEGORIES.map((c) => selected[c.key]).filter(Boolean) as Product[];
  const canGenerate = !!height && !!weight && !!selfie && selectedList.length > 0 && !loading;

  const toggle = (cat: ProductCategory, product: Product) => {
    setSelected((prev) => ({
      ...prev,
      [cat]: prev[cat]?.id === product.id ? undefined : product,
    }));
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true);
    setErrorKey(null);
    setResultUrl(null);

    const fd = new FormData();
    fd.append("height", height);
    fd.append("weight", weight);
    fd.append("selfie", selfie!);

    selectedList.forEach((p, i) => {
      fd.append(`garment_${i}_url`, p.images[0]);
      fd.append(`garment_${i}_desc`, `${p.name} (${p.material}) — ${p.description}`);
      fd.append(`garment_${i}_type`, p.category);
    });

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 60_000);

    try {
      const res = await fetch("/api/outfit", {
        method: "POST",
        body: fd,
        signal: controller.signal,
      });
      clearTimeout(t);
      const data = await res.json();
      if (!res.ok) {
        setErrorKey(data.error || "generation_failed");
      } else {
        setResultUrl(data.image);
      }
    } catch {
      setErrorKey("network");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResultUrl(null);
    setErrorKey(null);
  };

  if (loading) {
    return (
      <div className="py-12">
        <TryOnLoading />
      </div>
    );
  }

  if (resultUrl) {
    return (
      <div className="py-8">
        <div className="max-w-md mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resultUrl} alt="Your outfit preview" className="w-full bg-mist" />
        </div>
        <div className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <a
            href={resultUrl}
            download="213-outfit.png"
            className="flex-1 inline-flex items-center justify-center bg-ink text-sand uppercase tracking-wider-2 text-xs px-7 py-4 hover:bg-sea transition-colors"
          >
            Download
          </a>
          <button
            onClick={reset}
            className="flex-1 inline-flex items-center justify-center bg-transparent text-ink border border-ink uppercase tracking-wider-2 text-xs px-7 py-4 hover:bg-ink hover:text-sand transition-colors"
          >
            Try Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* LEFT — garment selector */}
      <div>
        <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-5">
          Step 1 — Build your outfit
        </p>

        {/* Category tabs */}
        <div className="flex gap-0 border-b border-ink/20 mb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={`px-4 py-2 text-xs uppercase tracking-wider-2 border-b-2 transition-colors -mb-px ${
                activeCategory === c.key
                  ? "border-ink text-ink"
                  : "border-transparent text-ink/40 hover:text-ink/70"
              }`}
            >
              {c.label}
              {selected[c.key] && (
                <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-terracotta align-middle" />
              )}
            </button>
          ))}
        </div>

        {/* Product grid for active category */}
        <div className="grid grid-cols-2 gap-4">
          {byCategory(activeCategory).map((p) => {
            const isSelected = selected[activeCategory]?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => toggle(activeCategory, p)}
                className={`text-left border transition-colors ${
                  isSelected ? "border-ink" : "border-ink/20 hover:border-ink/50"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full aspect-[3/4] object-cover bg-mist"
                />
                <div className="p-2">
                  <p className="text-xs font-medium leading-tight">{p.name}</p>
                  <p className="text-[10px] text-ink/50 mt-0.5">€{p.price}</p>
                </div>
                {isSelected && (
                  <div className="px-2 pb-2">
                    <span className="text-[10px] uppercase tracking-wider-2 text-terracotta">
                      Selected
                    </span>
                  </div>
                )}
              </button>
            );
          })}
          {byCategory(activeCategory).length === 0 && (
            <p className="col-span-2 text-sm text-ink/40 py-6">
              No {activeCategory}s in this collection.
            </p>
          )}
        </div>
      </div>

      {/* RIGHT — selfie + measurements + outfit summary */}
      <div className="space-y-10">
        <div>
          <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-3">
            Step 2 — Selfie
          </p>
          <SelfieUploader file={selfie} onChange={setSelfie} />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-3">
            Step 3 — Your measurements
          </p>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-ink/60">Height (cm)</span>
              <input
                type="number"
                inputMode="numeric"
                min={140}
                max={220}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="170"
                className="mt-1 w-full bg-transparent border-b border-ink/30 focus:border-ink py-2 text-base outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs text-ink/60">Weight (kg)</span>
              <input
                type="number"
                inputMode="numeric"
                min={40}
                max={180}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="65"
                className="mt-1 w-full bg-transparent border-b border-ink/30 focus:border-ink py-2 text-base outline-none"
              />
            </label>
          </div>
          <p className="text-[10px] text-ink/50 mt-3">
            Used only to estimate proportions. Nothing is stored.
          </p>
        </div>

        {/* Selected outfit summary */}
        <div>
          <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-3">
            Step 4 — Your outfit
          </p>
          {selectedList.length === 0 ? (
            <p className="text-sm text-ink/40 border border-dashed border-ink/20 p-4">
              No pieces selected yet. Pick items from the left panel.
            </p>
          ) : (
            <div className="space-y-2">
              {selectedList.map((p) => (
                <div key={p.id} className="flex items-center gap-3 border border-mist p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-10 h-14 object-cover bg-mist flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-tight truncate">{p.name}</p>
                    <p className="text-[10px] text-ink/50 capitalize">{p.category}</p>
                  </div>
                  <button
                    onClick={() => toggle(p.category, p)}
                    className="text-[10px] uppercase tracking-wider-2 text-ink/40 hover:text-terracotta flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {errorKey && (
          <div className="bg-terracotta/10 border border-terracotta px-4 py-3 text-sm text-ink">
            {ERROR_COPY[errorKey] ?? ERROR_COPY.generation_failed}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="w-full inline-flex items-center justify-center bg-terracotta text-sand uppercase tracking-wider-2 text-xs px-7 py-4 hover:brightness-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {canGenerate ? "Generate Outfit Preview" : "Complete all steps"}
        </button>
      </div>
    </div>
  );
}
