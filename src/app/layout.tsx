import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import PromoBanner from "@/components/PromoBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
});

const SITE_URL = "https://velura-sklep-demo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VELURA - Kosmetyki premium",
    template: "%s | VELURA",
  },
  description:
    "VELURA - pielęgnacja, makijaż i perfumy premium. Darmowa dostawa od 200 zł, płatność kartą i BLIK.",
  keywords: ["kosmetyki", "pielęgnacja twarzy", "makijaż", "perfumy", "sklep kosmetyczny", "VELURA"],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "VELURA",
    title: "VELURA - Kosmetyki premium",
    description:
      "Starannie dobrane kosmetyki do pielęgnacji, makijażu i zapachu. Darmowa dostawa od 200 zł.",
    url: SITE_URL,
    images: [
      {
        url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "VELURA - kosmetyki premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VELURA - Kosmetyki premium",
    description: "Pielęgnacja, makijaż i perfumy premium. Darmowa dostawa od 200 zł.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <PromoBanner />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
