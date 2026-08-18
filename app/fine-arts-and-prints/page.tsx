import { pradoClient } from "@/lib/prado";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { ShieldCheck, Award, Sparkles, Filter } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Fine Arts & Prints",
  description: "Browse original artworks and museum-grade limited edition prints by Alexpoeima.",
};

export default async function FineArtsAndPrintsPage() {
  let products = [];
  try {
    products = await pradoClient("/api/products");
  } catch (error) {
    console.error("Error fetching fine arts products:", error);
  }

  return (
    <main className="flex-1 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header Banner */}
      <section className="py-16 md:py-24 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-4">
          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 rounded-full border border-amber-200 dark:border-amber-900">
            Official Studio Collection
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Fine Arts & Prints
          </h1>
          <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-light">
            Explore original paintings, mixed media compositions, and museum-grade Giclée prints. Each piece is crafted with meticulous care and archival standards.
          </p>
        </div>
      </section>

      {/* Value Badges */}
      <section className="py-8 bg-zinc-100/70 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Certificate of Authenticity Included</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Award className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">100% Archival Cotton Rag Paper</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Worldwide Secure Express Shipping</span>
          </div>
        </div>
      </section>

      {/* Main Catalog Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Available Artworks ({products.length})
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Hand-selected studio works ready for your collection.</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 space-y-4">
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">No fine art products available in store right now.</p>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">
              Custom original pieces and private commissions are available upon request.
            </p>
            <Link
              href="/commissions"
              className="inline-block mt-4 px-6 py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Commission an Original Piece
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Bespoke Request Section */}
      <section className="py-16 max-w-5xl mx-auto px-6 border-t border-zinc-200 dark:border-zinc-800 text-center space-y-6">
        <h3 className="text-2xl md:text-3xl font-bold">Looking for a Custom Dimension or Original Canvas?</h3>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
          Alexpoeima creates custom-sized prints and bespoke paintings tailored to specific interior architecture and private gallery requirements.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-md transition-colors"
        >
          Inquire for Custom Order
        </Link>
      </section>
    </main>
  );
}
