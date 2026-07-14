"use client";

import { FileText, CalendarDays, MapPin, ShieldCheck, Clock } from "lucide-react";
import { useAuthorContent, SocialIcons, AuthorAvatar, Chip, interpolate, imgStyle, ArticleLink } from "../shared";

/** Template 3 — Sticky Left Sidebar: profile + stats + trust badges + topics
 *  live in a left column that uses position:sticky + top:20px + align-self:
 *  flex-start, so it scrolls naturally with the page and stops at the
 *  bottom of the center column. Center column holds the article grid,
 *  about section and most-read list. */
export default function SidebarLeftTemplate({ data, author, device = "desktop" }) {
  const isMobile = device === "mobile";
  const isTablet = device === "tablet";
  const a = author || { name: "James Whitmore", role: "Chief Foreign Correspondent", bio: "", location: "", topics: [], social: [] };
  const { articles, articlesCount } = useAuthorContent(author, data.latestArticles?.count ?? 6);
  const { articles: mostReadArticles } = useAuthorContent(author, data.mostRead?.count ?? 5);
  const cols = isMobile ? 1 : isTablet ? 2 : (data.latestArticles?.columns ?? 3);

  return (
    <div className="bg-white">
      <div className="mx-auto px-4 sm:px-6 py-6" style={{ maxWidth: 1600 }}>
        <div className={isMobile || isTablet ? "flex flex-col gap-8" : "flex items-start gap-8"}>
          {/* ── LEFT SIDEBAR — sticky ── */}
          <div
            className={isTablet ? "w-full" : "shrink-0"}
            style={isMobile || isTablet ? {} : { width: 280, position: "sticky", top: 20, alignSelf: "flex-start" }}
          >
            <AuthorAvatar author={a} size={92} />
            <h1 className="font-serif text-[20px] font-bold text-gray-900 mt-3">{a.name}</h1>
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-red-600 mt-1">{a.role}</p>
            <p className="text-[12.5px] text-gray-500 mt-2.5 leading-relaxed">{a.bio}</p>
            <SocialIcons social={a.social} className="mt-3 text-gray-500" />

            {data.stats?.enabled && (
              <div className="mt-5 space-y-3 pt-4 border-t border-gray-100">
                {data.stats.showArticles && <StatRow icon={FileText} label="Articles Published" value={articlesCount} />}
                {data.stats.showExperience && a.experience && <StatRow icon={CalendarDays} label="Experience" value={a.experience} />}
                {data.stats.showLocation && a.location && <StatRow icon={MapPin} label="Location" value={a.location} />}
              </div>
            )}

            {data.badges?.some((b) => b.enabled) && (
              <div className="mt-5 space-y-3 pt-4 border-t border-gray-100">
                {data.badges.filter((b) => b.enabled).map((b) => (
                  <div key={b.id} className="flex items-start gap-2">
                    <ShieldCheck size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12px] font-bold text-gray-900 leading-snug">{b.title}</p>
                      <p className="text-[10.5px] text-gray-500 leading-snug">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {data.topics?.enabled && a.topics?.length > 0 && (
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-2.5">{interpolate(data.topics.title, a)}</p>
                <div className="flex flex-wrap gap-1.5">
                  {a.topics.map((t) => <Chip key={t}>{t}</Chip>)}
                </div>
              </div>
            )}
          </div>

          {/* ── CENTER content ── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <SectionLabel>{interpolate(data.latestArticles?.title, a)}</SectionLabel>
            </div>
            <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
              {articles.map((art) => (
                <ArticleLink key={art.id} article={art} className={`group ${data.card?.borderEnabled ? "border border-gray-100 rounded-lg overflow-hidden" : ""}`}>
                  {data.latestArticles?.showImage && <div style={imgStyle(art, data.latestArticles?.imageRatio || "16/9")} />}
                  <div style={{ padding: data.card?.padding ?? 12 }}>
                    {data.latestArticles?.showCategory && (
                      <p className="text-[10px] font-bold uppercase tracking-wide text-red-600">{art.category}</p>
                    )}
                    <h3 className="font-semibold text-[14px] text-gray-900 leading-snug mt-1.5 line-clamp-2 group-hover:text-red-600 transition-colors">{art.title}</h3>
                    {data.latestArticles?.showDescription && (
                      <p className="text-[12px] text-gray-500 mt-1 line-clamp-2 leading-snug">{art.excerpt}</p>
                    )}
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-2">
                      {data.latestArticles?.showDate && <span>{art.date}</span>}
                      {data.latestArticles?.showDate && data.latestArticles?.showReadTime && <span>·</span>}
                      {data.latestArticles?.showReadTime && <span className="flex items-center gap-1"><Clock size={10} />{art.readTime}</span>}
                    </div>
                  </div>
                </ArticleLink>
              ))}
            </div>

            {data.about?.enabled && (
              <div className="mt-9 pt-8 border-t border-gray-100">
                <SectionLabel>{interpolate(data.about.title, a)}</SectionLabel>
                <p className="text-[12.5px] text-gray-500 leading-relaxed mt-2.5 max-w-2xl">{a.aboutText || a.bio}</p>
                <div className={`grid gap-4 mt-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  {a.specialization && <MiniField label="Specialization" value={a.specialization} />}
                  {a.education && <MiniField label="Education" value={a.education} />}
                  {a.experience && <MiniField label="Experience" value={a.experience} />}
                  {a.languages && <MiniField label="Languages" value={a.languages} />}
                </div>
              </div>
            )}

            {data.mostRead?.enabled && mostReadArticles.length > 0 && (
              <div className="mt-9 pt-8 border-t border-gray-100">
                <SectionLabel>{interpolate(data.mostRead.title, a)}</SectionLabel>
                <div className={`grid gap-4 mt-3 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  {mostReadArticles.map((art, i) => (
                    <ArticleLink key={art.id} article={art} as="div" className="flex gap-3 group">
                      {data.mostRead.showNumbers && (
                        <span className="font-serif text-[22px] font-bold text-gray-200 leading-none w-6 shrink-0">{i + 1}</span>
                      )}
                      <p className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{art.title}</p>
                    </ArticleLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon size={15} className="text-gray-400 shrink-0" />
      <div>
        <p className="text-[13px] font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-[10.5px] text-gray-400 mt-1">{label}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <h2 className="font-serif text-[19px] font-bold text-gray-900">{children}</h2>;
}

function MiniField({ label, value }) {
  return (
    <div>
      <p className="text-[10.5px] font-bold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-[12px] text-gray-700 mt-0.5 leading-snug">{value}</p>
    </div>
  );
}
