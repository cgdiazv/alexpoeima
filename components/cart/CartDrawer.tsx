"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, currency, totalItems } = useCart();

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md transform bg-white dark:bg-zinc-900 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Shopping Cart</span>
              {totalItems > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              )}
            </h2>
            <button
              onClick={closeCart}
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4" />
                <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-4">Your cart is currently empty.</p>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 rounded-md bg-black text-white dark:bg-white dark:text-black font-medium text-sm hover:opacity-80 transition-opacity"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {items.map((item) => (
                  <li key={item.id} className="flex py-4 gap-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800 relative bg-zinc-50 dark:bg-zinc-800">
                      <Image
                        src={item.image || "/next.svg"}
                        alt={item.name}
                        fill
                        className="object-cover object-center"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-base font-medium text-zinc-900 dark:text-white">
                          <h3 className="line-clamp-1">{item.name}</h3>
                          <p className="ml-2 font-semibold">
                            {(item.price * item.quantity).toFixed(2)} {currency.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm mt-2">
                        <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-md">
                          <button
                            className="px-2 py-1 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-0.5 font-medium text-zinc-900 dark:text-white text-xs">
                            {item.quantity}
                          </span>
                          <button
                            className="px-2 py-1 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="flex items-center text-xs text-red-600 hover:text-red-500 transition-colors gap-1"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer / Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-4">
              <div className="flex justify-between text-base font-bold text-zinc-900 dark:text-white">
                <p>Subtotal</p>
                <p>{totalPrice.toFixed(2)} {currency.toUpperCase()}</p>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex items-center justify-center w-full rounded-md bg-black px-6 py-3 text-base font-medium text-white shadow hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
