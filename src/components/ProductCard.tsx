import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

export type ProductCardData = {
  slug: string;
  name: string;
  category: string;
  priceCents: number;
  image: string;
  badge?: string | null;
  rating: number;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream-dark">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium tracking-wide text-ink">
            {product.badge}
          </span>
        )}
      </div>
      <div className="mt-3">
        <span className="text-xs uppercase tracking-wide text-ink-soft">
          {product.category}
        </span>
        <h3 className="mt-1 font-serif-display text-base text-ink">{product.name}</h3>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm text-ink">{formatPrice(product.priceCents)}</span>
          <span className="text-xs text-ink-soft">★ {product.rating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
