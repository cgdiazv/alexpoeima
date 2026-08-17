"use client";

import { useState } from "react";
import { CheckCircle2, Clock, ShieldCheck, Send, HelpCircle } from "lucide-react";

export default function CommissionsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Portrait",
    dimensions: "36x48 inches",
    budget: "$1,500 - $3,000",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: ["alexpoeima@gmail.com", formData.email],
          subject: `[Commission Request] ${formData.projectType} - ${formData.name}`,
          replyTo: formData.email,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #d97706;">New Fine Art Commission Inquiry</h2>
              <p><strong>Name:</strong> ${formData.name}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Phone:</strong> ${formData.phone || "Not provided"}</p>
              <p><strong>Project Type:</strong> ${formData.projectType}</p>
              <p><strong>Estimated Dimensions:</strong> ${formData.dimensions}</p>
              <p><strong>Target Budget Range:</strong> ${formData.budget}</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p><strong>Project Description & Vision:</strong></p>
              <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${formData.description}</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #888;">Sent via Prado Commerce Resend Integration (From: notifications@pradocommerce.com)</p>
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
    <main className="flex-1 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Hero Section */}
      <section className="py-16 md:py-24 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-4">
          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 rounded-full border border-amber-200 dark:border-amber-900">
            Bespoke Fine Art
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Commission a Unique Masterpiece
          </h1>
          <p className="text-base md:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed">
            Collaborate directly with Alex Poeima to create a custom original oil or acrylic painting tailored specifically to your home, office, or private art collection.
          </p>
        </div>
      </section>

      {/* Commission Process */}
      <section className="py-16 max-w-6xl mx-auto px-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">The Commission Process</h2>
          <p className="text-zinc-600 dark:text-zinc-400">From initial vision to your wall—crafted with precision and care.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="relative p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Step 01</span>
            <h3 className="text-lg font-bold">Consultation</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              We discuss your space, color palette, dimensions, and subject matter to align on your vision.
            </p>
          </div>

          <div className="relative p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Step 02</span>
            <h3 className="text-lg font-bold">Concept Study</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Alex prepares a digital or compositional sketch for your review and approval before painting begins.
            </p>
          </div>

          <div className="relative p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Step 03</span>
            <h3 className="text-lg font-bold">Creation & Updates</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              As the artwork progresses in the studio, you receive behind-the-scenes photo updates.
            </p>
          </div>

          <div className="relative p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Step 04</span>
            <h3 className="text-lg font-bold">Varnish & Delivery</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Once dried and varnished, your painting is shipped in custom protective crating with a Certificate of Authenticity.
            </p>
          </div>
        </div>
      </section>

      {/* Inquiry Form & Info */}
      <section className="py-16 md:py-24 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Start Your Inquiry</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Fill out the form with your project details. Alex accepts a limited number of private commissions each season to ensure maximum depth and quality for every canvas.
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3.5 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block text-zinc-900 dark:text-zinc-100">Typical Timeline</strong>
                <span className="text-zinc-600 dark:text-zinc-400">4 to 8 weeks depending on size and drying time for oil paints.</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block text-zinc-900 dark:text-zinc-100">Deposit & Payment</strong>
                <span className="text-zinc-600 dark:text-zinc-400">50% deposit upon contract sign-off, 50% upon final artwork completion.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
              <h3 className="text-2xl font-bold">Commission Request Received!</h3>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                Thank you for reaching out. Alex Poeima will review your request details and reply to <strong>{formData.email}</strong> within 1-2 business days.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    Artwork Subject/Type
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                  >
                    <option value="Portrait">Portrait / Figure</option>
                    <option value="Abstract">Abstract & Expressive</option>
                    <option value="Landscape">Landscape / Seascape</option>
                    <option value="Commercial">Commercial / Architectural</option>
                    <option value="Other">Custom Concept</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                    Preferred Dimensions
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="e.g. 36x48 inches, 100x150 cm"
                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                    Estimated Budget Range
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                  >
                    <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                    <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000+">$10,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                  Project Description & Vision *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about the room, color preferences, mood, or inspiration images..."
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {sending ? "Sending Request..." : "Submit Commission Request"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
