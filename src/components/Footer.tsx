import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-cream-dark">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="font-serif-display text-xl tracking-[0.15em] text-ink">
              VELURA
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink-soft">
              Kosmetyki premium do pielęgnacji, makijażu i codziennego rytuału
              piękna. Testowane dermatologicznie, bez okrucieństwa.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-ink">Sklep</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li><Link href="/shop" className="hover:text-ink">Wszystkie produkty</Link></li>
              <li><Link href="/shop?category=Pielęgnacja twarzy" className="hover:text-ink">Pielęgnacja twarzy</Link></li>
              <li><Link href="/shop?category=Makijaż" className="hover:text-ink">Makijaż</Link></li>
              <li><Link href="/shop?category=Perfumy" className="hover:text-ink">Perfumy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-ink">Obsługa klienta</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li>Dostawa i zwroty</li>
              <li>Płatności: karta, BLIK</li>
              <li>Darmowa dostawa od 200 zł</li>
              <li>kontakt@velura-demo.pl</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-ink">O projekcie</h4>
            <p className="mt-3 text-sm text-ink-soft">
              VELURA to projekt demonstracyjny portfolio — w pełni działający
              sklep na Next.js, Prisma i Stripe (tryb testowy).
            </p>
            <a
              href="https://www.dotczak.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium text-rose hover:text-rose-dark"
            >
              Zbudowane przez dotczak.pl →
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-ink-soft md:flex-row">
          <span>© {new Date().getFullYear()} VELURA. Projekt demonstracyjny — brak realnej sprzedaży.</span>
          <span>Płatności testowe obsługiwane przez Stripe.</span>
        </div>
      </div>
    </footer>
  );
}
