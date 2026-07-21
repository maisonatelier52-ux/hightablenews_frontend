"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Globe2 } from "lucide-react";
import {
  getArticlesForCategory,
  resolveCategoryHero,
  resolveCategoryArticles,
  articleHref,
} from "@/lib/articlesSource";

// ─── Sample fallback content (shown only when a category has zero articles
// yet, so the live preview never looks broken before any content exists) ──

const SAMPLE_HERO = {
  id: "sample-hero",
  title: "A New Chapter in Transatlantic Diplomacy: How Twelve Nations Stepped Back from the Brink",
  excerpt: "Senior diplomats convened for an extraordinary session as mounting trade tensions threatened to unravel eighteen months of multilateral progress.",
  category: "BUSINESS",
  categoryColor: "#dc2626",
  author: "James Whitmore",
  date: "Jun 26, 2026",
  readTime: "8 min read",
  img: null,
};

function sampleArticle(i) {
  const titles = [
    "Global economic growth forecasts slashed as Asia bloc struggles with persistent inflation",
    "Climate protest crackdown shows how wrong the ruling party is about free speech",
    "A state comptroller reservation bill heads to the governor's desk after marathon session",
    "Global markets rally as Fed signals rate cuts: what it means for investors",
    "Major banks announce $50 billion climate transition fund amid ESG push",
    "Commercial real estate faces $2 trillion refinancing cliff as rates bite",
    "Oil prices tumble as OPEC+ struggles to reach production agreement",
    "Quantum computing startup claims breakthrough in error correction",
    "US inflation data shows cooling prices, boosting consumer confidence",
    "Bitcoin ETFs see record inflows as institutional adoption accelerates",
    "Japanese stock market surges to 34-year high on corporate reform hopes",
    "Global luxury property market defies economic downturn with record sales",
  ];
  return {
    id: `sample-${i}`,
    title: titles[i % titles.length],
    excerpt: "Dispatches, analysis and long-form reporting from our correspondents across six continents.",
    category: ["MARKETS", "ECONOMY", "FINANCE", "TECH", "ENERGY"][i % 5],
    categoryColor: ["#dc2626", "#d97706", "#059669", "#2563eb", "#7c3aed"][i % 5],
    author: ["Sarah Thompson", "Wei Zhang", "Michael Chen", "Emma Roberts", "James Thornton"][i % 5],
    date: `${i + 2}h ago`,
    readTime: `${4 + (i % 5)} min read`,
    img: null,
  };
}
const SAMPLE_ARTICLES = Array.from({ length: 16 }, (_, i) => sampleArticle(i));

const GRADIENTS = [
  "#1e3a5f, #0f1f33", "#3b2f5e, #1c1530", "#5c3a21, #2b1a0f",
  "#1f4d3d, #0d231b", "#5e1f1f, #2b0d0d", "#1f3a5c, #0d1c33",
];
function gradFor(id) {
  let h = 0;
  const key = String(id || "x");
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

function imgStyle(article, ratio = "16/9") {
  return {
    aspectRatio: ratio.replace("/", " / "),
    background: article.img
      ? `url(${article.img}) center/cover no-repeat`
      : `linear-gradient(135deg, ${gradFor(article.id)})`,
  };
}

/** Resolves the hero + supporting article lists for the active category,
 *  always honoring the "client news" hero-priority rule, with graceful
 *  fallback to sample content when nothing has been published yet. */
function useCategoryContent(category, counts) {
  return useMemo(() => {
    const categoryId = category?._id || "";
    const hero = resolveCategoryHero(categoryId, { sampleFallback: SAMPLE_HERO }) || SAMPLE_HERO;
    const isSample = hero.id === "sample-hero" || getArticlesForCategory(categoryId).length === 0;
    const rest = isSample
      ? SAMPLE_ARTICLES
      : resolveCategoryArticles(categoryId, counts.rest, { excludeIds: [hero.id], sampleFallback: SAMPLE_ARTICLES });
    return { hero, rest, isSample };
  }, [category, counts.rest]);
}

// ─── Category banner (shared across all 4 templates) ──────────────────────

// Builds the page's single <h1>. SEO tools (and best practice) want the H1
// to closely echo the <title> tag's keywords rather than just the bare
// category name ("Power" was flagged as too short and keyword-less vs. the
// title "Power | Global Leaders, Influencers & Decision Makers"). When the
// admin has set an SEO Title for the category, we reuse it here — swapping
// the " | " title-tag separator for an em dash so it still reads naturally
// as a heading — so the H1 and <title> stay "the same or very similar" as
// recommended, without needing a brand-new admin field.
function deriveH1({ seoTitle, categoryName, bannerTitle }) {
  if (seoTitle && seoTitle.trim()) return seoTitle.trim().replace(/\s*\|\s*/g, " — ");
  return categoryName || bannerTitle || "Category";
}

function CategoryBanner({ banner, categoryName, seoTitle, description }) {
  const title = deriveH1({ seoTitle, categoryName, bannerTitle: banner.title });
  // Prefer the category's own admin-written Description (unique per
  // category, and the same text search engines see as fodder for the page)
  // over the generic, shared-across-templates banner.description. Previously
  // the category description was only ever placed into <meta name="description">
  // (invisible to on-page text analysis) and never actually rendered — which
  // is why keyword-coherence checks against the visible page text scored 0.
  const bodyText = description || banner.description;
  return (
    <div
      className="relative overflow-hidden rounded-t-lg"
      style={{ background: "linear-gradient(135deg, #18181b, #0a0a0b)" }}
    >
      {banner.bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner.bgImage})`, opacity: (banner.overlayOpacity ?? 70) / 100 }}
        />
      )}
      {banner.showGlobeGraphic && (
        <Globe2 size={180} className="absolute -right-6 top-1/2 -translate-y-1/2 text-white/[0.04]" strokeWidth={0.6} />
      )}
      <div className="relative px-6 py-7 sm:px-8 sm:py-9">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-red-500 mb-1.5">Section</p>
        <h1 className="text-white font-serif text-[28px] sm:text-[34px] font-bold leading-none">{title}</h1>
        {bodyText && (
          <p className="text-white/60 text-[12.5px] mt-2 max-w-lg leading-snug">{bodyText}</p>
        )}
      </div>
    </div>
  );
}

function CategoryTag({ children, color = "#dc2626", live = false }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide" style={{ color }}>
      {live && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

function Meta({ author, date, readTime, showAuthor, showDate, showReadTime }) {
  const bits = [];
  if (showAuthor && author) bits.push(`By ${author}`);
  if (showDate && date) bits.push(date);
  if (showReadTime && readTime) bits.push(readTime);
  if (bits.length === 0) return null;
  return <p className="text-[11px] text-gray-400 mt-1.5">{bits.join(" · ")}</p>;
}

/** Wraps a card in a real Next.js Link to its article; falls back to a plain
 *  element (`as`, default "article") when the card is sample/placeholder
 *  content with no real slug, so nothing links to a dead "#" route. */
function ArticleLink({ article, className, style, as: As = "article", children }) {
  const href = articleHref(article);
  if (!href) {
    return (
      <As className={className} style={style}>
        {children}
      </As>
    );
  }
  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  );
}

export {
  useCategoryContent, CategoryBanner, CategoryTag, Meta, imgStyle, gradFor,
  SAMPLE_HERO, SAMPLE_ARTICLES, ArticleLink,
};