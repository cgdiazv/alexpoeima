"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, CreditCard, Truck } from "lucide-react";

interface UserProfile {
  email: string;
  firstName?: string;
  lastName?: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface PaymentMethodOption {
  id: string;
  name: string;
  description?: string;
  type: string;
}

const REGIONS_BY_COUNTRY: Record<string, string[]> = {
  "United States (US)": [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ],
  "Belize (BZ)": [
    "Belize", "Cayo", "Corozal", "Orange Walk", "Stann Creek", "Toledo"
  ],
  "Costa Rica (CR)": [
    "San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"
  ],
  "El Salvador (SV)": [
    "San Salvador", "Ahuachapán", "Cabañas", "Chalatenango", "Cuscatlán", "La Libertad", "La Paz", "La Unión", "Morazán", "San Miguel", "San Vicente", "Santa Ana", "Sonsonate", "Usulután"
  ],
  "Guatemala (GT)": [
    "Guatemala", "Alta Verapaz", "Baja Verapaz", "Chimaltenango", "Chiquimula", "El Progreso", "Escuintla", "Huehuetenango", "Izabal", "Jalapa", "Jutiapa", "Petén", "Quetzaltenango", "Quiché", "Retalhuleu", "Sacatepéquez", "San Marcos", "Santa Rosa", "Sololá", "Suchitepéquez", "Totonicapán", "Zacapa"
  ],
  "Honduras (HN)": [
    "Francisco Morazán", "Atlántida", "Choluteca", "Colón", "Comayagua", "Copán", "Cortés", "El Paraíso", "Gracias a Dios", "Intibucá", "Islas de la Bahía", "La Paz", "Lempira", "Ocotepeque", "Olancho", "Santa Bárbara", "Valle", "Yoro"
  ],
  "Nicaragua (NI)": [
    "Managua", "Boaco", "Carazo", "Chinandega", "Chontales", "Estelí", "Granada", "Jinotega", "León", "Madriz", "Masaya", "Matagalpa", "Nueva Segovia", "Rivas", "Río San Juan", "RACCN", "RACCS"
  ],
  "Panama (PA)": [
    "Panamá", "Bocas del Toro", "Chiriquí", "Coclé", "Colón", "Darién", "Herrera", "Los Santos", "Panamá Oeste", "Veraguas", "Guna Yala", "Emberá-Wounaan", "Ngäbe-Buglé"
  ],
  "Canada (CA)": [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Northwest Territories", "Nunavut", "Yukon"
  ],
  "United Kingdom (UK)": [
    "England", "Scotland", "Wales", "Northern Ireland"
  ],
  "Mexico (MX)": [
    "Ciudad de México", "Jalisco", "Nuevo León", "Estado de México", "Guanajuato", "Puebla", "Veracruz", "Yucatán", "Quintana Roo", "Baja California", "Chihuahua", "Sonora", "Querétaro", "Tamaulipas", "Coahuila", "Sinaloa", "Michoacán", "San Luis Potosí", "Tabasco", "Aguascalientes", "Hidalgo", "Morelos", "Durango", "Zacatecas", "Nayarit", "Campeche", "Oaxaca", "Chiapas", "Guerrero", "Tlaxcala", "Colima", "Baja California Sur"
  ]
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, currency } = useCart();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [billing, setBilling] = useState({
    firstName: "",
    lastName: "",
    country: "United States (US)",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "Texas",
    zip: "",
    phone: "",
  });

  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    country: "United States (US)",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "Texas",
    zip: "",
    phone: "",
  });

  const [orderNotes, setOrderNotes] = useState("");

  // Prado Commerce Merchant Shipping Methods State
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string>("");

  // Prado Commerce Payment Options State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("CREDIT_CARD");

  // Payment Details
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [saveToAccount, setSaveToAccount] = useState(false);

  // Terms Agreement
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Coupon Code
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Load user session info on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.loggedIn && data.user) {
          setUser(data.user);
          setEmail(data.user.email || "");
          setBilling((prev) => ({
            ...prev,
            firstName: data.user.firstName || "",
            lastName: data.user.lastName || "",
          }));
        }
      } catch (err) {
        console.error("Session fetch error:", err);
      }
    }
    checkSession();
  }, []);

  // Fetch active merchant payment options from Prado Commerce backend
  useEffect(() => {
    async function fetchPaymentMethods() {
      try {
        const res = await fetch("/api/payment/methods");
        const data = await res.json();
        if (data.methods && data.methods.length > 0) {
          setPaymentMethods(data.methods);
          setSelectedPaymentId(data.methods[0].id);
        }
      } catch (err) {
        console.error("Error fetching payment methods:", err);
      }
    }
    fetchPaymentMethods();
  }, []);

  // Fetch dynamic shipping options from Prado Commerce backend whenever country/state changes
  const activeCountry = shipToDifferentAddress ? shipping.country : billing.country;
  const activeState = shipToDifferentAddress ? shipping.state : billing.state;

  useEffect(() => {
    async function fetchShippingMethods() {
      try {
        const res = await fetch(
          `/api/shipping/methods?country=${encodeURIComponent(activeCountry)}&state=${encodeURIComponent(activeState)}`
        );
        const data = await res.json();
        if (data.methods && data.methods.length > 0) {
          setShippingMethods(data.methods);
          setSelectedShippingId(data.methods[0].id || data.methods[0].name);
        }
      } catch (err) {
        console.error("Error fetching shipping methods:", err);
      }
    }
    fetchShippingMethods();
  }, [activeCountry, activeState]);

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "country") {
      const availableRegions = REGIONS_BY_COUNTRY[value] || [];
      setBilling((prev) => ({
        ...prev,
        country: value,
        state: availableRegions[0] || "",
      }));
    } else {
      setBilling((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "country") {
      const availableRegions = REGIONS_BY_COUNTRY[value] || [];
      setShipping((prev) => ({
        ...prev,
        country: value,
        state: availableRegions[0] || "",
      }));
    } else {
      setShipping((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setDiscountAmount(totalPrice * 0.1);
    setCouponApplied(true);
  };

  const selectedMethod = shippingMethods.find((m) => (m.id || m.name) === selectedShippingId) || shippingMethods[0];
  const finalShippingCost = selectedMethod ? Number(selectedMethod.price || 0) : 5.00;
  const salesTax = (totalPrice - discountAmount) * 0.0825;
  const finalTotal = Math.max(0, totalPrice - discountAmount + finalShippingCost + salesTax);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!agreeTerms) {
      alert("Please read and agree to the website terms and conditions.");
      return;
    }

    setLoading(true);

    try {
      const activeShippingAddress = shipToDifferentAddress ? shipping : billing;

      const response = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          shipping: {
            email: email || user?.email || "",
            firstName: activeShippingAddress.firstName,
            lastName: activeShippingAddress.lastName,
            address: `${activeShippingAddress.streetAddress} ${activeShippingAddress.apartment}`.trim(),
            city: activeShippingAddress.city,
            country: activeShippingAddress.country,
            state: activeShippingAddress.state,
            postalCode: activeShippingAddress.zip,
            phone: activeShippingAddress.phone,
          },
          shippingMethod: selectedMethod?.name || "Standard Shipping",
          orderNotes,
          paymentMethod: selectedPaymentId,
          total: finalTotal,
          currency,
        }),
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

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
        <h1 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Your cart is empty</h1>
        <Link href="/products" className="text-sm font-medium underline text-zinc-900 dark:text-white">
          Browse products to add items
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-6xl p-4 sm:p-8 min-h-screen">
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Customer Information, Billing, Shipping & Payment */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Customer Information */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Customer information</h2>
            {user ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Welcome Back <span className="font-semibold">{user.firstName || "Customer"}</span> ({user.email})
              </p>
            ) : (
              <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
                <p>
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-black dark:text-white underline">
                    Sign in
                  </Link>{" "}
                  or{" "}
                  <Link href="/login" className="font-semibold text-black dark:text-white underline">
                    Register
                  </Link>
                </p>
                <div>
                  <input
                    required
                    type="email"
                    placeholder="Email Address *"
                    className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Billing Details */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Billing details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  required
                  type="text"
                  name="firstName"
                  placeholder="First name *"
                  className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                  value={billing.firstName}
                  onChange={handleBillingChange}
                />
              </div>
              <div>
                <input
                  required
                  type="text"
                  name="lastName"
                  placeholder="Last name *"
                  className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                  value={billing.lastName}
                  onChange={handleBillingChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-1">Country / Region *</label>
              <select
                name="country"
                className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                value={billing.country}
                onChange={handleBillingChange}
              >
                <option value="United States (US)">United States (US)</option>
                <option value="Belize (BZ)">Belize (BZ)</option>
                <option value="Costa Rica (CR)">Costa Rica (CR)</option>
                <option value="El Salvador (SV)">El Salvador (SV)</option>
                <option value="Guatemala (GT)">Guatemala (GT)</option>
                <option value="Honduras (HN)">Honduras (HN)</option>
                <option value="Nicaragua (NI)">Nicaragua (NI)</option>
                <option value="Panama (PA)">Panama (PA)</option>
                <option value="Canada (CA)">Canada (CA)</option>
                <option value="United Kingdom (UK)">United Kingdom (UK)</option>
                <option value="Mexico (MX)">Mexico (MX)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  required
                  type="text"
                  name="streetAddress"
                  placeholder="House number and street name *"
                  className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                  value={billing.streetAddress}
                  onChange={handleBillingChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                  value={billing.apartment}
                  onChange={handleBillingChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <input
                  required
                  type="text"
                  name="city"
                  placeholder="Town / City *"
                  className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                  value={billing.city}
                  onChange={handleBillingChange}
                />
              </div>
              <div>
                {REGIONS_BY_COUNTRY[billing.country] ? (
                  <select
                    name="state"
                    className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                    value={billing.state}
                    onChange={handleBillingChange}
                  >
                    {REGIONS_BY_COUNTRY[billing.country].map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    required
                    type="text"
                    name="state"
                    placeholder="State / Province *"
                    className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                    value={billing.state}
                    onChange={handleBillingChange}
                  />
                )}
              </div>
              <div>
                <input
                  required
                  type="text"
                  name="zip"
                  placeholder="Postcode / ZIP *"
                  className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                  value={billing.zip}
                  onChange={handleBillingChange}
                />
              </div>
            </div>

            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                value={billing.phone}
                onChange={handleBillingChange}
              />
            </div>
          </section>

          {/* Ship to a different address checkbox */}
          <section className="space-y-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <label className="flex items-center space-x-3 cursor-pointer text-sm font-semibold text-zinc-900 dark:text-white">
              <input
                type="checkbox"
                checked={shipToDifferentAddress}
                onChange={(e) => setShipToDifferentAddress(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black dark:border-zinc-700"
              />
              <span>Ship to a different address?</span>
            </label>

            {shipToDifferentAddress && (
              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    required={shipToDifferentAddress}
                    type="text"
                    name="firstName"
                    placeholder="First name *"
                    className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                    value={shipping.firstName}
                    onChange={handleShippingChange}
                  />
                  <input
                    required={shipToDifferentAddress}
                    type="text"
                    name="lastName"
                    placeholder="Last name *"
                    className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                    value={shipping.lastName}
                    onChange={handleShippingChange}
                  />
                </div>

                <div>
                  <select
                    name="country"
                    className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                    value={shipping.country}
                    onChange={handleShippingChange}
                  >
                    <option value="United States (US)">United States (US)</option>
                    <option value="Belize (BZ)">Belize (BZ)</option>
                    <option value="Costa Rica (CR)">Costa Rica (CR)</option>
                    <option value="El Salvador (SV)">El Salvador (SV)</option>
                    <option value="Guatemala (GT)">Guatemala (GT)</option>
                    <option value="Honduras (HN)">Honduras (HN)</option>
                    <option value="Nicaragua (NI)">Nicaragua (NI)</option>
                    <option value="Panama (PA)">Panama (PA)</option>
                    <option value="Canada (CA)">Canada (CA)</option>
                    <option value="United Kingdom (UK)">United Kingdom (UK)</option>
                    <option value="Mexico (MX)">Mexico (MX)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    required={shipToDifferentAddress}
                    type="text"
                    name="streetAddress"
                    placeholder="House number and street name *"
                    className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                    value={shipping.streetAddress}
                    onChange={handleShippingChange}
                  />
                  <input
                    type="text"
                    name="apartment"
                    placeholder="Apartment, suite, unit, etc. (optional)"
                    className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                    value={shipping.apartment}
                    onChange={handleShippingChange}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    required={shipToDifferentAddress}
                    type="text"
                    name="city"
                    placeholder="Town / City *"
                    className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                    value={shipping.city}
                    onChange={handleShippingChange}
                  />
                  {REGIONS_BY_COUNTRY[shipping.country] ? (
                    <select
                      name="state"
                      className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                      value={shipping.state}
                      onChange={handleShippingChange}
                    >
                      {REGIONS_BY_COUNTRY[shipping.country].map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      required={shipToDifferentAddress}
                      type="text"
                      name="state"
                      placeholder="State / Province *"
                      className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                      value={shipping.state}
                      onChange={handleShippingChange}
                    />
                  )}
                  <input
                    required={shipToDifferentAddress}
                    type="text"
                    name="zip"
                    placeholder="Postcode / ZIP *"
                    className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                    value={shipping.zip}
                    onChange={handleShippingChange}
                  />
                </div>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                  value={shipping.phone}
                  onChange={handleShippingChange}
                />
              </div>
            )}

            {/* Order Notes */}
            <div className="pt-2">
              <textarea
                rows={3}
                placeholder="Notes about your order, e.g. special notes for delivery."
                className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white resize-y"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
            </div>
          </section>

          {/* Shipping Method Dropdown */}
          <section className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5" />
              <span>Shipping Method</span>
            </h2>

            {shippingMethods.length === 0 ? (
              <p className="text-sm text-zinc-500 animate-pulse">
                Loading shipping options...
              </p>
            ) : (
              <select
                className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                value={selectedShippingId}
                onChange={(e) => setSelectedShippingId(e.target.value)}
              >
                {shippingMethods.map((method) => {
                  const key = method.id || method.name;
                  const priceText = Number(method.price) === 0 ? "Free" : `$${Number(method.price).toFixed(2)}`;
                  return (
                    <option key={key} value={key}>
                      {method.name} ({priceText}) {method.description ? `- ${method.description}` : ""}
                    </option>
                  );
                })}
              </select>
            )}
          </section>

          {/* Dynamic Prado Commerce Payment Method Dropdown Section */}
          <section className="space-y-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              <span>Payment Option</span>
            </h2>

            {paymentMethods.length === 0 ? (
              <p className="text-sm text-zinc-500 animate-pulse">
                Loading payment options...
              </p>
            ) : (
              <select
                className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white"
                value={selectedPaymentId}
                onChange={(e) => setSelectedPaymentId(e.target.value)}
              >
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name} {method.description ? `- ${method.description}` : ""}
                  </option>
                ))}
              </select>
            )}

            {/* Dynamic Card Inputs vs Offline Payment Note */}
            {selectedPaymentId === "CREDIT_CARD" ? (
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">Card Details</span>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                    <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white">VISA</span>
                    <span className="px-1.5 py-0.5 rounded bg-red-600 text-white">MC</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-400 text-white">AMEX</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white">DISC</span>
                  </div>
                </div>

                <div className="flex border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 divide-x divide-zinc-200 dark:divide-zinc-700 overflow-hidden">
                  <div className="flex-1 flex items-center px-3">
                    <CreditCard className="w-5 h-5 text-zinc-400 mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      required={selectedPaymentId === "CREDIT_CARD"}
                      placeholder="Card number"
                      className="w-full py-2.5 bg-transparent text-sm text-zinc-900 dark:text-white outline-none"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="w-24 px-3">
                    <input
                      type="text"
                      required={selectedPaymentId === "CREDIT_CARD"}
                      placeholder="MM/YY"
                      className="w-full py-2.5 bg-transparent text-sm text-zinc-900 dark:text-white text-center outline-none"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>
                  <div className="w-20 px-3">
                    <input
                      type="text"
                      required={selectedPaymentId === "CREDIT_CARD"}
                      placeholder="CVV"
                      className="w-full py-2.5 bg-transparent text-sm text-zinc-900 dark:text-white text-center outline-none"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                    />
                  </div>
                </div>

                <label className="flex items-center space-x-2 cursor-pointer text-xs text-zinc-600 dark:text-zinc-400">
                  <input
                    type="checkbox"
                    checked={saveToAccount}
                    onChange={(e) => setSaveToAccount(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black dark:border-zinc-700"
                  />
                  <span>Securely Save to Account</span>
                </label>
              </div>
            ) : (
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <p className="font-semibold text-zinc-900 dark:text-white">Cash on Delivery / Manual Payment</p>
                <p>Pay with cash upon delivery or follow the store manual transfer instructions provided after placing your order.</p>
              </div>
            )}
          </section>

          {/* Terms & Submit Button */}
          <section className="space-y-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
            </p>

            <label className="flex items-start space-x-3 cursor-pointer text-xs text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black dark:border-zinc-700 mt-0.5"
              />
              <span>I have read and agree to the website terms and conditions *</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-md bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-bold text-base shadow-md disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? "Processing Order..." : "Place order"}</span>
            </button>
          </section>

        </div>

        {/* RIGHT COLUMN: Your Order Summary & Coupon Code */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Order Summary Card */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-zinc-900 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-3">
              Your order
            </h2>

            {/* Products Table */}
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span>Product</span>
                <span>Subtotal</span>
              </div>

              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm py-2">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 flex-shrink-0">
                      <Image
                        src={item.image || "/next.svg"}
                        alt={item.name}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                    <div>
                      <span className="font-medium text-zinc-900 dark:text-white line-clamp-1">{item.name}</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">× {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900 dark:text-white">${totalPrice.toFixed(2)}</span>
              </div>

              {couponApplied && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Coupon Discount</span>
                  <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Shipping ({selectedMethod?.name || "Standard"})</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {finalShippingCost === 0 ? "Free" : `$${finalShippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Sales Tax</span>
                <span className="font-semibold text-zinc-900 dark:text-white">${salesTax.toFixed(2)}</span>
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex justify-between items-center text-lg font-bold text-zinc-900 dark:text-white">
                <span>Total</span>
                <span className="text-xl">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Coupon Code Section */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Coupon Code"
              className="flex-1 p-3 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm dark:bg-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="px-6 py-3 rounded-md bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-semibold text-sm shadow transition-colors"
            >
              Apply
            </button>
          </div>

        </div>

      </form>
    </main>
  );
}
