import { pradoClient } from "@/lib/prado";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import Image from "next/image";

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
      <section className="relative w-full h-[380px] sm:h-[440px] md:h-[500px] overflow-hidden bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        {/* unoptimized: Next's optimizer re-encodes this webp incorrectly */}
        <Image
          src="/headers/header-finearts.webp"
          alt="Fine Arts & Prints"
          fill
          priority
          unoptimized
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/15 to-transparent" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-center items-start">
          <div className="max-w-2xl text-left space-y-4 sm:space-y-6">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#decf92]/20 border border-[#decf92]/50 text-[#f5ebd2] backdrop-blur-md text-xs font-bold uppercase tracking-widest">
              Originals
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-sm">
              Fine Arts & Prints
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-200/90 font-normal leading-relaxed max-w-xl drop-shadow">
              Explore original paintings and reproductions in my style.
            </p>
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
          className="inline-block px-8 py-3.5 bg-[#9e8b43] hover:bg-[#8a7833] text-white font-semibold rounded-lg shadow-md transition-colors"
        >
          Inquire for Custom Order
        </Link>
      </section>
    </main>
  );
}
