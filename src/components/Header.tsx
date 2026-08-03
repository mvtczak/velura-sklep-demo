"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartCount, useCartStore } from "@/lib/cart-store";

export default function Header() {
  const items = useCartStore((s) => s.items);
  const toggle = useCartStore((s) => s.toggle);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const count = mounted ? cartCount(items) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif-display text-2xl tracking-[0.15em] text-ink">
          VELURA
        </Link>

        <nav className="hidden items-center gap-8 text-sm tracking-wide text-ink-soft md:flex">
          <Link href="/shop" className="transition hover:text-ink">
            Wszystkie produkty
          </Link>
          <Link href="/shop?category=Pielęgnacja twarzy" className="transition hover:text-ink">
            Pielęgnacja
          </Link>
          <Link href="/shop?category=Makijaż" className="transition hover:text-ink">
            Makijaż
          </Link>
          <Link href="/shop?category=Perfumy" className="transition hover:text-ink">
            Perfumy
          </Link>
        </nav>

        <button
          onClick={toggle}
          className="relative flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm text-ink transition hover:border-rose"
          aria-label="Otwórz koszyk"
        >
          Koszyk
          {count > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1 text-xs font-medium text-white">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
