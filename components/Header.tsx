"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { selectCartCount, useCartStore } from "@/stores/cart";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/try-on", label: "Try On" },
  { href: "/outfit-builder", label: "Outfit" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartStore(selectCartCount);
  const openCart = useCartStore((s) => s.open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-sand/90 backdrop-blur-sm border-b border-mist" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          aria-label="213 home"
          className="font-display text-2xl tracking-wider-2 text-ink"
        >
          213
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs uppercase tracking-wider-2 text-ink hover:text-terracotta transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={openCart}
          aria-label="Open cart"
          className="relative text-xs uppercase tracking-wider-2 text-ink hover:text-terracotta transition-colors"
        >
          Panier
          <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] bg-ink text-sand rounded-full">
            {cartCount}
          </span>
        </button>
      </div>
    </header>
  );
}
