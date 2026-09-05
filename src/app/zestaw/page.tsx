import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BUNDLE_DISCOUNT_PERCENT } from "@/lib/bundle";
import BundleBuilder from "@/components/BundleBuilder";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Zbuduj zestaw",
  description: `Wybierz 3 produkty z różnych kategorii i odbierz ${BUNDLE_DISCOUNT_PERCENT}% rabatu na cały zestaw.`,
  alternates: { canonical: "/zestaw" },
};

export default async function BundlePage() {
  const products = await prisma.product.findMany({ orderBy: { category: "asc" } });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-xl text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-rose">Twój wybór</span>
        <h1 className="mt-3 font-serif-display text-3xl text-ink sm:text-4xl">Zbuduj zestaw</h1>
        <p className="mt-3 text-ink-soft">
          Wybierz po jednym produkcie z trzech różnych kategorii, a automatycznie otrzymasz{" "}
          <span className="font-medium text-rose-dark">{BUNDLE_DISCOUNT_PERCENT}% rabatu</span> na cały zestaw.
        </p>
      </div>

      <div className="mt-10">
        <BundleBuilder products={products} />
      </div>
    </div>
  );
}
