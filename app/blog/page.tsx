"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Sparkles, Clock, Calendar, ArrowRight, X, Heart, Palette, Share2 } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "Studio Journal" | "Inspiration & Faith" | "Live Events" | "Art Guides";
  date: string;
  readTime: string;
  image: string;
  content: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "the-meaning-behind-poiema",
    title: "The Meaning Behind 'Poiema': God's Work of Art in Progress",
    excerpt:
      "Exploring Ephesians 2:10 and the spiritual foundation of my artist identity—how every brushstroke reminds us that we are masterpieces being shaped with intention.",
    category: "Inspiration & Faith",
    date: "March 24, 2026",
    readTime: "4 min read",
    image: "/headers/header-home.webp",
    content: [
      "When people ask about the origin of 'Alexpoeima', the answer lies in an ancient Greek word that shifted my entire perspective on creativity: Poiema (POY-EMA). In Ephesians 2:10, Paul writes: 'For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.' In the original Greek text, 'handiwork' or 'masterpiece' is Poiema.",
      "The English word 'poem' comes directly from this root. Think of that: we are not an afterthought or an accidental stroke on the canvas. We are a living, breathing poem crafted by the Creator.",
      "Growing up, drawing and painting became my sanctuary—a tool for emotional connection, identity, and inner peace in challenging times. Whenever I sit before an empty canvas with palette knife and acrylics, I am reminded that beauty takes time, layers, and patience. Some layers are vibrant; others are dark and foundational. Yet every single layer serves a divine purpose.",
      "My prayer for every collector who welcomes an Alexpoeima piece into their home is that it serves as a daily visual reminder: you are loved, you are intentional, and you are a masterpiece in progress.",
    ],
  },
  {
    id: "2",
    slug: "capturing-timeless-moments-live-wedding-painting",
    title: "Behind the Easel: The Magic of Live Wedding & Event Painting",
    excerpt:
      "What it feels like to paint live during vows and celebrations, preserving memories in vivid pigment while guests watch the canvas unfold.",
    category: "Live Events",
    date: "March 12, 2026",
    readTime: "5 min read",
    image: "/headers/header-liveevvents.webp",
    content: [
      "There is an extraordinary energy in the air during a wedding celebration. The nervous excitement before the ceremony, the joy of the first kiss, and the celebration that follows on the dance floor. While photographers capture frozen fractions of a second, a live painting captures the atmosphere, romance, and emotion in textured acrylic.",
      "When I arrive at an event, I set up early to block in the architectural setting, lighting, and ambient colors. As guests arrive and the ceremony begins, I focus on capturing the couple's likeness, posture, and the unique intimacy of the moment.",
      "One of the greatest joys of live event painting is guest engagement. Throughout the evening, guests stop by the easel, watch the layers evolve, and chat about the creative process. It transforms art from a static object into an immersive entertainment experience.",
      "After the event concludes, the painting returns to my studio for 2 to 3 weeks of fine refinement, varnish sealing, and meticulous drying before being delivered ready to hang in the couple's new home.",
    ],
  },
  {
    id: "3",
    slug: "acrylic-layering-and-texture",
    title: "Palette, Light & Texture: My Studio Acrylic Process",
    excerpt:
      "A deep dive into why acrylic is my medium of choice, building dimensional layers, and creating works that shift beautifully under natural light.",
    category: "Studio Journal",
    date: "February 28, 2026",
    readTime: "6 min read",
    image: "/headers/header-finearts.webp",
    content: [
      "Many art lovers wonder why I specialize primarily in acrylic rather than traditional oils. Acrylics offer an extraordinary versatility: they dry with rich, vibrant pigment retention and allow for rapid layering of glazes, impasto textures, and gold undertones.",
      "In my studio, every piece begins with a deliberate tonal underpainting. This foundational wash dictates how ambient light bounces through subsequent translucent layers. From there, I build up texture using heavy-body acrylics, palette knives, and custom bristle brushes.",
      "Light is the final collaborator in every artwork. When you position an original canvas in a room, the appearance changes as morning dawn transitions into warm afternoon glow and evening lamplight. Designing art that breathes and responds to its environment is what makes original canvas collecting so rewarding.",
    ],
  },
  {
    id: "4",
    slug: "how-to-choose-artwork-size",
    title: "How to Choose the Perfect Canvas Size for Your Space",
    excerpt:
      "A practical collector's guide to scale, wall proportions, eye-level placement, and selecting statement pieces versus accent arrangements.",
    category: "Art Guides",
    date: "February 14, 2026",
    readTime: "4 min read",
    image: "/headers/header-discover.webp",
    content: [
      "One of the most frequent questions collectors ask is: 'How do I know what canvas size will look best on my wall?' The general rule of interior design is that artwork should span between 60% and 75% of available wall space when hung above furniture like sofas, beds, or console tables.",
      "For cozy reading nooks or single portrait subjects, a 30 × 40 cm (12\" × 16\") or 40 × 50 cm (18\" × 24\") canvas brings warmth without overwhelming the room.",
      "For open-concept living rooms, entry foyers, or master bedrooms, a 50 × 60 cm (24\" × 36\") or grand 60 × 80 cm (36\" × 48\") statement piece anchors the architectural lines and establishes an inspiring focal point.",
      "If you have unique wall dimensions or custom architectural niches, custom-tailored commission dimensions allow you to achieve seamless aesthetic balance.",
    ],
  },
];

const CATEGORIES = ["All", "Studio Journal", "Inspiration & Faith", "Live Events", "Art Guides"] as const;

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const filteredPosts =
    selectedCategory === "All"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((post) => post.category === selectedCategory);

  return (
    <main className="flex-1 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Hero Header Banner using /headers/blog.webp */}
      <section className="relative w-full h-[380px] sm:h-[440px] md:h-[500px] overflow-hidden bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <Image
          src="/headers/blog.webp"
          alt="Between Brushstrokes | Notes by Alexpoeima"
          fill
          priority
          unoptimized
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-center items-start">
          <div className="max-w-2xl text-left space-y-3 sm:space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#decf92]/20 border border-[#decf92]/50 text-[#f5ebd2] backdrop-blur-md text-xs font-bold uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5 text-[#decf92]" />
              Art Journal & Stories
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-sm uppercase">
              BETWEEN BRUSHSTROKES
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-zinc-200/95 font-medium tracking-wide leading-relaxed max-w-xl drop-shadow">
              Notes by Alexpoeima
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16">
        
        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-10 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#9e8b43] text-white shadow-sm"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs text-zinc-400 font-medium">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
          </span>
        </div>

        {/* Featured Post Card (Topmost) */}
        {selectedCategory === "All" && filteredPosts.length > 0 && (
          <article
            onClick={() => setActivePost(filteredPosts[0])}
            className="group mb-16 rounded-3xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 cursor-pointer"
          >
            <div className="relative lg:col-span-7 h-64 sm:h-80 lg:h-[420px] overflow-hidden bg-zinc-900">
              <Image
                src={filteredPosts[0].image}
                alt={filteredPosts[0].title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#decf92] border border-white/10">
                  Featured Story
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-bold text-[#9e8b43] dark:text-[#decf92] uppercase tracking-wider">
                    {filteredPosts[0].category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {filteredPosts[0].date}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight group-hover:text-[#9e8b43] transition-colors">
                  {filteredPosts[0].title}
                </h2>

                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3 sm:line-clamp-4">
                  {filteredPosts[0].excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <span className="flex items-center gap-1 text-xs text-zinc-400">
                  <Clock className="w-3.5 h-3.5" />
                  {filteredPosts[0].readTime}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-[#9e8b43] dark:text-[#decf92] group-hover:translate-x-1 transition-transform">
                  Read Full Story <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </article>
        )}

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(selectedCategory === "All" ? filteredPosts.slice(1) : filteredPosts).map((post) => (
            <article
              key={post.id}
              onClick={() => setActivePost(post)}
              className="group rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden bg-zinc-900">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-[#9e8b43] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#9e8b43] dark:text-[#decf92] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Story <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Studio Newsletter / Community Section */}
        <section className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#9e8b43]/20 text-[#9e8b43] dark:text-[#decf92] mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Connect With The Studio
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Receive early previews of newly released originals, behind-the-scenes studio journals, and exhibition announcements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 py-3 bg-[#9e8b43] hover:bg-[#8a7833] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md transition-colors inline-flex items-center justify-center gap-2"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/commissions"
              className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Custom Commissions
            </Link>
          </div>
        </section>
      </div>

      {/* Full Article Modal Reading View */}
      {activePost && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePost.title}
          onClick={() => setActivePost(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[90vh] flex flex-col"
          >
            {/* Modal Header Bar with Image */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-zinc-950 shrink-0">
              <Image
                src={activePost.image}
                alt={activePost.title}
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              
              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer focus:outline-none"
                aria-label="Close article"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#9e8b43] text-white">
                  {activePost.category}
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight">
                  {activePost.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-zinc-300">
                  <span>{activePost.date}</span>
                  <span>•</span>
                  <span>{activePost.readTime}</span>
                </div>
              </div>
            </div>

            {/* Modal Body: Article Content */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
              {activePost.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}

              <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#9e8b43]/20 flex items-center justify-center text-[#9e8b43]">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                      Alexandra Robles
                    </span>
                    <span className="text-xs text-zinc-500">Fine Artist & Studio Creator</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePost(null)}
                    className="px-5 py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                  >
                    Close Story
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
