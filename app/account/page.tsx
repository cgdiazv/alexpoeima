"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";
import {
  User,
  ShoppingBag,
  MapPin,
  Trash2,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Edit3,
  Package,
  Calendar,
  CreditCard,
  X,
  ChevronRight,
} from "lucide-react";

interface SavedAddress {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface UserProfile {
  email: string;
  firstName?: string;
  lastName?: string;
  address?: SavedAddress;
}

interface OrderItem {
  id?: string;
  name?: string;
  title?: string;
  quantity?: number;
  price?: number;
  image?: string;
  imageUrl?: string;
}

interface Order {
  id: string;
  createdAt?: string;
  total?: number;
  currency?: string;
  status?: string;
  items?: OrderItem[];
  shippingAddress?: SavedAddress | string;
}

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "address" | "danger">("orders");

  // Profile Form State
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Address Form State
  const [addressData, setAddressData] = useState<SavedAddress>({
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressMsg, setAddressMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Delete Account Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function fetchAccountData() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.loggedIn && data.user) {
          setUser(data.user);
          setOrders(data.orders || []);
          setProfileData({
            firstName: data.user.firstName || "",
            lastName: data.user.lastName || "",
            email: data.user.email || "",
          });
          if (data.user.address) {
            setAddressData({
              address1: data.user.address.address1 || "",
              address2: data.user.address.address2 || "",
              city: data.user.address.city || "",
              state: data.user.address.state || "",
              postalCode: data.user.address.postalCode || "",
              country: data.user.address.country || "United States",
            });
          }
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

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
      setUser((prev) => (prev ? { ...prev, ...profileData } : null));
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message || "Error updating profile" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    setAddressMsg(null);

    try {
      const res = await fetch("/api/auth/address", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update address");

      setAddressMsg({ type: "success", text: "Shipping address saved successfully!" });
      setUser((prev) => (prev ? { ...prev, address: addressData } : null));
    } catch (err: any) {
      setAddressMsg({ type: "error", text: err.message || "Error updating address" });
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    setDeleteError("");

    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete account");

      setIsDeleteModalOpen(false);
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setDeleteError(err.message || "Error deleting account. Please try again.");
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Loading your buyer account...</span>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Valued Customer";

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Account Header */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white font-bold text-xl border border-zinc-200 dark:border-zinc-700">
              {user.firstName ? user.firstName[0].toUpperCase() : "U"}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                {displayName}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto gap-2 sm:gap-4 scrollbar-none">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "orders"
                ? "border-black text-black dark:border-white dark:text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Recent Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "profile"
                ? "border-black text-black dark:border-white dark:text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("address")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "address"
                ? "border-black text-black dark:border-white dark:text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Shipping Address</span>
          </button>

          <button
            onClick={() => setActiveTab("danger")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "danger"
                ? "border-red-600 text-red-600 dark:border-red-500 dark:text-red-400"
                : "border-transparent text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>

        {/* TAB 1: RECENT ORDERS */}
        {activeTab === "orders" && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                  <span>Your Recent Orders</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Track your art purchases, original paintings, prints, and event bookings.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  No orders placed yet
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  Explore original fine art pieces, limited edition prints, and custom commissions.
                </p>
                <div className="pt-2">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    <span>Browse Collection</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-4 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-200/60 dark:border-zinc-800 pb-3">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Order ID</span>
                        <p className="font-bold text-zinc-900 dark:text-white text-base">
                          #{order.id}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {order.createdAt && (
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        )}
                        <span className="capitalize text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {order.status || "Completed"}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Breakdown */}
                    {order.items && order.items.length > 0 && (
                      <div className="space-y-3 py-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                              {item.image || item.imageUrl ? (
                                <img
                                  src={item.image || item.imageUrl}
                                  alt={item.name || item.title || "Artwork"}
                                  className="w-10 h-10 object-cover rounded-md border border-zinc-200 dark:border-zinc-800"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-md bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
                                  ART
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-zinc-900 dark:text-white">
                                  {item.name || item.title || "Fine Art Piece"}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                  Qty: {item.quantity || 1}
                                </p>
                              </div>
                            </div>
                            <span className="font-semibold text-zinc-900 dark:text-white">
                              {formatCurrency(item.price || 0, order.currency || "USD")}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center border-t border-zinc-200/60 dark:border-zinc-800 pt-3 text-sm">
                      <span className="text-zinc-500 dark:text-zinc-400 font-medium">Total Paid</span>
                      <span className="text-lg font-bold text-zinc-900 dark:text-white">
                        {formatCurrency(order.total || 0, order.currency || "USD")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EDIT PROFILE */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl space-y-6 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                <span>Edit Profile Details</span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Update your personal information associated with your Alex Poeima buyer account.
              </p>
            </div>

            {profileMsg && (
              <div
                className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
                  profileMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
                    : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
                }`}
              >
                {profileMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-5 max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <span>Save Profile Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: SHIPPING ADDRESS */}
        {activeTab === "address" && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl space-y-6 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                <span>Default Shipping Address</span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Save your primary delivery address for faster checkout on fine art pieces and original works.
              </p>
            </div>

            {addressMsg && (
              <div
                className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
                  addressMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
                    : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
                }`}
              >
                {addressMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                )}
                <span>{addressMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleAddressSubmit} className="space-y-5 max-w-xl">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Address Line 1
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street address or P.O. Box"
                  value={addressData.address1}
                  onChange={(e) => setAddressData({ ...addressData, address1: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Apartment, suite, unit, building, floor"
                  value={addressData.address2}
                  onChange={(e) => setAddressData({ ...addressData, address2: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={addressData.city}
                    onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                    State / Province
                  </label>
                  <input
                    type="text"
                    required
                    value={addressData.state}
                    onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                    Postal / ZIP Code
                  </label>
                  <input
                    type="text"
                    required
                    value={addressData.postalCode}
                    onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={addressData.country}
                    onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="px-6 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                >
                  {savingAddress ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Address...</span>
                    </>
                  ) : (
                    <span>Save Address</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: DANGER ZONE / DELETE ACCOUNT */}
        {activeTab === "danger" && (
          <div className="bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-950/60 p-6 sm:p-8 rounded-2xl space-y-6 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Delete Buyer Account</span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Permanently remove your active profile session and credentials from Alex Poeima Fine Art.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 space-y-3">
              <p className="text-sm font-semibold text-red-900 dark:text-red-300">
                What happens when you delete your account:
              </p>
              <ul className="text-xs text-red-800 dark:text-red-400 space-y-1.5 list-disc list-inside">
                <li>Your active login session cookie will be immediately cleared.</li>
                <li>An account deletion confirmation email will be sent to <strong>{user.email}</strong>.</li>
                <li>Saved shipping address details will be removed.</li>
                <li>Order history records are archived in Prado Commerce for accounting and tax purposes.</li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-6 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete My Account</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* CONFIRMATION MODAL FOR ACCOUNT DELETION */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 max-w-md w-full rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                Are you absolutely sure?
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                This will delete your account for <strong className="text-zinc-800 dark:text-zinc-200">{user.email}</strong>. You will be logged out immediately and a confirmation email will be sent.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs border border-red-200 dark:border-red-900">
                {deleteError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                disabled={deletingAccount}
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deletingAccount ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting Account...</span>
                  </>
                ) : (
                  <span>Yes, Delete Account</span>
                )}
              </button>

              <button
                type="button"
                disabled={deletingAccount}
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
