"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cartTotal, useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const total = cartTotal(items);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-ink/30 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-serif-display text-lg text-ink">Twój koszyk</h2>
          <button onClick={close} className="text-ink-soft hover:text-ink" aria-label="Zamknij">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-sm text-ink-soft">
              Twój koszyk jest pusty.
            </p>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium text-ink">{item.name}</span>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-ink-soft hover:text-rose"
                      >
                        Usuń
                      </button>
                    </div>
                    <span className="mt-1 text-sm text-ink-soft">{formatPrice(item.priceCents)}</span>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        className="h-7 w-7 rounded-full border border-line text-sm hover:border-rose"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        className="h-7 w-7 rounded-full border border-line text-sm hover:border-rose"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-line px-6 py-5">
          <div className="flex items-center justify-between text-sm text-ink-soft">
            <span>Suma częściowa</span>
            <span className="text-base font-medium text-ink">{formatPrice(total)}</span>
          </div>
          <p className="mt-1 text-xs text-ink-soft">Koszty dostawy obliczone przy płatności.</p>
          <Link
            href="/cart"
            onClick={close}
            className={`mt-4 block w-full rounded-full bg-ink px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-rose-dark ${
              items.length === 0 ? "pointer-events-none opacity-40" : ""
            }`}
          >
            Przejdź do koszyka
          </Link>
        </div>
      </aside>
    </>
  );
}
