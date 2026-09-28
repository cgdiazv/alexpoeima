"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/currency";

type ProductCardProps = {
  product: {
    id: string;
    title: string;
    slug: string;
    description?: string;
    images?: string[];
    variants?: { price: string }[];
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, currency } = useCart();
  const imageUrl = product.images?.[0] || "/placeholder-art.svg";
  
  // Prado Commerce variants hold the price
  const priceString = product.variants?.[0]?.price || "0";
  const priceNum = parseFloat(priceString);
  const displayPrice = priceNum; 

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-zinc-900 transition-all hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {product.title}</span>
      </Link>
      <div className="relative w-full h-64 overflow-hidden bg-gray-100 dark:bg-zinc-800">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
          {product.title}
        </h3>
        <div className="flex flex-1 flex-col justify-end mt-2">
          {displayPrice > 0 ? (
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {formatCurrency(displayPrice, currency)}
            </p>
          ) : (
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9e8b43] dark:text-[#decf92]">
              Commission Piece
            </span>
          )}
        </div>
      </div>
      <div className="px-4 pb-4 z-20 relative">
        {displayPrice > 0 ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem({
                id: product.id,
                name: product.title,
                price: displayPrice,
                quantity: 1,
                image: imageUrl,
              });
            }}
            className="w-full rounded-md bg-[#9e8b43] hover:bg-[#8a7833] px-4 py-2.5 text-sm font-bold text-white shadow transition-colors"
          >
            Add to Cart
          </button>
        ) : (
          <Link
            href={`/products/${product.slug}`}
            className="block text-center w-full rounded-md bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white px-4 py-2.5 text-sm font-bold text-white shadow transition-colors"
          >
            View Details & Story
          </Link>
        )}
      </div>
    </div>
  );
}
