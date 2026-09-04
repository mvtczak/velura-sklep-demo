import Link from "next/link";

export default function PromoBanner() {
  return (
    <div className="bg-ink px-4 py-2.5 text-center text-xs text-cream sm:text-sm">
      <span className="text-cream/70">To projekt demonstracyjny portfolio.</span>{" "}
      <Link href="/admin/orders" className="font-medium text-gold underline underline-offset-2 transition hover:text-rose">
        Chcesz sprawdzić panel administracyjny? Kliknij tutaj →
      </Link>
    </div>
  );
}
