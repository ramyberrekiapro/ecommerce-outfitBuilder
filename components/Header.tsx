"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { selectCartCount, useCartStore } from "@/stores/cart";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/try-on", label: "Try On" },
  { href: "/outfit-builder", label: "Outfit Builder" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartStore(selectCartCount);
  const openCart = useCartStore((s) => s.open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
          scrolled || mobileOpen ? "bg-sand/95 backdrop-blur-sm border-b border-mist" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <Link
            href="/"
            aria-label="213 home"
            className="font-display text-2xl tracking-wider-2 text-ink"
            onClick={() => setMobileOpen(false)}
          >
            213
          </Link>

          {/* Desktop nav */}
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

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={openCart}
              aria-label="Open cart"
              className="text-xs uppercase tracking-wider-2 text-ink hover:text-terracotta transition-colors"
            >
              Panier
              <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] bg-ink text-sand rounded-full">
                {cartCount}
              </span>
            </button>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center w-6 h-6 gap-1.5"
            >
              <span className={`block w-5 h-px bg-ink transition-transform duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-px bg-ink transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-px bg-ink transition-transform duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <div
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-30 bg-sand flex flex-col pt-16 transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col px-8 pt-12 gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="font-display text-4xl tracking-wider-2 text-ink hover:text-terracotta transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
