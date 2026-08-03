"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const sortOptions = [
  { value: "featured", label: "Polecane" },
  { value: "newest", label: "Najnowsze" },
  { value: "price-asc", label: "Cena: od najniższej" },
  { value: "price-desc", label: "Cena: od najwyższej" },
  { value: "rating", label: "Najwyżej oceniane" },
];

export default function ShopFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/shop?${params.toString()}`);
  }

  function applyPrice(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    router.push(`/shop?${params.toString()}`);
    setOpen(false);
  }

  function clearPrice() {
    setMinPrice("");
    setMaxPrice("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    router.push(`/shop?${params.toString()}`);
    setOpen(false);
  }

  const hasPriceFilter = searchParams.get("minPrice") || searchParams.get("maxPrice");
  const currentSort = searchParams.get("sort") ?? "featured";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition ${
            hasPriceFilter ? "border-ink bg-ink text-white" : "border-line text-ink-soft hover:border-rose"
          }`}
        >
          Cena
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={open ? "rotate-180" : ""}>
            <path d="M1.5 3.5 5 7l3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {open && (
          <form
            onSubmit={applyPrice}
            className="absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border border-line bg-white p-4 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                placeholder="Od"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-rose"
              />
              <span className="text-ink-soft">–</span>
              <input
                type="number"
                min={0}
                placeholder="Do"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-rose"
              />
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white hover:bg-rose-dark"
              >
                Zastosuj
              </button>
              <button
                type="button"
                onClick={clearPrice}
                className="rounded-full border border-line px-4 py-2 text-xs text-ink-soft hover:border-rose"
              >
                Wyczyść
              </button>
            </div>
          </form>
        )}
      </div>

      <select
        value={currentSort}
        onChange={(e) => updateParam("sort", e.target.value === "featured" ? null : e.target.value)}
        aria-label="Sortuj"
        className="rounded-full border border-line bg-white px-4 py-1.5 text-sm text-ink-soft outline-none transition hover:border-rose focus:border-rose"
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>
            Sortuj: {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
