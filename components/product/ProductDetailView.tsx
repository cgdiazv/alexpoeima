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
  images?: string[];
  variants?: Variant[];
};

export function ProductDetailView({
  product,
}: {
  product: Product;
}) {
  const { addItem, currency } = useCart();
  const images = product.images && product.images.length > 0 ? product.images : ["/next.svg"];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const activeVariant = product.variants?.[selectedVariantIndex];
  const priceNum = activeVariant ? parseFloat(activeVariant.price) : 0;

  const handleAddToCart = () => {
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
            <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-4">
              {formatCurrency(priceNum, currency)}
            </p>
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 1 && (
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
            <div className="prose prose-sm dark:prose-invert text-zinc-600 dark:text-zinc-300 leading-relaxed border-t border-b border-zinc-200 dark:border-zinc-800 py-6">
              <p>{product.description}</p>
            </div>
          )}

          {/* Quantity & Add to Cart Action */}
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
