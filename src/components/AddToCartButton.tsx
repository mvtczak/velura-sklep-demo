"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";

export default function AddToCartButton({
  productId,
  slug,
  name,
  image,
  priceCents,
}: {
  productId: string;
  slug: string;
  name: string;
  image: string;
  priceCents: number;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center rounded-full border border-line">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="h-11 w-11 text-lg text-ink-soft hover:text-ink"
        >
          −
        </button>
        <span className="w-8 text-center text-sm">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="h-11 w-11 text-lg text-ink-soft hover:text-ink"
        >
          +
        </button>
      </div>
      <button
        onClick={() => addItem({ productId, slug, name, image, priceCents }, quantity)}
        className="flex-1 rounded-full bg-ink px-8 py-3 text-sm font-medium text-white transition hover:bg-rose-dark"
      >
        Dodaj do koszyka
      </button>
    </div>
  );
}
