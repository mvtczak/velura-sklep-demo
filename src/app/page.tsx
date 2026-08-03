import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const categories = [
  { name: "Pielęgnacja twarzy", image: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=800&auto=format&fit=crop" },
  { name: "Makijaż", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop" },
  { name: "Perfumy", image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=800&auto=format&fit=crop" },
  { name: "Włosy", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop" },
];

export default async function Home() {
  const featured = await prisma.product.findMany({
    where: { badge: { not: null } },
    take: 4,
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-rose">
              Nowa kolekcja
            </span>
            <h1 className="mt-4 font-serif-display text-3xl leading-tight text-ink sm:text-4xl md:text-5xl">
              Piękno jako
              <br />
              codzienny rytuał.
            </h1>
            <p className="mt-5 max-w-md text-ink-soft">
              Starannie dobrane kosmetyki do pielęgnacji, makijażu i zapachu —
              testowane dermatologicznie, bez okrucieństwa wobec zwierząt.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
              <Link
                href="/shop"
                className="rounded-full bg-ink px-8 py-3 text-sm font-medium text-white transition hover:bg-rose-dark"
              >
                Odkryj kolekcję
              </Link>
              <Link
                href="/shop?category=Zestawy"
                className="rounded-full border border-line px-8 py-3 text-sm font-medium text-ink transition hover:border-rose"
              >
                Zobacz zestawy
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop"
              alt="Kosmetyki VELURA"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <h2 className="font-serif-display text-xl text-ink sm:text-2xl">Kategorie</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/shop?category=${encodeURIComponent(c.name)}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(min-width: 768px) 25vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 font-serif-display text-lg text-white">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex items-end justify-between">
          <h2 className="font-serif-display text-xl text-ink sm:text-2xl">Polecane</h2>
          <Link href="/shop" className="text-sm text-rose hover:text-rose-dark">
            Zobacz wszystkie →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-cream-dark">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-center sm:px-6 sm:py-14 md:grid-cols-3">
          <div>
            <h3 className="font-serif-display text-lg text-ink">Darmowa dostawa</h3>
            <p className="mt-2 text-sm text-ink-soft">Od 200 zł, kurier w 1–2 dni robocze.</p>
          </div>
          <div>
            <h3 className="font-serif-display text-lg text-ink">Płatność BLIK i kartą</h3>
            <p className="mt-2 text-sm text-ink-soft">Bezpieczne płatności obsługiwane przez Stripe.</p>
          </div>
          <div>
            <h3 className="font-serif-display text-lg text-ink">30 dni na zwrot</h3>
            <p className="mt-2 text-sm text-ink-soft">Nie pasuje? Odeślij bez pytań.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
