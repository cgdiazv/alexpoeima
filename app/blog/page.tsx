"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Sparkles, Clock, Calendar, ArrowRight } from "lucide-react";
import { BLOG_POSTS, BLOG_CATEGORIES, BlogPost } from "@/lib/blog";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/admin-posts");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPosts(data);
          }
        }
      } catch (err) {
        console.error("Error loading blog posts:", err);
      }
    }
    loadPosts();
  }, []);

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

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
            {BLOG_CATEGORIES.map((cat) => (
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
            Showing {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "article" : "articles"}
          </span>
        </div>

        {/* Featured Post Card (Topmost) */}
        {selectedCategory === "All" && filteredPosts.length > 0 && (
          <Link
            href={`/blog/${filteredPosts[0].slug}`}
            className="group mb-16 rounded-3xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 cursor-pointer block"
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
          </Link>
        )}

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(selectedCategory === "All"
            ? filteredPosts.slice(1)
            : filteredPosts
          ).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
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
            </Link>
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
              Receive early previews of newly released originals, behind-the-scenes
              studio journals, and exhibition announcements.
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
    </main>
  );
}
