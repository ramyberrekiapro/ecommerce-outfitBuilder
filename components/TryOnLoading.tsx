"use client";

import { useEffect, useState } from "react";

const messages = [
  "Studying your selfie…",
  "Fitting the garment…",
  "Adjusting drape and light…",
  "Composing the photograph…",
  "Almost there…",
];

export function TryOnLoading() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setI((v) => (v + 1) % messages.length),
      4000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="aspect-[2/3] max-w-md mx-auto bg-mist relative overflow-hidden">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-mist via-dune/30 to-mist" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-10 h-10 border-2 border-ink border-t-transparent rounded-full animate-spin" />
        <p className="font-display text-2xl mt-6">{messages[i]}</p>
        <p className="text-xs uppercase tracking-wider-2 text-ink/60 mt-2">
          10–30 seconds
        </p>
      </div>
    </div>
  );
}
