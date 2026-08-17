import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Alexpoeima Art",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8 text-zinc-900 dark:text-white">
      <div className="max-w-3xl mx-auto space-y-8 bg-white dark:bg-zinc-900 p-8 sm:p-12 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        
        <h1 className="text-3xl font-bold tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-4">
          Terms of Service
        </h1>

        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <p>
            Welcome to <strong>Alexpoeima Art</strong>. By accessing or placing an order on our website, you agree to be bound by the following terms and conditions.
          </p>

          <h2 className="text-base font-semibold text-zinc-900 dark:text-white pt-2">1. Orders & Pricing</h2>
          <p>
            All products and prices are displayed in the merchant's configured store currency. We reserve the right to accept or cancel orders at any time due to stock availability or unexpected pricing discrepancies.
          </p>

          <h2 className="text-base font-semibold text-zinc-900 dark:text-white pt-2">2. Shipping & Delivery</h2>
          <p>
            Shipping costs and estimated delivery times are calculated at checkout based on selected shipping methods and regional zones.
          </p>

          <h2 className="text-base font-semibold text-zinc-900 dark:text-white pt-2">3. Intellectual Property</h2>
          <p>
            All original artwork, images, designs, and content displayed on this website are the exclusive property of <strong>Alexpoeima Art</strong> and protected under copyright laws.
          </p>

          <h2 className="text-base font-semibold text-zinc-900 dark:text-white pt-2">4. Platform Service</h2>
          <p>
            This online storefront is powered by <strong>Prado Commerce</strong>.
          </p>
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <Link
            href="/"
            className="inline-block px-5 py-2.5 rounded-md bg-black text-white dark:bg-white dark:text-black font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Return to Store
          </Link>
        </div>

      </div>
    </main>
  );
}
