import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

function sumRevenue(orders: { totalCents: number; status: string }[]) {
  return orders.filter((o) => o.status === "paid").reduce((sum, o) => sum + o.totalCents, 0);
}

function countPaid(orders: { status: string }[]) {
  return orders.filter((o) => o.status === "paid").length;
}

function pctChange(current: number, previous: number): string | null {
  if (previous === 0) return null;
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(0)}%`;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
      }`}
    >
      {status === "paid" ? "Opłacone" : "Oczekujące"}
    </span>
  );
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const adminKey = process.env.ADMIN_KEY;

  if (adminKey && key !== adminKey) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-24">
        <h1 className="font-serif-display text-2xl text-ink">Panel administracyjny</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Dostęp chroniony. Dodaj <code className="rounded bg-cream-dark px-1">?key=TWOJ_KLUCZ</code> do
          adresu URL (ustawiony w zmiennej środowiskowej <code className="rounded bg-cream-dark px-1">ADMIN_KEY</code>).
        </p>
      </div>
    );
  }

  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  const within = (days: number, from = 0) =>
    orders.filter((o) => {
      const age = now - o.createdAt.getTime();
      return age <= days * DAY && age > from * DAY;
    });

  const last1 = within(1);
  const prev1 = within(2, 1);
  const last7 = within(7);
  const prev7 = within(14, 7);
  const last30 = within(30);
  const prev30 = within(60, 30);

  const kpis = [
    {
      label: "Ostatnie 24h",
      revenue: sumRevenue(last1),
      count: countPaid(last1),
      change: pctChange(sumRevenue(last1), sumRevenue(prev1)),
    },
    {
      label: "Ostatnie 7 dni",
      revenue: sumRevenue(last7),
      count: countPaid(last7),
      change: pctChange(sumRevenue(last7), sumRevenue(prev7)),
    },
    {
      label: "Ostatnie 30 dni",
      revenue: sumRevenue(last30),
      count: countPaid(last30),
      change: pctChange(sumRevenue(last30), sumRevenue(prev30)),
    },
  ];

  const totalRevenue = sumRevenue(orders);

  // 14-day revenue trend
  const days = Array.from({ length: 14 }).map((_, i) => {
    const dayIndex = 13 - i;
    const dayStart = now - (dayIndex + 1) * DAY;
    const dayEnd = now - dayIndex * DAY;
    const dayOrders = orders.filter((o) => {
      const t = o.createdAt.getTime();
      return t >= dayStart && t < dayEnd && o.status === "paid";
    });
    return {
      label: new Date(dayEnd).toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" }),
      revenue: sumRevenue(dayOrders),
    };
  });
  const maxDayRevenue = Math.max(1, ...days.map((d) => d.revenue));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <AdminNav active="orders" />

      <div className="mt-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-serif-display text-2xl text-ink sm:text-3xl">Panel administracyjny</h1>
        <div className="text-left sm:text-right">
          <div className="text-xs uppercase tracking-wide text-ink-soft">Przychód łącznie (opłacone)</div>
          <div className="font-serif-display text-xl text-ink sm:text-2xl">{formatPrice(totalRevenue)}</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-line bg-white p-4 sm:p-5">
            <div className="text-xs uppercase tracking-wide text-ink-soft">{k.label}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif-display text-xl text-ink sm:text-2xl">{formatPrice(k.revenue)}</span>
              {k.change && (
                <span className={`text-xs font-medium ${k.change.startsWith("-") ? "text-red-500" : "text-emerald-600"}`}>
                  {k.change}
                </span>
              )}
            </div>
            <div className="mt-1 text-sm text-ink-soft">{k.count} zamówień</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-white p-4 sm:mt-8 sm:p-6">
        <h2 className="text-sm font-medium text-ink">Przychód dzienny — ostatnie 14 dni</h2>
        <div className="mt-5 overflow-x-auto">
          <div className="flex min-w-[480px] items-end gap-1.5 sm:min-w-0 sm:gap-2" style={{ height: 120 }}>
            {days.map((d) => (
              <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-t bg-rose/70 transition hover:bg-rose"
                  style={{ height: `${Math.max(4, (d.revenue / maxDayRevenue) * 100)}px` }}
                  title={`${d.label}: ${formatPrice(d.revenue)}`}
                />
                <span className="text-[10px] text-ink-soft sm:text-xs">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: expandable card list */}
      <div className="mt-6 rounded-2xl border border-line bg-white sm:hidden">
        {orders.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-ink-soft">Brak zamówień.</p>
        ) : (
          orders.map((order) => (
            <details key={order.id} className="group border-b border-line px-4 py-3 last:border-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                <div className="min-w-0">
                  <div className="truncate font-medium text-ink">{order.name}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusBadge status={order.status} />
                    <span className="text-xs text-ink-soft">
                      {new Intl.DateTimeFormat("pl-PL", { dateStyle: "short" }).format(order.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="font-medium text-ink">{formatPrice(order.totalCents)}</span>
                  <span className="flex items-center gap-1 text-xs text-rose">
                    Rozwiń
                    <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                      className="shrink-0 transition group-open:rotate-180"
                    >
                      <path d="M2.5 5 7 9.5 11.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </summary>

              <div className="mt-3 space-y-2.5 rounded-xl bg-cream-dark/50 p-3 text-sm">
                <div>
                  <div className="text-xs uppercase tracking-wide text-ink-soft">Zamówienie</div>
                  <div className="font-mono text-xs text-ink">{order.id.slice(-8).toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-ink-soft">Kontakt</div>
                  <div className="text-ink-soft">{order.email}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-ink-soft">Adres wysyłki</div>
                  <div className="text-ink-soft">{order.address}</div>
                  <div className="text-ink-soft">{order.postalCode} {order.city}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-ink-soft">Produkty</div>
                  <div className="text-ink-soft">
                    {order.items.map((i) => `${i.product.name} ×${i.quantity}`).join(", ")}
                  </div>
                </div>
              </div>
            </details>
          ))
        )}
      </div>

      {/* Desktop / tablet: full table */}
      <div className="mt-8 hidden overflow-x-auto rounded-2xl border border-line bg-white sm:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-cream-dark text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="whitespace-nowrap px-4 py-3">Zamówienie</th>
              <th className="whitespace-nowrap px-4 py-3">Klient</th>
              <th className="whitespace-nowrap px-4 py-3">Adres wysyłki</th>
              <th className="whitespace-nowrap px-4 py-3">Produkty</th>
              <th className="whitespace-nowrap px-4 py-3">Status</th>
              <th className="whitespace-nowrap px-4 py-3">Data</th>
              <th className="whitespace-nowrap px-4 py-3 text-right">Suma</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-line last:border-0">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink-soft">
                  {order.id.slice(-8).toUpperCase()}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="text-ink">{order.name}</div>
                  <div className="text-xs text-ink-soft">{order.email}</div>
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  <div>{order.address}</div>
                  <div className="text-xs">{order.postalCode} {order.city}</div>
                </td>
                <td className="max-w-[220px] px-4 py-3 text-ink-soft">
                  {order.items.map((i) => `${i.product.name} ×${i.quantity}`).join(", ")}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-soft">
                  {new Intl.DateTimeFormat("pl-PL", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(order.createdAt)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-ink">
                  {formatPrice(order.totalCents)}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink-soft">
                  Brak zamówień.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-ink-soft">
        Dane demonstracyjne — klienci i adresy są wygenerowane losowo do celów prezentacji.
      </p>
    </div>
  );
}
