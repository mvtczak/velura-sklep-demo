"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  priceCents: number;
  image: string;
  badge: string | null;
  rating: number;
  originalPriceCents?: number;
  isNew?: boolean;
};

const categories = ["Pielęgnacja twarzy", "Makijaż", "Perfumy", "Włosy", "Ciało", "Zestawy"];
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop";

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "produkt"
  );
}

export default function ProductsManager({ initialProducts }: { initialProducts: AdminProduct[] }) {
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: categories[0],
    price: "",
    image: "",
    description: "",
  });

  function notify(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }

  function resetAll() {
    setProducts(initialProducts);
    notify("Przywrócono stan początkowy.");
  }

  function addProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;

    const priceCents = Math.round(parseFloat(form.price.replace(",", ".")) * 100);
    if (Number.isNaN(priceCents) || priceCents <= 0) return;

    const newProduct: AdminProduct = {
      id: `local-${crypto.randomUUID()}`,
      slug: `${slugify(form.name)}-${Math.random().toString(36).slice(2, 6)}`,
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim() || "Opis produktu zostanie uzupełniony wkrótce.",
      priceCents,
      image: form.image.trim() || PLACEHOLDER_IMAGE,
      badge: "Nowość",
      rating: 5.0,
      isNew: true,
    };

    setProducts((prev) => [newProduct, ...prev]);
    setForm({ name: "", category: categories[0], price: "", image: "", description: "" });
    setShowAddForm(false);
    notify(`Dodano „${newProduct.name}” (tylko lokalnie, w Twojej przeglądarce).`);
  }

  function deleteProduct(id: string, name: string) {
    if (!confirm(`Usunąć „${name}”? (to tylko podgląd — nic nie zniknie z bazy danych)`)) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    notify(`Usunięto „${name}” (tylko lokalnie).`);
  }

  function updatePrice(id: string, newPriceCents: number) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, priceCents: newPriceCents, originalPriceCents: undefined, badge: p.badge === null || p.badge?.startsWith("-") ? null : p.badge } : p))
    );
    notify("Cena zaktualizowana (tylko lokalnie).");
  }

  function setPromotion(id: string, percent: number) {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const base = p.originalPriceCents ?? p.priceCents;
        const discounted = Math.round(base * (1 - percent / 100));
        return { ...p, originalPriceCents: base, priceCents: discounted, badge: `-${percent}%` };
      })
    );
    notify(`Ustawiono promocję -${percent}% (tylko lokalnie).`);
  }

  function clearPromotion(id: string) {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id || p.originalPriceCents === undefined) return p;
        return { ...p, priceCents: p.originalPriceCents, originalPriceCents: undefined, badge: null };
      })
    );
    notify("Promocja usunięta (tylko lokalnie).");
  }

  const hasChanges = JSON.stringify(products) !== JSON.stringify(initialProducts);

  return (
    <div>
      <div className="rounded-2xl border border-rose/30 bg-rose/10 p-4 text-sm text-ink">
        <strong>Tryb demonstracyjny.</strong> Dodawanie, usuwanie, edycja cen i promocje działają w
        tej przeglądarce, ale niczego nie zapisują w bazie danych — sklep i inni odwiedzający tego
        nie zobaczą. Odśwież stronę, aby wrócić do stanu początkowego.
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-dark"
        >
          {showAddForm ? "Anuluj" : "+ Dodaj produkt"}
        </button>
        {hasChanges && (
          <button
            onClick={resetAll}
            className="rounded-full border border-line px-5 py-2.5 text-sm text-ink-soft transition hover:border-rose"
          >
            Cofnij wszystkie zmiany
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={addProduct} className="mt-4 rounded-2xl border border-line bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              placeholder="Nazwa produktu"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-rose"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-rose"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              placeholder="Cena (zł)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-rose"
            />
            <input
              placeholder="URL zdjęcia (opcjonalnie)"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-rose"
            />
            <textarea
              placeholder="Opis (opcjonalnie)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="sm:col-span-2 rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-rose"
              rows={2}
            />
          </div>
          <button
            type="submit"
            className="mt-4 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-dark"
          >
            Zapisz produkt
          </button>
        </form>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            onDelete={() => deleteProduct(product.id, product.name)}
            onUpdatePrice={(cents) => updatePrice(product.id, cents)}
            onSetPromotion={(pct) => setPromotion(product.id, pct)}
            onClearPromotion={() => clearPromotion(product.id)}
          />
        ))}
        {products.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-ink-soft">
            Brak produktów (lokalnie usunięto wszystkie — odśwież stronę, aby przywrócić).
          </p>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

function ProductRow({
  product,
  onDelete,
  onUpdatePrice,
  onSetPromotion,
  onClearPromotion,
}: {
  product: AdminProduct;
  onDelete: () => void;
  onUpdatePrice: (cents: number) => void;
  onSetPromotion: (percent: number) => void;
  onClearPromotion: () => void;
}) {
  const [editing, setEditing] = useState<"price" | "promo" | null>(null);
  const [priceInput, setPriceInput] = useState((product.priceCents / 100).toFixed(2));
  const [promoInput, setPromoInput] = useState("15");

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div className="relative aspect-[4/3] bg-cream-dark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink">
            {product.badge}
          </span>
        )}
        {product.isNew && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/90 px-2.5 py-1 text-xs font-medium text-white">
            lokalnie dodane
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs uppercase tracking-wide text-ink-soft">{product.category}</span>
        <h3 className="mt-1 font-serif-display text-base text-ink">{product.name}</h3>

        <div className="mt-2 flex items-center gap-2">
          {product.originalPriceCents !== undefined && (
            <span className="text-sm text-ink-soft line-through">
              {formatPrice(product.originalPriceCents)}
            </span>
          )}
          <span className="text-base font-medium text-ink">{formatPrice(product.priceCents)}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setEditing(editing === "price" ? null : "price")}
            className="rounded-full border border-line px-3 py-1.5 text-ink-soft transition hover:border-rose"
          >
            Edytuj cenę
          </button>
          <button
            onClick={() => setEditing(editing === "promo" ? null : "promo")}
            className="rounded-full border border-line px-3 py-1.5 text-ink-soft transition hover:border-rose"
          >
            Promocja
          </button>
          {product.originalPriceCents !== undefined && (
            <button
              onClick={onClearPromotion}
              className="rounded-full border border-line px-3 py-1.5 text-ink-soft transition hover:border-rose"
            >
              Usuń promocję
            </button>
          )}
          <button
            onClick={onDelete}
            className="ml-auto rounded-full border border-red-200 px-3 py-1.5 text-red-500 transition hover:border-red-400"
          >
            Usuń
          </button>
        </div>

        {editing === "price" && (
          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-rose"
            />
            <button
              onClick={() => {
                const cents = Math.round(parseFloat(priceInput.replace(",", ".")) * 100);
                if (!Number.isNaN(cents) && cents > 0) {
                  onUpdatePrice(cents);
                  setEditing(null);
                }
              }}
              className="shrink-0 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white hover:bg-rose-dark"
            >
              Zapisz
            </button>
          </div>
        )}

        {editing === "promo" && (
          <div className="mt-3 flex items-center gap-2">
            <div className="relative w-full">
              <input
                type="number"
                min="1"
                max="90"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 pr-8 text-sm outline-none focus:border-rose"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-soft">%</span>
            </div>
            <button
              onClick={() => {
                const pct = parseInt(promoInput, 10);
                if (!Number.isNaN(pct) && pct > 0 && pct < 100) {
                  onSetPromotion(pct);
                  setEditing(null);
                }
              }}
              className="shrink-0 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white hover:bg-rose-dark"
            >
              Ustaw
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
