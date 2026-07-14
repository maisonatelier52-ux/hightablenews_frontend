// "use client";

// import Link from "next/link";
// import { Mail, Newspaper } from "lucide-react";
// import { useCategoryContent, imgStyle, gradFor, ArticleLink } from "../shared";
// import { articleHref } from "@/lib/articlesSource";

// /** Template 1 — Sticky Sidebar Editorial (matches the HighTableNews Business
//  *  category page reference): dark masthead banner, lead story, top stories
//  *  grid, opinion strip, article list on the left/center; a right sidebar
//  *  that uses position:sticky + top:20px + align-self:flex-start inside a
//  *  flex row, so it scrolls naturally with the page and stops exactly at
//  *  the bottom of the center column — never fixed, never overlapping the
//  *  footer.
//  *
//  *  Layout: the outer wrapper is full-bleed (w-full) with horizontal padding
//  *  only — no max-width cap — so the page uses the entire viewport. The main
//  *  column takes 75% of the available width and the sidebar takes the
//  *  remaining 25% on desktop/tablet; both stack to 100% on mobile.
//  *
//  *  Visual language: Playfair Display for headlines, Lora for body copy,
//  *  Source Sans 3 for UI/meta text, with a deep-red / navy / gold editorial
//  *  palette on an off-white ground — a broadsheet-style masthead look. */

// // ─── Design tokens ───────────────────────────────────────────────────────
// const INK = "#111111";
// const RED = "#8B1A1A";
// const BLUE = "#1A3A6B";
// const GOLD = "#B8962A";
// const GRAY = "#888888";
// const LINE = "#E4E3DF";
// const LINE_STRONG = "#CCCCCC";
// const PAPER = "#F2F1EE";
// const OFFWHITE = "#FAFAF8";

// const HEAD = "font-['Playfair_Display',Georgia,serif]";
// const BODY = "font-['Lora',Georgia,serif]";
// const SANS = "font-['Source_Sans_3',Arial,sans-serif]";

// function bgFill(item) {
//   return item?.img
//     ? { backgroundImage: `url(${item.img})`, backgroundSize: "cover", backgroundPosition: "center" }
//     : { background: `linear-gradient(135deg, ${gradFor(item?.id)})` };
// }

// function metaBits({ author, date, readTime, showAuthor, showDate, showReadTime }) {
//   const bits = [];
//   if (showAuthor && author) bits.push(`By ${author}`);
//   if (showDate && date) bits.push(date);
//   if (showReadTime && readTime) bits.push(readTime);
//   return bits.join(" • ");
// }

// export default function StickyEditorialTemplate({ data, category, device = "desktop" }) {
//   const { hero, rest } = useCategoryContent(category, { rest: 30 });
//   const topStories = rest.slice(0, data.topStories?.count ?? 3);
//   const opinionCards = rest.slice(topStories.length, topStories.length + (data.opinion?.count ?? 2));
//   const listStart = topStories.length + opinionCards.length;
//   const articleList = rest.slice(listStart, listStart + (data.articleList?.count ?? 12));
//   const mostRead = rest.slice(0, data.sidebar?.mostRead?.count ?? 3);
//   const latest = rest.slice(3, 3 + (data.sidebar?.latest?.count ?? 4));

//   const isMobile = device === "mobile";
//   const isTablet = device === "tablet";
//   const stacked = isMobile || isTablet;
//   const sidebarOn = !stacked;
//   const categoryName = category?.name || "Category";

//   return (
//     <div style={{ background: OFFWHITE }}>
//       {/* ── MASTHEAD BANNER — full bleed ── */}
//       <div className="relative overflow-hidden" style={{ background: INK }}>
//         <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${RED}, ${GOLD}, ${RED})` }} />
//         <span
//           aria-hidden="true"
//           className={`${HEAD} absolute right-[-10px] bottom-[-20px] text-white pointer-events-none select-none leading-none`}
//           style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: "9rem", opacity: 0.04 }}
//         >
//           {categoryName.toUpperCase()}
//         </span>

//         <div className="relative z-10 px-4 sm:px-6 lg:px-10 py-7 flex flex-wrap items-end justify-between gap-6">
//           <div>
//             <span className={`${SANS} text-[0.62rem] font-extrabold tracking-[0.22em] uppercase block mb-[6px]`} style={{ color: GOLD }}>Section</span>
//             <h1 className={`${HEAD} font-black text-white leading-[1.05] tracking-[-0.01em]`} style={{ fontSize: "2.4rem" }}>
//               {categoryName}
//             </h1>
//             {data.banner?.description && (
//               <p className={`${BODY} italic mt-2 max-w-[480px] leading-[1.5]`} style={{ fontSize: "0.86rem", color: "#999999" }}>
//                 {data.banner.description}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="w-full px-4 sm:px-6 lg:px-10">
//         {/* ── BREADCRUMB ── */}
//         <nav
//           aria-label="Breadcrumb"
//           className={`${SANS} py-[10px] text-[0.7rem] tracking-[0.03em] flex gap-[6px] items-center flex-wrap`}
//           style={{ color: GRAY }}
//         >
//           <Link href="/" className="hover:opacity-75" style={{ color: BLUE }}>Home</Link>
//           <span style={{ color: LINE_STRONG }}>/</span>
//           <span>{categoryName}</span>
//         </nav>

//         <div className={stacked ? "flex flex-col gap-8 pt-[6px]" : "flex gap-0 pt-[6px] items-start"}>
//           {/* ── MAIN — 75% ── */}
//           <main
//             className={stacked ? "min-w-0 pb-6" : "min-w-0 pr-9 pb-10"}
//             style={{
//               width: stacked ? "100%" : sidebarOn ? "75%" : "100%",
//               flex: stacked ? "1 1 auto" : sidebarOn ? "0 0 75%" : "1 1 auto",
//               borderRight: sidebarOn ? `1px solid ${LINE_STRONG}` : "none",
//             }}
//           >
//             {/* Lead story */}
//             {hero && (
//               <>
//                 <SectionHdr label="Lead Story" />
//                 <ArticleLink
//                   article={hero}
//                   as="article"
//                   className={`grid gap-0 mb-[22px] pb-[22px] group ${stacked ? "grid-cols-1" : "grid-cols-2"}`}
//                   style={{ borderBottom: `1px solid ${LINE_STRONG}` }}
//                 >
//                   <div className="overflow-hidden" style={{ minHeight: stacked ? 200 : 240, ...imgStyle(hero, data.card?.imageRatio || "16/9") }} />
//                   <div className={stacked ? "pt-[14px] flex flex-col justify-center" : "pl-[22px] flex flex-col justify-center"}>
//                     <div className="flex items-center gap-2 mb-[6px] flex-wrap">
//                       {data.hero?.showLiveBadge && (
//                         <span className={`${SANS} text-[0.72rem] font-bold tracking-[0.12em] uppercase`} style={{ color: GOLD }}>● Live Coverage</span>
//                       )}
//                       {data.hero?.showLiveBadge && <span style={{ color: LINE_STRONG }}>•</span>}
//                       <span className={`${SANS} text-[0.72rem] font-bold tracking-[0.12em] uppercase`} style={{ color: hero.categoryColor || RED }}>{hero.category}</span>
//                     </div>
//                     <h2 className={`${HEAD} font-black leading-[1.15] mb-3`} style={{ fontSize: stacked ? "1.4rem" : "1.75rem", color: INK }}>
//                       <span className="group-hover:opacity-75">{hero.title}</span>
//                     </h2>
//                     {data.hero?.showDescription && (
//                       <p className={`${BODY} leading-[1.6] mb-[10px]`} style={{ fontSize: "0.9rem", color: "#333333" }}>{hero.excerpt}</p>
//                     )}
//                     <div className="flex items-center gap-2">
//                       <div className="w-[30px] h-[30px] rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold text-[11px]" style={{ background: `linear-gradient(135deg, ${gradFor(hero.author)})` }}>
//                         {(hero.author || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
//                       </div>
//                       <span className={`${SANS} text-[0.72rem]`} style={{ color: GRAY }}>
//                         {metaBits({ ...hero, showAuthor: data.hero?.showAuthor, showDate: data.hero?.showDate, showReadTime: data.hero?.showReadTime })}
//                       </span>
//                     </div>
//                   </div>
//                 </ArticleLink>
//               </>
//             )}

//             {/* Top stories grid */}
//             {topStories.length > 0 && (
//               <div className="mb-[22px]">
//                 <SectionHdr label={data.topStories?.title || "Top Stories"} />
//                 <div className={`grid gap-[18px] ${stacked ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-3"}`}>
//                   {topStories.map((a) => (
//                     <ArticleLink key={a.id} article={a} className={`group ${data.card?.borderEnabled ? "p-3" : ""}`} style={data.card?.borderEnabled ? { border: `1px solid ${LINE}` } : undefined}>
//                       {data.topStories?.showImage && (
//                         <div className="h-[130px] overflow-hidden mb-[10px]" style={bgFill(a)} />
//                       )}
//                       <div className={`${SANS} text-[0.68rem] font-bold tracking-[0.12em] uppercase mb-1`} style={{ color: a.categoryColor || RED }}>{a.category}</div>
//                       <h3 className={`${HEAD} text-[0.96rem] font-bold leading-[1.27] mb-[5px] group-hover:opacity-75`} style={{ color: INK }}>{a.title}</h3>
//                       {data.topStories?.showDescription && (
//                         <p className="text-[0.79rem] leading-[1.45] line-clamp-2" style={{ color: "#555555" }}>{a.excerpt}</p>
//                       )}
//                       <div className={`${SANS} text-[0.7rem] mt-[6px]`} style={{ color: GRAY }}>
//                         {metaBits({ ...a, showAuthor: data.topStories?.showAuthor, showDate: data.topStories?.showDate })}
//                       </div>
//                     </ArticleLink>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Opinion strip */}
//             {data.opinion?.enabled && opinionCards.length > 0 && (
//               <div className="mb-[22px]">
//                 <SectionHdr label={data.opinion?.title || "Opinion"} />
//                 <div className={`grid gap-[18px] ${stacked ? "grid-cols-1" : isTablet ? "grid-cols-2" : opinionCards.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
//                   {opinionCards.map((a) => (
//                     <ArticleLink key={a.id} article={a} className={`group ${data.card?.borderEnabled ? "p-3" : ""}`} style={data.card?.borderEnabled ? { border: `1px solid ${LINE}` } : undefined}>
//                       {data.topStories?.showImage && (
//                         <div className="h-[130px] overflow-hidden mb-[10px]" style={bgFill(a)} />
//                       )}
//                       <div className={`${SANS} text-[0.68rem] font-bold tracking-[0.12em] uppercase mb-1`} style={{ color: a.categoryColor || RED }}>{a.category}</div>
//                       <h3 className={`${HEAD} text-[0.96rem] font-bold leading-[1.27] mb-[5px] group-hover:opacity-75`} style={{ color: INK }}>{a.title}</h3>
//                       {data.topStories?.showDescription && (
//                         <p className="text-[0.79rem] leading-[1.45] line-clamp-2" style={{ color: "#555555" }}>{a.excerpt}</p>
//                       )}
//                       <div className={`${SANS} text-[0.7rem] mt-[6px]`} style={{ color: GRAY }}>
//                         {metaBits({ ...a, showAuthor: data.topStories?.showAuthor, showDate: data.topStories?.showDate })}
//                       </div>
//                     </ArticleLink>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Article list */}
//             {articleList.length > 0 && (
//               <div>
//                 <SectionHdr label={data.articleList?.title || "More From Category"} />
//                 <div>
//                   {articleList.map((a, i, arr) => (
//                     <ArticleLink
//                       key={a.id}
//                       article={a}
//                       as="article"
//                       className={`grid gap-4 py-4 group ${stacked ? "grid-cols-1" : "grid-cols-[200px_1fr]"}`}
//                       style={i < arr.length - 1 ? { borderBottom: `1px solid ${LINE}` } : undefined}
//                     >
//                       {data.articleList?.showImage && (
//                         <div className={stacked ? "h-[180px] overflow-hidden" : "h-[128px] overflow-hidden"} style={bgFill(a)} />
//                       )}
//                       <div className="flex flex-col justify-center min-w-0">
//                         <div className={`${SANS} text-[0.68rem] font-bold tracking-[0.12em] uppercase mb-1`} style={{ color: a.categoryColor || RED }}>{a.category}</div>
//                         <h4 className={`${HEAD} text-[1.06rem] font-bold leading-[1.28] mb-[6px] group-hover:opacity-75`} style={{ color: INK }}>{a.title}</h4>
//                         {data.articleList?.showDescription && (
//                           <p className={`${BODY} text-[0.82rem] leading-[1.5] mb-[7px] line-clamp-2`} style={{ color: "#333333" }}>{a.excerpt}</p>
//                         )}
//                         <div className={`${SANS} text-[0.72rem]`} style={{ color: GRAY }}>
//                           {metaBits({ ...a, showAuthor: data.articleList?.showAuthor, showDate: data.articleList?.showDate, showReadTime: data.articleList?.showReadTime })}
//                         </div>
//                       </div>
//                     </ArticleLink>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </main>

//           {/* ── SIDEBAR — 25%, sticky ── */}
//           {sidebarOn && (
//             <div style={{ width: "25%", flex: "0 0 25%", position: "sticky", top: 20, alignSelf: "flex-start" }}>
//               <Sidebar data={data.sidebar} mostRead={mostRead} latest={latest} stacked={false} />
//             </div>
//           )}
//           {stacked && (
//             <div className="w-full">
//               <Sidebar data={data.sidebar} mostRead={mostRead} latest={latest} stacked />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function SectionHdr({ label, count }) {
//   return (
//     <div className="flex items-center gap-[10px] mb-4 mt-1">
//       <span className={`${SANS} text-[0.62rem] font-extrabold tracking-[0.16em] uppercase px-[9px] py-[3px] whitespace-nowrap`} style={{ color: OFFWHITE, background: INK }}>{label}</span>
//       <hr className="flex-1 border-none border-t" style={{ borderColor: LINE_STRONG }} />
//       {count && <span className={`${SANS} text-[0.66rem] whitespace-nowrap`} style={{ color: GRAY }}>{count}</span>}
//     </div>
//   );
// }

// function ModuleHdr({ children }) {
//   return (
//     <div className={`${SANS} text-[0.62rem] font-extrabold tracking-[0.2em] uppercase mb-3 pb-[6px]`} style={{ color: INK, borderBottom: `2px solid ${INK}` }}>
//       {children}
//     </div>
//   );
// }

// function Sidebar({ data, mostRead, latest, stacked }) {
//   if (!data) return null;
//   return (
//     <aside className={stacked ? "w-full pt-6" : "pl-[22px] pt-1"} aria-label="Sidebar">
//       {data.mostRead?.enabled && (
//         <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${LINE}` }}>
//           <ModuleHdr>{data.mostRead.title}</ModuleHdr>
//           <ul className="list-none">
//             {mostRead.map((a, i, arr) => {
//               const href = articleHref(a);
//               const Item = href ? Link : "div";
//               return (
//                 <li key={a.id} className="flex gap-[10px] items-start py-[10px] group" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : "none" }}>
//                   {data.mostRead.showNumbers && (
//                     <span className={`${HEAD} font-black leading-none min-w-[22px]`} style={{ fontSize: "1.4rem", color: LINE_STRONG }}>{i + 1}</span>
//                   )}
//                   <div className="w-[60px] h-[50px] flex-shrink-0 overflow-hidden" style={bgFill(a)} />
//                   <div className="min-w-0">
//                     <h5 className={`${HEAD} text-[0.8rem] font-bold leading-[1.25]`} style={{ color: INK }}>
//                       <Item {...(href ? { href } : {})} className="hover:opacity-75">{a.title}</Item>
//                     </h5>
//                     <div className={`${SANS} text-[0.72rem] mt-[2px]`} style={{ color: GRAY }}>{a.date}</div>
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       )}

//       {data.latest?.enabled && (
//         <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${LINE}` }}>
//           <ModuleHdr>{data.latest.title}</ModuleHdr>
//           <ul className="list-none">
//             {latest.map((a, i, arr) => {
//               const href = articleHref(a);
//               const Item = href ? Link : "div";
//               return (
//                 <li key={a.id} className="flex gap-[10px] items-start py-[9px] group" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : "none" }}>
//                   <div className="w-16 h-[50px] flex-shrink-0 overflow-hidden" style={bgFill(a)} />
//                   <div className="min-w-0">
//                     <h5 className={`${HEAD} text-[0.8rem] font-bold leading-[1.25] mb-[2px]`} style={{ color: INK }}>
//                       <Item {...(href ? { href } : {})} className="hover:opacity-75">{a.title}</Item>
//                     </h5>
//                     <div className={`${SANS} text-[0.72rem]`} style={{ color: GRAY }}>{a.date}</div>
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       )}

//       {data.newsletter?.enabled && (
//         <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${LINE}` }}>
//           <div className="p-[18px] text-center" style={{ background: INK }}>
//             <div className="flex justify-center mb-2" style={{ color: "#666666" }}><Mail size={22} /></div>
//             <div className={`${HEAD} text-[1.0rem] font-bold text-white mb-[6px] leading-[1.3]`}>{data.newsletter.heading}</div>
//             <div className={`${SANS} text-[0.72rem] mb-[14px] leading-[1.5]`} style={{ color: "#888888" }}>{data.newsletter.subheading}</div>
//             <input
//               readOnly
//               placeholder="Your email address"
//               className={`${SANS} w-full px-[10px] py-2 text-[0.78rem] mb-2 outline-none`}
//               style={{ background: "#222222", border: "1px solid #333333", color: "white" }}
//             />
//             <button type="button" className={`${SANS} w-full py-[9px] text-[0.72rem] font-bold tracking-[0.1em] uppercase cursor-pointer transition-colors duration-150`} style={{ background: RED, color: "white", border: "none" }}>
//               {data.newsletter.ctaLabel}
//             </button>
//           </div>
//         </div>
//       )}

//       {data.topics?.enabled && (
//         <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${LINE}` }}>
//           <ModuleHdr>{data.topics.title}</ModuleHdr>
//           <div className="flex flex-wrap gap-[6px]">
//             {(data.topics.tags || []).map((t) => (
//               <span key={t} className={`${SANS} text-[0.66rem] font-semibold tracking-[0.04em] px-[10px] py-1`} style={{ border: `1px solid ${LINE_STRONG}`, color: "#333333" }}>{t}</span>
//             ))}
//           </div>
//         </div>
//       )}

//       {data.authors?.enabled && (
//         <div>
//           <ModuleHdr>{data.authors.title}</ModuleHdr>
//           {Array.from({ length: data.authors.count ?? 4 }).map((_, i, arr) => (
//             <div key={i} className="flex gap-[10px] items-center py-[9px]" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : "none" }}>
//               <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: PAPER }}>
//                 <Newspaper size={14} style={{ color: GRAY }} />
//               </div>
//               <p className={`${SANS} text-[0.78rem] font-semibold`} style={{ color: "#333333" }}>Correspondent {i + 1}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </aside>
//   );
// }


"use client";

import Link from "next/link";
import { Mail, Newspaper } from "lucide-react";
import { useCategoryContent, imgStyle, gradFor, ArticleLink } from "../shared";
import { articleHref, authorHref } from "@/lib/articlesSource";
import { getAuthors } from "@/lib/authorsApi";

/** Template 1 — Sticky Sidebar Editorial (matches the HighTableNews Business
 *  category page reference): dark masthead banner, lead story, top stories
 *  grid, opinion strip, article list on the left/center; a right sidebar
 *  that uses position:sticky + top:20px + align-self:flex-start inside a
 *  flex row, so it scrolls naturally with the page and stops exactly at
 *  the bottom of the center column — never fixed, never overlapping the
 *  footer.
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

function bgFill(item) {
  return item?.img
    ? { backgroundImage: `url(${item.img})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: `linear-gradient(135deg, ${gradFor(item?.id)})` };
}

function metaBits({ author, date, readTime, showAuthor, showDate, showReadTime }) {
  const bits = [];
  if (showAuthor && author) bits.push(`By ${author}`);
  if (showDate && date) bits.push(date);
  if (showReadTime && readTime) bits.push(readTime);
  return bits.join(" • ");
}

export default function StickyEditorialTemplate({ data, category, device = "desktop" }) {
  const { hero, rest } = useCategoryContent(category, { rest: 30 });
  const topStories = rest.slice(0, data.topStories?.count ?? 3);
  const opinionCards = rest.slice(topStories.length, topStories.length + (data.opinion?.count ?? 2));
  const listStart = topStories.length + opinionCards.length;
  const articleList = rest.slice(listStart, listStart + (data.articleList?.count ?? 12));
  const mostRead = rest.slice(0, data.sidebar?.mostRead?.count ?? 3);
  const latest = rest.slice(3, 3 + (data.sidebar?.latest?.count ?? 4));

  const isMobile = device === "mobile";
  const isTablet = device === "tablet";
  const stacked = isMobile || isTablet;
  const sidebarOn = !stacked;
  const categoryName = category?.name || "Category";

  return (
    <div style={{ background: OFFWHITE }}>
      {/* ── MASTHEAD BANNER — full bleed ── */}
      <div className="relative overflow-hidden" style={{ background: INK }}>
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${RED}, ${GOLD}, ${RED})` }} />
        <span
          aria-hidden="true"
          className={`${HEAD} absolute right-[-10px] bottom-[-20px] text-white pointer-events-none select-none leading-none`}
          style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: "9rem", opacity: 0.04 }}
        >
          {categoryName.toUpperCase()}
        </span>

        <div className="relative z-10 px-4 sm:px-6 lg:px-10 py-7 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className={`${SANS} text-[0.62rem] font-extrabold tracking-[0.22em] uppercase block mb-[6px]`} style={{ color: GOLD }}>Section</span>
            <h1 className={`${HEAD} font-black text-white leading-[1.05] tracking-[-0.01em]`} style={{ fontSize: "2.4rem" }}>
              {categoryName}
            </h1>
            {data.banner?.description && (
              <p className={`${BODY} italic mt-2 max-w-[480px] leading-[1.5]`} style={{ fontSize: "0.86rem", color: "#999999" }}>
                {data.banner.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-10">
        {/* ── BREADCRUMB ── */}
        {/* <nav
          aria-label="Breadcrumb"
          className={`${SANS} py-[10px] text-[0.7rem] tracking-[0.03em] flex gap-[6px] items-center flex-wrap`}
          style={{ color: GRAY }}
        >
          <Link href="/" className="hover:opacity-75" style={{ color: BLUE }}>Home</Link>
          <span style={{ color: LINE_STRONG }}>/</span>
          <span>{categoryName}</span>
        </nav> */}

        <div className={stacked ? "flex flex-col gap-8 pt-[6px]" : "flex gap-0 pt-[6px] items-start"}>
          {/* ── MAIN — 75% ── */}
          <main
            className={stacked ? "min-w-0 pb-6" : "min-w-0 pr-9 pb-10"}
            style={{
              width: stacked ? "100%" : sidebarOn ? "75%" : "100%",
              flex: stacked ? "1 1 auto" : sidebarOn ? "0 0 75%" : "1 1 auto",
              borderRight: sidebarOn ? `1px solid ${LINE_STRONG}` : "none",
              ...(sidebarOn ? { position: "sticky", top: 20, alignSelf: "flex-start" } : {}),
            }}
          >
            {/* Lead story */}
            {hero && (
              <>
                <SectionHdr label="Lead Story" />
                <ArticleLink
                  article={hero}
                  as="article"
                  className={`grid gap-0 mb-[22px] pb-[22px] group ${stacked ? "grid-cols-1" : "grid-cols-2"}`}
                  style={{ borderBottom: `1px solid ${LINE_STRONG}` }}
                >
                  <div className="overflow-hidden" style={{ minHeight: stacked ? 200 : 240, ...imgStyle(hero, data.card?.imageRatio || "16/9") }} />
                  <div className={stacked ? "pt-[14px] flex flex-col justify-center" : "pl-[22px] flex flex-col justify-center"}>
                    <div className="flex items-center gap-2 mb-[6px] flex-wrap">
                      {data.hero?.showLiveBadge && (
                        <span className={`${SANS} text-[0.72rem] font-bold tracking-[0.12em] uppercase`} style={{ color: GOLD }}>● Live Coverage</span>
                      )}
                      {data.hero?.showLiveBadge && <span style={{ color: LINE_STRONG }}>•</span>}
                      <span className={`${SANS} text-[0.72rem] font-bold tracking-[0.12em] uppercase`} style={{ color: hero.categoryColor || RED }}>{hero.category}</span>
                    </div>
                    <h2 className={`${HEAD} font-black leading-[1.15] mb-3`} style={{ fontSize: stacked ? "1.4rem" : "1.75rem", color: INK }}>
                      <span className="group-hover:opacity-75">{hero.title}</span>
                    </h2>
                    {data.hero?.showDescription && (
                      <p className={`${BODY} leading-[1.6] mb-[10px]`} style={{ fontSize: "0.9rem", color: "#333333" }}>{hero.excerpt}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="w-[30px] h-[30px] rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold text-[11px]" style={{ background: `linear-gradient(135deg, ${gradFor(hero.author)})` }}>
                        {(hero.author || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                      </div>
                      <span className={`${SANS} text-[0.72rem]`} style={{ color: GRAY }}>
                        {metaBits({ ...hero, showAuthor: data.hero?.showAuthor, showDate: data.hero?.showDate, showReadTime: data.hero?.showReadTime })}
                      </span>
                    </div>
                  </div>
                </ArticleLink>
              </>
            )}

            {/* Top stories grid */}
            {topStories.length > 0 && (
              <div className="mb-[22px]">
                <SectionHdr label={data.topStories?.title || "Top Stories"} />
                <div className={`grid gap-[18px] ${stacked ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-3"}`}>
                  {topStories.map((a) => (
                    <ArticleLink key={a.id} article={a} className={`group ${data.card?.borderEnabled ? "p-3" : ""}`} style={data.card?.borderEnabled ? { border: `1px solid ${LINE}` } : undefined}>
                      {data.topStories?.showImage && (
                        <div className="h-[130px] overflow-hidden mb-[10px]" style={bgFill(a)} />
                      )}
                      <div className={`${SANS} text-[0.68rem] font-bold tracking-[0.12em] uppercase mb-1`} style={{ color: a.categoryColor || RED }}>{a.category}</div>
                      <h3 className={`${HEAD} text-[0.96rem] font-bold leading-[1.27] mb-[5px] group-hover:opacity-75`} style={{ color: INK }}>{a.title}</h3>
                      {data.topStories?.showDescription && (
                        <p className="text-[0.79rem] leading-[1.45] line-clamp-2" style={{ color: "#555555" }}>{a.excerpt}</p>
                      )}
                      <div className={`${SANS} text-[0.7rem] mt-[6px]`} style={{ color: GRAY }}>
                        {metaBits({ ...a, showAuthor: data.topStories?.showAuthor, showDate: data.topStories?.showDate })}
                      </div>
                    </ArticleLink>
                  ))}
                </div>
              </div>
            )}

            {/* Opinion strip */}
            {data.opinion?.enabled && opinionCards.length > 0 && (
              <div className="mb-[22px]">
                <SectionHdr label={data.opinion?.title || "Opinion"} />
                <div className={`grid gap-[18px] ${stacked ? "grid-cols-1" : isTablet ? "grid-cols-2" : opinionCards.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                  {opinionCards.map((a) => (
                    <ArticleLink key={a.id} article={a} className={`group ${data.card?.borderEnabled ? "p-3" : ""}`} style={data.card?.borderEnabled ? { border: `1px solid ${LINE}` } : undefined}>
                      {data.topStories?.showImage && (
                        <div className="h-[130px] overflow-hidden mb-[10px]" style={bgFill(a)} />
                      )}
                      <div className={`${SANS} text-[0.68rem] font-bold tracking-[0.12em] uppercase mb-1`} style={{ color: a.categoryColor || RED }}>{a.category}</div>
                      <h3 className={`${HEAD} text-[0.96rem] font-bold leading-[1.27] mb-[5px] group-hover:opacity-75`} style={{ color: INK }}>{a.title}</h3>
                      {data.topStories?.showDescription && (
                        <p className="text-[0.79rem] leading-[1.45] line-clamp-2" style={{ color: "#555555" }}>{a.excerpt}</p>
                      )}
                      <div className={`${SANS} text-[0.7rem] mt-[6px]`} style={{ color: GRAY }}>
                        {metaBits({ ...a, showAuthor: data.topStories?.showAuthor, showDate: data.topStories?.showDate })}
                      </div>
                    </ArticleLink>
                  ))}
                </div>
              </div>
            )}

            {/* Article list */}
            {articleList.length > 0 && (
              <div>
                <SectionHdr label={data.articleList?.title || "More From Category"} />
                <div>
                  {articleList.map((a, i, arr) => (
                    <ArticleLink
                      key={a.id}
                      article={a}
                      as="article"
                      className={`grid gap-4 py-4 group ${stacked ? "grid-cols-1" : "grid-cols-[200px_1fr]"}`}
                      style={i < arr.length - 1 ? { borderBottom: `1px solid ${LINE}` } : undefined}
                    >
                      {data.articleList?.showImage && (
                        <div className={stacked ? "h-[180px] overflow-hidden" : "h-[128px] overflow-hidden"} style={bgFill(a)} />
                      )}
                      <div className="flex flex-col justify-center min-w-0">
                        <div className={`${SANS} text-[0.68rem] font-bold tracking-[0.12em] uppercase mb-1`} style={{ color: a.categoryColor || RED }}>{a.category}</div>
                        <h4 className={`${HEAD} text-[1.06rem] font-bold leading-[1.28] mb-[6px] group-hover:opacity-75`} style={{ color: INK }}>{a.title}</h4>
                        {data.articleList?.showDescription && (
                          <p className={`${BODY} text-[0.82rem] leading-[1.5] mb-[7px] line-clamp-2`} style={{ color: "#333333" }}>{a.excerpt}</p>
                        )}
                        <div className={`${SANS} text-[0.72rem]`} style={{ color: GRAY }}>
                          {metaBits({ ...a, showAuthor: data.articleList?.showAuthor, showDate: data.articleList?.showDate, showReadTime: data.articleList?.showReadTime })}
                        </div>
                      </div>
                    </ArticleLink>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* ── SIDEBAR — 25%, sticky ── */}
          {sidebarOn && (
            <div style={{ width: "25%", flex: "0 0 25%", position: "sticky", top: 20, alignSelf: "flex-start" }}>
              <Sidebar data={data.sidebar} mostRead={mostRead} latest={latest} stacked={false} />
            </div>
          )}
          {stacked && (
            <div className="w-full">
              <Sidebar data={data.sidebar} mostRead={mostRead} latest={latest} stacked />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHdr({ label, count }) {
  return (
    <div className="flex items-center gap-[10px] mb-4 mt-1">
      <span className={`${SANS} text-[0.62rem] font-extrabold tracking-[0.16em] uppercase px-[9px] py-[3px] whitespace-nowrap`} style={{ color: OFFWHITE, background: INK }}>{label}</span>
      <hr className="flex-1 border-none border-t" style={{ borderColor: LINE_STRONG }} />
      {count && <span className={`${SANS} text-[0.66rem] whitespace-nowrap`} style={{ color: GRAY }}>{count}</span>}
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

function Sidebar({ data, mostRead, latest, stacked }) {
  if (!data) return null;
  return (
    <aside className={stacked ? "w-full pt-6" : "pl-[22px] pt-1"} aria-label="Sidebar">
      {data.mostRead?.enabled && (
        <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${LINE}` }}>
          <ModuleHdr>{data.mostRead.title}</ModuleHdr>
          <ul className="list-none">
            {mostRead.map((a, i, arr) => {
              const href = articleHref(a);
              const Item = href ? Link : "div";
              return (
                <li key={a.id} className="flex gap-[10px] items-start py-[10px] group" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : "none" }}>
                  {data.mostRead.showNumbers && (
                    <span className={`${HEAD} font-black leading-none min-w-[22px]`} style={{ fontSize: "1.4rem", color: LINE_STRONG }}>{i + 1}</span>
                  )}
                  <div className="w-[60px] h-[50px] flex-shrink-0 overflow-hidden" style={bgFill(a)} />
                  <div className="min-w-0">
                    <h5 className={`${HEAD} text-[0.8rem] font-bold leading-[1.25]`} style={{ color: INK }}>
                      <Item {...(href ? { href } : {})} className="hover:opacity-75">{a.title}</Item>
                    </h5>
                    <div className={`${SANS} text-[0.72rem] mt-[2px]`} style={{ color: GRAY }}>{a.date}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {data.latest?.enabled && (
        <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${LINE}` }}>
          <ModuleHdr>{data.latest.title}</ModuleHdr>
          <ul className="list-none">
            {latest.map((a, i, arr) => {
              const href = articleHref(a);
              const Item = href ? Link : "div";
              return (
                <li key={a.id} className="flex gap-[10px] items-start py-[9px] group" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : "none" }}>
                  <div className="w-16 h-[50px] flex-shrink-0 overflow-hidden" style={bgFill(a)} />
                  <div className="min-w-0">
                    <h5 className={`${HEAD} text-[0.8rem] font-bold leading-[1.25] mb-[2px]`} style={{ color: INK }}>
                      <Item {...(href ? { href } : {})} className="hover:opacity-75">{a.title}</Item>
                    </h5>
                    <div className={`${SANS} text-[0.72rem]`} style={{ color: GRAY }}>{a.date}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {data.newsletter?.enabled && (
        <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${LINE}` }}>
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
        </div>
      )}

      {data.topics?.enabled && (
        <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${LINE}` }}>
          <ModuleHdr>{data.topics.title}</ModuleHdr>
          <div className="flex flex-wrap gap-[6px]">
            {(data.topics.tags || []).map((t) => (
              <span key={t} className={`${SANS} text-[0.66rem] font-semibold tracking-[0.04em] px-[10px] py-1`} style={{ border: `1px solid ${LINE_STRONG}`, color: "#333333" }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      {data.authors?.enabled && (
        <div>
          <ModuleHdr>{data.authors.title}</ModuleHdr>
          {(() => {
            const authors = (getAuthors() || []).slice(0, data.authors.count ?? 4);
            if (authors.length === 0) {
              return (
                <p className={`${SANS} text-[0.74rem]`} style={{ color: GRAY }}>
                  No correspondents yet — add authors on the Authors page.
                </p>
              );
            }
            return authors.map((author, i, arr) => {
              const href = authorHref(author.slug);
              const Item = href ? Link : "div";
              const initials = (author.name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
              return (
                <Item
                  key={author._id}
                  {...(href ? { href } : {})}
                  className="flex gap-[10px] items-center py-[9px] group"
                  style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : "none" }}
                >
                  {author.profileImage ? (
                    <img src={author.profileImage} alt={author.name} className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold"
                      style={{ background: `linear-gradient(135deg, ${gradFor(author.name)})`, fontSize: "0.68rem" }}
                    >
                      {initials || <Newspaper size={14} style={{ color: GRAY }} />}
                    </div>
                  )}
                  <p className={`${SANS} text-[0.78rem] font-semibold group-hover:opacity-75`} style={{ color: "#333333" }}>{author.name}</p>
                </Item>
              );
            });
          })()}
        </div>
      )}
    </aside>
  );
}