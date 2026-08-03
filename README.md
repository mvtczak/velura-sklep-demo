# VELURA — demo sklepu internetowego (portfolio)

W pełni działający sklep e-commerce zbudowany jako projekt portfolio: Next.js
(App Router) + TypeScript + Tailwind CSS + Prisma (SQLite) + Stripe Checkout
(tryb testowy). Katalog produktów, koszyk, dane do wysyłki, płatność online
i panel zamówień — dokładnie to, co znajduje się w ofercie "Sklep internetowy"
na dotczak.pl.

## Uruchomienie lokalne

```bash
npm install
cp .env.example .env
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Otwórz http://localhost:3000.

## Płatności Stripe (tryb testowy)

1. Załóż darmowe konto na https://dashboard.stripe.com/register (jeśli jeszcze
   go nie masz).
2. Upewnij się, że jesteś w trybie **Test mode** (przełącznik w prawym górnym
   rogu dashboardu).
3. Przejdź do *Developers → API keys* i skopiuj:
   - `Secret key` (`sk_test_...`) → wklej jako `STRIPE_SECRET_KEY` w `.env`
   - `Publishable key` (`pk_test_...`) → wklej jako
     `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` w `.env`
4. Zrestartuj `npm run dev`.

Do testowej płatności użyj karty **4242 4242 4242 4242**, dowolnej przyszłej
daty ważności i dowolnego CVC.

**Bez kluczy Stripe projekt też działa** — checkout przechodzi w trybie
symulowanym (zamówienie zapisuje się od razu jako opłacone), więc można
prezentować cały sklep bez zakładania konta Stripe.

## Panel zamówień

Dostępny pod `/admin/orders`. Jeśli w `.env` ustawisz `ADMIN_KEY`, panel
będzie wymagał dopisania `?key=TWOJ_KLUCZ` do adresu URL. To uproszczona
ochrona — do prawdziwego wdrożenia u klienta należałoby dodać pełne
logowanie (np. NextAuth).

## Struktura projektu

```
src/app/                strony (App Router)
  page.tsx               strona główna
  shop/                   katalog produktów + filtrowanie po kategorii
  product/[slug]/         strona produktu
  cart/                    koszyk + formularz dostawy + start płatności
  checkout/success|cancel  wynik płatności
  admin/orders/            panel zamówień
  api/checkout/            tworzenie zamówienia + sesji Stripe Checkout
src/components/          Header, Footer, CartDrawer, ProductCard, AddToCartButton
src/lib/                 Prisma client, Stripe client, cart store (Zustand), formatowanie cen
prisma/schema.prisma     modele Product / Order / OrderItem
prisma/seed.ts           13 przykładowych produktów kosmetycznych
```

## Deploy (Vercel)

1. Wypchnij projekt na GitHub.
2. Zaimportuj repo w Vercel.
3. Ustaw zmienne środowiskowe (`DATABASE_URL`, `STRIPE_SECRET_KEY`,
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `ADMIN_KEY`) w ustawieniach projektu.
4. Uwaga: SQLite (plik lokalny) nie nadaje się do produkcji na Vercel
   (serverless, brak trwałego dysku). Do prawdziwego wdrożenia zamień
   `datasource` w `prisma/schema.prisma` na Postgres (np. Vercel Postgres,
   Neon lub Supabase) i zaktualizuj `DATABASE_URL`.

## Zdjęcia produktów

Zdjęcia pochodzą z Unsplash (darmowa licencja) i służą wyłącznie do celów
demonstracyjnych.
