"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-black/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-script.webp"
              alt="Alex Poeima"
              width={200}
              height={50}
              className="h-10 w-auto object-contain dark:invert"
              priority
            />
          </Link>
          <div className="hidden space-x-6 md:flex">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white">
              Products
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white">
            Login
          </Link>
          <Link href="/cart" className="relative group">
            <svg
              className="h-6 w-6 text-gray-700 group-hover:text-black dark:text-gray-300 dark:group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white dark:bg-white dark:text-black">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
