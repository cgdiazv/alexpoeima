"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, currency } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Basic shipping form state
  const [shipping, setShipping] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);

    try {
      // Create a mock capture/order placement in our API
      const response = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          shipping,
          total: totalPrice,
          currency,
        }),
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      // Success
      clearCart();
      router.push("/checkout/success");
    } catch (error) {
      console.error(error);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="container mx-auto p-6 min-h-screen text-center flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <button onClick={() => router.push("/")} className="text-blue-600 hover:underline">
          Go back shopping
        </button>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-3xl p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-zinc-50">Checkout</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Shipping Form */}
        <div className="flex-1">
          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
            <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">Contact Information</h2>
            <input
              required
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              value={shipping.email}
              onChange={handleChange}
            />

            <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 pt-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full p-3 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                value={shipping.firstName}
                onChange={handleChange}
              />
              <input
                required
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full p-3 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                value={shipping.lastName}
                onChange={handleChange}
              />
            </div>
            <input
              required
              type="text"
              name="address"
              placeholder="Address"
              className="w-full p-3 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              value={shipping.address}
              onChange={handleChange}
            />
            <div className="grid grid-cols-3 gap-4">
              <input
                required
                type="text"
                name="city"
                placeholder="City"
                className="w-full p-3 border rounded-md col-span-1 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                value={shipping.city}
                onChange={handleChange}
              />
              <input
                required
                type="text"
                name="country"
                placeholder="Country"
                className="w-full p-3 border rounded-md col-span-1 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                value={shipping.country}
                onChange={handleChange}
              />
              <input
                required
                type="text"
                name="postalCode"
                placeholder="ZIP"
                className="w-full p-3 border rounded-md col-span-1 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                value={shipping.postalCode}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-80 bg-zinc-50 dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 h-fit">
          <h2 className="text-xl font-medium mb-4 text-zinc-900 dark:text-zinc-100">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">{item.quantity}x {item.name}</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{(item.price * item.quantity).toFixed(2)} {currency.toUpperCase()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg text-zinc-900 dark:text-zinc-100">
              <span>Total</span>
              <span>{totalPrice.toFixed(2)} {currency.toUpperCase()}</span>
            </div>
          </div>
          <button
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="w-full py-3 px-4 bg-black text-white dark:bg-white dark:text-black font-medium rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Processing..." : "Place Mock Order"}
          </button>
        </div>
      </div>
    </main>
  );
}
