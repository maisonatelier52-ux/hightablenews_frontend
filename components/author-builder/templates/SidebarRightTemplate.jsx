"use client";

import Link from "next/link";
import { FileText, CalendarDays, MapPin, Award, ShieldCheck, Clock, Mail, Bookmark } from "lucide-react";
import { getAuthors } from "@/lib/authorsApi";
import { useAuthorContent, SocialIcons, AuthorAvatar, interpolate, imgStyle, ArticleLink } from "../shared";
import { authorHref as authorPageHref, articleHref } from "@/lib/articlesSource";

/** Template 1 — Sticky Right Sidebar (matches the HighTableNews author page
 *  reference): profile hero + stat rail + trust badges + article grid +
 *  topics + more writers on the left/center; a right sidebar (About, Most
 *  Read, Newsletter) that uses position:sticky + top:20px + align-self:
 *  flex-start, so it scrolls naturally and stops at the bottom of the
 *  center column — never fixed, never overlapping the footer.
 *
 *  Layout: the outer wrapper is full-bleed (w-full) with horizontal padding
 *  only — no max-width cap — so the page uses the entire viewport. The main
 *  column takes 75% of the available width and the sidebar takes the
 *  remaining 25% on desktop/tablet; both stack to 100% on mobile.
 *
 *  Visual language: Playfair Display for headlines, Lora for body copy,
 *  Source Sans 3 for UI/meta text, with a deep-red / navy / gold editorial
 *  palette on an off-white ground — a broadsheet-style masthead look. */

// ─── Design tokens ───────────────────────────────────────────────────────
const INK = "#111111";
const RED = "#8B1A1A";
const BLUE = "#1A3A6B";
const GOLD = "#B8962A";
const GRAY = "#888888";
const LINE = "#E4E3DF";
const LINE_STRONG = "#CCCCCC";
const PAPER = "#F2F1EE";
const OFFWHITE = "#FAFAF8";

const HEAD = "font-['Playfair_Display',Georgia,serif]";
const BODY = "font-['Lora',Georgia,serif]";
const SANS = "font-['Source_Sans_3',Arial,sans-serif]";

export default function SidebarRightTemplate({ data, author, device = "desktop" }) {
  const target = author || null;
  const { articles, articlesCount } = useAuthorContent(target, data.latestArticles?.count ?? 6);
  const isMobile = device === "mobile";
  const isTablet = device === "tablet";
  const stacked = isMobile || isTablet;
  const a = target || { name: "James Whitmore", role: "Chief Foreign Correspondent", bio: "", location: "", topics: [], social: [] };
  const otherAuthors = getAuthors().filter((x) => x._id !== a._id).slice(0, data.moreWriters?.count ?? 4);

  const cols = isMobile ? 1 : isTablet ? 2 : (data.latestArticles?.columns ?? 3);
  const sidebarOn = !stacked;

  return (
    <div style={{ background: OFFWHITE }}>
      <div className="w-full px-4 sm:px-6 lg:px-10">

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className={`${SANS} py-[10px] text-[0.7rem] tracking-[0.03em] flex gap-[6px] items-center flex-wrap`}
          style={{ color: GRAY }}
        >
          <Link href="/" className="hover:opacity-75" style={{ color: BLUE }}>Home</Link>
          <span style={{ color: LINE_STRONG }}>/</span>
          <Link href="/authors" className="hover:opacity-75" style={{ color: BLUE }}>Authors</Link>
          <span style={{ color: LINE_STRONG }}>/</span>
          <span>{a.name}</span>
        </nav>

        {/* ── HERO ── */}
        <div className="pb-6">
          <div className="p-6 sm:p-7" style={{ background: PAPER, border: `1px solid ${LINE}` }}>
            <div className={stacked ? "flex flex-col gap-6" : "flex flex-row gap-7 items-start"}>
              <div className="mx-auto sm:mx-0 flex-shrink-0" style={{ padding: 4, background: "white", borderRadius: "9999px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <AuthorAvatar author={a} size={isMobile ? 88 : 104} />
              </div>

              <div className={`flex-1 min-w-0 ${stacked ? "text-center" : "text-left"}`}>
                <h1 className={`${HEAD} font-black leading-[1.1] mb-1`} style={{ fontSize: isMobile ? "1.7rem" : "2rem", color: INK }}>{a.name}</h1>
                <div className={`${SANS} text-[0.74rem] font-bold tracking-[0.14em] uppercase mb-3`} style={{ color: RED }}>{a.role}</div>
                <p className={`${BODY} leading-[1.6] mb-4 max-w-[560px] ${stacked ? "mx-auto" : ""}`} style={{ fontSize: "0.9rem", color: "#333333" }}>{a.bio}</p>
                <SocialIconsRow social={a.social} centered={stacked} />
              </div>

              {data.stats?.enabled && !stacked && (
                <div className="flex-shrink-0 flex flex-col gap-5" style={{ borderLeft: `1px solid ${LINE_STRONG}`, paddingLeft: 28 }}>
                  <StatsBlock author={a} articlesCount={articlesCount} data={data.stats} />
                </div>
              )}
            </div>
            {data.stats?.enabled && stacked && (
              <div className="mt-5 pt-4 flex flex-row justify-between gap-4" style={{ borderTop: `1px solid ${LINE_STRONG}` }}>
                <StatsBlock author={a} articlesCount={articlesCount} data={data.stats} stacked />
              </div>
            )}
          </div>

          {/* Trust badges */}
          {data.badges?.some((b) => b.enabled) && (
            <div className={`grid gap-4 mt-6 py-6 ${isMobile ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`} style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
              {data.badges.filter((b) => b.enabled).map((b) => (
                <div key={b.id} className="flex items-start gap-2.5">
                  <div className="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center" style={{ background: `${RED}1a`, color: RED }}>
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <p className={`${SANS} text-[0.82rem] font-bold mb-[2px]`} style={{ color: INK }}>{b.title}</p>
                    <p className={`${SANS} text-[0.74rem] leading-[1.4]`} style={{ color: GRAY }}>{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── MAIN 75% / SIDEBAR 25% ── */}
        <div className={stacked ? "flex flex-col gap-8 pb-6" : "flex gap-0 items-start pb-10"}>
          <main
            className={stacked ? "min-w-0" : "min-w-0 pr-9"}
            style={{
              width: stacked ? "100%" : sidebarOn ? "75%" : "100%",
              flex: stacked ? "1 1 auto" : sidebarOn ? "0 0 75%" : "1 1 auto",
              borderRight: sidebarOn ? `1px solid ${LINE_STRONG}` : "none",
            }}
          >
            {/* Article grid */}
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <h2 className={`${HEAD} font-bold`} style={{ fontSize: "1.3rem", color: INK }}>{interpolate(data.latestArticles?.title, a)}</h2>
            </div>
            <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
              {articles.map((art) => (
                <ArticleLink key={art.id} article={art} className="group block" style={{ border: `1px solid ${LINE}`, background: "white" }}>
                  {data.latestArticles?.showImage && (
                    <div className="overflow-hidden" style={imgStyle(art, data.latestArticles?.imageRatio || "16/9")} />
                  )}
                  <div style={{ padding: data.card?.padding ?? 16 }}>
                    <div className="flex items-center gap-[6px] mb-[6px]">
                      {data.latestArticles?.showCategory && (
                        <span className={`${SANS} text-[0.68rem] font-bold tracking-[0.1em] uppercase`} style={{ color: RED }}>{art.category}</span>
                      )}
                    </div>
                    <h3 className={`${HEAD} text-[1rem] font-bold leading-[1.3] mb-[7px] group-hover:opacity-75`} style={{ color: INK }}>{art.title}</h3>
                    {data.latestArticles?.showDescription && (
                      <p className="text-[0.79rem] leading-[1.45] line-clamp-2 mb-3" style={{ color: "#555555" }}>{art.excerpt}</p>
                    )}
                    <div className={`${SANS} flex items-center justify-between pt-2 text-[0.7rem]`} style={{ borderTop: `1px solid ${LINE}`, color: GRAY }}>
                      <span className="flex items-center gap-[5px]">
                        {data.latestArticles?.showDate && <span>{art.date}</span>}
                        {data.latestArticles?.showDate && data.latestArticles?.showReadTime && <span>•</span>}
                        {data.latestArticles?.showReadTime && (
                          <span className="flex items-center gap-1"><Clock size={11} />{art.readTime}</span>
                        )}
                      </span>
                      <Bookmark size={14} style={{ color: LINE_STRONG }} />
                    </div>
                  </div>
                </ArticleLink>
              ))}
            </div>

            {/* Topics */}
            {data.topics?.enabled && a.topics?.length > 0 && (
              <div className="mt-9 pt-6" style={{ borderTop: `1px solid ${LINE}` }}>
                <div className={`${SANS} text-[0.7rem] font-bold tracking-[0.06em] mb-3`} style={{ color: INK }}>{interpolate(data.topics?.title, a)}</div>
                <div className="flex flex-wrap gap-[8px]">
                  {a.topics.map((t) => (
                    <span key={t} className={`${SANS} text-[0.72rem] font-semibold tracking-[0.02em] px-[13px] py-[6px]`} style={{ border: `1px solid ${LINE_STRONG}`, color: "#333333" }}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* More writers */}
            {data.moreWriters?.enabled && otherAuthors.length > 0 && (
              <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${LINE}` }}>
                <div className={`${SANS} text-[0.7rem] font-bold tracking-[0.06em] mb-4`} style={{ color: INK }}>{data.moreWriters?.title || "More Writers"}</div>
                <div className={`grid gap-4 ${isMobile ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
                  {otherAuthors.map((w) => {
                    const wHref = authorPageHref(w.slug);
                    const WWrap = wHref ? Link : "div";
                    return (
                      <WWrap key={w._id} {...(wHref ? { href: wHref } : {})} className="flex items-center gap-[10px] group">
                        <AuthorAvatar author={w} size={40} />
                        <div className="min-w-0">
                          <p className={`${HEAD} text-[0.86rem] font-bold truncate group-hover:opacity-75`} style={{ color: INK }}>{w.name}</p>
                          <p className={`${SANS} text-[0.66rem] truncate`} style={{ color: GRAY }}>{w.role}</p>
                        </div>
                      </WWrap>
                    );
                  })}
                </div>
              </div>
            )}
          </main>

          {/* ── SIDEBAR — 25%, sticky ── */}
          {sidebarOn && (
            <div style={{ width: "25%", flex: "0 0 25%", position: "sticky", top: 20, alignSelf: "flex-start", paddingLeft: 22 }}>
              <RightSidebar data={data.sidebar} author={a} />
            </div>
          )}
          {stacked && (
            <div className="w-full">
              <RightSidebar data={data.sidebar} author={a} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SocialIconsRow({ social = [], centered }) {
  if (!social?.length) return null;
  return (
    <div className={`flex gap-2 ${centered ? "justify-center" : "justify-start"}`}>
      <SocialIcons social={social} size={14} />
    </div>
  );
}

function StatsBlock({ author, articlesCount, data, stacked = false }) {
  const items = [
    data.showArticles && { icon: FileText, label: "Articles Published", value: articlesCount },
    data.showExperience && author.experience && { icon: CalendarDays, label: "Experience", value: author.experience },
    data.showLocation && author.location && { icon: MapPin, label: "Location", value: author.location },
    data.showAwards && author.awards && { icon: Award, label: "Recognition", value: author.awards },
  ].filter(Boolean);
  if (items.length === 0) return null;
  return (
    <div className={stacked ? "grid grid-cols-2 gap-4 w-full" : "flex flex-col gap-5"}>
      {items.map((it, i) => (
        <div key={i} className="flex items-start gap-3">
          <it.icon size={18} style={{ color: RED }} className="shrink-0 mt-[2px]" />
          <div>
            <div className={`${HEAD} font-bold leading-[1.1]`} style={{ fontSize: "1.15rem", color: INK }}>{it.value}</div>
            <div className={`${SANS} text-[0.72rem] tracking-[0.03em]`} style={{ color: GRAY }}>{it.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ModuleHdr({ children }) {
  return (
    <div className={`${SANS} text-[0.62rem] font-extrabold tracking-[0.2em] uppercase mb-3 pb-[6px]`} style={{ color: INK, borderBottom: `2px solid ${INK}` }}>
      {children}
    </div>
  );
}

function AboutRow({ label, value }) {
  return (
    <div className="py-[9px]" style={{ borderBottom: `1px solid ${LINE}` }}>
      <div className={`${SANS} text-[0.66rem] font-bold tracking-[0.06em] uppercase mb-[3px]`} style={{ color: RED }}>{label}</div>
      <div className={`${BODY} text-[0.82rem] leading-[1.45]`} style={{ color: "#333333" }}>{value}</div>
    </div>
  );
}

function RightSidebar({ data, author }) {
  if (!data) return null;
  const { articles: mostReadArticles } = useAuthorContent(author, data.mostRead?.count ?? 5);
  return (
    <aside aria-label="Sidebar">
      {data.about?.enabled && (
        <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${LINE}` }}>
          <ModuleHdr>{interpolate(data.about.title, author)}</ModuleHdr>
          <p className={`${BODY} text-[0.84rem] leading-[1.6] mb-3`} style={{ color: "#333333" }}>{author.aboutText || author.bio}</p>
          <div>
            {author.specialization && <AboutRow label="Specialization" value={author.specialization} />}
            {author.education && <AboutRow label="Education" value={author.education} />}
            {author.experience && <AboutRow label="Experience" value={author.experience} />}
            {author.languages && <AboutRow label="Languages" value={author.languages} />}
          </div>
        </div>
      )}

      {data.mostRead?.enabled && (
        <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${LINE}` }}>
          <ModuleHdr>{interpolate(data.mostRead.title, author)}</ModuleHdr>
          <ul className="list-none">
            {mostReadArticles.map((a, i, arr) => {
              const href = articleHref(a);
              const Item = href ? Link : "div";
              return (
                <li key={a.id} className="flex gap-[10px] items-start py-[10px] group" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : "none" }}>
                  {data.mostRead.showNumbers && (
                    <span className={`${HEAD} font-black leading-none min-w-[20px]`} style={{ fontSize: "1.3rem", color: LINE_STRONG }}>{i + 1}</span>
                  )}
                  <div className="min-w-0">
                    <h5 className={`${HEAD} text-[0.8rem] font-bold leading-[1.28]`} style={{ color: INK }}>
                      <Item {...(href ? { href } : {})} className="hover:opacity-75">{a.title}</Item>
                    </h5>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {data.newsletter?.enabled && (
        <div className="p-[18px] text-center" style={{ background: INK }}>
          <div className="flex justify-center mb-2" style={{ color: "#666666" }}><Mail size={22} /></div>
          <div className={`${HEAD} text-[1.0rem] font-bold text-white mb-[6px] leading-[1.3]`}>{data.newsletter.heading}</div>
          <div className={`${SANS} text-[0.72rem] mb-[14px] leading-[1.5]`} style={{ color: "#888888" }}>{data.newsletter.subheading}</div>
          <input
            readOnly
            placeholder="Your email address"
            className={`${SANS} w-full px-[10px] py-2 text-[0.78rem] mb-2 outline-none`}
            style={{ background: "#222222", border: "1px solid #333333", color: "white" }}
          />
          <button type="button" className={`${SANS} w-full py-[9px] text-[0.72rem] font-bold tracking-[0.1em] uppercase cursor-pointer transition-colors duration-150`} style={{ background: RED, color: "white", border: "none" }}>
            {data.newsletter.ctaLabel}
          </button>
        </div>
      )}
    </aside>
  );
}
