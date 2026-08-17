"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

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
  const imageUrl = product.images?.[0] || "/next.svg";
  
  // Prado Commerce variants hold the price
  const priceString = product.variants?.[0]?.price || "0";
  const priceNum = parseFloat(priceString); // e.g. "1600" -> 1600 (Assuming it's not cents but full amount or cents based on currency)

  // In the previous conversation we troubleshooted that price was passed as string.
  // We'll format it assuming it is the exact amount e.g. "1600" is $1600.00
  // Or if it's cents, we should divide by 100.
  // We'll format it as standard number.
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
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {displayPrice.toFixed(2)} {currency.toUpperCase()}
          </p>
        </div>
      </div>
      <div className="px-4 pb-4 z-20 relative">
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
          className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:focus:ring-white dark:focus:ring-offset-gray-900 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
