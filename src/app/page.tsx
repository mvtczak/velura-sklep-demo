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

const trust = [
  {
    title: "Darmowa dostawa",
    text: "Od 200 zł, kurier w 1–2 dni robocze.",
    icon: (
      <path d="M3 7h11v9H3V7Zm11 3h4l3 3v3h-7v-6ZM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    ),
  },
  {
    title: "Płatność BLIK i kartą",
    text: "Bezpieczne płatności obsługiwane przez Stripe.",
    icon: (
      <path d="M3 6.5h18v3H3v-3Zm0 5.5h18v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6Zm3 4h5" />
    ),
  },
  {
    title: "30 dni na zwrot",
    text: "Nie pasuje? Odeślij bez pytań.",
    icon: (
      <path d="M4 12a8 8 0 1 1 2.6 5.9M4 12V6m0 6h6" />
    ),
  },
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
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-2 md:gap-10 md:py-28">
          <div className="animate-fade-up">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <span className="text-xs uppercase tracking-[0.35em] text-rose">
                Nowa kolekcja
              </span>
            </div>
            <h1 className="mt-5 font-serif-display text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl">
              Piękno jako
              <br />
              codzienny{" "}
              <span className="font-serif-italic text-rose">rytuał.</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
              Starannie dobrane kosmetyki do pielęgnacji, makijażu i zapachu -
              testowane dermatologicznie, bez okrucieństwa wobec zwierząt.
            </p>
            <div className="mt-9 flex flex-wrap gap-3 sm:gap-4">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-rose-dark hover:shadow-soft-lg"
              >
                Odkryj kolekcję
                <span className="transition group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/shop?category=Zestawy"
                className="rounded-full border border-line px-8 py-3.5 text-sm font-medium text-ink transition hover:border-rose hover:text-rose-dark"
              >
                Zobacz zestawy
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8 border-t border-line pt-6">
              <div>
                <div className="font-serif-display text-2xl text-ink">4.9</div>
                <div className="mt-0.5 text-xs text-ink-soft">★★★★★ ocena klientek</div>
              </div>
              <div className="h-8 w-px bg-line" />
              <div>
                <div className="font-serif-display text-2xl text-ink">10&nbsp;000+</div>
                <div className="mt-0.5 text-xs text-ink-soft">zrealizowanych zamówień</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft-lg">
              <Image
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop"
                alt="Kosmetyki VELURA"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden max-w-[13rem] rounded-2xl bg-white p-4 shadow-soft-lg sm:block sm:-left-8">
              <span className="font-serif-display text-sm text-ink">
                Dermatologicznie przetestowane
              </span>
              <p className="mt-1 text-xs text-ink-soft">
                100% składników bezpiecznych dla skóry wrażliwej.
              </p>
            </div>
            <div className="pointer-events-none absolute -right-4 -top-4 -z-10 hidden aspect-[4/5] w-full rounded-[2rem] border border-gold/40 sm:block" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gold" />
          <span className="text-xs uppercase tracking-[0.35em] text-rose">Przeglądaj</span>
        </div>
        <h2 className="mt-3 font-serif-display text-2xl text-ink sm:text-3xl">Kategorie</h2>
        <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c, i) => (
            <Link
              key={c.name}
              href={`/shop?category=${encodeURIComponent(c.name)}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-soft transition duration-300 hover:shadow-soft-lg"
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-110"
                sizes="(min-width: 768px) 25vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent transition duration-300 group-hover:from-ink/85" />
              <span className="absolute right-4 top-4 font-serif-display text-xs text-white/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="font-serif-display text-lg text-white">{c.name}</span>
                <span className="mt-1 flex items-center gap-1 text-xs text-white/0 transition duration-300 group-hover:text-white/80">
                  Zobacz produkty <span className="transition group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <span className="text-xs uppercase tracking-[0.35em] text-rose">Wybrane dla Ciebie</span>
            </div>
            <h2 className="mt-3 font-serif-display text-2xl text-ink sm:text-3xl">Polecane</h2>
          </div>
          <Link href="/shop" className="group hidden items-center gap-1 text-sm text-rose hover:text-rose-dark sm:flex">
            Zobacz wszystkie <span className="transition group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <Link href="/shop" className="mt-8 flex items-center gap-1 text-sm text-rose hover:text-rose-dark sm:hidden">
          Zobacz wszystkie →
        </Link>
      </section>

      <section className="border-t border-line bg-cream-dark">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 sm:py-16 md:grid-cols-3">
          {trust.map((t) => (
            <div
              key={t.title}
              className="flex flex-col items-center gap-3 rounded-2xl bg-cream p-6 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose/10 text-rose">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  {t.icon}
                </svg>
              </span>
              <h3 className="font-serif-display text-base text-ink">{t.title}</h3>
              <p className="text-sm text-ink-soft">{t.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
