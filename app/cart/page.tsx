"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, currency } = useCart();

  return (
    <main className="container mx-auto max-w-4xl p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900 rounded-lg">
          <p className="text-gray-500 mb-4 text-lg">Your cart is empty.</p>
          <Link href="/" className="inline-block px-6 py-3 rounded-md bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-80 transition-opacity">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {items.map((item) => (
                <li key={item.id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
                    <Image
                      src={item.image || "/next.svg"}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-100">
                        <h3>{item.name}</h3>
                        <p className="ml-4">{(item.price * item.quantity).toFixed(2)} {currency.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
                        <button
                          className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-medium">{item.quantity}</span>
                        <button
                          className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="font-medium text-red-600 hover:text-red-500"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="w-full lg:w-80 h-fit bg-gray-50 dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>
            <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-100 mb-6">
              <p>Subtotal</p>
              <p>{totalPrice.toFixed(2)} {currency.toUpperCase()}</p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Shipping and taxes calculated at checkout.
            </p>
            <Link href="/checkout" className="flex items-center justify-center w-full rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors">
              Checkout
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
