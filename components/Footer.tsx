import Link from "next/link";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/try-on", label: "Try On" },
  { href: "/outfit-builder", label: "Outfit" },
];

export function Footer() {
  return (
    <footer className="border-t border-mist mt-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <p className="text-xs uppercase tracking-wider-2 text-ink/70">
          213 © 2026 — Méditerranée
        </p>
        <nav className="flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs uppercase tracking-wider-2 text-ink/70 hover:text-ink transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
