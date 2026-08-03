import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

const categories = [
  "Pielęgnacja twarzy",
  "Makijaż",
  "Perfumy",
  "Włosy",
  "Ciało",
  "Zestawy",
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const products = await prisma.product.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <span className="text-xs uppercase tracking-[0.3em] text-rose">Sklep</span>
        <h1 className="mt-2 font-serif-display text-3xl text-ink">
          {category ?? "Wszystkie produkty"}
        </h1>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/shop"
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            !category
              ? "border-ink bg-ink text-white"
              : "border-line text-ink-soft hover:border-rose"
          }`}
        >
          Wszystkie
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            href={`/shop?category=${encodeURIComponent(c)}`}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              category === c
                ? "border-ink bg-ink text-white"
                : "border-line text-ink-soft hover:border-rose"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-sm text-ink-soft">
          Brak produktów w tej kategorii.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
