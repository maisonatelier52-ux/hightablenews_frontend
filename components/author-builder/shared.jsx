"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Twitter, Linkedin, Globe, Mail, Instagram, Facebook, Youtube } from "lucide-react";
import { getArticlesForAuthor, resolveAuthorArticles, articleHref } from "@/lib/articlesSource";
import { imgStyle, gradFor } from "@/components/category-builder/shared";

// ─── Sample fallback author + articles (shown only until real authors /
// articles exist, so the live preview never looks empty or broken) ────────

export const SAMPLE_AUTHOR = {
  _id: "sample-author",
  name: "James Whitmore",
  role: "Chief Foreign Correspondent",
  location: "Geneva, Switzerland",
  bio: "James Whitmore is HighTableNews' Chief Foreign Correspondent, based in Geneva. He reports on global diplomacy, international economics, and geopolitical risk, with over 18 years of experience covering major world events.",
  aboutText: "James leads our global reporting team from Geneva, with a focus on diplomacy, international trade, sanctions, and global economic policy.",
  experience: "18+ Years in International Journalism",
  education: "Columbia University — MA in International Relations",
  languages: "English, French, German",
  specialization: "Diplomacy, Global Economy, Geopolitics",
  awards: "Multiple Awards & Recognitions",
  profileImage: "",
  topics: ["World Politics", "Diplomacy", "Global Economy", "Geopolitics", "Trade & Tariffs", "Sanctions"],
  social: [
    { id: "s1", platform: "twitter", url: "#" },
    { id: "s2", platform: "linkedin", url: "#" },
    { id: "s3", platform: "website", url: "#" },
    { id: "s4", platform: "email", url: "#" },
  ],
};

function sampleArticle(i) {
  const titles = [
    "A New Chapter in Transatlantic Diplomacy: How Twelve Nations Stepped Back from the Brink",
    "Climate Protest Crackdown Shows How Wrong the Ruling Party Is About Free Speech",
    "A State Comptroller Reservation Bill Heads to the Governor's Desk After Marathon Session",
    "Global Economic Growth Forecasts Slashed as Asia Struggles with Persistent Inflation",
    "It's Never Been More Expensive to Visit New York City",
    "Visitor Numbers Remain Robust Even as Costs Spiral Higher in Major Cities",
  ];
  const cats = ["WORLD • POLITICS", "EUROPE • LAW", "AMERICAS • POLITICS", "BUSINESS • ASIA", "AMERICAS • ECONOMY", "WORLD • ECONOMY"];
  return {
    id: `sample-art-${i}`,
    title: titles[i % titles.length],
    excerpt: "Dispatches, analysis and long-form reporting from our correspondents across six continents.",
    category: cats[i % cats.length],
    categoryColor: ["#dc2626", "#d97706", "#059669", "#2563eb", "#7c3aed"][i % 5],
    author: SAMPLE_AUTHOR.name,
    date: `Jun ${26 - i}, 2026`,
    readTime: `${4 + (i % 5)} min read`,
    img: null,
  };
}
export const SAMPLE_ARTICLES = Array.from({ length: 12 }, (_, i) => sampleArticle(i));

/** Resolves an author's real published articles, with graceful fallback to
 *  sample content when the author has none yet (or none exist at all). */
function useAuthorContent(author, count) {
  return useMemo(() => {
    const target = author || SAMPLE_AUTHOR;
    const isSampleAuthor = target._id === "sample-author";
    const real = isSampleAuthor ? [] : getArticlesForAuthor(target);
    const isSample = real.length === 0;
    const articles = isSample
      ? SAMPLE_ARTICLES.slice(0, count)
      : resolveAuthorArticles(target, count, { sampleFallback: SAMPLE_ARTICLES });
    return { articles, isSample, articlesCount: isSample ? 142 : real.length };
  }, [author, count]);
}

const SOCIAL_ICONS = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
  youtube: Youtube,
  website: Globe,
  email: Mail,
};

/** Renders an author's social links as real, clickable icons that open the
 *  account URL configured for them in the Authors admin (author.social).
 *  Falls back to a plain, non-interactive icon when a platform has no URL
 *  set yet, instead of pretending it's a working link. */
function SocialIcons({ social = [], size = 13, className = "" }) {
  if (!social.length) return null;
  const baseClass = "h-7 w-7 rounded-md border border-current/15 flex items-center justify-center opacity-90 transition-opacity hover:opacity-100";
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {social.map((s) => {
        const Icon = SOCIAL_ICONS[s.platform] || Globe;
        const rawUrl = (s.url || "").trim();
        const hasLink = rawUrl && rawUrl !== "#";
        if (!hasLink) {
          return (
            <span key={s.id} className={baseClass}>
              <Icon size={size} />
            </span>
          );
        }
        const isEmail = s.platform === "email";
        const href = isEmail ? (rawUrl.startsWith("mailto:") ? rawUrl : `mailto:${rawUrl}`) : rawUrl;
        return (
          <a
            key={s.id}
            href={href}
            target={isEmail ? undefined : "_blank"}
            rel={isEmail ? undefined : "noopener noreferrer"}
            aria-label={s.platform}
            title={s.platform}
            className={baseClass}
          >
            <Icon size={size} />
          </a>
        );
      })}
    </div>
  );
}

function firstName(name) {
  return String(name || "").split(" ")[0] || "";
}

function interpolate(template, author) {
  if (!template) return "";
  return template.replace("{name}", author.name || "").replace("{firstName}", firstName(author.name));
}

function AuthorAvatar({ author, size = 96, className = "" }) {
  const initials = (author.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return author.profileImage ? (
    <img
      src={author.profileImage}
      alt={author.name}
      className={`rounded-full object-cover shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className={`rounded-full shrink-0 flex items-center justify-center font-bold text-white shrink-0 ${className}`}
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${gradFor(author.name)})`, fontSize: size / 3 }}
    >
      {initials}
    </div>
  );
}

function Chip({ children, dark = false }) {
  return (
    <span
      className={`inline-flex items-center text-[11.5px] px-3 py-1 rounded-full border ${
        dark ? "border-white/20 text-white/80" : "border-gray-200 text-gray-600"
      }`}
    >
      {children}
    </span>
  );
}

/** Wraps a card in a real Next.js Link to its article; falls back to a plain
 *  element when the card is sample/placeholder content with no real slug. */
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

export { useAuthorContent, SocialIcons, AuthorAvatar, Chip, firstName, interpolate, imgStyle, gradFor, ArticleLink };
