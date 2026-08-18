import { pradoClient } from "@/lib/prado";
import { ProductCard } from "@/components/product/ProductCard";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  let products = [];
  try {
    products = await pradoClient("/api/products");
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#decf92]/20 border border-[#decf92]/50 text-[#8a7b42] dark:text-[#decf92] text-xs font-bold uppercase tracking-widest mb-4">
            Fine Art & Commissions
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 leading-tight">
            Welcome to Alexpoeima
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto font-normal leading-relaxed">
            Discover exclusive art pieces, fine prints, and more.
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="flex-1 py-16 px-6 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-10">
          Featured Artworks
        </h2>
        
        {products.length === 0 ? (
          <div className="text-center py-20 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <p className="text-zinc-500 dark:text-zinc-400">No products available at the moment.</p>
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
