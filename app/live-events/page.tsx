"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Heart, Award, Users, CheckCircle2, ArrowRight, Music } from "lucide-react";

export default function LiveEventsPage() {
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [eventData, setEventData] = useState({
    name: "",
    email: "",
    eventType: "Wedding",
    eventDate: "",
    location: "",
    details: "",
  });

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: ["alexpoeima@gmail.com", eventData.email],
          subject: `[Live Event Booking] ${eventData.eventType} - ${eventData.name}`,
          replyTo: eventData.email,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #d97706;">Live Event Painting Availability Check</h2>
              <p><strong>Name:</strong> ${eventData.name}</p>
              <p><strong>Email:</strong> ${eventData.email}</p>
              <p><strong>Event Type:</strong> ${eventData.eventType}</p>
              <p><strong>Event Date:</strong> ${eventData.eventDate}</p>
              <p><strong>Location / Venue:</strong> ${eventData.location}</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #888;">Sent via Prado Commerce Resend Integration (From: notifications@pradocommerce.com)</p>
            </div>
          `,
        }),
      });
      setBookingSubmitted(true);
    } catch (err) {
      console.error("Failed to send live event email:", err);
      setBookingSubmitted(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="flex-1 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Hero Header */}
      <section className="relative py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-4">
          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 rounded-full border border-amber-200 dark:border-amber-900">
            Live Performance Art
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Preserve Magical Moments Live on Canvas
          </h1>
          <p className="text-base md:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed">
            Elevate your wedding, gala, or celebration with a live event painting experience by Alexpoeima. Guests watch the painting unfold in real-time while a priceless heirloom is born.
          </p>
        </div>
      </section>

      {/* Event Types Offered */}
      <section className="py-16 max-w-6xl mx-auto px-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">Live Painting Offerings</h2>
          <p className="text-zinc-600 dark:text-zinc-400">Tailored entertainment and artistic keepsake for any luxury occasion.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Luxury Weddings</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Capturing the first kiss, first dance, or ceremony backdrop live on canvas. A captivating experience for guests and a treasured masterpiece for the couple.
            </p>
          </div>

          <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Corporate Galas</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Interactive live art performance for brand launches, executive celebrations, and milestone galas. Compositions can incorporate corporate themes and logos.
            </p>
          </div>

          <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Charity Auctions</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              High-impact live artwork created during the event and auctioned off live later in the evening to maximize fundraising revenue for worthy causes.
            </p>
          </div>
        </div>
      </section>

      {/* Package Features */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">What Is Included in the Experience</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Pre-Event Consultation:</strong> Selecting background elements, key figures, pose, and canvas size.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>5-8 Hours Live Painting:</strong> Alex sets up early and paints live throughout your ceremony & reception.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Guest Engagement:</strong> Guests love watching the canvas evolve and chatting with the artist.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Studio Touch-ups & Framing:</strong> Studio refinement, protective varnish seal, and ready-to-hang delivery.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <h3 className="text-2xl font-bold mb-6">Inquire Event Availability</h3>
            {bookingSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-xl font-bold">Booking Request Sent</h4>
                <p className="text-sm text-zinc-500">We will check Alex's travel schedule and respond within 24 hours.</p>
                <button
                  onClick={() => setBookingSubmitted(false)}
                  className="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={eventData.name}
                    onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={eventData.email}
                    onChange={(e) => setEventData({ ...eventData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">Event Type</label>
                    <select
                      value={eventData.eventType}
                      onChange={(e) => setEventData({ ...eventData, eventType: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm focus:outline-none"
                    >
                      <option value="Wedding">Wedding</option>
                      <option value="Corporate">Corporate Gala</option>
                      <option value="Charity">Charity Event</option>
                      <option value="Private Party">Private Party</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">Event Date</label>
                    <input
                      type="date"
                      required
                      value={eventData.eventDate}
                      onChange={(e) => setEventData({ ...eventData, eventDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">Location / Venue</label>
                  <input
                    type="text"
                    required
                    value={eventData.location}
                    onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm focus:outline-none"
                    placeholder="City, State / Venue Name"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-lg shadow-md transition-colors disabled:opacity-50"
                >
                  {sending ? "Checking Availability..." : "Check Date Availability"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
