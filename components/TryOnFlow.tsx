"use client";

import { useState } from "react";
import Link from "next/link";
import { SelfieUploader } from "@/components/SelfieUploader";
import { TryOnLoading } from "@/components/TryOnLoading";
import type { Product } from "@/lib/types";

interface TryOnFlowProps {
  products: Product[];
  initialProductId?: string;
}

const ERROR_COPY: Record<string, string> = {
  missing_fields: "Please complete all steps before generating.",
  measurements_out_of_range:
    "Height must be 140–220cm and weight 40–180kg.",
  selfie_too_large: "Your selfie is too large. Try one under 10MB.",
  selfie_invalid_format: "Please upload a JPEG, PNG, or WEBP image.",
  selfie_too_small: "Selfie resolution is too small. Use at least 400×400.",
  garment_unavailable:
    "We couldn't load the garment image. Try again in a moment.",
  service_unavailable:
    "The try-on service is temporarily unavailable. Please try again later.",
  rate_limited: "We're at capacity. Please try again in a minute.",
  generation_failed: "Generation failed. Please try a different selfie.",
  network: "Network error. Check your connection and try again.",
};

export function TryOnFlow({ products, initialProductId }: TryOnFlowProps) {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [selfie, setSelfie] = useState<File | null>(null);
  const [productId, setProductId] = useState<string>(
    initialProductId && products.some((p) => p.id === initialProductId)
      ? initialProductId
      : "",
  );
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const product = products.find((p) => p.id === productId);

  const canGenerate =
    !!height && !!weight && !!selfie && !!product && !loading;

  const handleGenerate = async () => {
    if (!canGenerate || !product) return;
    setLoading(true);
    setErrorKey(null);
    setResultUrl(null);

    const fd = new FormData();
    fd.append("height", height);
    fd.append("weight", weight);
    fd.append("selfie", selfie!);
    fd.append("garmentImageUrl", product.images[0]);
    fd.append(
      "garmentDescription",
      `${product.name} (${product.material}) — ${product.description}`,
    );

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 60_000);

    try {
      const res = await fetch("/api/try-on", {
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
          <img
            src={resultUrl}
            alt={`You wearing ${product?.name}`}
            className="w-full bg-mist"
          />
        </div>
        <div className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <a
            href={resultUrl}
            download={`213-tryon-${product?.id}.png`}
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
          {product && (
            <Link
              href={`/shop/${product.id}`}
              className="flex-1 inline-flex items-center justify-center bg-terracotta text-sand uppercase tracking-wider-2 text-xs px-7 py-4 hover:brightness-95 transition"
            >
              View Piece
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* LEFT — selfie */}
      <div>
        <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-3">
          Step 1 — Selfie
        </p>
        <SelfieUploader file={selfie} onChange={setSelfie} />
      </div>

      {/* RIGHT — measurements + garment */}
      <div className="space-y-10">
        <div>
          <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-3">
            Step 2 — Your measurements
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
          <p className="text-[10px] text-ink/50 mt-3 leading-relaxed">
            Used only to estimate body proportions for this generation.
            Nothing is stored.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-3">
            Step 3 — Choose a garment
          </p>
          {product ? (
            <div className="flex items-center gap-4 border border-mist p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-16 h-20 object-cover bg-mist"
              />
              <div className="flex-1">
                <p className="font-display text-lg leading-tight">
                  {product.name}
                </p>
                <p className="text-xs text-ink/60">€{product.price}</p>
              </div>
              <button
                onClick={() => setProductId("")}
                className="text-[10px] uppercase tracking-wider-2 text-ink/60 hover:text-terracotta"
              >
                Change
              </button>
            </div>
          ) : (
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full bg-transparent border border-ink/30 focus:border-ink p-3 text-sm outline-none"
            >
              <option value="">— Select a piece —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — €{p.price}
                </option>
              ))}
            </select>
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
          {canGenerate ? "Generate Try-On" : "Complete all steps"}
        </button>
      </div>
    </div>
  );
}
