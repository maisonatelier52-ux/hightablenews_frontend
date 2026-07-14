"use client";

// Realistic block preview thumbnails shown in the Page Structure panel

const SAMPLE_ARTICLES = [
  { category: "POLITICS", title: "Live updates from The White House: A new chapter in transatlantic diplomacy", date: "2h ago", tag: "FEATURED" },
  { category: "HEALTH", title: "How Sarah Caped With Her Chronic Disease — And Found Clarity", date: "3h ago" },
  { category: "ECONOMY", title: "A Global Economic Redress: Asia-Blue strategies with high inflation", date: "4h ago" },
  { category: "JUSTICE", title: "Regulating technology: how courts are reshaping AI liability law", date: "5h ago" },
  { category: "BUSINESS", title: "It's Never Been More Expensive to Visit New York City", date: "6h ago" },
  { category: "FREE SPEECH", title: "The new showdown: how governments are reshaping modern rhetoric", date: "7h ago" },
];

export default function BlockPreview({ type, data }) {
  switch (type) {
    case "breakingNews":
      return (
        <div
          className="flex items-center gap-0 rounded overflow-hidden text-[11px]"
          style={{ backgroundColor: data.bg || "#111111" }}
        >
          <span
            className="px-2 py-1.5 font-bold text-[10px] shrink-0"
            style={{ backgroundColor: data.labelBg || "#cc0000", color: data.textColor || "#fff" }}
          >
            {data.labelText || "BREAKING"}
          </span>
          <span className="px-3 py-1.5 truncate" style={{ color: data.textColor || "#ffffff" }}>
            Markets open higher as central bank signals rate pause · Tech stocks lead gains · {data.limit || 5} headlines rotating
          </span>
        </div>
      );

    case "heroStory":
      return (
        <div className="rounded-md overflow-hidden" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b1b 100%)" }}>
          <div className="relative" style={{ paddingTop: `${Math.max((data.paddingTop || 48) * 0.4, 16)}px`, paddingBottom: `${Math.max((data.paddingBottom || 48) * 0.4, 16)}px`, paddingLeft: 12, paddingRight: 12 }}>
            {data.showCategory && data.category && (
              <span className="text-[9px] font-bold uppercase tracking-widest text-red-400 block mb-1">{data.category}</span>
            )}
            <p className="text-white font-bold leading-tight mb-1" style={{ fontSize: Math.max((data.titleSize || 28) * 0.45, 11) + 'px' }}>
              {data.title || "Untitled hero story"}
            </p>
            {data.subheadline && (
              <p className="text-white/70 text-[10px] leading-snug">{data.subheadline}</p>
            )}
            {data.showCta && data.ctaLabel && (
              <span className="inline-block mt-2 text-[9px] font-bold bg-red-600 text-white px-2 py-0.5 rounded">{data.ctaLabel}</span>
            )}
          </div>
        </div>
      );

    case "topStoriesGrid":
      return (
        <div>
          <div className={`grid gap-1.5`} style={{ gridTemplateColumns: `repeat(${Math.min(data.columns || 4, 4)}, 1fr)` }}>
            {Array.from({ length: Math.min(data.limit || 4, 8) }).map((_, i) => (
              <div key={i} className="rounded overflow-hidden">
                <div className="h-10 bg-gradient-to-br from-gray-300 to-gray-400" />
                <div className="p-1 space-y-0.5">
                  <div className="h-1 rounded bg-red-200 w-1/2" />
                  <div className="h-1.5 rounded bg-gray-300 w-full" />
                  <div className="h-1 rounded bg-gray-200 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "newsFeed":
      return (
        <div>
          {data.title && <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1.5">{data.title}</p>}
          <div className="space-y-2">
            {SAMPLE_ARTICLES.slice(0, Math.min(data.limit || 4, 4)).map((a, i) => (
              <div key={i} className="flex gap-2 pb-2 border-b border-gray-100 last:border-0">
                {data.showImages && (
                  <div className="h-12 w-16 shrink-0 rounded bg-gradient-to-br from-gray-200 to-gray-300" />
                )}
                <div className="flex-1 space-y-0.5">
                  {data.showCategory && <span className="text-[8px] font-bold uppercase tracking-wide text-red-500">{a.category}</span>}
                  <p className="text-[10px] font-semibold text-gray-800 leading-tight line-clamp-2">{a.title}</p>
                  {data.showDate && <span className="text-[8px] text-gray-400">{a.date}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "categorySection":
      return (
        <div style={{ backgroundColor: data.bg || "#fff" }} className="rounded p-2">
          <p className="text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ color: data.textColor || "#111" }}>
            {data.title || data.category}
          </p>
          {data.layout === "list" ? (
            <div className="space-y-1.5">
              {SAMPLE_ARTICLES.slice(0, Math.min(data.limit || 4, 4)).map((a, i) => (
                <div key={i} className="flex gap-2 items-center">
                  {data.showImages && <div className="h-8 w-10 shrink-0 rounded bg-gradient-to-br from-gray-200 to-gray-300" />}
                  <div className="h-2.5 rounded bg-gray-200 flex-1" style={{ width: `${90 - i * 8}%` }} />
                </div>
              ))}
            </div>
          ) : data.layout === "carousel" ? (
            <div className="flex gap-1.5 overflow-hidden">
              {Array.from({ length: Math.min(data.limit || 5, 5) }).map((_, i) => (
                <div key={i} className="h-14 w-20 shrink-0 rounded bg-gradient-to-br from-gray-200 to-gray-300" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5">
              {Array.from({ length: Math.min(data.limit || 6, 6) }).map((_, i) => (
                <div key={i} className="rounded overflow-hidden">
                  {data.showImages && <div className="h-10 bg-gradient-to-br from-gray-200 to-gray-300" />}
                  <div className="h-2 rounded bg-gray-200 mt-1 mx-1" />
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case "opinion":
      return (
        <div className="rounded border border-gray-200 p-3" style={{ backgroundColor: data.bg || "#f8f8f6" }}>
          <p className="text-[9px] font-bold uppercase tracking-wide text-red-500 mb-0.5">Opinion</p>
          <p className="text-[11px] font-semibold text-gray-900 italic leading-snug">
            "{data.title || "Untitled opinion piece"}"
          </p>
          {data.author && <p className="text-[9px] text-gray-500 mt-1">— {data.author}</p>}
        </div>
      );

    case "authorSpotlight":
      return (
        <div>
          {data.title && <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1.5">{data.title}</p>}
          <div className="flex gap-3">
            {Array.from({ length: Math.min(data.limit || 3, 4) }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 border-2 border-white shadow" />
                <div className="h-1.5 w-10 rounded bg-gray-200" />
                <div className="h-1 w-8 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      );

    case "advertisement":
      return data.imageUrl ? (
        <div className="rounded overflow-hidden" style={{ height: `${Math.max((data.height || 90) * 0.4, 36)}px` }}>
          <img src={data.imageUrl} alt={data.altText || "Advertisement"} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div
          className="rounded border-2 border-dashed border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-medium uppercase tracking-wide"
          style={{ height: `${Math.max((data.height || 90) * 0.4, 36)}px` }}
        >
          Ad — {data.size || "leaderboard"} ({data.height || 90}px)
        </div>
      );

    case "video":
      return (
        <div className="h-20 rounded bg-gray-900 flex items-center justify-center relative overflow-hidden">
          <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow">
            <div className="h-0 w-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-gray-900 ml-0.5" />
          </div>
          <p className="absolute bottom-1.5 left-2 text-white text-[10px] font-medium truncate right-2">{data.title || "Featured video"}</p>
        </div>
      );

    case "fullWidthBanner":
      return (
        <div
          className="rounded flex flex-col items-start justify-center p-3 overflow-hidden"
          style={{ height: `${Math.max((data.height || 320) * 0.2, 48)}px`, background: data.imageUrl ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${data.imageUrl}) center/cover` : "linear-gradient(135deg, #1a1a2e, #cc0000)" }}
        >
          <p className="text-white text-[11px] font-bold leading-tight">{data.heading || "Full Width Banner"}</p>
          {data.ctaLabel && (
            <span className="mt-1 text-[9px] bg-white text-gray-900 px-1.5 py-0.5 rounded font-semibold">{data.ctaLabel}</span>
          )}
        </div>
      );

    case "featuredStoriesRow":
      return (
        <div>
          {data.title && <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1.5">{data.title}</p>}
          <div className="flex gap-1.5">
            {Array.from({ length: Math.min(data.limit || 4, 5) }).map((_, i) => (
              <div key={i} className="flex-1 rounded overflow-hidden">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300" style={{ height: `${Math.max((data.imageHeight || 120) * 0.35, 32)}px` }} />
                <div className="p-1 space-y-0.5">
                  <div className="h-1 rounded bg-red-200 w-1/2" />
                  <div className="h-1.5 rounded bg-gray-200 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "newsletter":
      return (
        <div className="rounded p-3 text-center" style={{ backgroundColor: data.bg || "#f5f5f0" }}>
          <p className="text-[11px] font-bold" style={{ color: data.textColor || "#111111" }}>{data.heading || "Stay ahead of the story"}</p>
          <p className="text-[9px] text-gray-500 mt-0.5">{data.subheading || "Get the headlines that matter."}</p>
          <div className="flex gap-1 mt-2 justify-center">
            <div className="h-6 w-28 rounded border border-gray-300 bg-white" />
            <div className="h-6 w-16 rounded" style={{ backgroundColor: data.ctaBg || "#cc0000" }} />
          </div>
        </div>
      );

    case "customHtml":
      return (
        <div className="rounded border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 border-b border-gray-100">
            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">Custom HTML</span>
            {!data.enabled && <span className="text-[9px] text-orange-500 font-medium">Disabled</span>}
          </div>
          {data.html?.trim() && data.html !== "<!-- Add custom markup -->" ? (
            <div className="p-2 text-[10px] leading-relaxed text-gray-600" dangerouslySetInnerHTML={{ __html: data.html.slice(0, 200) }} />
          ) : (
            <div className="p-4 text-center text-[10px] text-gray-400">No HTML content yet</div>
          )}
        </div>
      );

    case "stickyNotice":
      return (
        <div className="rounded flex items-center gap-2 px-3 py-2" style={{ backgroundColor: data.bg || "#1a1a1a" }}>
          <p className="flex-1 text-[10px]" style={{ color: data.textColor || "#fff" }}>{data.text || "Subscribe for full access."}</p>
          {data.ctaLabel && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded shrink-0" style={{ backgroundColor: data.ctaBg || "#cc0000", color: "#fff" }}>{data.ctaLabel}</span>
          )}
        </div>
      );

    case "threeColumnLayout":
      return (
        <div className="flex gap-1.5 min-h-[80px]">
          <div className="w-[22%] shrink-0 rounded border border-gray-200 bg-gray-50 p-1.5">
            <div className="flex items-center gap-1 mb-1">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-500 shrink-0" />
              <p className="text-[8px] font-bold uppercase tracking-wide text-gray-500 truncate">{data.leftTitle || "Most Read"}</p>
            </div>
            <div className="space-y-1">
              {(data.leftItems || []).slice(0, 4).map((item, i) => (
                <div key={item.id || i} className="flex items-center gap-1">
                  {data.leftShowNumbers && <span className="text-[7px] font-bold text-primary-500 w-2.5 shrink-0">{i + 1}</span>}
                  <div className="h-1.5 rounded bg-gray-200 flex-1" style={{ width: `${85 - i * 10}%` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 rounded border border-gray-200 bg-white p-1.5">
            <p className="text-[8px] font-bold uppercase tracking-wide text-gray-500 mb-1 truncate">{data.centerTitle || "Latest News"}</p>
            <div className="space-y-1.5">
              {Array.from({ length: Math.min(data.centerLimit || 3, 4) }).map((_, i) => (
                <div key={i} className="flex gap-1.5 items-center">
                  <div className="h-6 w-8 rounded bg-gradient-to-br from-gray-200 to-gray-300 shrink-0" />
                  <div className="flex-1 space-y-0.5">
                    <div className="h-1 rounded bg-red-200 w-1/3" />
                    <div className="h-1.5 rounded bg-gray-200" style={{ width: `${90 - i * 10}%` }} />
                    <div className="h-1 rounded bg-gray-100 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-[24%] shrink-0 rounded border border-gray-200 bg-gray-50 p-1.5 space-y-1.5">
            <p className="text-[8px] font-bold uppercase tracking-wide text-gray-500 truncate">{data.rightTitle || "In Brief"}</p>
            {data.rightShowNewsletter && (
              <div className="rounded bg-primary-50 border border-primary-100 p-1">
                <p className="text-[7px] font-semibold text-primary-600 truncate">Newsletter</p>
                <div className="h-2.5 w-full rounded bg-white border border-gray-200 mt-0.5" />
              </div>
            )}
            {data.rightShowAd && (
              <div className="h-8 rounded border-2 border-dashed border-gray-200 flex items-center justify-center text-[7px] text-gray-400 font-medium uppercase">Ad</div>
            )}
            <div className="space-y-1">
              {[80, 65, 50].map((w, i) => <div key={i} className="h-1.5 rounded bg-gray-200" style={{ width: `${w}%` }} />)}
            </div>
          </div>
        </div>
      );

    case "newspaperEditorial":
      return (
        <div className="space-y-1.5">
          {/* Top Stories preview */}
          {data.showTopStories && (
            <div className="rounded border border-gray-100 p-1.5">
              <p className="text-[7px] font-black uppercase tracking-widest text-gray-500 mb-1">{data.topStoriesTitle || "FEATURED STORIES"}</p>
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: data.topStoriesCount || 4 }).map((_, i) => (
                  <div key={i} className="rounded overflow-hidden">
                    <div className="h-8 bg-gradient-to-br from-gray-700 to-gray-900" style={{ background: ["linear-gradient(135deg,#1a1a2e,#16213e)","linear-gradient(135deg,#1a2e1a,#163016)","linear-gradient(135deg,#2e1a1a,#301616)","linear-gradient(135deg,#1a1e2e,#161630)"][i%4] }} />
                    <div className="p-0.5 space-y-0.5">
                      <div className="h-1 rounded bg-red-200 w-1/2" />
                      <div className="h-1.5 rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* 3-col editorial */}
          <div className="flex gap-1.5">
            {/* Left sidebar */}
            <div className="w-[22%] shrink-0 space-y-1">
              <div className="h-10 rounded bg-gradient-to-br from-gray-200 to-gray-300" />
              <div className="h-1.5 rounded bg-gray-700 w-4/5" />
              <div className="h-1 rounded bg-gray-200 w-3/5" />
              <div className="h-px bg-gray-100 my-0.5" />
              <div className="h-8 rounded bg-gradient-to-br from-amber-100 to-amber-200" />
              <div className="h-1.5 rounded bg-gray-600 w-4/5" />
              <div className="h-px bg-gray-100 my-0.5" />
              <div className="h-8 rounded bg-green-100 border border-green-200 p-1">
                <div className="h-1 rounded bg-gray-700 w-3/5 mb-0.5" />
                <div className="h-1 rounded bg-gray-400 w-full" />
                <div className="h-1 rounded bg-gray-400 w-4/5" />
              </div>
            </div>
            {/* Center */}
            <div className="flex-1 space-y-1">
              <div className="h-1 rounded bg-gray-300 w-2/5" />
              <div className="h-3 rounded bg-gray-800 w-full" />
              <div className="h-2 rounded bg-gray-800 w-4/5" />
              <div className="h-14 rounded bg-gradient-to-br from-gray-300 to-gray-400" />
              <div className="h-1 rounded bg-gray-200 w-full" />
              <div className="h-1 rounded bg-gray-200 w-5/6" />
              <div className="h-px bg-gray-100 my-1" />
              <div className="flex gap-1">
                <div className="h-10 w-16 rounded bg-gradient-to-br from-amber-100 to-amber-200 shrink-0" />
                <div className="flex-1 space-y-0.5">
                  <div className="h-1 rounded bg-amber-400 w-1/2" />
                  <div className="h-1.5 rounded bg-gray-700" />
                  <div className="h-1.5 rounded bg-gray-700 w-4/5" />
                </div>
              </div>
              <div className="flex gap-1">
                <div className="h-10 w-16 rounded bg-gradient-to-br from-amber-100 to-amber-200 shrink-0" />
                <div className="flex-1 space-y-0.5">
                  <div className="h-1 rounded bg-amber-400 w-1/2" />
                  <div className="h-1.5 rounded bg-gray-700" />
                  <div className="h-1.5 rounded bg-gray-700 w-4/5" />
                </div>
              </div>
            </div>
            {/* Right sidebar */}
            <div className="w-[22%] shrink-0 space-y-1">
              <div className="h-10 rounded bg-gradient-to-br from-gray-200 to-gray-300" />
              <div className="h-1.5 rounded bg-gray-700 w-4/5" />
              <div className="h-px bg-gray-100 my-0.5" />
              <div className="h-1 rounded bg-gray-500 w-2/5 mb-0.5" />
              {[1,2,3].map(i => <div key={i} className="flex gap-0.5 items-center"><span className="text-[6px] font-bold text-gray-400">{i}</span><div className="h-1.5 rounded bg-gray-200 flex-1" /></div>)}
              <div className="h-px bg-gray-100 my-0.5" />
              <div className="h-8 rounded border-2 border-dashed border-gray-200 flex items-center justify-center text-[6px] text-gray-400 uppercase font-bold">Ad</div>
            </div>
          </div>
        </div>
      );

    case "modernMagazineLayout":
      return (
        <div className="flex gap-1.5">
          <div className="flex-1 space-y-1.5">
            <div className="rounded overflow-hidden">
              <div className="h-14 bg-gradient-to-br from-gray-700 to-gray-900 flex items-end p-1">
                <div className="space-y-0.5">
                  <div className="h-1 w-8 rounded bg-red-400" />
                  <div className="h-1.5 w-16 rounded bg-white/80" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded overflow-hidden">
                  <div className="h-7 bg-gradient-to-br from-gray-300 to-gray-400" />
                  <div className="h-1 rounded bg-gray-200 mt-0.5" />
                </div>
              ))}
            </div>
          </div>
          <div className="w-[22%] shrink-0 space-y-1 rounded border border-gray-100 p-1">
            <div className="h-1 rounded bg-gray-400 w-3/5" />
            {[1, 2, 3].map((i) => <div key={i} className="flex gap-0.5 items-center"><div className="h-3 w-4 rounded bg-gray-200 shrink-0" /><div className="h-1 rounded bg-gray-200 flex-1" /></div>)}
          </div>
        </div>
      );

    case "darkNewsLayout":
      return (
        <div className="rounded p-1.5 space-y-1.5" style={{ backgroundColor: data.bg || "#111111" }}>
          <div className="flex gap-1.5">
            <div className="flex-1 rounded overflow-hidden h-12 bg-gradient-to-br from-gray-700 to-black flex items-end p-1">
              <div className="space-y-0.5">
                <div className="h-1 w-6 rounded" style={{ backgroundColor: data.accentColor || "#cc0000" }} />
                <div className="h-1.5 w-14 rounded bg-white/80" />
              </div>
            </div>
            <div className="w-[22%] shrink-0 rounded p-1" style={{ backgroundColor: data.cardBg || "#1a1a1a" }}>
              <div className="h-1 rounded bg-gray-500 w-3/5 mb-1" />
              <div className="h-1.5 rounded bg-gray-600 w-full mb-0.5" />
              <div className="h-1.5 rounded bg-gray-600 w-4/5" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded overflow-hidden">
                <div className="h-6" style={{ backgroundColor: data.cardBg || "#1a1a1a" }} />
                <div className="h-1 rounded bg-gray-600 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      );

    case "masonryEditorialLayout":
      return (
        <div className="space-y-1.5">
          <div className="flex gap-1">
            <div className="flex-1 rounded overflow-hidden h-12 bg-gradient-to-br from-gray-700 to-gray-900" />
            <div className="w-[30%] shrink-0 space-y-1">
              <div className="h-[22px] rounded bg-gradient-to-br from-gray-300 to-gray-400" />
              <div className="h-[22px] rounded bg-gradient-to-br from-gray-300 to-gray-400" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded overflow-hidden">
                <div className="h-6 bg-gradient-to-br from-gray-200 to-gray-300" />
                <div className="h-1 rounded bg-gray-200 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}
