import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Palette,
  Sparkles,
  BookOpen,
  ChevronRight,
  Quote,
} from "lucide-react";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getRelatedBlogPosts,
  BlogPost,
} from "@/lib/blog";
import { BlogShareBar } from "@/components/blog/BlogShareBar";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Story Not Found | Alexpoeima Art Blog",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: `${post.title} | Alexpoeima Art Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllBlogPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost: BlogPost | null = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost: BlogPost | null =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const relatedPosts = getRelatedBlogPosts(post.slug, 3);

  return (
    <main className="flex-1 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen">
      {/* Top Navigation & Breadcrumbs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 backdrop-blur-md sticky top-14 z-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-3.5 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-[#9e8b43] dark:hover:text-[#decf92] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Stories</span>
          </Link>

          <nav
            aria-label="Breadcrumb"
            className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400"
          >
            <Link href="/" className="hover:text-zinc-600 dark:hover:text-zinc-300">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-zinc-600 dark:hover:text-zinc-300">
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#9e8b43] dark:text-[#decf92] font-semibold truncate max-w-[200px]">
              {post.category}
            </span>
          </nav>
        </div>
      </div>

      {/* Article Header Container */}
      <header className="max-w-4xl mx-auto px-6 sm:px-8 pt-10 sm:pt-14 pb-8 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#9e8b43]/15 text-[#9e8b43] dark:text-[#decf92] border border-[#9e8b43]/30">
            {post.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            {post.date}
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-[1.15]">
          {post.title}
        </h1>

        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
          {post.excerpt}
        </p>

        {/* Author Byline */}
        <div className="flex items-center gap-3.5 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="w-11 h-11 rounded-full bg-[#9e8b43]/20 flex items-center justify-center text-[#9e8b43] border border-[#9e8b43]/40">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-sm font-bold text-zinc-900 dark:text-white">
              Alexandra Robles
            </span>
            <span className="block text-xs text-zinc-500 dark:text-zinc-400">
              Fine Artist & Studio Creator at Alexpoeima
            </span>
          </div>
        </div>
      </header>

      {/* Featured Artwork Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 mb-12 sm:mb-16">
        <div className="relative w-full h-[320px] sm:h-[460px] md:h-[540px] rounded-3xl overflow-hidden bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            unoptimized
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Article Body Content */}
      <article className="max-w-3xl mx-auto px-6 sm:px-8 space-y-8 pb-14 text-zinc-800 dark:text-zinc-200">
        {post.content.map((paragraph, idx) => {
          if (idx === 0) {
            return (
              <p
                key={idx}
                className="text-lg sm:text-xl leading-relaxed text-zinc-900 dark:text-zinc-100 font-medium border-l-4 border-[#9e8b43] pl-4 sm:pl-6 my-4 italic"
              >
                {paragraph}
              </p>
            );
          }

          if (idx === 2) {
            return (
              <div key={idx} className="space-y-6">
                {/* Pull Quote Callout Box */}
                <div className="my-8 p-6 sm:p-8 rounded-2xl bg-[#9e8b43]/10 border border-[#9e8b43]/30 text-zinc-900 dark:text-zinc-100 space-y-3">
                  <Quote className="w-8 h-8 text-[#9e8b43] dark:text-[#decf92] opacity-80" />
                  <p className="text-base sm:text-lg font-semibold italic leading-relaxed text-zinc-900 dark:text-zinc-100">
                    &ldquo;Beauty takes time, layers, and patience. Every single layer serves a divine purpose.&rdquo;
                  </p>
                  <span className="block text-xs uppercase tracking-widest font-bold text-[#9e8b43] dark:text-[#decf92]">
                    — Notes by Alexandra Robles
                  </span>
                </div>

                <p className="text-base sm:text-lg leading-relaxed">{paragraph}</p>
              </div>
            );
          }

          return (
            <p key={idx} className="text-base sm:text-lg leading-relaxed">
              {paragraph}
            </p>
          );
        })}

        {/* Share & Heart Reaction Bar */}
        <div className="pt-8">
          <BlogShareBar title={post.title} />
        </div>

        {/* Author Bio Box */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-[#9e8b43]/20 flex items-center justify-center text-[#9e8b43] shrink-0 border border-[#9e8b43]/30">
            <Palette className="w-10 h-10" />
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                About Alexandra Robles
              </h3>
              <p className="text-xs uppercase tracking-widest text-[#9e8b43] dark:text-[#decf92] font-semibold">
                Artist & Founder of Alexpoeima
              </p>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Alexandra is a visual artist based in the studio, creating original textured acrylic paintings, custom commissioned works, and live event paintings that celebrate faith, love, and human emotion.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <Link
                href="/about"
                className="text-xs font-bold uppercase tracking-wider text-[#9e8b43] dark:text-[#decf92] hover:underline"
              >
                Read Artist Story &rarr;
              </Link>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <Link
                href="/commissions"
                className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Inquire Commission &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Previous & Next Post Navigation */}
        <nav
          aria-label="Story navigation"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-10 border-t border-zinc-200 dark:border-zinc-800"
        >
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:border-[#9e8b43]/50 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold mb-2 group-hover:text-[#9e8b43]">
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Previous Story</span>
              </div>
              <span className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-2">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}

          {nextPost && (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:border-[#9e8b43]/50 transition-all group flex flex-col justify-between text-right sm:col-start-2"
            >
              <div className="flex items-center justify-end gap-1.5 text-xs text-zinc-400 font-semibold mb-2 group-hover:text-[#9e8b43]">
                <span>Next Story</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
              <span className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-2">
                {nextPost.title}
              </span>
            </Link>
          )}
        </nav>
      </article>

      {/* Related Stories Section */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 py-16">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest font-extrabold text-[#9e8b43] dark:text-[#decf92]">
                  Explore Further
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  More from Between Brushstrokes
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9e8b43] dark:text-[#decf92] hover:underline"
              >
                <span>All Articles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between hover:-translate-y-1"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                      <Image
                        src={related.image}
                        alt={related.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                          {related.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span>{related.date}</span>
                        <span>•</span>
                        <span>{related.readTime}</span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-[#9e8b43] transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {related.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <span className="text-xs font-bold text-[#9e8b43] dark:text-[#decf92] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Story <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="sm:hidden text-center pt-2">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold uppercase tracking-wider"
              >
                <span>View All Articles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Studio Banner Section */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#9e8b43]/20 text-[#9e8b43] dark:text-[#decf92] mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Bring Alexpoeima Art Into Your Home
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Explore available original canvases, limited museum-grade prints, or commission a bespoke work tailored to your story.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              href="/fine-arts-and-prints"
              className="w-full sm:w-auto px-6 py-3 bg-[#9e8b43] hover:bg-[#8a7833] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md transition-colors inline-flex items-center justify-center gap-2"
            >
              <span>Explore Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/commissions"
              className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Custom Commissions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
