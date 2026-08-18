import type { Metadata, Viewport } from "next";
import { Aboreto, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { pradoClient } from "@/lib/prado";

const aboreto = Aboreto({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-aboreto",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Alexpoeima Art",
    template: "%s | Alexpoeima Art",
  },
  description: "Official store for Alexpoeima Art - Fine art prints and original artworks.",
};


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let currency = "USD";
  let pricesIncludeTax = true; // Prado merchant setting: Prices include tax (checked)
  let taxRate = 0.15; // Prado merchant setting: 15% ISV
  let taxName = "Impuesto sobre Ventas (ISV)";

  try {
    const storeId = process.env.NEXT_PUBLIC_PRADO_STORE_ID;
    if (storeId) {
      const store = await pradoClient(`/api/stores/${storeId}`);
      if (store?.currency) {
        currency = store.currency;
      }
      if (typeof store?.pricesIncludeTax === "boolean") {
        pricesIncludeTax = store.pricesIncludeTax;
      }
      if (typeof store?.taxRate === "number") {
        taxRate = store.taxRate;
      }
      if (store?.taxName) {
        taxName = store.taxName;
      }
    }
  } catch (error) {
    console.error("Failed to fetch store settings:", error);
  }

  return (
    <html
      lang="en"
      className={`${aboreto.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${aboreto.className} min-h-screen flex flex-col bg-white dark:bg-black text-zinc-900 dark:text-zinc-100`}>
        <CartProvider
          currency={currency}
          pricesIncludeTax={pricesIncludeTax}
          taxRate={taxRate}
          taxName={taxName}
        >
          <Navbar />
          <CartDrawer />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

