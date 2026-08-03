import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { category: product.category, slug: { not: slug } },
    take: 4,
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-cream-dark">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink">
              {product.badge}
            </span>
          )}
        </div>

        <div>
          <span className="text-xs uppercase tracking-wide text-ink-soft">
            {product.category}
          </span>
          <h1 className="mt-2 font-serif-display text-3xl text-ink">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xl text-ink">{formatPrice(product.priceCents)}</span>
            <span className="text-sm text-ink-soft">★ {product.rating.toFixed(1)} · dostępne</span>
          </div>
          <p className="mt-6 max-w-md text-ink-soft">{product.description}</p>

          <div className="mt-8">
            <AddToCartButton
              productId={product.id}
              slug={product.slug}
              name={product.name}
              image={product.image}
              priceCents={product.priceCents}
            />
          </div>

          <dl className="mt-10 space-y-3 border-t border-line pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Dostawa</dt>
              <dd className="text-ink">1–2 dni robocze, kurier</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Zwroty</dt>
              <dd className="text-ink">30 dni na zwrot</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Płatność</dt>
              <dd className="text-ink">Karta, BLIK (Stripe)</dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif-display text-2xl text-ink">Może Cię zainteresować</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
