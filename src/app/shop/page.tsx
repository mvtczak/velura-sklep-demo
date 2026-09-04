import Link from "next/link";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import ShopFilters from "@/components/ShopFilters";

export const dynamic = "force-dynamic";

const categories = [
  "Pielęgnacja twarzy",
  "Makijaż",
  "Perfumy",
  "Włosy",
  "Ciało",
  "Zestawy",
];

type SearchParams = {
  category?: string;
  q?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { category, q } = await searchParams;
  const title = q
    ? `Wyniki wyszukiwania: "${q}"`
    : category
      ? category
      : "Wszystkie produkty";
  return {
    title,
    description: `Zobacz kolekcję ${category ?? "kosmetyków premium"} VELURA - pielęgnacja, makijaż i perfumy z darmową dostawą od 200 zł.`,
    alternates: { canonical: category ? `/shop?category=${encodeURIComponent(category)}` : "/shop" },
  };
}

function getOrderBy(sort?: string): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { priceCents: "asc" };
    case "price-desc":
      return { priceCents: "desc" };
    case "rating":
      return { rating: "desc" };
    case "newest":
      return { createdAt: "desc" };
    default:
      return { createdAt: "asc" };
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category, q, sort, minPrice, maxPrice } = await searchParams;

  const where: Prisma.ProductWhereInput = {};
  if (category) where.category = category;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
    ];
  }
  if (minPrice || maxPrice) {
    where.priceCents = {
      ...(minPrice ? { gte: Math.round(parseFloat(minPrice) * 100) } : {}),
      ...(maxPrice ? { lte: Math.round(parseFloat(maxPrice) * 100) } : {}),
    };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: getOrderBy(sort),
  });

  const heading = q ? `Wyniki dla "${q}"` : (category ?? "Wszystkie produkty");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-8 sm:mb-10">
        <span className="text-xs uppercase tracking-[0.3em] text-rose">Sklep</span>
        <h1 className="mt-2 font-serif-display text-2xl text-ink sm:text-3xl">{heading}</h1>
        {q && (
          <p className="mt-1 text-sm text-ink-soft">
            Znaleziono {products.length} {products.length === 1 ? "produkt" : "produktów"}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
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

        <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
          <ShopFilters />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-sm text-ink-soft">
            {q ? `Brak wyników dla „${q}”.` : "Brak produktów spełniających kryteria."}
          </p>
          <Link href="/shop" className="mt-4 inline-block text-sm text-rose hover:text-rose-dark">
            Wyczyść filtry
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-10 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
