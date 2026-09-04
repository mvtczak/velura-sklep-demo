import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-cream-dark">
      <div className="hairline-gold h-px w-full opacity-60" />
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="font-serif-display text-xl tracking-[0.15em] text-ink">
              VELURA
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
              Kosmetyki premium do pielęgnacji, makijażu i codziennego rytuału
              piękna. Testowane dermatologicznie, bez okrucieństwa.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-rose hover:text-rose"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-rose hover:text-rose"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M15 8h2V5h-2a4 4 0 0 0-4 4v2H9v3h2v6h3v-6h2.2l.8-3H14V9a1 1 0 0 1 1-1Z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Pinterest"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-rose hover:text-rose"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9.5 17c1-3.5 1.5-5.5 1.5-5.5m0 0c.3-1.4 2.6-1.9 3.4-.4.7 1.3-.2 4.9-2 4.9-1 0-1.5-.7-1.4-1.7Z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-ink">Sklep</h4>
            <ul className="mt-3 space-y-2.5 text-sm text-ink-soft">
              <li><Link href="/shop" className="transition hover:text-rose-dark">Wszystkie produkty</Link></li>
              <li><Link href="/shop?category=Pielęgnacja twarzy" className="transition hover:text-rose-dark">Pielęgnacja twarzy</Link></li>
              <li><Link href="/shop?category=Makijaż" className="transition hover:text-rose-dark">Makijaż</Link></li>
              <li><Link href="/shop?category=Perfumy" className="transition hover:text-rose-dark">Perfumy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-ink">Obsługa klienta</h4>
            <ul className="mt-3 space-y-2.5 text-sm text-ink-soft">
              <li>Dostawa i zwroty</li>
              <li>Płatności: karta, BLIK</li>
              <li>Darmowa dostawa od 200 zł</li>
              <li>kontakt@velura-demo.pl</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-ink">O projekcie</h4>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              VELURA to projekt demonstracyjny portfolio - w pełni działający
              sklep na Next.js, Prisma i Stripe (tryb testowy).
            </p>
            <a
              href="https://www.dotczak.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-rose transition hover:text-rose-dark"
            >
              Zbudowane przez dotczak.pl <span>→</span>
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-ink-soft md:flex-row">
          <span>© {new Date().getFullYear()} VELURA. Projekt demonstracyjny - brak realnej sprzedaży.</span>
          <span>Płatności testowe obsługiwane przez Stripe.</span>
        </div>
      </div>
    </footer>
  );
}
