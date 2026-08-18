"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, User, Menu, X } from "lucide-react";

export function Navbar() {
  const { totalItems, openCart } = useCart();
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
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

  // Close mobile menu on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "About Me", href: "/about" },
    { name: "Fine Arts & Prints", href: "/fine-arts-and-prints" },
    { name: "Commissions", href: "/commissions" },
    { name: "Live Events", href: "/live-events" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[#eae4d2] bg-[#fdfcf8]/90 backdrop-blur-md dark:border-zinc-800 dark:bg-[#12110c]/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-script.webp"
              alt="Alexpoeima"
              width={260}
              height={65}
              className="h-12 sm:h-14 lg:h-16 w-auto object-contain dark:invert"
              priority
            />
          </Link>
          <div className="hidden space-x-6 lg:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-black font-semibold dark:text-white underline underline-offset-4"
                      : "text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-6">
          {loggedIn ? (
            <Link
              href="/account"
              className="flex items-center space-x-1.5 text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <User className="w-5 h-5" strokeWidth={0.75} />
              <span className="hidden sm:inline">Account</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-1.5 text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <User className="w-5 h-5" strokeWidth={0.75} />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}

          <button onClick={openCart} className="relative group p-1" aria-label="Open cart">
            <ShoppingBag className="w-6 h-6 text-gray-700 group-hover:text-black dark:text-gray-300 dark:group-hover:text-white transition-colors" strokeWidth={0.75} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#decf92] text-xs font-extrabold text-zinc-950">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 lg:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" strokeWidth={0.75} /> : <Menu className="w-6 h-6" strokeWidth={0.75} />}
          </button>
        </div>
      </div>

      {/* Mobile left-side slide drawer rendered via Portal directly into document.body */}
      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-[100] transition-opacity duration-300 lg:hidden ${
              mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Dark Backdrop overlay (no backdrop-blur to avoid CSS filter bleed) */}
            <div
              className="fixed inset-0 bg-black/70 z-[101]"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Solid Opaque Sliding Drawer */}
            <div
              className={`fixed top-0 left-0 bottom-0 h-screen w-[85%] max-w-sm z-[102] bg-white dark:bg-zinc-950 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out border-r border-zinc-200 dark:border-zinc-800 ${
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="space-y-8">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <Image
                      src="/logo-script.webp"
                      alt="Alexpoeima"
                      width={200}
                      height={50}
                      className="h-10 sm:h-12 w-auto object-contain dark:invert"
                    />
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" strokeWidth={0.75} />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                          isActive
                            ? "bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white font-semibold"
                            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-black dark:hover:text-white"
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                {loggedIn ? (
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white"
                  >
                    <User className="w-4 h-4" strokeWidth={0.75} />
                    <span>My Account</span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white"
                  >
                    <User className="w-4 h-4" strokeWidth={0.75} />
                    <span>Sign In / Register</span>
                  </Link>
                )}
                <p className="text-xs text-zinc-400 px-3">&copy; {new Date().getFullYear()} Alexpoeima Art</p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </nav>
  );
}


