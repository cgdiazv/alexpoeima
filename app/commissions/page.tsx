import { pradoClient } from "@/lib/prado";
import { ProductCard } from "@/components/product/ProductCard";
import { CommissionCalculatorSection } from "@/components/commissions/CommissionCalculatorSection";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Commissions",
  description: "Custom portraits, pet memorials, and bespoke original paintings by Alexpoeima.",
};

export default async function CommissionsPage() {
  let commissionProducts: any[] = [];

  try {
    const allProducts = await pradoClient("/api/products");
    if (Array.isArray(allProducts)) {
      commissionProducts = allProducts.filter((product: any) => {
        const catName = (product.category?.name || product.categoryName || "").toLowerCase().trim();
        const catId = product.categoryId || product.category?.id;
        return (
          catName === "commissions" ||
          catName.includes("commission") ||
          catId === "cmtuwwwcb000304jq940pnz06"
        );
      });
    }
  } catch (error) {
    console.error("Error fetching commissions products:", error);
  }

  return (
    <main className="flex-1 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Hero Section / Header */}
      <section className="relative w-full h-[380px] sm:h-[440px] md:h-[500px] overflow-hidden bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <Image
          src="/headers/header-commissions.webp"
          alt="Commissions"
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
              Memories on Canvas
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-sm">
              COMMISSIONS
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-200/90 font-normal leading-relaxed max-w-xl drop-shadow">
              Custom Portraits, Pets, bring your ideas to life.
            </p>
          </div>
        </div>
      </section>

      {/* Commissioned Artworks Showcase */}
      <section className="py-16 max-w-7xl mx-auto px-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#9e8b43] dark:text-[#decf92]">
              Commissions Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-1">
              Commissioned Artworks ({commissionProducts.length})
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Custom portraits, pet memorials, and bespoke client works handcrafted by Alexpoeima.
            </p>
          </div>
          <a
            href="#commission-calculator"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9e8b43] dark:text-[#decf92] hover:underline"
          >
            <span>Commission a Custom Piece</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {commissionProducts.length === 0 ? (
          <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 space-y-4">
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              No commission pieces currently displayed in the gallery.
            </p>
            <a
              href="#commission-calculator"
              className="inline-block px-6 py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Request a Custom Commission
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {commissionProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>


      {/* Commission Calculator & Request Form */}
      <CommissionCalculatorSection />
    </main>
  );
}
