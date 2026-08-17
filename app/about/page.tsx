import Link from "next/link";
import { Palette, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Me",
  description: "Learn more about Alex Poeima - Fine artist, live painter, and custom artwork creator.",
};

export default function AboutPage() {
  return (
    <main className="flex-1 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 rounded-full border border-amber-200 dark:border-amber-900 mb-6">
            Fine Artist & Visionary
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 leading-tight">
            Art that speaks beyond words.
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed">
            Welcome to the creative world of <strong className="font-semibold text-zinc-900 dark:text-zinc-100">Alex Poeima</strong>. 
            Blending expressive brushwork, intricate textures, and emotional depth to transform spaces and memorable live moments into timeless fine art.
          </p>
        </div>
      </section>

      {/* Artist Philosophy & Story */}
      <section className="py-16 md:py-24 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            The Journey & Philosophy
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Alex Poeima has spent over a decade perfecting a distinct artistic style that balances bold realism with fluid abstraction. Each creation is guided by a passion for texture, luminous light, and authentic emotional resonance.
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Whether crafting bespoke private commissions, creating fine archival prints, or capturing the high-energy romance of live events on canvas, Alex brings unparalleled dedicated craftsmanship to every brushstroke.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/fine-arts-and-prints"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-medium transition-all shadow-md"
            >
              View Fine Art Collection <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/commissions"
              className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-lg text-sm font-medium transition-all"
            >
              Request a Commission
            </Link>
          </div>
        </div>

        {/* Visual Card / Highlights */}
        <div className="relative rounded-2xl bg-zinc-100 dark:bg-zinc-900 p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <Palette className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Mediums & Specializations</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Oil, Acrylics, Gold Leaf & Mixed Media</p>
            </div>
          </div>
          <hr className="border-zinc-200 dark:border-zinc-800" />
          <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
            <li className="flex items-start gap-3">
              <span className="h-2 w-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>Museum-Grade Prints:</strong> Limited-edition archival Giclée prints crafted on heavyweight cotton rag paper.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-2 w-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>Live Event Painting:</strong> Capturing weddings, galas, and corporate events live on canvas in real-time.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-2 w-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>Custom Private Commissions:</strong> Tailored fine artworks personalized for private residences and corporate spaces.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Key Milestones Grid */}
      <section className="bg-zinc-50 dark:bg-zinc-900/50 py-16 md:py-24 border-t border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Artistic Milestones</h2>
            <p className="text-zinc-600 dark:text-zinc-400">A look at the dedication behind the artwork.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
              <div className="text-4xl font-extrabold text-amber-600 dark:text-amber-400">10+</div>
              <h3 className="text-lg font-semibold">Years of Studio Craft</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Dedicated mastery in traditional fine art techniques, oil painting, and modern expressive compositions.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
              <div className="text-4xl font-extrabold text-amber-600 dark:text-amber-400">150+</div>
              <h3 className="text-lg font-semibold">Live Events Painted</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Preserving once-in-a-lifetime moments live for luxury weddings, corporate galas, and charity auctions.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
              <div className="text-4xl font-extrabold text-amber-600 dark:text-amber-400">500+</div>
              <h3 className="text-lg font-semibold">Collected Worldwide</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Original paintings and limited prints hanging in private art collections across the globe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 max-w-4xl mx-auto px-6 text-center space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Let's Create Something Extraordinary</h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
          Whether you are looking to acquire a piece for your home, book a live painting experience, or discuss a commission, we would love to connect.
        </p>
        <div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg text-base font-semibold transition-all shadow-lg"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
