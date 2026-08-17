"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserProfile {
  email: string;
  firstName?: string;
  lastName?: string;
}

interface Order {
  id: string;
  createdAt?: string;
  total?: number;
  status?: string;
  items?: any[];
}

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchAccountData() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.loggedIn && data.user) {
          setUser(data.user);
          setOrders(data.orders || []);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error loading account details:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchAccountData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-zinc-500 dark:text-zinc-400">Loading your account...</p>
      </main>
    );
  }

  if (!user) return null;

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Valued Customer";

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Account Header */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
              Hello, {displayName}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Order History */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Order History
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                You haven't placed any orders yet.
              </p>
              <Link
                href="/products"
                className="inline-block px-5 py-2.5 rounded-md bg-black text-white dark:bg-white dark:text-black font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      Order #{order.id}
                    </p>
                    {order.createdAt && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      ${order.total ? order.total.toFixed(2) : "0.00"}
                    </span>
                    <span className="capitalize text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                      {order.status || "Completed"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
