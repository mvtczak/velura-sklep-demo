import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-serif-display text-3xl text-ink">Płatność anulowana</h1>
      <p className="mt-3 text-ink-soft">
        Twoje zamówienie nie zostało opłacone. Produkty nadal czekają w koszyku.
      </p>
      <Link
        href="/cart"
        className="mt-8 inline-block rounded-full bg-ink px-8 py-3 text-sm font-medium text-white hover:bg-rose-dark"
      >
        Wróć do koszyka
      </Link>
    </div>
  );
}
