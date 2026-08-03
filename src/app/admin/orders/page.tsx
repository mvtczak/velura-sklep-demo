import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const adminKey = process.env.ADMIN_KEY;

  if (adminKey && key !== adminKey) {
    return (
      <div className="mx-auto max-w-md px-6 py-24">
        <h1 className="font-serif-display text-2xl text-ink">Panel zamówień</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Dostęp chroniony. Dodaj <code className="rounded bg-cream-dark px-1">?key=TWOJ_KLUCZ</code> do
          adresu URL (ustawiony w zmiennej środowiskowej <code className="rounded bg-cream-dark px-1">ADMIN_KEY</code>).
        </p>
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  const revenue = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.totalCents, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-end justify-between">
        <h1 className="font-serif-display text-3xl text-ink">Panel zamówień</h1>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide text-ink-soft">Przychód (opłacone)</div>
          <div className="font-serif-display text-2xl text-ink">{formatPrice(revenue)}</div>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-cream-dark text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Zamówienie</th>
              <th className="px-4 py-3">Klient</th>
              <th className="px-4 py-3">Produkty</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3 text-right">Suma</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-ink-soft">
                  {order.id.slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-3">
                  <div className="text-ink">{order.name}</div>
                  <div className="text-xs text-ink-soft">{order.email}</div>
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {order.items.map((i) => `${i.product.name} ×${i.quantity}`).join(", ")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      order.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.status === "paid" ? "Opłacone" : "Oczekujące"}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {new Intl.DateTimeFormat("pl-PL", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(order.createdAt)}
                </td>
                <td className="px-4 py-3 text-right font-medium text-ink">
                  {formatPrice(order.totalCents)}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-soft">
                  Brak zamówień.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
