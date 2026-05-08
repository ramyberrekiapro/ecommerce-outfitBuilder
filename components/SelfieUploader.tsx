"use client";

import { ChangeEvent, useRef, useState } from "react";

interface SelfieUploaderProps {
  onChange: (file: File | null) => void;
  file: File | null;
}

export function SelfieUploader({ onChange, file }: SelfieUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File | null | undefined) => {
    setError(null);
    if (!f) {
      onChange(null);
      setPreviewUrl(null);
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setError("Please upload a JPEG, PNG, or WEBP image.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");
      return;
    }
    onChange(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const onSelect = (e: ChangeEvent<HTMLInputElement>) =>
    handleFile(e.target.files?.[0]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative aspect-[3/4] max-w-sm mx-auto bg-mist border-2 border-dashed cursor-pointer transition-colors ${
          dragOver ? "border-terracotta" : "border-ink/30 hover:border-ink"
        }`}
      >
        {previewUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={previewUrl}
            alt="Selfie preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="font-display text-2xl mb-2">Upload a selfie</p>
            <p className="text-xs uppercase tracking-wider-2 text-ink/60">
              Drop here, or click to choose
            </p>
            <p className="text-xs text-ink/50 mt-6 max-w-[240px] leading-relaxed">
              Front-facing, full body, neutral pose. Good daylight. Min 400×400.
            </p>
          </div>
        )}
        {previewUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleFile(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="absolute top-3 right-3 bg-sand text-ink text-[10px] uppercase tracking-wider-2 px-3 py-1.5 hover:bg-ink hover:text-sand transition-colors"
          >
            Replace
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="user"
          className="hidden"
          onChange={onSelect}
        />
      </div>
      {error && (
        <p className="text-xs text-terracotta mt-3 text-center">{error}</p>
      )}
      {file && !error && (
        <p className="text-xs text-ink/60 mt-3 text-center">
          {file.name} · {(file.size / 1024 / 1024).toFixed(1)}MB
        </p>
      )}
    </div>
  );
}
