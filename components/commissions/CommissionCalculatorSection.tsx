"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, ShieldCheck, Send, PawPrint, User, Image as ImageIcon, Sparkles, Ruler, Calculator, Mail, ArrowRight } from "lucide-react";

interface CanvasSize {
  id: string;
  label: string;
  inches: string;
  title: string;
  desc: string;
  basePrice: number | null;
  popular?: boolean;
}

const CANVAS_SIZES: CanvasSize[] = [
  {
    id: "12x16",
    label: "30 × 40 cm",
    inches: '12" × 16"',
    title: "Small / Accent",
    desc: "Ideal for single pet portraits or cozy spaces",
    basePrice: 100,
  },
  {
    id: "18x24",
    label: "40 × 50 cm",
    inches: '18" × 24"',
    title: "Classic Canvas",
    desc: "Ideal size for pet or human portraits",
    basePrice: 150,
    popular: true,
  },
  {
    id: "24x36",
    label: "50 × 60 cm",
    inches: '24" × 36"',
    title: "Gallery Statement",
    desc: "Most Popular choice for Home & Human portraits",
    basePrice: 120,
  },
  {
    id: "36x48",
    label: "60 × 80 cm",
    inches: '36" × 48"',
    title: "Grand Masterpiece",
    desc: "High-Impact centerpiece for living rooms or offices",
    basePrice: 260,
  },
  {
    id: "custom",
    label: "Custom Size",
    inches: "Bespoke Dimensions",
    title: "Custom Dimension",
    desc: "Tailored to your specific architectural space requirements",
    basePrice: null,
  },
];

const PROJECT_TYPES = [
  { id: "Pet Portrait", label: "Pet Portrait", icon: PawPrint, desc: "Dogs, cats, horses & beloved pets" },
  { id: "Human Portrait", label: "Human / Family Portrait", icon: User, desc: "Individual, couple or family subjects" },
  { id: "Landscape", label: "Fine Art Landscape", icon: ImageIcon, desc: "Seascapes, mountains & nature scenes" },
  { id: "Abstract", label: "Abstract & Expressive", icon: Sparkles, desc: "Texture, light, & color compositions" },
  { id: "Custom Concept", label: "Custom Concept", icon: Ruler, desc: "Unique artistic vision or commercial work" },
];

const ACCESS_STORAGE_KEY = "alexpoeima_commissions_calculator_unlocked";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

function CommissionCalculatorInner() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("piece");

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const [projectType, setProjectType] = useState("Pet Portrait");
  const [selectedSizeId, setSelectedSizeId] = useState("18x24");
  const [customWidth, setCustomWidth] = useState("30");
  const [customHeight, setCustomHeight] = useState("40");
  const [petCount, setPetCount] = useState("1");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  const [gateEmail, setGateEmail] = useState("");
  const [gateError, setGateError] = useState("");

  // Restore active session for at least 7 days from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ACCESS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.expiresAt && Date.now() < parsed.expiresAt) {
          setIsUnlocked(true);
          if (parsed.email) {
            setFormData((prev) => ({ ...prev, email: parsed.email }));
            setGateEmail(parsed.email);
          }
        } else {
          localStorage.removeItem(ACCESS_STORAGE_KEY);
        }
      }
    } catch {
      // Ignore storage errors (e.g. cookies/localStorage blocked)
    } finally {
      setHasCheckedStorage(true);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = gateEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setGateError("Please enter a valid email address");
      return;
    }
    setFormData((prev) => ({ ...prev, email: trimmed }));
    setGateError("");
    setIsUnlocked(true);

    // Save session in localStorage for 7 days
    try {
      const now = Date.now();
      const payload = {
        email: trimmed,
        unlockedAt: now,
        expiresAt: now + SEVEN_DAYS_MS,
      };
      localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage errors
    }

    // Send the captured lead email to admin
    fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "alexandra.robles@alexpoeima.com",
        replyTo: trimmed,
        subject: `[New Lead] Commissions Calculator Access - ${trimmed}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #18181b; background-color: #ffffff;">
            <h2 style="color: #9e8b43; margin-top: 0;">New Commission Lead Captured</h2>
            <p>A prospective client has entered their email to access the Commissions Calculator on <strong>alexpoeima.com</strong>:</p>
            
            <div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9e8b43;">
              <p style="margin: 4px 0; font-size: 15px;"><strong>Entered Email:</strong> <a href="mailto:${trimmed}" style="color: #9e8b43; text-decoration: none; font-weight: bold;">${trimmed}</a></p>
              <p style="margin: 4px 0; font-size: 13px; color: #71717a;"><strong>Date & Time:</strong> ${new Date().toLocaleString()}</p>
              ${reference ? `<p style="margin: 4px 0; font-size: 13px; color: #71717a;"><strong>Artwork Reference:</strong> ${reference}</p>` : ""}
            </div>
            
            <p style="font-size: 13px; color: #52525b;">The user is currently reviewing canvas options and estimated pricing in the calculator.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0;" />
            <p style="font-size: 12px; color: #a1a1aa;">Notification from Alexpoeima Art Commissions Platform</p>
          </div>
        `,
      }),
    }).catch((err) => {
      console.error("Failed to send admin notification for calculator lead:", err);
    });
  };

  useEffect(() => {
    if (reference) {
      setFormData((prev) => {
        if (!prev.description) {
          return {
            ...prev,
            description: `I am interested in commissioning a custom piece inspired by "${reference}". `,
          };
        }
        return prev;
      });
    }
  }, [reference]);

  // Calculate price dynamically
  const calculatedPricing = useMemo(() => {
    const sizeObj = CANVAS_SIZES.find((s) => s.id === selectedSizeId);
    let price = 0;
    let sizeLabel = "";

    if (selectedSizeId === "custom") {
      const w = parseFloat(customWidth) || 0;
      const h = parseFloat(customHeight) || 0;
      sizeLabel = w > 0 && h > 0 ? `Custom (${w}" × ${h}")` : "Custom Dimensions";
      if (w > 0 && h > 0) {
        // ~$1.30 per sq in, minimum $150
        price = Math.max(150, Math.round(w * h * 1.3));
      } else {
        price = 0;
      }
    } else if (sizeObj && sizeObj.basePrice) {
      price = sizeObj.basePrice;
      sizeLabel = `${sizeObj.label} (${sizeObj.inches})`;
    }

    // Additional pet surcharge if pet portrait
    let petSurcharge = 0;
    if (projectType === "Pet Portrait") {
      if (petCount === "2") petSurcharge = 150;
      if (petCount === "3+") petSurcharge = 300;
    }

    const totalPrice = price > 0 ? price + petSurcharge : 0;

    return {
      sizeLabel,
      basePrice: price,
      petSurcharge,
      totalPrice,
    };
  }, [selectedSizeId, customWidth, customHeight, projectType, petCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const sizeObj = CANVAS_SIZES.find((s) => s.id === selectedSizeId);
    const sizeText =
      selectedSizeId === "custom"
        ? `Custom (${customWidth}" x ${customHeight}")`
        : sizeObj ? `${sizeObj.label} (${sizeObj.inches})` : selectedSizeId;

    const priceText =
      calculatedPricing.totalPrice > 0
        ? `$${calculatedPricing.totalPrice.toLocaleString()} USD`
        : "Quote on Request";

    const petDetail = projectType === "Pet Portrait" ? ` (${petCount} Pet${petCount !== "1" ? "s" : ""})` : "";

    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: ["alexandra.robles@alexpoeima.com", "alexpoeima@gmail.com", formData.email],
          subject: `[Commission Request] ${projectType}${petDetail} - ${sizeText} - ${formData.name}`,
          replyTo: formData.email,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #18181b; background-color: #ffffff;">
              <h2 style="color: #d97706; margin-top: 0;">New Fine Art Commission Inquiry</h2>
              <p>Alexpoeima has received a new custom artwork request with the following specifications:</p>
              
              <div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 4px 0;"><strong>Client Name:</strong> ${formData.name}</p>
                <p style="margin: 4px 0;"><strong>Email:</strong> ${formData.email}</p>
                <p style="margin: 4px 0;"><strong>Phone:</strong> ${formData.phone || "Not provided"}</p>
                <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 12px 0;" />
                <p style="margin: 4px 0;"><strong>Artwork Type:</strong> ${projectType}${petDetail}</p>
                <p style="margin: 4px 0;"><strong>Canvas Dimensions:</strong> ${sizeText}</p>
                <p style="margin: 4px 0;"><strong>Medium:</strong> Acrylic on Canvas</p>
                <p style="margin: 4px 0; font-size: 16px; color: #b45309;"><strong>Estimated Price:</strong> ${priceText}</p>
              </div>
              
              <p><strong>Project Vision & Details:</strong></p>
              <p style="white-space: pre-wrap; background: #fafafa; padding: 15px; border-radius: 8px; border: 1px solid #e4e4e7;">${formData.description}</p>
              
              <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0;" />
              <p style="font-size: 12px; color: #888;">Sent via Alexpoeima Art Commissions Platform</p>
            </div>
          `,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to send commission email:", err);
      setSubmitted(true);
    } finally {
      setSending(false);
    }
  };

  if (!hasCheckedStorage) {
    return (
      <section id="commission-calculator" className="py-24 max-w-4xl mx-auto px-6 text-center">
        <div className="inline-block w-7 h-7 border-2 border-[#9e8b43] border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (!isUnlocked) {
    return (
      <section id="commission-calculator" className="py-16 md:py-24 max-w-4xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl p-8 sm:p-12 md:p-16 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#9e8b43] dark:text-[#decf92] mx-auto shadow-sm">
            <Calculator className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />
          </div>

          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9e8b43] block">
              Custom Artwork Commission
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Commission Calculator
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
              Enter your email and commission your order, choose size, media, and receive an estimated price overview.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="max-w-md mx-auto pt-2 space-y-3">
            <div className="relative flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={gateEmail}
                  onChange={(e) => {
                    setGateEmail(e.target.value);
                    if (gateError) setGateError("");
                  }}
                  placeholder="Enter your email address..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#9e8b43] text-sm shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#9e8b43] hover:bg-[#8a7833] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#decf92] shrink-0 cursor-pointer"
              >
                <span>View Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {gateError && (
              <p className="text-xs text-red-500 font-medium">{gateError}</p>
            )}
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              No obligation • Instant pricing calculation • Private & secure
            </p>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section id="commission-calculator" className="py-16 md:py-24 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-in fade-in duration-300">
      {/* Left Column: Guarantees & Pricing Calculator Breakdown */}
      <div className="lg:col-span-5 space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Commission Calculator</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Customize your canvas preferences to calculate an instant pricing estimate. Alex accepts a limited number of commissions each season to ensure maximum quality.
          </p>
        </div>

        {/* Dynamic Pricing Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-4">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
            <Calculator className="w-5 h-5" strokeWidth={1.5} />
            <span>Estimated Price Overview</span>
          </div>

          <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <div className="flex justify-between">
              <span>Subject:</span>
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{projectType}</strong>
            </div>
            <div className="flex justify-between">
              <span>Canvas Size:</span>
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{calculatedPricing.sizeLabel}</strong>
            </div>
            {projectType === "Pet Portrait" && (
              <div className="flex justify-between">
                <span>Number of Pets:</span>
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{petCount} Pet{petCount !== "1" ? "s" : ""}</strong>
              </div>
            )}
            <div className="flex justify-between">
              <span>Medium:</span>
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100">Acrylic</strong>
            </div>
            {calculatedPricing.petSurcharge > 0 && (
              <div className="flex justify-between text-xs text-amber-700 dark:text-amber-300">
                <span>Additional Pet Fee:</span>
                <span>+${calculatedPricing.petSurcharge}</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-amber-500/20 flex items-baseline justify-between">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Investment:</span>
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {calculatedPricing.totalPrice > 0 ? `$${calculatedPricing.totalPrice.toLocaleString()} USD` : "Quote on Request"}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic">
            * Estimate includes original artwork and consultation. Taxes & express shipping calculated at final agreement.
          </p>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3.5 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
            <div>
              <strong className="block text-zinc-900 dark:text-zinc-100">Typical Lead Time</strong>
              <span className="text-zinc-600 dark:text-zinc-400">2 weeks depending on size and drying schedule, plus shipping time.</span>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
            <div>
              <strong className="block text-zinc-900 dark:text-zinc-100">50/50 Payment Terms</strong>
              <span className="text-zinc-600 dark:text-zinc-400">50% Deposit to begin painting, remaining 50% prior to delivery.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Form with Options */}
      <div className="lg:col-span-7 bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-[#9e8b43] dark:text-[#decf92] mx-auto" strokeWidth={1.5} />
            <h3 className="text-2xl font-bold">Commission Request Submitted!</h3>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
              Thank you for your interest! Alexpoeima will review your requested subject ({projectType}) and canvas size ({calculatedPricing.sizeLabel}) and email <strong>{formData.email}</strong> within 1 business day.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-6 py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
            <>
              {reference && (
                <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#9e8b43] flex-shrink-0" />
                    <span className="text-zinc-800 dark:text-zinc-200">
                      Inquiry inspired by piece: <strong className="text-zinc-950 dark:text-white">{reference}</strong>
                    </span>
                  </div>
                  <span className="text-xs uppercase tracking-wider font-bold text-[#9e8b43]">
                    Custom Piece
                  </span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Artwork Subject / Type Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                1. Select Artwork Subject / Category *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => {
                  const IconComp = type.icon;
                  const isSelected = projectType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setProjectType(type.id)}
                      className={`p-3.5 rounded-xl text-left border transition-all flex items-start gap-3 ${
                        isSelected
                          ? "border-amber-600 bg-amber-50/50 dark:bg-amber-950/40 dark:border-amber-500 ring-1 ring-amber-500"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <IconComp className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isSelected ? "text-amber-600 dark:text-amber-400" : "text-zinc-400"}`} strokeWidth={1.5} />
                      <div>
                        <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{type.label}</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">{type.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Pet Count Option if Pet Portrait selected */}
              {projectType === "Pet Portrait" && (
                <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    How many pets will be in the painting?
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: "1", label: "1 Pet (Included)" },
                      { value: "2", label: "2 Pets (+$150)" },
                      { value: "3+", label: "3+ Pets (+$300)" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPetCount(opt.value)}
                        className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
                          petCount === opt.value
                            ? "bg-amber-600 text-white border-amber-600 font-semibold"
                            : "bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Canvas Size Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  2. Select Canvas Dimensions *
                </label>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Prices update automatically</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CANVAS_SIZES.map((size) => {
                  const isSelected = selectedSizeId === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSizeId(size.id)}
                      className={`relative p-4 rounded-xl text-left border transition-all ${
                        isSelected
                          ? "border-amber-600 bg-amber-50/50 dark:bg-amber-950/40 dark:border-amber-500 ring-1 ring-amber-500"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      {size.popular && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-white rounded-full">
                          Popular
                        </span>
                      )}
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-50">{size.label}</span>
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                          {size.basePrice ? `$${size.basePrice}` : "Custom"}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">{size.inches}</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-1">{size.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Dimensions Fields if "custom" selected */}
              {selectedSizeId === "custom" && (
                <div className="mt-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 space-y-3">
                  <span className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                    Specify Custom Canvas Dimensions (Inches)
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-zinc-500 mb-1">Width (Inches)</label>
                      <input
                        type="number"
                        min="8"
                        max="120"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        placeholder="e.g. 30"
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-500 mb-1">Height (Inches)</label>
                      <input
                        type="number"
                        min="8"
                        max="120"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        placeholder="e.g. 40"
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Contact Information */}
            <div className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                3. Contact & Delivery Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                  Project Vision & Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your pet/subject, background style, room lighting, or special requests..."
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 bg-[#9e8b43] hover:bg-[#8a7833] text-white rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" strokeWidth={1} />
              {sending ? "Submitting Inquiry..." : "Submit Inquiry"}
            </button>
          </form>
          </>
        )}
      </div>
    </section>
  );
}

export function CommissionCalculatorSection() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-zinc-500">Loading calculator...</div>}>
      <CommissionCalculatorInner />
    </Suspense>
  );
}
