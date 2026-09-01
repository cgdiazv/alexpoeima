"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export interface HeaderSlide {
  id: string;
  image: string;
  badge: string;
  title: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
}

const DEFAULT_SLIDES: HeaderSlide[] = [
  {
    id: "fine-arts",
    image: "/headers/header-finearts.webp",
    badge: "Official Studio Collection",
    title: "Fine Arts & Archival Prints",
    description: "Explore original paintings, mixed media compositions, and museum-grade Giclée prints crafted with archival precision.",
    primaryCta: {
      label: "Explore Fine Arts",
      href: "/fine-arts-and-prints",
    },
    secondaryCta: {
      label: "View All Artworks",
      href: "/products",
    },
  },
  {
    id: "commissions",
    image: "/headers/header-commisions.webp",
    badge: "Bespoke Masterpieces",
    title: "Commission an Original Artwork",
    description: "Collaborate directly with Alexpoeima for custom pet portraits, family figures, landscapes, or tailored architectural canvases.",
    primaryCta: {
      label: "Custom Commissions",
      href: "/commissions",
    },
    secondaryCta: {
      label: "Pricing Calculator",
      href: "/commissions",
    },
  },
  {
    id: "live-events",
    image: "/headers/header-liveevents.webp",
    badge: "Live Performance Art",
    title: "Live Painting for Luxury Events",
    description: "Preserve once-in-a-lifetime moments on canvas. Watch a master painting unfold live during weddings, galas, and celebrations.",
    primaryCta: {
      label: "Live Event Services",
      href: "/live-events",
    },
    secondaryCta: {
      label: "Check Date Availability",
      href: "/live-events",
    },
  },
  {
    id: "contact",
    image: "/headers/header-contact.webp",
    badge: "Private Inquiries",
    title: "Connect With Alexpoeima",
    description: "Get in touch for custom dimensions, private gallery consultations, international shipping, or bespoke collaborations.",
    primaryCta: {
      label: "Contact Studio",
      href: "/contact",
    },
    secondaryCta: {
      label: "About the Artist",
      href: "/about",
    },
  },
];

export function HeaderSlider({ slides = DEFAULT_SLIDES }: { slides?: HeaderSlide[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play interval
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [nextSlide, isPaused, totalSlides]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50; // minimum distance in px to register a swipe

    if (diff > swipeThreshold) {
      nextSlide();
    } else if (diff < -swipeThreshold) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="relative w-full h-[520px] sm:h-[600px] md:h-[650px] lg:h-[700px] overflow-hidden bg-zinc-950 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Featured artworks slider"
      role="region"
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={!isActive}
          >
            {/* Background Artwork Image */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className={`object-cover object-center transition-transform duration-[7000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
                sizes="100vw"
                quality={90}
              />
              {/* Refined multi-stop gradient overlay for maximum readability and luxury depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            </div>

            {/* Slide Content */}
            <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-center items-start">
              <div className="max-w-2xl text-left space-y-4 sm:space-y-6">
                {/* Badge */}
                <div
                  className={`inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#decf92]/20 border border-[#decf92]/50 text-[#f5ebd2] backdrop-blur-md text-xs font-bold uppercase tracking-widest transition-all duration-700 delay-100 ${
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <span>{slide.badge}</span>
                </div>

                {/* Title */}
                <h1
                  className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-sm transition-all duration-700 delay-200 ${
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  {slide.title}
                </h1>

                {/* Description */}
                <p
                  className={`text-sm sm:text-base md:text-lg text-zinc-200/90 font-normal leading-relaxed max-w-xl drop-shadow transition-all duration-700 delay-300 ${
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  {slide.description}
                </p>

                {/* Actions */}
                <div
                  className={`flex flex-wrap items-center gap-3.5 pt-2 transition-all duration-700 delay-400 ${
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <Link
                    href={slide.primaryCta.href}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#9e8b43] hover:bg-[#8a7833] text-white font-bold text-sm tracking-wide shadow-lg shadow-black/30 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>{slide.primaryCta.label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {slide.secondaryCta && (
                    <Link
                      href={slide.secondaryCta.href}
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm tracking-wide backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-200"
                    >
                      <span>{slide.secondaryCta.label}</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 text-white/90 hover:text-white backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#decf92]"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 text-white/90 hover:text-white backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#decf92]"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Bottom Pagination Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full focus:outline-none ${
                isActive
                  ? "w-8 h-2 bg-[#decf92]"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}: ${slide.title}`}
              aria-current={isActive ? "true" : "false"}
            />
          );
        })}
      </div>
    </div>
  );
}
