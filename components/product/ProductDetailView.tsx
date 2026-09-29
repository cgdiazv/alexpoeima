"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/currency";

type Variant = {
  id?: string;
  name?: string;
  price: string;
};

type Product = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  dimension?: string | null;
  weight?: string | null;
  images?: string[];
  variants?: Variant[];
  categoryId?: string;
  categoryName?: string;
  category?: {
    id?: string;
    name?: string;
  };
  isForSale?: boolean;
};

/**
 * Normalizes and formats artwork dimensions from Prado Commerce.
 * Converts metric (cm) to imperial inches for international collectors.
 */
function formatArtworkDimensions(rawDim?: string | null) {
  if (!rawDim || typeof rawDim !== "string" || !rawDim.trim()) return null;
  const trimmed = rawDim.trim();

  // Handle patterns like "30 x 40 cm", "30x40 cm", "40.5 x 60 cm", "60 x 80 cm"
  const metricMatch = trimmed.match(
    /^([\d.]+)\s*(?:x|×|\*)\s*([\d.]+)(?:\s*(?:x|×|\*)\s*([\d.]+))?\s*(cm|mm|m)?$/i
  );

  if (metricMatch) {
    const w = parseFloat(metricMatch[1]);
    const h = parseFloat(metricMatch[2]);
    const d = metricMatch[3] ? parseFloat(metricMatch[3]) : null;
    const unit = (metricMatch[4] || "cm").toLowerCase();

    if (unit === "cm" && !isNaN(w) && !isNaN(h)) {
      const wIn = (w / 2.54).toFixed(1).replace(/\.0$/, "");
      const hIn = (h / 2.54).toFixed(1).replace(/\.0$/, "");

      if (d && !isNaN(d)) {
        const dIn = (d / 2.54).toFixed(1).replace(/\.0$/, "");
        return {
          metric: `${w} × ${h} × ${d} cm`,
          imperial: `${wIn}″ × ${hIn}″ × ${dIn}″`,
          summary: `${w} × ${h} × ${d} cm (${wIn}″ × ${hIn}″ × ${dIn}″)`,
        };
      }

      return {
        metric: `${w} × ${h} cm`,
        imperial: `${wIn}″ × ${hIn}″`,
        summary: `${w} × ${h} cm (${wIn}″ × ${hIn}″)`,
      };
    }
  }

  // Fallback: clean up standard "x" to multiplication sign "×"
  const cleanFallback = trimmed.replace(/\s*[xX*]\s*/g, " × ");
  return {
    metric: cleanFallback,
    imperial: null,
    summary: cleanFallback,
  };
}

export function ProductDetailView({
  product,
}: {
  product: Product;
}) {
  const { addItem, currency } = useCart();
  const images = product.images && product.images.length > 0 ? product.images : ["/placeholder-art.svg"];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const activeVariant = product.variants?.[selectedVariantIndex];
  const priceNum = activeVariant ? parseFloat(activeVariant.price) : 0;
  const dimensions = formatArtworkDimensions(product.dimension);

  // Determine if artwork is for direct sale or a commission / exhibition piece
  const isCommissionCategory =
    (product.categoryName || product.category?.name || "").toLowerCase().includes("commission");
  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const isForSale =
    !isCommissionCategory &&
    hasVariants &&
    !isNaN(priceNum) &&
    priceNum > 0 &&
    product.isForSale !== false;

  const handleAddToCart = () => {
    if (!isForSale) return;
    addItem({
      id: product.id,
      name: product.title + (activeVariant?.name ? ` - ${activeVariant.name}` : ""),
      price: priceNum,
      quantity,
      image: selectedImage,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-zinc-500 dark:text-zinc-400 mb-8">
        <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white font-medium line-clamp-1">
          {product.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
            <Image
              src={selectedImage}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === img
                      ? "border-black dark:border-white ring-2 ring-black/10 dark:ring-white/10"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Details */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {product.title}
            </h1>
            {isForSale ? (
              <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-4">
                {formatCurrency(priceNum, currency)}
              </p>
            ) : (
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300">
                  Bespoke Commission
                </span>
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Private Collection • Not for Direct Sale
                </span>
              </div>
            )}
          </div>

          {/* Canvas Dimensions Indicator from Prado Commerce */}
          {dimensions && (
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#9e8b43]/15 text-[#9e8b43] dark:text-[#decf92] shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Artwork Dimensions
                </span>
                <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                  <span className="text-base font-bold text-zinc-900 dark:text-white">
                    {dimensions.metric}
                  </span>
                  {dimensions.imperial && (
                    <span className="text-xs font-semibold text-[#9e8b43] dark:text-[#decf92]">
                      ({dimensions.imperial})
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Variants Selector (Only when product is for sale and has multiple variants) */}
          {isForSale && product.variants && product.variants.length > 1 && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-zinc-900 dark:text-white">
                Option / Variant
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.id || idx}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`px-4 py-2 text-sm font-medium rounded-md border transition-all ${
                      selectedVariantIndex === idx
                        ? "border-[#9e8b43] bg-[#9e8b43] text-white"
                        : "border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-white hover:border-zinc-400"
                    }`}
                  >
                    {v.name || `Variant ${idx + 1}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Description */}
          {product.description && (
            <div className="prose prose-sm dark:prose-invert text-zinc-600 dark:text-zinc-300 leading-relaxed border-t border-zinc-200 dark:border-zinc-800 py-6">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {/* Artwork Specifications Table */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Artwork Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                  Dimensions
                </span>
                <span className="font-bold text-zinc-900 dark:text-white block">
                  {dimensions ? dimensions.metric : "Available upon request"}
                </span>
                {dimensions?.imperial && (
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    approx. {dimensions.imperial}
                  </span>
                )}
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                  Medium / Category
                </span>
                <span className="font-bold text-zinc-900 dark:text-white block line-clamp-1">
                  {product.categoryName || product.category?.name || "Original Artwork"}
                </span>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Studio Original
                </span>
              </div>
            </div>
          </div>

          {/* Action: Quantity & Add to Cart OR Commission Inquiry */}
          {isForSale ? (
            <div className="space-y-4 pt-2">
              <label className="text-sm font-semibold text-zinc-900 dark:text-white block">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-md">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-zinc-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 rounded-md bg-[#9e8b43] hover:bg-[#8a7833] text-white px-6 py-3 text-base font-bold shadow-md focus:outline-none transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-zinc-800 dark:text-zinc-200">
                <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
                  Commissioned Artwork / Private Collection
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  This piece was created as an original custom commission. You can request a personalized piece tailored to your vision.
                </p>
              </div>
              <Link
                href={`/commissions?reference=${encodeURIComponent(product.title)}#commission-calculator`}
                className="flex items-center justify-center w-full rounded-md bg-[#9e8b43] hover:bg-[#8a7833] text-white px-6 py-3.5 text-base font-bold shadow-md focus:outline-none transition-colors text-center"
              >
                Commission
              </Link>
            </div>
          )}

          {/* Assurance badges */}
          <div className="pt-6 grid grid-cols-2 gap-4 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-zinc-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Authentic Original Art</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-zinc-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Worldwide Shipping</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
