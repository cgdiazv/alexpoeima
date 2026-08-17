"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, User } from "lucide-react";

export function Navbar() {
  const { totalItems, openCart } = useCart();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setLoggedIn(!!data.loggedIn);
      } catch (err) {
        setLoggedIn(false);
      }
    }
    checkAuth();
  }, []);

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
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">
              Products
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {loggedIn ? (
            <Link href="/account" className="flex items-center space-x-1.5 text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">
              <User className="w-4 h-4" />
              <span>Account</span>
            </Link>
          ) : (
            <Link href="/login" className="flex items-center space-x-1.5 text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}

          <button onClick={openCart} className="relative group p-1" aria-label="Open cart">
            <ShoppingBag className="w-6 h-6 text-gray-700 group-hover:text-black dark:text-gray-300 dark:group-hover:text-white transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white dark:bg-white dark:text-black">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
