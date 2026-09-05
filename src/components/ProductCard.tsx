import Image from "next/image";
import Link from "next/link";
import { formatPrice, reviewCount } from "@/lib/format";
import { getTrustBadge, TRUST_ICON_PATHS } from "@/lib/trust-badges";

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
  const trustBadge = getTrustBadge(product.category);
  const reviews = reviewCount(product.rating);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream-dark shadow-soft transition duration-300 group-hover:-translate-y-1 group-hover:shadow-soft-lg">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium tracking-wide text-ink shadow-soft">
            {product.badge}
          </span>
        )}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center rounded-full bg-ink/90 py-2 text-center text-xs font-medium tracking-wide text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Zobacz produkt
        </div>
      </div>
      <div className="mt-3">
        <span className="text-xs uppercase tracking-wide text-ink-soft">
          {product.category}
        </span>
        <h3 className="mt-1 font-serif-display text-base text-ink transition group-hover:text-rose-dark">
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-sm font-medium text-ink">{formatPrice(product.priceCents)}</span>
          <span className="flex items-center gap-1 text-xs text-ink-soft">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" className="text-gold">
              <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6L1.3 7.7l6.1-.6L10 1.5Z" />
            </svg>
            {product.rating.toFixed(1)}
            <span className="text-ink-soft/70">({reviews})</span>
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-soft">
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-rose">
            <path d={TRUST_ICON_PATHS[trustBadge.icon]} />
          </svg>
          {trustBadge.label}
        </div>
      </div>
    </Link>
  );
}
