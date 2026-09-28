"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, Clock, ShieldCheck, Send, PawPrint, User, Image as ImageIcon, Sparkles, Ruler, Calculator } from "lucide-react";

interface CanvasSize {
  id: string;
  label: string;
  cm: string;
  title: string;
  desc: string;
  basePrice: number | null;
  popular?: boolean;
}

const CANVAS_SIZES: CanvasSize[] = [
  {
    id: "12x16",
    label: '12" × 16"',
    cm: "30 × 40 cm",
    title: "Small / Accent",
    desc: "Ideal for single pet portraits or cozy spaces",
    basePrice: 450,
  },
  {
    id: "18x24",
    label: '18" × 24"',
    cm: "45 × 60 cm",
    title: "Classic Canvas",
    desc: "Most popular choice for home portraits & fine art",
    basePrice: 750,
    popular: true,
  },
  {
    id: "24x36",
    label: '24" × 36"',
    cm: "60 × 90 cm",
    title: "Gallery Statement",
    desc: "High-impact centerpiece for living rooms or offices",
    basePrice: 1250,
  },
  {
    id: "36x48",
    label: '36" × 48"',
    cm: "90 × 120 cm",
    title: "Grand Masterpiece",
    desc: "Commanding large-scale original oil canvas",
    basePrice: 2200,
  },
  {
    id: "custom",
    label: "Custom Size",
    cm: "Bespoke Dimensions",
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

export function CommissionCalculatorSection() {
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
        // ~$1.30 per sq in, minimum $450
        price = Math.max(450, Math.round(w * h * 1.3));
      } else {
        price = 0;
      }
    } else if (sizeObj && sizeObj.basePrice) {
      price = sizeObj.basePrice;
      sizeLabel = sizeObj.label;
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

    const sizeText =
      selectedSizeId === "custom"
        ? `Custom (${customWidth}" x ${customHeight}")`
        : CANVAS_SIZES.find((s) => s.id === selectedSizeId)?.label || selectedSizeId;

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
          to: ["alexpoeima@gmail.com", formData.email],
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

  return (
    <section id="commission-calculator" className="py-16 md:py-24 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
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
              <span className="text-zinc-600 dark:text-zinc-400">3 to 6 weeks depending on size and drying schedule.</span>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
            <div>
              <strong className="block text-zinc-900 dark:text-zinc-100">50/50 Payment Terms</strong>
              <span className="text-zinc-600 dark:text-zinc-400">50% deposit upon sketch approval, remaining 50% prior to final delivery.</span>
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
              <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                2. Select Canvas Dimensions *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CANVAS_SIZES.map((size) => {
                  const isSelected = selectedSizeId === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSizeId(size.id)}
                      className={`p-3.5 rounded-xl text-left border relative transition-all ${
                        isSelected
                          ? "border-amber-600 bg-amber-50/50 dark:bg-amber-950/40 dark:border-amber-500 ring-1 ring-amber-500"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      {size.popular && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white">
                          Popular
                        </span>
                      )}
                      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{size.label}</div>
                      <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">{size.cm}</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{size.desc}</div>
                      {size.basePrice && (
                        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-2">
                          From ${size.basePrice.toLocaleString()} USD
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Dimensions Input */}
              {selectedSizeId === "custom" && (
                <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                  <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Enter Desired Dimensions (Inches)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Width (in)</span>
                      <input
                        type="number"
                        min="10"
                        max="120"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Height (in)</span>
                      <input
                        type="number"
                        min="10"
                        max="120"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Client Contact Info */}
            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                3. Your Contact Information *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Tell Alex About Your Vision & Details *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your subject, pet name/temperament, desired color accents, background atmosphere, or any deadline considerations..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 px-6 rounded-xl bg-[#9e8b43] hover:bg-[#8a7833] text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
            >
              {sending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Inquiry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Request Commission Consultation</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
              No immediate payment required. You will receive a personal reply with direct consultation and sketch study schedule.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
