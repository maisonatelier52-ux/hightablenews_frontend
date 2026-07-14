"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCategoryContent, CategoryBanner, CategoryTag, Meta, imgStyle, ArticleLink } from "../shared";
import { articleHref } from "@/lib/articlesSource";

/** Template 4 — Carousel Magazine: hero carousel (arrows + dot indicators)
 *  followed by a Top Stories carousel strip, a Latest Updates grid, and a
 *  More From Category list. Matches the reference design's carousel-driven
 *  magazine layout, with no sidebar. */
export default function CarouselMagazineTemplate({ data, category, device = "desktop" }) {
  const slideCount = data.hero?.slideCount ?? 5;
  const topStoriesSlides = data.topStories?.totalSlides ?? 9;
  const latestCount = data.latestUpdates?.count ?? 6;
  const moreCount = data.moreFromCategory?.count ?? 6;

  const { hero, rest } = useCategoryContent(category, {
    rest: (slideCount - 1) + topStoriesSlides + latestCount + moreCount,
  });

  const heroSlides = [hero, ...rest.slice(0, slideCount - 1)].filter(Boolean);
  let cursor = slideCount - 1;
  const topStories = rest.slice(cursor, cursor + topStoriesSlides);
  cursor += topStoriesSlides;
  const latestUpdates = rest.slice(cursor, cursor + latestCount);
  cursor += latestCount;
  const moreArticles = rest.slice(cursor, cursor + moreCount);

  const [heroIdx, setHeroIdx] = useState(0);
  const [topIdx, setTopIdx] = useState(0);

  const isMobile = device === "mobile";
  const isTablet = device === "tablet";
  const visibleTop = isMobile ? 1 : isTablet ? 3 : (data.topStories?.visibleCount ?? 5);

  const activeHero = heroSlides[heroIdx] || heroSlides[0];

  return (
    <div className="bg-white">
      <CategoryBanner banner={data.banner} categoryName={category?.name} />

      <div className="mx-auto px-4 sm:px-6 py-7" style={{ maxWidth: 1600 }}>
        {/* ── Hero carousel ── */}
        {activeHero && (
          <div className={`relative grid gap-0 mb-9 rounded-lg overflow-hidden ${isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-[1fr_1.4fr]"}`}>
            <div className="bg-gray-900 text-white p-6 sm:p-8 flex flex-col justify-center relative z-10">
              <CategoryTag live color="#ef4444">{activeHero.category || "Live Coverage"}</CategoryTag>
              <h2 className="font-serif text-[22px] sm:text-[26px] font-bold leading-tight mt-2">
                {articleHref(activeHero) ? (
                  <Link href={articleHref(activeHero)} className="hover:underline">{activeHero.title}</Link>
                ) : activeHero.title}
              </h2>
              <Meta
                author={activeHero.author} date={activeHero.date} readTime={activeHero.readTime}
                showAuthor={data.hero?.showAuthor} showDate={data.hero?.showDate} showReadTime={data.hero?.showReadTime}
              />
              {articleHref(activeHero) ? (
                <Link href={articleHref(activeHero)} className="mt-4 self-start text-[11px] font-bold uppercase tracking-wide bg-red-600 text-white rounded-md px-4 py-2.5">
                  {data.hero?.ctaLabel || "Read Full Story"}
                </Link>
              ) : (
                <button type="button" className="mt-4 self-start text-[11px] font-bold uppercase tracking-wide bg-red-600 text-white rounded-md px-4 py-2.5">
                  {data.hero?.ctaLabel || "Read Full Story"}
                </button>
              )}
            </div>
            <div className="relative" style={imgStyle(activeHero, "16/9")}>
              <CarouselArrow dir="left" onClick={() => setHeroIdx((i) => (i - 1 + heroSlides.length) % heroSlides.length)} />
              <CarouselArrow dir="right" onClick={() => setHeroIdx((i) => (i + 1) % heroSlides.length)} />
            </div>
            <Dots count={heroSlides.length} active={heroIdx} onSelect={setHeroIdx} className="absolute bottom-3 left-1/2 -translate-x-1/2" />
          </div>
        )}

        {/* ── Top Stories carousel ── */}
        {topStories.length > 0 && (
          <div className="mb-9">
            <SectionHeading>{data.topStories?.title || "Top Stories"}</SectionHeading>
            <div className="relative mt-3">
              <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-5"}`}>
                {topStories.slice(topIdx, topIdx + visibleTop).map((a) => (
                  <ArticleLink key={a.id} article={a} className="group block">
                    <div className="rounded-md overflow-hidden mb-2" style={imgStyle(a, "16/9")} />
                    <CategoryTag color={a.categoryColor}>{a.category}</CategoryTag>
                    <h4 className="font-semibold text-[12.5px] text-gray-900 leading-snug mt-1 line-clamp-3 group-hover:text-red-600 transition-colors">{a.title}</h4>
                    <Meta author={a.author} date={a.date} showDate />
                  </ArticleLink>
                ))}
              </div>
              {topStories.length > visibleTop && (
                <>
                  <CarouselArrow dir="left" inline onClick={() => setTopIdx((i) => Math.max(0, i - 1))} />
                  <CarouselArrow dir="right" inline onClick={() => setTopIdx((i) => Math.min(topStories.length - visibleTop, i + 1))} />
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Latest Updates grid ── */}
        {latestUpdates.length > 0 && (
          <div className="mb-9">
            <SectionHeading>{data.latestUpdates?.title || "Latest Updates"}</SectionHeading>
            <div className={`grid gap-x-6 gap-y-5 mt-3 ${isMobile ? "grid-cols-1" : latestColsClass(data.latestUpdates?.columns, isTablet)}`}>
              {latestUpdates.map((a) => (
                <ArticleLink key={a.id} article={a} as="div" className="flex gap-3 group">
                  <div className="flex-none w-20 h-16 rounded-md overflow-hidden" style={imgStyle(a, "4/3")} />
                  <div className="min-w-0">
                    <CategoryTag color={a.categoryColor}>{a.category}</CategoryTag>
                    <h4 className="font-semibold text-[12.5px] text-gray-900 leading-snug mt-1 line-clamp-2 group-hover:text-red-600 transition-colors">{a.title}</h4>
                    <p className="text-[10.5px] text-gray-400 mt-1">{a.date}</p>
                  </div>
                </ArticleLink>
              ))}
            </div>
          </div>
        )}

        {/* ── More From Category ── */}
        {moreArticles.length > 0 && (
          <div>
            <SectionHeading>{data.moreFromCategory?.title || "More From Category"}</SectionHeading>
            <div className={`grid gap-x-6 gap-y-6 mt-3 ${isMobile ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"}`}>
              {moreArticles.map((a) => (
                <ArticleLink key={a.id} article={a} className="group block">
                  <div className="rounded-md overflow-hidden mb-2" style={imgStyle(a, "16/9")} />
                  <CategoryTag color={a.categoryColor}>{a.category}</CategoryTag>
                  <h4 className="font-semibold text-[13px] text-gray-900 leading-snug mt-1 line-clamp-2 group-hover:text-red-600 transition-colors">{a.title}</h4>
                  <Meta author={a.author} date={a.date} showAuthor showDate />
                </ArticleLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h3 className="text-[15px] font-bold text-gray-900 pb-2 border-b-2 border-red-600 inline-block">{children}</h3>
  );
}

function latestColsClass(columns, isTablet) {
  const n = Math.min(columns ?? 3, isTablet ? 2 : 3);
  if (n <= 1) return "grid-cols-1";
  if (n === 2) return "grid-cols-2";
  return "grid-cols-3";
}

function CarouselArrow({ dir, onClick, inline = false }) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  const side = dir === "left" ? { left: inline ? -6 : 12 } : { right: inline ? -6 : 12 };
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors z-10"
      style={side}
    >
      <Icon size={15} />
    </button>
  );
}

function Dots({ count, active, onSelect, className = "" }) {
  if (count <= 1) return null;
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          className={`h-1.5 rounded-full transition-all ${i === active ? "w-4 bg-red-600" : "w-1.5 bg-white/60"}`}
        />
      ))}
    </div>
  );
}
