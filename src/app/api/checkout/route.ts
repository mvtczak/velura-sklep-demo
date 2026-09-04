import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, stripeConfigured } from "@/lib/stripe";

const SHIPPING_CENTS = 1500;
const FREE_SHIPPING_THRESHOLD = 20000;

type IncomingItem = { productId: string; quantity: number };
type Customer = {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      items: IncomingItem[];
      customer: Customer;
    };

    if (!body.items?.length) {
      return NextResponse.json({ error: "Koszyk jest pusty." }, { status: 400 });
    }
    const { customer } = body;
    if (
      !customer?.name ||
      !customer?.email ||
      !customer?.address ||
      !customer?.city ||
      !customer?.postalCode
    ) {
      return NextResponse.json({ error: "Brak danych do wysyłki." }, { status: 400 });
    }

    // Always price from the database - never trust client-sent prices.
    const productIds = body.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Jeden z produktów jest niedostępny." },
        { status: 400 }
      );
    }

    const lineItems = body.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return { product, quantity: Math.max(1, Math.min(item.quantity, 20)) };
    });

    const subtotal = lineItems.reduce(
      (sum, li) => sum + li.product.priceCents * li.quantity,
      0
    );
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CENTS;
    const total = subtotal + shipping;

    const order = await prisma.order.create({
      data: {
        email: customer.email,
        name: customer.name,
        address: customer.address,
        city: customer.city,
        postalCode: customer.postalCode,
        totalCents: total,
        status: stripeConfigured ? "pending" : "paid",
        items: {
          create: lineItems.map((li) => ({
            productId: li.product.id,
            quantity: li.quantity,
            priceCents: li.product.priceCents,
          })),
        },
      },
    });

    const origin = req.nextUrl.origin;

    if (!stripeConfigured || !stripe) {
      // Demo fallback: no Stripe keys configured, simulate a completed order.
      return NextResponse.json({ url: `${origin}/checkout/success?order_id=${order.id}` });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customer.email,
      line_items: [
        ...lineItems.map((li) => ({
          price_data: {
            currency: "pln",
            product_data: { name: li.product.name, images: [li.product.image] },
            unit_amount: li.product.priceCents,
          },
          quantity: li.quantity,
        })),
        ...(shipping > 0
          ? [
              {
                price_data: {
                  currency: "pln",
                  product_data: { name: "Dostawa" },
                  unit_amount: shipping,
                },
                quantity: 1,
              },
            ]
          : []),
      ],
      metadata: { orderId: order.id },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSession: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas tworzenia zamówienia." },
      { status: 500 }
    );
  }
}

