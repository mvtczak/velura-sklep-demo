import Link from "next/link";

export default function AdminNav({ active }: { active: "orders" | "products" }) {
  const tabs = [
    { key: "orders", label: "Zamówienia", href: "/admin/orders" },
    { key: "products", label: "Produkty", href: "/admin/products" },
  ] as const;

  return (
    <div className="flex gap-2 border-b border-line pb-4">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            active === t.key
              ? "border-ink bg-ink text-white"
              : "border-line text-ink-soft hover:border-rose"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
