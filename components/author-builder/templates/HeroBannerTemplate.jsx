"use client";

import { FileText, CalendarDays, MapPin, Award, Clock } from "lucide-react";
import { useAuthorContent, SocialIcons, AuthorAvatar, Chip, interpolate, imgStyle, ArticleLink } from "../shared";

/** Template 2 — Hero Banner Layout: full-width dark gradient hero with
 *  portrait + bio, a horizontal metrics strip, article grid, about/topics
 *  below. Nothing here is sticky — the hero stays static, per spec. */
export default function HeroBannerTemplate({ data, author, device = "desktop" }) {
  const isMobile = device === "mobile";
  const isTablet = device === "tablet";
  const a = author || { name: "James Whitmore", role: "Chief Foreign Correspondent", bio: "", location: "", topics: [], social: [] };
  const { articles, articlesCount } = useAuthorContent(author, data.latestArticles?.count ?? 6);
  const cols = isMobile ? 1 : isTablet ? 2 : (data.latestArticles?.columns ?? 3);

  const stats = [
    data.stats?.showArticles && { icon: FileText, label: "Articles Published", value: articlesCount },
    data.stats?.showExperience && a.experience && { icon: CalendarDays, label: "Experience", value: a.experience },
    data.stats?.showLocation && a.location && { icon: MapPin, label: "Location", value: a.location },
    data.stats?.showAwards && a.awards && { icon: Award, label: "Recognitions", value: a.awards },
  ].filter(Boolean);

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="px-6 sm:px-10 py-8 sm:py-10" style={{ background: data.hero?.bg || "linear-gradient(120deg, #16181d, #0b0c0f)" }}>
        <div className={`mx-auto flex ${isMobile ? "flex-col items-center text-center" : "flex-row items-center"} gap-7`} style={{ maxWidth: 1200 }}>
          <AuthorAvatar author={a} size={isMobile ? 96 : 118} />
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-[26px] sm:text-[32px] font-bold text-white leading-tight">{a.name}</h1>
            <p className="text-[11px] font-bold uppercase tracking-widest text-red-500 mt-1.5">{a.role}</p>
            <p className="text-[13px] text-white/60 mt-2.5 leading-relaxed max-w-2xl">{a.bio}</p>
            {data.hero?.showSocial && <SocialIcons social={a.social} className={`mt-3 text-white/70 ${isMobile ? "justify-center" : ""}`} />}
          </div>
        </div>
      </div>

      {/* Metrics strip */}
      {data.stats?.enabled && stats.length > 0 && (
        <div className="border-b border-gray-100">
          <div className={`mx-auto px-6 sm:px-10 py-4 flex ${isMobile ? "flex-wrap gap-5 justify-center" : "gap-10"}`} style={{ maxWidth: 1200 }}>
            {stats.map((it, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <it.icon size={17} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-[14px] font-bold text-gray-900 leading-none">{it.value}</p>
                  <p className="text-[10.5px] text-gray-400 mt-1">{it.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto px-6 sm:px-10 py-8" style={{ maxWidth: 1200 }}>
        {/* Latest articles */}
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>{interpolate(data.latestArticles?.title, a)}</SectionLabel>
          <span className="text-[11.5px] font-semibold text-red-600">View All Articles →</span>
        </div>
        <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {articles.map((art) => (
            <ArticleLink key={art.id} article={art} className={`group ${data.card?.borderEnabled ? "border border-gray-100 rounded-lg overflow-hidden" : ""}`}>
              {data.latestArticles?.showImage && (
                <div className="overflow-hidden">
                  <div className="transition-transform duration-300 group-hover:scale-105" style={imgStyle(art, data.latestArticles?.imageRatio || "16/9")} />
                </div>
              )}
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

        {/* About + Topics */}
        {(data.about?.enabled || data.topics?.enabled) && (
          <div className={`grid gap-8 mt-10 pt-8 border-t border-gray-100 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            {data.about?.enabled && (
              <div>
                <SectionLabel>{interpolate(data.about.title, a)}</SectionLabel>
                <p className="text-[12.5px] text-gray-500 leading-relaxed mt-2.5">{a.aboutText || a.bio}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {a.specialization && <MiniField label="Specialization" value={a.specialization} />}
                  {a.education && <MiniField label="Education" value={a.education} />}
                  {a.experience && <MiniField label="Experience" value={a.experience} />}
                  {a.languages && <MiniField label="Languages" value={a.languages} />}
                </div>
              </div>
            )}
            {data.topics?.enabled && a.topics?.length > 0 && (
              <div>
                <SectionLabel>{interpolate(data.topics.title, a)}</SectionLabel>
                <div className="flex flex-wrap gap-2 mt-3">
                  {a.topics.map((t) => <Chip key={t}>{t}</Chip>)}
                </div>
              </div>
            )}
          </div>
        )}
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
