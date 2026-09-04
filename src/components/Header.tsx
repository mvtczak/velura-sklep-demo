"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cartCount, useCartStore } from "@/lib/cart-store";

const navLinks = [
  { href: "/shop", label: "Wszystkie produkty" },
  { href: "/shop?category=Pielęgnacja twarzy", label: "Pielęgnacja" },
  { href: "/shop?category=Makijaż", label: "Makijaż" },
  { href: "/shop?category=Perfumy", label: "Perfumy" },
  { href: "/shop?category=Włosy", label: "Włosy" },
];

export default function Header() {
  const items = useCartStore((s) => s.items);
  const toggle = useCartStore((s) => s.toggle);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, []);

  const count = mounted ? cartCount(items) : 0;

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
    setSearchOpen(false);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center text-ink md:hidden"
          aria-label="Otwórz menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2.5 5h15M2.5 10h15M2.5 15h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <Link href="/" className="font-serif-display text-xl tracking-[0.15em] text-ink transition hover:text-rose-dark sm:text-2xl">
          VELURA
        </Link>

        <nav className="hidden items-center gap-7 text-sm tracking-wide text-ink-soft md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="group relative whitespace-nowrap py-1 transition hover:text-ink"
            >
              {l.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-rose transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <form onSubmit={submitSearch} className="relative hidden md:block">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj produktów…"
              aria-label="Szukaj produktów"
              className="w-48 rounded-full border border-line bg-white px-4 py-2 text-sm outline-none transition focus:w-64 focus:border-rose lg:w-56 lg:focus:w-72"
            />
          </form>

          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center text-ink md:hidden"
            aria-label="Szukaj"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16 16l-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <button
            onClick={toggle}
            className="relative flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-sm text-ink shadow-soft transition hover:-translate-y-0.5 hover:border-rose hover:shadow-soft-lg sm:px-4"
            aria-label="Otwórz koszyk"
          >
            <span className="hidden sm:inline">Koszyk</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="sm:hidden">
              <path d="M4 6h10l-1 8H5L4 6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M6.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1 text-xs font-medium text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-line px-4 py-3 md:hidden">
          <form onSubmit={submitSearch}>
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj produktów…"
              aria-label="Szukaj produktów"
              className="w-full rounded-full border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-rose"
            />
          </form>
        </div>
      )}

      {menuOpen && (
        <nav className="flex flex-col border-t border-line px-4 py-2 text-sm text-ink-soft md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-line/60 py-3 transition hover:text-ink last:border-0"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
