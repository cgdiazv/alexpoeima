import { pradoClient } from "@/lib/prado";
import { ProductCard } from "@/components/product/ProductCard";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Products | Alex Poeima",
  description: "Browse all art pieces and fine prints by Alex Poeima.",
};

export default async function ProductsPage() {
  let products = [];
  try {
    products = await pradoClient("/api/products");
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
          Product Catalog
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-10">
          Discover original artworks, fine prints, and collections.
        </p>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400">
              No products available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
