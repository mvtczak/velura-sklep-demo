"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { BUNDLE_DISCOUNT_PERCENT, BUNDLE_SIZE } from "@/lib/bundle";
import { useCartStore } from "@/lib/cart-store";

export type BundleProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  priceCents: number;
  image: string;
  rating: number;
};

export default function BundleBuilder({ products }: { products: BundleProduct[] }) {
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  const [slotCategory, setSlotCategory] = useState<string[]>(
    Array.from({ length: BUNDLE_SIZE }, (_, i) => categories[i] ?? categories[0] ?? "")
  );
  const [slotProductId, setSlotProductId] = useState<(string | null)[]>(
    Array.from({ length: BUNDLE_SIZE }, () => null)
  );
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const open = useCartStore((s) => s.open);

  function selectCategory(slot: number, category: string) {
    setSlotCategory((prev) => prev.map((c, i) => (i === slot ? category : c)));
    setSlotProductId((prev) => prev.map((id, i) => (i === slot ? null : id)));
    setAdded(false);
  }

  function selectProduct(slot: number, id: string) {
    setSlotProductId((prev) => prev.map((v, i) => (i === slot ? id : v)));
    setAdded(false);
  }

  const selectedProducts = slotProductId.map(
    (id) => products.find((p) => p.id === id) ?? null
  );
  const allSelected = selectedProducts.every((p): p is BundleProduct => Boolean(p));
  const categoriesDistinct = new Set(slotCategory).size === BUNDLE_SIZE;
  const complete = allSelected && categoriesDistinct;

  const subtotal = allSelected
    ? selectedProducts.reduce((sum, p) => sum + (p as BundleProduct).priceCents, 0)
    : 0;
  const discount = complete ? Math.round((subtotal * BUNDLE_DISCOUNT_PERCENT) / 100) : 0;
  const finalTotal = subtotal - discount;

  function handleAdd() {
    if (!complete) return;
    const bundleId = `bundle-${Date.now()}`;
    for (const p of selectedProducts as BundleProduct[]) {
      addItem(
        { productId: p.id, slug: p.slug, name: p.name, image: p.image, priceCents: p.priceCents, bundleId },
        1
      );
    }
    setAdded(true);
    open();
  }

  return (
    <div className="space-y-6">
      {Array.from({ length: BUNDLE_SIZE }).map((_, slot) => {
        const category = slotCategory[slot];
        const duplicate =
          category && slotCategory.filter((c) => c === category).length > 1;
        const options = products.filter((p) => p.category === category);
        const selectedId = slotProductId[slot];

        return (
          <div key={slot} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-medium text-cream">
                {slot + 1}
              </span>
              <h3 className="font-serif-display text-base text-ink">Produkt {slot + 1}</h3>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => selectCategory(slot, c)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
                    category === c
                      ? "border-ink bg-ink text-white"
                      : "border-line text-ink-soft hover:border-rose"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            {duplicate && (
              <p className="mt-2 text-xs text-rose-dark">
                Ta kategoria jest już wybrana w innym slocie — wybierz 3 różne kategorie.
              </p>
            )}

            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {options.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectProduct(slot, p.id)}
                  className={`overflow-hidden rounded-xl border text-left transition ${
                    selectedId === p.id
                      ? "border-rose shadow-soft"
                      : "border-line hover:border-rose/60"
                  }`}
                >
                  <div className="relative aspect-square bg-cream-dark">
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="120px" />
                  </div>
                  <div className="p-2">
                    <p className="line-clamp-2 text-[11px] leading-tight text-ink">{p.name}</p>
                    <p className="mt-1 text-[11px] font-medium text-ink-soft">{formatPrice(p.priceCents)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {allSelected && !categoriesDistinct && (
        <p className="text-sm text-rose-dark">
          Wybierz produkty z {BUNDLE_SIZE} różnych kategorii, aby otrzymać rabat.
        </p>
      )}

      {complete && (
        <div className="rounded-2xl border border-rose/30 bg-rose/5 p-5 sm:p-6">
          <div className="flex justify-between text-sm text-ink-soft">
            <span>Suma</span>
            <span className="text-ink line-through decoration-ink-soft/60">{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-1.5 flex justify-between text-sm text-rose-dark">
            <span>Rabat zestawu (-{BUNDLE_DISCOUNT_PERCENT}%)</span>
            <span>−{formatPrice(discount)}</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-line pt-3 text-base font-medium text-ink">
            <span>Razem</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>
          <button
            onClick={handleAdd}
            className="mt-4 w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-rose-dark"
          >
            {added ? "Dodano do koszyka ✓" : "Dodaj zestaw do koszyka"}
          </button>
        </div>
      )}
    </div>
  );
}
