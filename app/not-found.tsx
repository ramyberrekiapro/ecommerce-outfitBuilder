import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-4">404</p>
      <h1 className="font-display text-6xl md:text-8xl tracking-wider-2 text-ink leading-[0.95] mb-6">
        Not Found
      </h1>
      <p className="text-sm text-ink/70 max-w-sm leading-relaxed mb-10">
        This page doesn&apos;t exist. Perhaps it drifted out to sea.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center bg-ink text-sand uppercase tracking-wider-2 text-xs px-7 py-4 hover:bg-sea transition-colors"
        >
          Back to Shop
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center border border-ink text-ink uppercase tracking-wider-2 text-xs px-7 py-4 hover:bg-ink hover:text-sand transition-colors"
        >
          Homepage
        </Link>
      </div>
    </div>
  );
}
