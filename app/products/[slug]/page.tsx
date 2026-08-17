import { pradoClient } from "@/lib/prado";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const products = await pradoClient("/api/products");
    const product = Array.isArray(products)
      ? products.find((p: any) => p.slug === slug || p.id === slug)
      : null;

    if (product) {
      return {
        title: product.title,
        description: product.description || `View ${product.title} on Alexpoeima Art`,
      };
    }
  } catch (error) {
    console.error("Error generating product metadata:", error);
  }

  return {
    title: "Product Detail",
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product = null;

  try {
    const products = await pradoClient("/api/products");
    if (Array.isArray(products)) {
      product = products.find((p: any) => p.slug === slug || p.id === slug);
    }
  } catch (error) {
    console.error("Error fetching product detail:", error);
  }

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-zinc-50 dark:bg-black">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
          Product Not Found
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md">
          The artwork or product you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/products"
          className="px-6 py-3 rounded-md bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-90 transition-opacity"
        >
          Return to Catalog
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <ProductDetailView product={product} />
    </main>
  );
}
