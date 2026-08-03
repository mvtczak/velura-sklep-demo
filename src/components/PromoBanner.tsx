import Link from "next/link";

export default function PromoBanner() {
  return (
    <div className="bg-ink px-4 py-2.5 text-center text-xs text-cream sm:text-sm">
      To projekt demonstracyjny portfolio.{" "}
      <Link href="/admin/orders" className="font-medium underline underline-offset-2 hover:text-rose">
        Chcesz sprawdzić panel administracyjny? Kliknij tutaj →
      </Link>
    </div>
  );
}
