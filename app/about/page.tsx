import Link from "next/link";
import { Palette, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Alexpoeima | Alexandra Robles",
  description:
    "Alexpoeima is a word inspired by the Greek word poiema (POY-EMA), which means God's work of art in progress. Ephesians 2.10",
};

export default function AboutPage() {
  return (
    <main className="flex-1 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="inline-flex items-center px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#9e8b43] bg-[#decf92]/20 rounded-full border border-[#decf92]/50 mb-6">
            Fine Artist & Visionary
          </span>
          <div className="space-y-3 mb-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-wider text-zinc-900 dark:text-zinc-50 leading-tight uppercase">
              ALEXPOEIMA
            </h1>
            <p className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-widest text-[#9e8b43] uppercase">
              ALEXANDRA ROBLES
            </p>
          </div>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto font-normal leading-relaxed">
            Alexpoeima is a word inspired by the Greek word <em className="italic text-zinc-800 dark:text-zinc-200">poiema</em> (POY-EMA), which means God&apos;s work of art in progress. Ephesians 2.10
          </p>
        </div>
      </section>

      {/* Artist Philosophy & Story */}
      <section className="py-16 md:py-24 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Our Journey Together
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Ephesians 2:10: “For we are God’s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do” (NIV).
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            I believe we are God’s masterpieces in His hands, always learning, growing, and becoming who He intended us to be. My art is an expression of the beauty and hope we all long to bring into this world, into our homes, and into our lives.
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            I believe in the power of art, to transform and bring forward peace.​ I have experienced this myself, since a child, when drawing and painting became my tool for connection, identity, and even as a weapon to defend myself in trying times. Follow my journey, and let´s bring your story into a memory that will last forever.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/fine-arts-and-prints"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#9e8b43] hover:bg-[#8a7833] text-white rounded-lg text-sm font-medium transition-all shadow-md"
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
        <div className="relative rounded-2xl bg-zinc-100 dark:bg-zinc-900 p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6 text-center flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <Palette className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Mediums & Specializations</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Oil, Acrylics, & Mixed Media</p>
            </div>
          </div>
          <hr className="w-full border-zinc-200 dark:border-zinc-800" />
          <div className="py-2 space-y-2 text-center">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              You have a story.
            </p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-[#9e8b43]">
              I want to paint it!
            </p>
          </div>
        </div>
      </section>

      {/* Key Milestones Grid */}
      <section className="bg-zinc-50 dark:bg-zinc-900/50 py-16 md:py-24 border-t border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">The Artist&apos;s Background</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Box 1: A Lifetime of Painting */}
            <div className="p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
                A LIFETIME OF PAINTING
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                From the age of five, my talent for drawing became evident through sketches and stories. In high school, I wrote and illustrated my first comic, which became the first piece of my work to be seen publicly. Later on went into Charcoal, pastels, acrylics and Oil.
              </p>
            </div>

            {/* Box 2: Creative Arts and Graphic Design */}
            <div className="p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase mb-4">
                  Creative Arts and Graphic Design
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Studied Advertising and have worked for more than 30 years as a copywriter, graphic designer and Creative Director for local and worldwide brands. Take a look at some of my branding works here:
                </p>
              </div>
              <div>
                <Link
                  href="/commissions"
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-[#9e8b43] hover:bg-[#8a7833] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm text-center"
                >
                  Commission a Branding Package
                </Link>
              </div>
            </div>

            {/* Box 3: The Painting Bug */}
            <div className="p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
                THE PAINTING BUG
              </h3>
              <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <p>
                  Recently I am passionate with mixed media.
                </p>
                <p>
                  My preferred style is Abstract Realism, as taught by Elli and Dimitra Milan. Other sources of inspiration come from the works of artists such as Rembrandt, Caravaggio, Briton Rivière, the Impressionists and Leonid Afremov.
                </p>
              </div>
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
