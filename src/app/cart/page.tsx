"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cartTotal, useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

const SHIPPING_CENTS = 1500;
const FREE_SHIPPING_THRESHOLD = 20000;

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const subtotal = cartTotal(items);
  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CENTS;
  const total = subtotal + shipping;

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.address || !form.city || !form.postalCode) {
      setError("Uzupełnij wszystkie pola dostawy.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer: form }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Nie udało się rozpocząć płatności.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Wystąpił błąd. Spróbuj ponownie.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h1 className="font-serif-display text-3xl text-ink">Twój koszyk jest pusty</h1>
        <p className="mt-3 text-ink-soft">Dodaj produkty, aby przejść do zamówienia.</p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-ink px-8 py-3 text-sm font-medium text-white hover:bg-rose-dark"
        >
          Przejdź do sklepu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="font-serif-display text-3xl text-ink">Koszyk i dostawa</h1>

      <div className="mt-8 grid gap-10 sm:mt-10 sm:gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="space-y-6">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-4 border-b border-line pb-6">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <span className="font-medium text-ink">{item.name}</span>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-xs text-ink-soft hover:text-rose"
                    >
                      Usuń
                    </button>
                  </div>
                  <span className="mt-1 text-sm text-ink-soft">{formatPrice(item.priceCents)} / szt.</span>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      className="h-8 w-8 rounded-full border border-line hover:border-rose"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      className="h-8 w-8 rounded-full border border-line hover:border-rose"
                    >
                      +
                    </button>
                    <span className="ml-auto text-sm font-medium text-ink">
                      {formatPrice(item.priceCents * item.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <form onSubmit={handleCheckout} className="mt-10 space-y-4">
            <h2 className="font-serif-display text-xl text-ink">Dane do wysyłki</h2>
            <div className="rounded-xl border border-amber-600/30 bg-amber-50 px-4 py-3 text-xs text-amber-800 sm:text-sm">
              To projekt demonstracyjny portfolio - nie podawaj tu prawdziwych danych osobowych. Wpisz dowolne
              przykładowe imię, adres e-mail i adres wysyłki.
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                placeholder="Imię i nazwisko"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none focus:border-rose"
              />
              <input
                placeholder="E-mail"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none focus:border-rose"
              />
              <input
                placeholder="Adres"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="sm:col-span-2 rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none focus:border-rose"
              />
              <input
                placeholder="Miasto"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none focus:border-rose"
              />
              <input
                placeholder="Kod pocztowy"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                className="rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none focus:border-rose"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-white transition hover:bg-rose-dark disabled:opacity-50"
            >
              {loading ? "Przekierowanie do płatności…" : "Przejdź do płatności"}
            </button>
          </form>
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-white p-6">
          <h2 className="font-serif-display text-lg text-ink">Podsumowanie</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Suma częściowa</span>
              <span className="text-ink">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Dostawa</span>
              <span className="text-ink">{shipping === 0 ? "Gratis" : formatPrice(shipping)}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4 text-base font-medium text-ink">
            <span>Razem</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p className="mt-4 text-xs text-ink-soft">
            Płatność testowa Stripe - użyj karty 4242 4242 4242 4242, dowolna data ważności i CVC.
          </p>
        </aside>
      </div>
    </div>
  );
}
