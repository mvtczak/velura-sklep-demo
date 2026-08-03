import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/admin/AdminNav";
import ProductsManager from "@/components/admin/ProductsManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
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

  const products = await prisma.product.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <AdminNav active="products" />

      <div className="mt-6">
        <h1 className="font-serif-display text-2xl text-ink sm:text-3xl">Produkty</h1>
        <p className="mt-1 text-sm text-ink-soft">{products.length} produktów w katalogu</p>
      </div>

      <div className="mt-6">
        <ProductsManager initialProducts={products} />
      </div>
    </div>
  );
}
