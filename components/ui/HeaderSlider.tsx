"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeaderSlide {
  id: string;
  image: string;
  text?: string;
  position?: "center" | "right" | "lower-center";
  href?: string;
}

export const DEFAULT_SLIDES: HeaderSlide[] = [
  {
    id: "home",
    image: "/headers/header-home.webp",
    href: "/about",
  },
  {
    id: "discover",
    image: "/headers/header-discover.webp",
    text: "Discover",
    position: "center",
    href: "/fine-arts-and-prints",
  },
  {
    id: "fine-arts",
    image: "/headers/header-finearts.webp",
    text: "Fine art",
    position: "center",
    href: "/fine-arts-and-prints",
  },
  {
    id: "exclusive",
    image: "/headers/header-exclusive.webp",
    text: "Exclusive art pieces",
    position: "center",
    href: "/fine-arts-and-prints",
  },
  {
    id: "commissions",
    image: "/headers/header-commissions.webp",
    text: "Comissions",
    position: "center",
    href: "/commissions",
  },
  {
    id: "live-events",
    image: "/headers/header-liveevvents.webp",
    text: "Live Events and more",
    position: "center",
    href: "/live-events",
  },
];

export function HeaderSlider({ slides = DEFAULT_SLIDES }: { slides?: HeaderSlide[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const hasSwiped = useRef(false);

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
    }, 5500);

    return () => clearInterval(timer);
  }, [nextSlide, isPaused, totalSlides]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    hasSwiped.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (diff > swipeThreshold) {
      hasSwiped.current = true;
      nextSlide();
    } else if (diff < -swipeThreshold) {
      hasSwiped.current = true;
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const aboretoStyle = {
    fontFamily: 'var(--font-aboreto), "Aboreto", serif, cursive',
    textShadow: "0 2px 8px rgba(0,0,0,0.85), 0 4px 20px rgba(0,0,0,0.6)",
  };

  return (
    <div
      className="relative w-full aspect-[16/9] min-h-[240px] sm:min-h-[380px] md:min-h-[480px] max-h-[720px] overflow-hidden bg-white select-none"
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

        // Determine content positioning
        let positionClasses = "justify-center items-center text-center px-6";
        if (slide.position === "right") {
          positionClasses =
            "justify-end items-center pr-8 sm:pr-16 md:pr-24 lg:pr-36 xl:pr-48 text-right px-6";
        } else if (slide.position === "lower-center") {
          positionClasses =
            "justify-center items-center pt-24 sm:pt-32 md:pt-40 lg:pt-48 text-center px-6";
        }

        const slideInner = (
          <>
            {/* Background Artwork Image */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={slide.image}
                alt={slide.text || "Alexpoeima artwork"}
                fill
                priority={index === 0}
                className={`object-cover object-center transition-transform duration-[7000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
                sizes="100vw"
                quality={90}
              />
              {/* Subtle ambient gradient overlay for slides with text to preserve readability */}
              {slide.text && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
              )}
            </div>

            {/* Slide Text Content */}
            {slide.text && (
              <div
                className={`relative z-20 h-full w-full max-w-7xl mx-auto flex ${positionClasses}`}
              >
                <h2
                  style={aboretoStyle}
                  className={`text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-wider sm:tracking-widest transition-all duration-700 delay-150 ${
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  }`}
                >
                  {slide.text}
                </h2>
              </div>
            )}
          </>
        );

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={!isActive}
          >
            {slide.href ? (
              <Link
                href={slide.href}
                onClick={(e) => {
                  if (hasSwiped.current) {
                    e.preventDefault();
                  }
                }}
                className="relative block w-full h-full group cursor-pointer"
                tabIndex={isActive ? 0 : -1}
                aria-label={slide.text || "View artwork"}
              >
                {slideInner}
              </Link>
            ) : (
              <div className="relative w-full h-full">{slideInner}</div>
            )}
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/35 hover:bg-black/65 text-white/90 hover:text-white backdrop-blur-md border border-white/20 hover:border-white/40 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#decf92]"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/35 hover:bg-black/65 text-white/90 hover:text-white backdrop-blur-md border border-white/20 hover:border-white/40 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#decf92]"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* Bottom Pagination Indicators */}
      <div className="absolute bottom-4 sm:bottom-7 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/15 shadow-md">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`transition-all duration-300 rounded-full focus:outline-none ${
                isActive
                  ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-[#decf92]"
                  : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}${slide.text ? `: ${slide.text}` : ""}`}
              aria-current={isActive ? "true" : "false"}
            />
          );
        })}
      </div>
    </div>
  );
}

