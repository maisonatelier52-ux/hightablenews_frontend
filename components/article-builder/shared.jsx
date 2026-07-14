"use client";

import { useState } from "react";
import Link from "next/link";
import { Facebook, Twitter, Linkedin, Mail, MessageCircle, Send, Link2, Check, Clock, ChevronRight } from "lucide-react";
import { imgStyle, gradFor } from "@/components/category-builder/shared";
import { articleHref, authorHref } from "@/lib/articlesSource";
import { useToast } from "@/components/ui/Toast";

// ─── Sample fallback article (shown until a real article exists, so the
// live preview never looks empty or broken) ─────────────────────────────────

export const SAMPLE_ARTICLE = {
  id: "sample-article",
  title: "A New Chapter in Transatlantic Diplomacy: How Twelve Nations Stepped Back from the Brink",
  excerpt: "Senior diplomats convened in Geneva for an extraordinary emergency session on mounting trade tensions threatening to unsettle eighteen months of painstaking multilateral progress.",
  category: "POLITICS",
  categoryId: "sample-cat",
  categoryTags: ["World", "Politics"],
  categoryColor: "#dc2626",
  author: "James Whitmore",
  authorRole: "Chief Foreign Correspondent",
  authorImage: "",
  date: "Jun 26, 2026",
  readTime: "8 min read",
  img: null,
  slug: "sample-article",
  _raw: {
    content: [
      { type: "paragraph", text: "The call went out in the early hours of a Tuesday morning, dispatched simultaneously to twelve foreign ministers across three continents. By Wednesday afternoon, the globe's most pressing trade world's most consequential economic blocs were seated around the long oval table at the Palais des Nations in Geneva." },
      { type: "paragraph", text: "The stakes could not be higher. What emerged wasn't a shift in policy — and in diplomacy, a pause is sometimes everything." },
      { type: "pullquote", text: "The rule still exist on paper. The enforcement mechanisms have quietly ceased to function.", attribution: "Dr. Helena Cross, European Council on Foreign Relations" },
      { type: "subheading", text: "The Architecture of Crisis" },
      { type: "paragraph", text: "Analysts who have tracked the deterioration of the global trade framework over the past three years point to a structural failure rather than a sudden crisis. Officials say the search continues for a durable arrangement." },
      { type: "at_a_glance", glanceTitle: "Key Points from the Summit", glanceSubtitle: "", glanceRows: [
        { label: "Session", value: "Extraordinary session convened to de-escalate rising trade tensions" },
        { label: "Tariffs", value: "12 nations agreed to pause new tariffs for 90 days" },
        { label: "Framework", value: "Digital trade and green technology cooperation announced" },
        { label: "Standards", value: "Joint working group to draft enforceable standards by Q2 2026" },
      ] },
      { type: "paragraph", text: "In the room itself, three people who drove yesterday's breakthrough describe a process that was far less orderly than the formal communique released to the press suggested." },
    ],
  },
};

export function sampleRelated(i) {
  const titles = [
    "Climate Protest Crackdown Shows How Wrong the Ruling Party Is About Free Speech",
    "A State Comptroller Reservation Bill Heads to the Governor's Desk After Marathon Session",
    "Global Economic Growth Forecasts Slashed as Asia Struggles with Persistent Inflation",
    "It's Never Been More Expensive to Visit New York City",
  ];
  const cats = ["EUROPE • LAW", "AMERICAS • POLITICS", "BUSINESS • ASIA", "WORLD • ECONOMY"];
  return {
    id: `sample-related-${i}`,
    title: titles[i % titles.length],
    category: cats[i % cats.length],
    categoryColor: ["#d97706", "#059669", "#2563eb", "#7c3aed"][i % 4],
    date: `Jun ${25 - i}, 2026`,
    readTime: `${5 + (i % 4)} min read`,
    img: null,
  };
}
export const SAMPLE_RELATED = Array.from({ length: 8 }, (_, i) => sampleRelated(i));

// ─── Small shared UI atoms ───────────────────────────────────────────────────

export function Breadcrumb({ article, dark = false }) {
  const parts = ["Home", ...(article.categoryTags?.length ? article.categoryTags : [article.category || "News"])];
  return (
    <div className={`flex items-center flex-wrap gap-1 text-[11.5px] ${dark ? "text-white/60" : "text-gray-400"}`}>
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={11} />}
          {i === 0 ? (
            <Link href="/" className={dark ? "hover:text-white/90" : "hover:text-gray-600"}>{p}</Link>
          ) : (
            <span className={i === parts.length - 1 ? (dark ? "text-white/80" : "text-gray-600") : ""}>{p}</span>
          )}
        </span>
      ))}
    </div>
  );
}

export function CategoryTags({ article }) {
  const tags = article.categoryTags?.length ? article.categoryTags : [article.category || "News"];
  return (
    <div className="flex gap-2">
      {tags.map((t) => (
        <span key={t} className="text-[10px] font-bold uppercase tracking-wide text-white px-2 py-1 rounded" style={{ background: article.categoryColor || "#dc2626" }}>
          {t}
        </span>
      ))}
    </div>
  );
}

// ─── Article share buttons ───────────────────────────────────────────────
// Lucide doesn't ship brand marks for Medium or Substack, so those two get a
// small monogram glyph instead — everything else uses the real brand icon.

function MediumGlyph({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <text x="12" y="17" textAnchor="middle" fontSize="15" fontWeight="700" fill="currentColor" fontFamily="Georgia, 'Times New Roman', serif">M</text>
    </svg>
  );
}

function SubstackGlyph({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="800" fill="currentColor" fontFamily="Georgia, 'Times New Roman', serif">S</text>
    </svg>
  );
}

/** Single source of truth for every share option — used both to render the
 *  buttons on the article page and to build the "which platforms to show"
 *  checklist in the Article Page Builder settings panel. */
export const SHARE_PLATFORMS = {
  facebook: { label: "Facebook", icon: Facebook, color: "#1877F2" },
  twitter: { label: "X (Twitter)", icon: Twitter, color: "#000000" },
  linkedin: { label: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
  medium: { label: "Medium", icon: MediumGlyph, color: "#000000" },
  substack: { label: "Substack", icon: SubstackGlyph, color: "#FF6719" },
  whatsapp: { label: "WhatsApp", icon: MessageCircle, color: "#25D366" },
  telegram: { label: "Telegram", icon: Send, color: "#229ED9" },
  email: { label: "Email", icon: Mail, color: "#4b5563" },
  copyLink: { label: "Copy Link", icon: Link2, color: "#111827" },
};

export const DEFAULT_SHARE_PLATFORMS = ["facebook", "twitter", "linkedin", "copyLink"];

/** Builds the absolute, shareable URL for an article — its real permalink
 *  when one exists, otherwise the current page (e.g. while previewing
 *  placeholder content in the builder). */
function getShareUrl(article) {
  if (typeof window === "undefined") return "";
  const href = articleHref(article);
  return href ? `${window.location.origin}${href}` : window.location.href;
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy fallback below
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return true;
  } catch {
    return false;
  }
}

/** Renders the article's share icons. Each one opens the article's actual
 *  public URL through that platform's real share flow — Facebook/X/LinkedIn/
 *  WhatsApp/Telegram use their official share-intent URLs, Medium opens its
 *  official story-import tool, Substack copies the link and opens Notes
 *  (it has no public share-intent URL), Email opens a mailto:, and Copy Link
 *  copies the URL to the clipboard with a toast + checkmark confirmation. */
export function ShareRow({ size = 13, article, platforms }) {
  const active = platforms?.length ? platforms : DEFAULT_SHARE_PLATFORMS;
  const { showToast } = useToast();
  const [copiedKey, setCopiedKey] = useState(null);

  function handleShare(key) {
    const url = getShareUrl(article);
    const title = article?.title || "";

    if (key === "copyLink") {
      copyToClipboard(url).then((ok) => {
        if (ok) {
          setCopiedKey("copyLink");
          showToast("Link copied to clipboard");
          setTimeout(() => setCopiedKey((k) => (k === "copyLink" ? null : k)), 2000);
        } else {
          showToast("Couldn't copy the link", { type: "error" });
        }
      });
      return;
    }

    if (key === "email") {
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
      return;
    }

    if (key === "substack") {
      // Substack has no public share-intent URL, so copy the link and open
      // Notes so the reader can paste it in — closest real equivalent to a
      // one-click share for this platform.
      copyToClipboard(url).then((ok) => {
        if (ok) showToast("Link copied — paste it into your Substack note");
      });
      window.open("https://substack.com/notes", "_blank", "noopener,noreferrer");
      return;
    }

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`.trim())}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      // Medium's official "import a story from a URL" tool — the closest
      // real equivalent Medium offers to a one-click share of external
      // content, since Medium can't host a post via a share-intent link.
      medium: `https://medium.com/p/import?url=${encodeURIComponent(url)}`,
    };
    const target = shareUrls[key];
    if (!target) return;
    window.open(target, "_blank", "noopener,noreferrer,width=600,height=520");
  }

  return (
    <div className="flex items-center gap-2">
      {active.map((key) => {
        const cfg = SHARE_PLATFORMS[key];
        if (!cfg) return null;
        const Icon = cfg.icon;
        const isCopied = key === "copyLink" && copiedKey === "copyLink";
        return (
          <button
            key={key}
            type="button"
            onClick={() => handleShare(key)}
            aria-label={`Share on ${cfg.label}`}
            title={`Share on ${cfg.label}`}
            className="h-7 w-7 rounded-full border flex items-center justify-center transition-colors duration-150 cursor-pointer"
            style={{
              borderColor: isCopied ? "#16a34a" : "#e5e7eb",
              color: isCopied ? "#16a34a" : "#6b7280",
              background: isCopied ? "#f0fdf4" : "transparent",
            }}
            onMouseEnter={(e) => {
              if (isCopied) return;
              e.currentTarget.style.background = cfg.color;
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.borderColor = cfg.color;
            }}
            onMouseLeave={(e) => {
              if (isCopied) return;
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#6b7280";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            {isCopied ? <Check size={size} /> : <Icon size={size} />}
          </button>
        );
      })}
    </div>
  );
}

export function ByLine({ article, avatarSize = 32 }) {
  const initials = (article.author || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const href = authorHref(article.authorSlug);
  const Avatar = article.authorImage ? (
    <img src={article.authorImage} alt={article.author} className="rounded-full object-cover shrink-0" style={{ width: avatarSize, height: avatarSize }} />
  ) : (
    <div className="rounded-full shrink-0 flex items-center justify-center text-white font-bold" style={{ width: avatarSize, height: avatarSize, background: `linear-gradient(135deg, ${gradFor(article.author)})`, fontSize: avatarSize / 2.6 }}>
      {initials}
    </div>
  );
  return (
    <div className="flex items-center gap-2.5">
      {href ? <Link href={href}>{Avatar}</Link> : Avatar}
      <div>
        <p className="text-[12.5px] font-semibold text-gray-900 leading-tight">
          By {href ? <Link href={href} className="hover:text-red-600 transition-colors">{article.author || "Staff Writer"}</Link> : (article.author || "Staff Writer")}
        </p>
        <p className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
          <span>{article.date}</span>
          {article.readTime && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock size={10} />{article.readTime}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

/** Renders the article's rich content blocks (paragraph, subheading,
 *  pullquote, image, at_a_glance, faq) — the exact same block schema the
 *  Articles admin form already produces, so nothing new needs to be added
 *  to the article data model. */
export function ArticleBody({ article, typography, dropCap = true, showPullquotes = true, showKeyPoints = true }) {
  const blocks = article._raw?.content?.length ? article._raw.content : SAMPLE_ARTICLE._raw.content;
  const bodyStyle = { fontSize: typography?.bodySize ?? 16, lineHeight: typography?.lineHeight ?? 1.7, fontWeight: typography?.fontWeight ?? 400 };

  let firstParagraphSeen = false;

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.type === "paragraph") {
          const isFirst = dropCap && !firstParagraphSeen;
          if (isFirst) firstParagraphSeen = true;
          return (
            <p key={i} className="text-gray-700" style={bodyStyle}>
              {isFirst && (
                <span className="float-left font-serif font-bold leading-[0.8] pr-2 pt-1" style={{ fontSize: (typography?.bodySize ?? 16) * 3.4, color: "#111" }}>
                  {block.text.trim()[0]}
                </span>
              )}
              {isFirst ? block.text.trim().slice(1) : block.text}
            </p>
          );
        }
        if (block.type === "subheading") {
          return <h2 key={i} className="font-serif font-bold text-gray-900" style={{ fontSize: (typography?.titleSize ?? 30) * 0.62 }}>{block.text}</h2>;
        }
        if (block.type === "pullquote" && showPullquotes) {
          return (
            <blockquote key={i} className="border-l-[3px] pl-5 py-1 my-2" style={{ borderColor: "#dc2626" }}>
              <p className="font-serif text-[19px] italic text-gray-800 leading-snug">"{block.text}"</p>
              {block.attribution && <p className="text-[11.5px] text-gray-400 mt-2 uppercase tracking-wide">{block.attribution}</p>}
            </blockquote>
          );
        }
        if (block.type === "image") {
          return (
            <figure key={i}>
              <div className="rounded-lg overflow-hidden" style={imgStyle({ img: block.src }, "16/9")} />
              {block.caption && <figcaption className="text-[11.5px] text-gray-400 mt-1.5">{block.caption}</figcaption>}
            </figure>
          );
        }
        if (block.type === "at_a_glance" && showKeyPoints) {
          return (
            <div key={i} className="rounded-lg border-l-[3px] p-4" style={{ borderColor: "#dc2626", background: "#fafaf9" }}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-2.5">{block.glanceTitle || "Key Points"}</p>
              <ul className="space-y-1.5">
                {(block.glanceRows || []).map((r, ri) => (
                  <li key={ri} className="text-[13px] text-gray-600 flex gap-2">
                    <span className="text-red-600 shrink-0">•</span>
                    <span>{r.value || r.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        if (block.type === "faq") {
          return (
            <div key={i} className="space-y-3">
              <p className="text-[15px] font-bold text-gray-900">{block.faqTitle || "Frequently asked questions"}</p>
              {(block.faqItems || []).map((f, fi) => (
                <div key={fi}>
                  <p className="text-[13.5px] font-semibold text-gray-800">{f.question}</p>
                  <p className="text-[13px] text-gray-500 mt-0.5">{f.answer}</p>
                </div>
              ))}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export function ArticleCard({ article, imageRatio = "4/3", borderEnabled = true }) {
  const href = articleHref(article);
  const className = `group block ${borderEnabled ? "border border-gray-100 rounded-lg overflow-hidden" : ""}`;
  const content = (
    <>
      <div style={imgStyle(article, imageRatio)} />
      <div className="p-3">
        <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: article.categoryColor || "#dc2626" }}>{article.category}</p>
        <h4 className="font-semibold text-[13.5px] text-gray-900 leading-snug mt-1.5 line-clamp-2 group-hover:text-red-600 transition-colors">{article.title}</h4>
        <p className="text-[11px] text-gray-400 mt-1.5">{article.date}{article.readTime ? ` · ${article.readTime}` : ""}</p>
      </div>
    </>
  );
  return href ? <Link href={href} className={className}>{content}</Link> : <article className={className}>{content}</article>;
}

export function AuthorBox({ article }) {
  const initials = (article.author || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const href = authorHref(article.authorSlug);
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4 flex gap-3.5">
      {article.authorImage ? (
        <img src={article.authorImage} alt={article.author} className="w-14 h-14 rounded-full object-cover shrink-0" />
      ) : (
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0" style={{ background: `linear-gradient(135deg, ${gradFor(article.author)})` }}>
          {initials}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400">About the Author</p>
        <p className="text-[14.5px] font-bold text-gray-900 mt-0.5">
          {href ? <Link href={href} className="hover:text-red-600 transition-colors">{article.author || "Staff Writer"}</Link> : (article.author || "Staff Writer")}
        </p>
        <p className="text-[12px] text-gray-500 mt-1 leading-snug">{article.authorRole}</p>
        {href ? (
          <Link href={href} className="text-[11.5px] font-semibold text-red-600 mt-1.5 inline-block hover:underline">View All Articles →</Link>
        ) : (
          <span className="text-[11.5px] font-semibold text-red-600/50 mt-1.5 inline-block">View All Articles →</span>
        )}
      </div>
    </div>
  );
}

/** Default look for the Previous/Next navigation cards — used whenever the
 *  admin hasn't (yet) overridden a particular setting, so older saved
 *  configs that predate a field still render sensibly. */
export const DEFAULT_PREV_NEXT_SETTINGS = {
  enabled: true,
  showThumbnail: true,
  prevLabel: "Previous Article",
  nextLabel: "Next Article",
  labelSize: 10,
  titleSize: 12.5,
  labelColor: "#9ca3af",
  textColor: "#111827",
  hoverColor: "#dc2626",
  bgColor: "#f9fafb",
  hoverBgColor: "#f3f4f6",
  borderColor: "#f1f5f9",
  borderRadius: 10,
};

/** Previous/Next article navigation — every visual aspect (thumbnail
 *  on/off, label text, font sizes, text/hover/background/border colors,
 *  corner radius) is driven by `settings`, which comes straight from the
 *  Article Detail Page Builder's "Previous / Next navigation" panel so the
 *  admin's choices apply identically across every template.
 *
 *  Only renders the side(s) that actually exist within the article's own
 *  category — e.g. if the open article is the oldest one in its category
 *  there is no "next", so only the "previous" card is shown (full width),
 *  and vice versa. Nothing renders at all if neither exists. */
export function PrevNextNav({ previous, next, settings = {} }) {
  if (!previous && !next) return null;
  const s = { ...DEFAULT_PREV_NEXT_SETTINGS, ...settings };
  const bothPresent = !!previous && !!next;
  return (
    <div className={bothPresent ? "grid grid-cols-2 gap-3" : "grid grid-cols-1 gap-3"}>
      {previous && <PrevNextCard item={previous} direction="prev" label={s.prevLabel} settings={s} />}
      {next && <PrevNextCard item={next} direction="next" label={s.nextLabel} settings={s} />}
    </div>
  );
}

function PrevNextCard({ item, direction, label, settings }) {
  const [hover, setHover] = useState(false);
  const href = articleHref(item);
  const Wrap = href ? Link : "div";
  const isNext = direction === "next";

  return (
    <Wrap
      {...(href ? { href } : {})}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center gap-3 p-3 transition-colors duration-150"
      style={{
        background: hover ? settings.hoverBgColor : settings.bgColor,
        border: `1px solid ${settings.borderColor}`,
        borderRadius: settings.borderRadius,
        flexDirection: isNext ? "row-reverse" : "row",
        textAlign: isNext ? "right" : "left",
        cursor: href ? "pointer" : "default",
      }}
    >
      {settings.showThumbnail && (
        <div className="w-14 h-14 rounded-md shrink-0 overflow-hidden" style={imgStyle(item || {}, "1/1")} />
      )}
      <div className="min-w-0 flex-1">
        <p
          className="font-bold uppercase flex items-center gap-1"
          style={{ fontSize: settings.labelSize, color: settings.labelColor, justifyContent: isNext ? "flex-end" : "flex-start" }}
        >
          {!isNext && <span>⟨</span>}
          <span>{label}</span>
          {isNext && <span>⟩</span>}
        </p>
        <p
          className="font-semibold mt-1 line-clamp-2 transition-colors duration-150"
          style={{ fontSize: settings.titleSize, color: hover ? settings.hoverColor : settings.textColor }}
        >
          {item?.title || "—"}
        </p>
      </div>
    </Wrap>
  );
}

export { imgStyle, gradFor };
