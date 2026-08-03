import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { formatPrice } from "@/lib/format";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; order_id?: string }>;
}) {
  const { session_id, order_id } = await searchParams;

  let order = null;

  if (session_id && stripeConfigured && stripe) {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    order = await prisma.order.findUnique({
      where: { stripeSession: session_id },
      include: { items: { include: { product: true } } },
    });

    if (order && session.payment_status === "paid" && order.status !== "paid") {
      order = await prisma.order.update({
        where: { id: order.id },
        data: { status: "paid" },
        include: { items: { include: { product: true } } },
      });
    }
  } else if (order_id) {
    order = await prisma.order.findUnique({
      where: { id: order_id },
      include: { items: { include: { product: true } } },
    });
  }

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose/10 text-2xl text-rose">
        ✓
      </div>
      <h1 className="mt-6 font-serif-display text-3xl text-ink">Dziękujemy za zamówienie</h1>
      <p className="mt-3 text-ink-soft">
        Potwierdzenie zostało wysłane na adres <strong>{order.email}</strong>.
        Numer zamówienia: <strong>{order.id.slice(-8).toUpperCase()}</strong>
      </p>

      <div className="mt-10 rounded-2xl border border-line bg-white p-6 text-left">
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span className="text-ink">
                {item.product.name} × {item.quantity}
              </span>
              <span className="text-ink-soft">{formatPrice(item.priceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-4 text-base font-medium text-ink">
          <span>Razem</span>
          <span>{formatPrice(order.totalCents)}</span>
        </div>
      </div>

      <p className="mt-6 text-xs text-ink-soft">
        To zamówienie testowe — nie zostały pobrane żadne realne środki.
      </p>

      <Link
        href="/shop"
        className="mt-8 inline-block rounded-full bg-ink px-8 py-3 text-sm font-medium text-white hover:bg-rose-dark"
      >
        Wróć do sklepu
      </Link>
    </div>
  );
}
