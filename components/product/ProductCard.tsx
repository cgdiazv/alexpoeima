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
    dimension?: string | null;
    images?: string[];
    variants?: { price: string }[];
    categoryId?: string;
    categoryName?: string;
    category?: { id?: string; name?: string };
    isForSale?: boolean;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, currency } = useCart();
  const imageUrl = product.images?.[0] || "/placeholder-art.svg";
  
  // Prado Commerce variants hold the price
  const priceString = product.variants?.[0]?.price || "0";
  const priceNum = parseFloat(priceString);

  const isCommissionCategory =
    (product.categoryName || product.category?.name || "").toLowerCase().includes("commission");
  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const isForSale =
    !isCommissionCategory &&
    hasVariants &&
    !isNaN(priceNum) &&
    priceNum > 0 &&
    product.isForSale !== false;

  const formattedDimension = product.dimension
    ? product.dimension.trim().replace(/\s*[xX*]\s*/g, " × ")
    : null;

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
      <div className="flex flex-1 flex-col space-y-1.5 p-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
          {product.title}
        </h3>
        {formattedDimension && (
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {formattedDimension}
          </p>
        )}
        <div className="flex flex-1 flex-col justify-end mt-2">
          {isForSale ? (
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {formatCurrency(priceNum, currency)}
            </p>
          ) : (
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9e8b43] dark:text-[#decf92]">
              Commission Piece
            </span>
          )}
        </div>
      </div>
      <div className="px-4 pb-4 z-20 relative">
        {isForSale ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem({
                id: product.id,
                name: product.title,
                price: priceNum,
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
            href={`/commissions?reference=${encodeURIComponent(product.title)}#commission-calculator`}
            className="block text-center w-full rounded-md bg-[#9e8b43] hover:bg-[#8a7833] px-4 py-2.5 text-sm font-bold text-white shadow transition-colors"
          >
            Commission
          </Link>
        )}
      </div>
    </div>
  );
}
