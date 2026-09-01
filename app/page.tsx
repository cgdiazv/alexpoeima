import { pradoClient } from "@/lib/prado";
import { ProductCard } from "@/components/product/ProductCard";
import { HeaderSlider } from "@/components/ui/HeaderSlider";
import { ShieldCheck, Award, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  let products = [];
  try {
    products = await pradoClient("/api/products");
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main className="w-full bg-white flex flex-col min-h-screen">
      {/* Home Page Header Slider */}
      <HeaderSlider />

      {/* Value Badges Banner */}
      <section className="py-6 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#9e8b43] flex-shrink-0" strokeWidth={1.5} />
            <span className="text-xs sm:text-sm font-semibold text-zinc-700">Certificate of Authenticity Included</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <Award className="w-5 h-5 text-[#9e8b43] flex-shrink-0" strokeWidth={1.5} />
            <span className="text-xs sm:text-sm font-semibold text-zinc-700">100% Archival Museum-Grade Cotton Rag</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <Sparkles className="w-5 h-5 text-[#9e8b43] flex-shrink-0" strokeWidth={1.5} />
            <span className="text-xs sm:text-sm font-semibold text-zinc-700">Worldwide Secure Express Shipping</span>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="flex-1 py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-zinc-200 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#9e8b43] block mb-1">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              Featured Artworks
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#9e8b43] hover:text-[#8a7833] transition-colors"
          >
            <span>View All Artworks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4">
            <p className="text-zinc-500 font-medium">No products available at the moment.</p>
            <Link
              href="/commissions"
              className="inline-block px-6 py-2.5 bg-[#9e8b43] hover:bg-[#8a7833] text-white rounded-lg text-sm font-bold shadow transition-colors"
            >
              Inquire for Custom Commission
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
    </main>
  );
}
