// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import {
//   getAllPreviewArticlesSorted,
//   getRelatedArticles,
//   getPrevNextArticle,
//   articleHref,
//   authorHref,
// } from "@/lib/articlesSource";
// import { imgStyle, gradFor } from "@/components/category-builder/shared";
// import { SAMPLE_ARTICLE, PrevNextNav } from "../shared";

// /** Template 1 — Sticky Sidebar Editorial: classic single-column article body
//  *  with a right sidebar (Latest/Most Read, Newsletter, Most Commented, Ad
//  *  slot) that uses position:sticky + top:20px + align-self:flex-start, so it
//  *  scrolls with the page and stops naturally at the bottom of the article
//  *  column — never fixed, never overlapping the footer.
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
// const BADGE_COLORS = [RED, BLUE, GOLD];

// const HEAD = "font-['Playfair_Display',Georgia,serif]";
// const BODY = "font-['Lora',Georgia,serif]";
// const SANS = "font-['Source_Sans_3',Arial,sans-serif]";

// function bgFill(item) {
//   return item?.img
//     ? { backgroundImage: `url(${item.img})`, backgroundSize: "cover", backgroundPosition: "center" }
//     : { background: `linear-gradient(135deg, ${gradFor(item?.id)})` };
// }

// export default function StickySidebarTemplate({ data, article, device = "desktop" }) {
//   const isMobile = device === "mobile";
//   const isTablet = device === "tablet";
//   const a = article;
//   const related = data.relatedArticles?.enabled ? getRelatedArticles(a, data.relatedArticles?.count ?? 3) : [];
//   const { previous, next } = data.prevNext?.enabled ? getPrevNextArticle(a) : { previous: null, next: null };
//   const tags = a.categoryTags?.length ? a.categoryTags : [a.category || "News"];
//   const stacked = isMobile || isTablet;
//   const sidebarOn = data.sidebar?.enabled && !stacked;

//   return (
//     <div style={{ background: OFFWHITE }}>
//       <div className="w-full px-4 sm:px-6 lg:px-10">

//         {data.header?.showBreadcrumb && (
//           <nav
//             aria-label="Breadcrumb"
//             className={`${SANS} pt-[14px] text-[0.7rem] tracking-[0.03em] flex gap-[6px] items-center flex-wrap`}
//             style={{ color: GRAY }}
//           >
//             <Link href="/" className="hover:opacity-75" style={{ color: BLUE }}>Home</Link>
//             {tags.map((t, i) => (
//               <span key={t} className="flex items-center gap-[6px]">
//                 <span style={{ color: LINE_STRONG }}>/</span>
//                 {i === tags.length - 1 ? <span>{t}</span> : <span style={{ color: BLUE }}>{t}</span>}
//               </span>
//             ))}
//           </nav>
//         )}

//         <div className={stacked ? "flex flex-col gap-8 pt-[14px]" : "flex gap-0 pt-[14px] items-start"}>

//           {/* ── MAIN — 75% on desktop/tablet, 100% stacked ── */}
//           <article
//             className={stacked ? "flex-1 min-w-0 pb-6" : "min-w-0 pr-9 pb-10"}
//             style={{
//               width: stacked ? "100%" : sidebarOn ? "75%" : "100%",
//               flex: stacked ? "1 1 auto" : sidebarOn ? "0 0 75%" : "1 1 auto",
//               borderRight: sidebarOn ? `1px solid ${LINE_STRONG}` : "none",
//             }}
//           >
//             {/* Header */}
//             <header className="pb-[18px] mb-[22px]" style={{ borderBottom: `1px solid ${LINE}` }}>
//               {data.header?.showCategoryTags && (
//                 <div className="flex gap-2 items-center mb-3 flex-wrap">
//                   {tags.map((t, i) => (
//                     <span
//                       key={t}
//                       className={`${SANS} text-[0.65rem] font-extrabold tracking-[0.14em] uppercase px-[9px] py-[3px]`}
//                       style={{ color: OFFWHITE, background: a.categoryColor || BADGE_COLORS[i % BADGE_COLORS.length] }}
//                     >
//                       {t}
//                     </span>
//                   ))}
//                 </div>
//               )}

//               <h1
//                 className={`${HEAD} font-black leading-[1.12] tracking-[-0.01em]`}
//                 style={{ fontSize: data.typography?.titleSize || 34, color: INK }}
//               >
//                 {a.title}
//               </h1>

//               {a.excerpt && (
//                 <p
//                   className={`${BODY} italic mb-1 mt-[14px] leading-[1.6] pl-[14px]`}
//                   style={{ fontSize: data.typography?.subtitleSize || 16, color: "#333333", borderLeft: `3px solid ${GOLD}` }}
//                 >
//                   {a.excerpt}
//                 </p>
//               )}

//               <ByLine article={a} />

//               {data.header?.showShare && (
//                 <ShareRow article={a} platforms={data.header?.sharePlatforms} />
//               )}
//             </header>

//             {/* Hero */}
//             {data.hero?.enabled && (
//               <figure className="mb-8">
//                 <div style={imgStyle(a, data.hero?.ratio || "16/9")} />
//               </figure>
//             )}

//             {/* Body */}
//             <ArticleBody
//               article={a}
//               typography={data.typography}
//               dropCap={data.body?.dropCap}
//               showPullquotes={data.body?.showPullquotes}
//               showKeyPoints={data.body?.showKeyPoints}
//             />

//             {/* Topics */}
//             {tags.length > 0 && (
//               <div className="mt-7 pt-[18px] flex gap-[7px] flex-wrap items-center" style={{ borderTop: `1px solid ${LINE_STRONG}` }}>
//                 <span className={`${SANS} text-[0.65rem] font-bold tracking-[0.1em] uppercase`} style={{ color: GRAY }}>Topics</span>
//                 {tags.map((t) => (
//                   <span
//                     key={t}
//                     className={`${SANS} text-[0.68rem] font-semibold tracking-[0.04em] px-[11px] py-1`}
//                     style={{ border: `1px solid ${LINE_STRONG}`, color: "#333333" }}
//                   >
//                     {t}
//                   </span>
//                 ))}
//               </div>
//             )}

//             {data.authorBox?.enabled && <AuthorBox article={a} />}

//             {data.prevNext?.enabled && (previous || next) && (
//               <div className="mt-7 pt-6" style={{ borderTop: `1px solid ${LINE}` }}>
//                 <PrevNextNav previous={previous} next={next} settings={data.prevNext} />
//               </div>
//             )}

//             {data.relatedArticles?.enabled && related.length > 0 && (
//               <section className="mt-9 pt-5" style={{ borderTop: `2px solid ${INK}` }} aria-label="Related articles">
//                 <div className={`${SANS} text-[0.65rem] font-extrabold tracking-[0.2em] uppercase mb-[18px] flex items-center gap-3`} style={{ color: INK }}>
//                   {data.relatedArticles.title || "Related Articles"}
//                   <span className="flex-1 h-px" style={{ background: LINE_STRONG }} />
//                 </div>
//                 <div
//                   className="grid gap-[18px]"
//                   style={{ gridTemplateColumns: `repeat(${stacked ? 1 : Math.min(data.relatedArticles?.columns ?? 3, isTablet ? 2 : 3)}, minmax(0,1fr))` }}
//                 >
//                   {related.map((r) => <RelatedCard key={r.id} article={r} />)}
//                 </div>
//               </section>
//             )}
//           </article>

//           {/* ── SIDEBAR — 25% on desktop/tablet, 100% stacked ── */}
//           {data.sidebar?.enabled && (
//             <Sidebar data={data} article={a} stacked={stacked} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Header pieces ────────────────────────────────────────────────────────

// function ByLine({ article }) {
//   const initials = (article.author || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
//   const href = authorHref(article.authorSlug);
//   const NameWrap = href ? Link : "span";
//   return (
//     <div className="flex items-center gap-3 py-3 flex-wrap" style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
//       <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
//         {article.authorImage ? (
//           <img src={article.authorImage} alt={article.author} className="w-full h-full object-cover" />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-white font-bold" style={{ background: `linear-gradient(135deg, ${gradFor(article.author)})` }}>
//             {initials}
//           </div>
//         )}
//       </div>
//       <div className="flex-1 min-w-0">
//         <NameWrap {...(href ? { href } : {})} className={`${HEAD} text-[0.92rem] font-bold block`} style={{ color: INK }}>
//           {article.author || "Staff Writer"}
//         </NameWrap>
//         {article.authorRole && (
//           <span className={`${SANS} text-[0.68rem] block mt-[1px]`} style={{ color: GRAY }}>{article.authorRole}</span>
//         )}
//       </div>
//       <div className={`${SANS} text-[0.7rem] text-right leading-[1.5]`} style={{ color: GRAY }}>
//         {article.date && <strong className="block" style={{ color: "#555555" }}>{article.date}</strong>}
//         {article.readTime && <span>{article.readTime}</span>}
//       </div>
//     </div>
//   );
// }

// function ShareRow({ article, platforms }) {
//   const labels = { twitter: "𝕏 Post", facebook: "Facebook", linkedin: "LinkedIn", whatsapp: "WhatsApp", telegram: "Telegram", email: "Email" };
//   const active = (platforms?.length ? platforms : ["twitter", "facebook", "linkedin"]).filter((k) => labels[k]);
//   const [copied, setCopied] = useState(false);

//   function getUrl() {
//     if (typeof window === "undefined") return "";
//     const href = articleHref(article);
//     return href ? `${window.location.origin}${href}` : window.location.href;
//   }
//   function handleShare(key) {
//     const url = getUrl();
//     const title = article?.title || "";
//     if (key === "email") {
//       window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
//       return;
//     }
//     const map = {
//       twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
//       facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
//       linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
//       whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`.trim())}`,
//       telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
//     };
//     const target = map[key];
//     if (target) window.open(target, "_blank", "noopener,noreferrer,width=600,height=520");
//   }
//   function handleCopy() {
//     const url = getUrl();
//     if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
//       navigator.clipboard.writeText(url).catch(() => {});
//     }
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   }

//   const btnBase = { border: `1px solid ${LINE_STRONG}`, color: "#333333", background: "transparent" };
//   const onEnter = (e) => { e.currentTarget.style.background = INK; e.currentTarget.style.color = OFFWHITE; e.currentTarget.style.borderColor = INK; };
//   const onLeave = (e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#333333"; e.currentTarget.style.borderColor = LINE_STRONG; };

//   return (
//     <div className="flex gap-2 items-center pt-[10px] flex-wrap">
//       <span className={`${SANS} text-[0.66rem] font-bold tracking-[0.12em] uppercase`} style={{ color: GRAY }}>Share</span>
//       {active.map((k) => (
//         <button
//           key={k}
//           type="button"
//           onClick={() => handleShare(k)}
//           className={`${SANS} text-[0.66rem] font-bold tracking-[0.08em] uppercase px-3 py-[5px] cursor-pointer transition-colors duration-150`}
//           style={btnBase}
//           onMouseEnter={onEnter}
//           onMouseLeave={onLeave}
//         >
//           {labels[k]}
//         </button>
//       ))}
//       <button
//         type="button"
//         onClick={handleCopy}
//         className={`${SANS} text-[0.66rem] font-bold tracking-[0.08em] uppercase px-3 py-[5px] cursor-pointer transition-colors duration-150`}
//         style={btnBase}
//         onMouseEnter={onEnter}
//         onMouseLeave={onLeave}
//       >
//         {copied ? "Copied!" : "Copy Link"}
//       </button>
//     </div>
//   );
// }

// // ─── Body ─────────────────────────────────────────────────────────────────

// function ArticleBody({ article, typography, dropCap = true, showPullquotes = true, showKeyPoints = true }) {
//   const blocks = article._raw?.content?.length ? article._raw.content : SAMPLE_ARTICLE._raw.content;
//   const bodySize = typography?.bodySize ?? 16;
//   const lineHeight = typography?.lineHeight ?? 1.75;
//   const fontWeight = typography?.fontWeight ?? 400;
//   const titleSize = typography?.titleSize ?? 34;
//   let firstParaSeen = false;

//   return (
//     <div className="mt-6">
//       {blocks.map((block, i) => {
//         if (block.type === "paragraph") {
//           const isFirst = dropCap && !firstParaSeen;
//           if (isFirst) firstParaSeen = true;
//           const text = block.text || "";
//           return (
//             <p key={i} className={`${BODY} mb-[1.4em]`} style={{ fontSize: bodySize, lineHeight, fontWeight, color: INK }}>
//               {isFirst && text.trim() ? (
//                 <>
//                   <span className={`${HEAD} float-left font-black leading-[0.78] mr-2 mt-[6px]`} style={{ fontSize: bodySize * 4.2, color: RED }}>
//                     {text.trim()[0]}
//                   </span>
//                   {text.trim().slice(1)}
//                 </>
//               ) : text}
//             </p>
//           );
//         }
//         if (block.type === "subheading") {
//           return (
//             <h2
//               key={i}
//               className={`${HEAD} font-bold mt-[1.8em] mb-[0.6em] leading-[1.25] pb-2`}
//               style={{ fontSize: titleSize * 0.48, color: INK, borderBottom: `1px solid ${LINE}` }}
//             >
//               {block.text}
//             </h2>
//           );
//         }
//         if (block.type === "pullquote" && showPullquotes) {
//           return (
//             <div key={i} className="pl-5 py-[14px] my-7 relative" style={{ borderLeft: `4px solid ${RED}`, background: PAPER }}>
//               <span className={`${HEAD} absolute top-[-10px] left-3 opacity-25 leading-none`} style={{ fontSize: "4rem", color: RED }}>&ldquo;</span>
//               <p className={`${HEAD} italic leading-[1.5] mb-2 pl-2`} style={{ fontSize: "1.2rem", color: "#333333" }}>{block.text}</p>
//               {block.attribution && (
//                 <cite className={`${SANS} not-italic tracking-[0.08em] uppercase pl-2 block text-[0.68rem]`} style={{ color: GRAY }}>
//                   {block.attribution}
//                 </cite>
//               )}
//             </div>
//           );
//         }
//         if (block.type === "image") {
//           return (
//             <figure key={i} className="my-7">
//               <div style={imgStyle({ img: block.src }, "16/9")} />
//               {block.caption && (
//                 <figcaption className={`${SANS} text-[0.68rem] mt-[6px] italic pl-2`} style={{ color: GRAY, borderLeft: `2px solid ${LINE_STRONG}` }}>
//                   {block.caption}
//                 </figcaption>
//               )}
//             </figure>
//           );
//         }
//         if (block.type === "at_a_glance" && showKeyPoints) {
//           const rows = block.glanceRows || [];
//           return (
//             <div key={i} className="px-[18px] py-4 my-7" style={{ border: `1px solid ${LINE_STRONG}`, borderTop: `3px solid ${GOLD}`, background: PAPER }}>
//               <div className={`${SANS} text-[0.65rem] font-extrabold tracking-[0.16em] uppercase mb-[10px]`} style={{ color: GOLD }}>
//                 {block.glanceTitle || "Key Points"}
//               </div>
//               <ul className="list-none">
//                 {rows.map((r, ri) => (
//                   <li
//                     key={ri}
//                     className={`${SANS} text-[0.82rem] py-[6px] flex gap-2 items-start leading-[1.4]`}
//                     style={{ color: "#333333", borderBottom: ri < rows.length - 1 ? `1px solid ${LINE}` : "none" }}
//                   >
//                     <span className="text-[0.6rem] flex-shrink-0 mt-[2px]" style={{ color: RED }}>▸</span>
//                     <span>{r.value || r.label}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           );
//         }
//         if (block.type === "faq") {
//           return (
//             <div key={i} className="space-y-3 my-7">
//               <p className={`${HEAD} font-bold`} style={{ fontSize: "1.05rem", color: INK }}>{block.faqTitle || "Frequently asked questions"}</p>
//               {(block.faqItems || []).map((f, fi) => (
//                 <div key={fi}>
//                   <p className={`${SANS} font-semibold text-[0.85rem]`} style={{ color: "#333333" }}>{f.question}</p>
//                   <p className={`${BODY} text-[0.85rem] mt-1`} style={{ color: "#555555" }}>{f.answer}</p>
//                 </div>
//               ))}
//             </div>
//           );
//         }
//         return null;
//       })}
//     </div>
//   );
// }

// // ─── Author box / related cards ────────────────────────────────────────────

// function AuthorBox({ article }) {
//   const initials = (article.author || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
//   const href = authorHref(article.authorSlug);
//   return (
//     <div className="mt-8 p-6 flex gap-[18px] items-start flex-wrap sm:flex-nowrap" style={{ border: `1px solid ${LINE}`, borderTop: `3px solid ${INK}`, background: PAPER }}>
//       <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
//         {article.authorImage ? (
//           <img src={article.authorImage} alt={article.author} className="w-full h-full object-cover" />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl" style={{ background: `linear-gradient(135deg, ${gradFor(article.author)})` }}>
//             {initials}
//           </div>
//         )}
//       </div>
//       <div className="min-w-0">
//         <div className={`${SANS} text-[0.6rem] font-extrabold tracking-[0.18em] uppercase mb-1`} style={{ color: RED }}>About the Author</div>
//         <div className={`${HEAD} text-[1.2rem] font-bold mb-[2px]`} style={{ color: INK }}>{article.author || "Staff Writer"}</div>
//         {article.authorRole && <div className={`${SANS} text-[0.72rem] mb-[10px] tracking-[0.03em]`} style={{ color: GRAY }}>{article.authorRole}</div>}
//         {href ? (
//           <Link href={href} className={`${SANS} text-[0.65rem] font-bold tracking-[0.08em] uppercase inline-block hover:opacity-75`} style={{ color: BLUE }}>
//             View All Articles →
//           </Link>
//         ) : (
//           <span className={`${SANS} text-[0.65rem] font-bold tracking-[0.08em] uppercase inline-block opacity-40`} style={{ color: BLUE }}>
//             View All Articles →
//           </span>
//         )}
//       </div>
//     </div>
//   );
// }

// function RelatedCard({ article }) {
//   const href = articleHref(article);
//   const Wrap = href ? Link : "div";
//   return (
//     <article>
//       <div className="h-[110px] overflow-hidden mb-[10px]" style={bgFill(article)} />
//       <div className={`${SANS} text-[0.68rem] font-bold tracking-[0.12em] uppercase`} style={{ color: article.categoryColor || RED }}>{article.category}</div>
//       <h4 className={`${HEAD} text-[0.9rem] font-bold leading-[1.28] mb-[5px] mt-1`} style={{ color: INK }}>
//         <Wrap {...(href ? { href } : {})} className="hover:opacity-75">{article.title}</Wrap>
//       </h4>
//       <div className={`${SANS} text-[0.72rem]`} style={{ color: GRAY }}>
//         By {article.author || "Staff Writer"}{article.date ? ` • ${article.date}` : ""}
//       </div>
//     </article>
//   );
// }

// // ─── Sidebar ────────────────────────────────────────────────────────────
// //
// // STICKY SIDEBAR IMPLEMENTATION:
// // - Uses `position: sticky` with `top: 20px`
// // - `align-self: flex-start` ensures it starts at the top of the flex container
// // - The parent flex row has no overflow: hidden/auto/scroll
// // - The sidebar sticks when it reaches top: 20px from the viewport and stops
// //   at the bottom of the parent (bounded by the main content column's height)
// // - On mobile/tablet the sidebar stacks below the main content, at 100% width
// // - On desktop the sidebar always takes the remaining 25% of the row, with
// //   the main column locked to 75%, so the layout uses the full page width
// //   with no leftover whitespace on the right.

// function Sidebar({ data, article, stacked }) {
//   const widgets = data.sidebar?.widgets;
//   const ad = data.sidebar?.ad;
//   const latest = getAllPreviewArticlesSorted().filter((x) => x.id !== article.id);

//   return (
//     <aside
//       className={stacked ? "w-full pt-6" : "min-w-0 pl-[22px] pt-1"}
//       style={stacked ? {} : { width: "25%", flex: "0 0 25%", position: data.sidebar?.sticky ? "sticky" : "static", top: 20, alignSelf: "flex-start" }}
//       aria-label="Sidebar"
//     >
//       {widgets?.mostRead && (
//         <SidebarModule title="Most Read Today">
//           <ul className="list-none">
//             {latest.slice(0, 5).map((art, i, arr) => {
//               const href = articleHref(art);
//               const Item = href ? Link : "div";
//               return (
//                 <li key={art.id} className="flex gap-[10px] items-start py-[10px]" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : "none" }}>
//                   <div className="w-[68px] h-[52px] flex-shrink-0 overflow-hidden" style={bgFill(art)} />
//                   <div className="min-w-0">
//                     <div className={`${SANS} text-[0.66rem] font-bold tracking-[0.1em] uppercase mb-[3px]`} style={{ color: RED }}>{art.category}</div>
//                     <h5 className={`${HEAD} text-[0.82rem] font-bold leading-[1.25] mb-[3px]`} style={{ color: INK }}>
//                       <Item {...(href ? { href } : {})} className="hover:opacity-75">{art.title}</Item>
//                     </h5>
//                     <div className={`${SANS} text-[0.72rem]`} style={{ color: GRAY }}>{art.date}</div>
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         </SidebarModule>
//       )}

//       {(widgets?.mostRead || widgets?.mostCommented || widgets?.advertisement) && <NewsletterBox />}

//       {widgets?.mostCommented && (
//         <SidebarModule title="Most Commented">
//           <ul className="list-none">
//             {latest.slice(1, 5).map((art, i, arr) => {
//               const href = articleHref(art);
//               const Item = href ? Link : "div";
//               return (
//                 <li key={art.id} className="flex gap-[10px] items-start py-[9px]" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : "none" }}>
//                   <span className={`${SANS} text-[0.76rem] font-extrabold w-4 flex-shrink-0 pt-[1px]`} style={{ color: GRAY }}>{i + 1}</span>
//                   <div className="min-w-0">
//                     <h5 className={`${BODY} text-[0.8rem] leading-[1.3]`} style={{ color: INK }}>
//                       <Item {...(href ? { href } : {})} className="hover:opacity-75">{art.title}</Item>
//                     </h5>
//                     <div className={`${SANS} text-[0.72rem]`} style={{ color: GRAY }}>{art.date}</div>
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         </SidebarModule>
//       )}

//       {widgets?.advertisement && <AdBox ad={ad} />}
//     </aside>
//   );
// }

// function SidebarModule({ title, children }) {
//   return (
//     <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${LINE}` }}>
//       <div className={`${SANS} text-[0.62rem] font-extrabold tracking-[0.2em] uppercase mb-3 pb-[6px]`} style={{ color: INK, borderBottom: `2px solid ${INK}` }}>
//         {title}
//       </div>
//       {children}
//     </div>
//   );
// }

// function NewsletterBox() {
//   return (
//     <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${LINE}` }}>
//       <div className="p-[18px] text-center" style={{ background: INK }}>
//         <div className="text-[1.6rem] mb-2">✉</div>
//         <div className={`${HEAD} text-[1.02rem] font-bold mb-[6px] leading-[1.3]`} style={{ color: OFFWHITE }}>Stay Informed</div>
//         <div className={`${SANS} text-[0.72rem] mb-[14px] leading-[1.5]`} style={{ color: "#888888" }}>
//           Get our top stories delivered to your inbox — incisive, informed, and never breathless.
//         </div>
//         <input
//           type="email"
//           placeholder="Your email address"
//           className={`${SANS} w-full px-[10px] py-2 text-[0.78rem] mb-2 outline-none`}
//           style={{ background: "#222222", border: "1px solid #333333", color: "white" }}
//         />
//         <button
//           type="button"
//           className={`${SANS} w-full py-[9px] text-[0.72rem] font-bold tracking-[0.1em] uppercase cursor-pointer transition-colors duration-150`}
//           style={{ background: RED, color: "white", border: "none" }}
//         >
//           Subscribe Free →
//         </button>
//       </div>
//     </div>
//   );
// }

// function AdBox({ ad }) {
//   const adW = ad?.width > 0 ? ad.width : "100%";
//   const adH = ad?.height || 250;
//   const adBody = ad?.imageUrl ? (
//     <img src={ad.imageUrl} alt={ad.altText || "Advertisement"} className="w-full object-cover" style={{ height: adH }} />
//   ) : (
//     <div className="p-4" style={{ background: INK }}>
//       <p className={`${SANS} text-[0.6rem] font-extrabold uppercase tracking-[0.18em]`} style={{ color: GOLD }}>Sponsored</p>
//       <p className={`${HEAD} text-[0.98rem] font-bold leading-[1.3] mt-2`} style={{ color: OFFWHITE }}>Your advertisement appears here</p>
//     </div>
//   );
//   return (
//     <div style={{ width: adW, maxWidth: "100%", border: `1px solid ${LINE}`, overflow: "hidden" }}>
//       {ad?.imageUrl && ad?.linkUrl ? (
//         <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer sponsored" className="block">{adBody}</a>
//       ) : adBody}
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import Link from "next/link";
import {
  getAllPreviewArticlesSorted,
  getRelatedArticles,
  getPrevNextArticle,
  articleHref,
  authorHref,
} from "@/lib/articlesSource";
import { imgStyle, gradFor } from "@/components/category-builder/shared";
import { SAMPLE_ARTICLE, PrevNextNav } from "../shared";
import NewsletterForm from "@/components/site/NewsletterForm";

/** Template 1 — Sticky Sidebar Editorial: classic single-column article body
 *  with a right sidebar (Latest/Most Read, Newsletter, Most Commented, Ad
 *  slot) that uses position:sticky + top:20px + align-self:flex-start, so it
 *  scrolls with the page and stops naturally at the bottom of the article
 *  column — never fixed, never overlapping the footer.
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
const BADGE_COLORS = [RED, BLUE, GOLD];

const HEAD = "font-['Playfair_Display',Georgia,serif]";
const BODY = "font-['Lora',Georgia,serif]";
const SANS = "font-['Source_Sans_3',Arial,sans-serif]";

function bgFill(item) {
  return item?.img
    ? { backgroundImage: `url(${item.img})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: `linear-gradient(135deg, ${gradFor(item?.id)})` };
}

export default function StickySidebarTemplate({ data, article, device = "desktop" }) {
  const isMobile = device === "mobile";
  const isTablet = device === "tablet";
  const a = article;
  const related = data.relatedArticles?.enabled ? getRelatedArticles(a, data.relatedArticles?.count ?? 3) : [];
  const { previous, next } = data.prevNext?.enabled ? getPrevNextArticle(a) : { previous: null, next: null };
  const tags = a.categoryTags?.length ? a.categoryTags : [a.category || "News"];
  const stacked = isMobile || isTablet;
  const sidebarOn = data.sidebar?.enabled && !stacked;

  return (
    <div style={{ background: OFFWHITE }}>
      <div className="w-full px-4 sm:px-6 lg:px-10">

        {data.header?.showBreadcrumb && (
          <nav
            aria-label="Breadcrumb"
            className={`${SANS} pt-[14px] text-[0.7rem] tracking-[0.03em] flex gap-[6px] items-center flex-wrap`}
            style={{ color: GRAY }}
          >
            <Link href="/" className="hover:opacity-75" style={{ color: BLUE }}>Home</Link>
            {tags.map((t, i) => (
              <span key={t} className="flex items-center gap-[6px]">
                <span style={{ color: LINE_STRONG }}>/</span>
                {i === tags.length - 1 ? <span>{t}</span> : <span style={{ color: BLUE }}>{t}</span>}
              </span>
            ))}
          </nav>
        )}

        <div className={stacked ? "flex flex-col gap-8 pt-[14px]" : "flex gap-0 pt-[14px] items-start"}>

          {/* ── MAIN — 75% on desktop/tablet, 100% stacked ── */}
          <article
            className={stacked ? "flex-1 min-w-0 pb-6" : "min-w-0 pr-9 pb-10"}
            style={{
              width: stacked ? "100%" : sidebarOn ? "75%" : "100%",
              flex: stacked ? "1 1 auto" : sidebarOn ? "0 0 75%" : "1 1 auto",
              borderRight: sidebarOn ? `1px solid ${LINE_STRONG}` : "none",
            }}
          >
            {/* Header */}
            <header className="pb-[18px] mb-[22px]" style={{ borderBottom: `1px solid ${LINE}` }}>
              {data.header?.showCategoryTags && (
                <div className="flex gap-2 items-center mb-3 flex-wrap">
                  {tags.map((t, i) => (
                    <span
                      key={t}
                      className={`${SANS} text-[0.65rem] font-extrabold tracking-[0.14em] uppercase px-[9px] py-[3px]`}
                      style={{ color: OFFWHITE, background: a.categoryColor || BADGE_COLORS[i % BADGE_COLORS.length] }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <h1
                className={`${HEAD} font-black leading-[1.12] tracking-[-0.01em]`}
                style={{ fontSize: data.typography?.titleSize || 34, color: INK }}
              >
                {a.title}
              </h1>

              {a.excerpt && (
                <p
                  className={`${BODY} italic mb-1 mt-[14px] leading-[1.6] pl-[14px]`}
                  style={{ fontSize: data.typography?.subtitleSize || 16, color: "#333333", borderLeft: `3px solid ${GOLD}` }}
                >
                  {a.excerpt}
                </p>
              )}

              <ByLine article={a} />

              {data.header?.showShare && (
                <ShareRow article={a} platforms={data.header?.sharePlatforms} />
              )}
            </header>

            {/* Hero */}
            {data.hero?.enabled && (
              <figure className="mb-8">
                <div style={imgStyle(a, data.hero?.ratio || "16/9")} />
              </figure>
            )}

            {/* Body */}
            <ArticleBody
              article={a}
              typography={data.typography}
              dropCap={data.body?.dropCap}
              showPullquotes={data.body?.showPullquotes}
              showKeyPoints={data.body?.showKeyPoints}
            />

            {/* Topics */}
            {tags.length > 0 && (
              <div className="mt-7 pt-[18px] flex gap-[7px] flex-wrap items-center" style={{ borderTop: `1px solid ${LINE_STRONG}` }}>
                <span className={`${SANS} text-[0.65rem] font-bold tracking-[0.1em] uppercase`} style={{ color: GRAY }}>Topics</span>
                {tags.map((t) => (
                  <span
                    key={t}
                    className={`${SANS} text-[0.68rem] font-semibold tracking-[0.04em] px-[11px] py-1`}
                    style={{ border: `1px solid ${LINE_STRONG}`, color: "#333333" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {data.authorBox?.enabled && <AuthorBox article={a} />}

            {data.prevNext?.enabled && (previous || next) && (
              <div className="mt-7 pt-6" style={{ borderTop: `1px solid ${LINE}` }}>
                <PrevNextNav previous={previous} next={next} settings={data.prevNext} />
              </div>
            )}

            {data.relatedArticles?.enabled && related.length > 0 && (
              <section className="mt-9 pt-5" style={{ borderTop: `2px solid ${INK}` }} aria-label="Related articles">
                <div className={`${SANS} text-[0.65rem] font-extrabold tracking-[0.2em] uppercase mb-[18px] flex items-center gap-3`} style={{ color: INK }}>
                  {data.relatedArticles.title || "Related Articles"}
                  <span className="flex-1 h-px" style={{ background: LINE_STRONG }} />
                </div>
                <div
                  className="grid gap-[18px]"
                  style={{ gridTemplateColumns: `repeat(${stacked ? 1 : Math.min(data.relatedArticles?.columns ?? 3, isTablet ? 2 : 3)}, minmax(0,1fr))` }}
                >
                  {related.map((r) => <RelatedCard key={r.id} article={r} />)}
                </div>
              </section>
            )}
          </article>

          {/* ── SIDEBAR — 25% on desktop/tablet, 100% stacked ── */}
          {data.sidebar?.enabled && (
            <Sidebar data={data} article={a} stacked={stacked} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Header pieces ────────────────────────────────────────────────────────

function ByLine({ article }) {
  const initials = (article.author || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const href = authorHref(article.authorSlug);
  const NameWrap = href ? Link : "span";
  return (
    <div className="flex items-center gap-3 py-3 flex-wrap" style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
      <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
        {article.authorImage ? (
          <img src={article.authorImage} alt={article.author} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-bold" style={{ background: `linear-gradient(135deg, ${gradFor(article.author)})` }}>
            {initials}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <NameWrap {...(href ? { href } : {})} className={`${HEAD} text-[0.92rem] font-bold block`} style={{ color: INK }}>
          {article.author || "Staff Writer"}
        </NameWrap>
        {article.authorRole && (
          <span className={`${SANS} text-[0.68rem] block mt-[1px]`} style={{ color: GRAY }}>{article.authorRole}</span>
        )}
      </div>
      <div className={`${SANS} text-[0.7rem] text-right leading-[1.5]`} style={{ color: GRAY }}>
        {article.date && <strong className="block" style={{ color: "#555555" }}>{article.date}</strong>}
        {article.readTime && <span>{article.readTime}</span>}
      </div>
    </div>
  );
}

function ShareRow({ article, platforms }) {
  const labels = { twitter: "𝕏 Post", facebook: "Facebook", linkedin: "LinkedIn", whatsapp: "WhatsApp", telegram: "Telegram", email: "Email" };
  const active = (platforms?.length ? platforms : ["twitter", "facebook", "linkedin"]).filter((k) => labels[k]);
  const [copied, setCopied] = useState(false);

  function getUrl() {
    if (typeof window === "undefined") return "";
    const href = articleHref(article);
    return href ? `${window.location.origin}${href}` : window.location.href;
  }
  function handleShare(key) {
    const url = getUrl();
    const title = article?.title || "";
    if (key === "email") {
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
      return;
    }
    const map = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`.trim())}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    };
    const target = map[key];
    if (target) window.open(target, "_blank", "noopener,noreferrer,width=600,height=520");
  }
  function handleCopy() {
    const url = getUrl();
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const btnBase = { border: `1px solid ${LINE_STRONG}`, color: "#333333", background: "transparent" };
  const onEnter = (e) => { e.currentTarget.style.background = INK; e.currentTarget.style.color = OFFWHITE; e.currentTarget.style.borderColor = INK; };
  const onLeave = (e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#333333"; e.currentTarget.style.borderColor = LINE_STRONG; };

  return (
    <div className="flex gap-2 items-center pt-[10px] flex-wrap">
      <span className={`${SANS} text-[0.66rem] font-bold tracking-[0.12em] uppercase`} style={{ color: GRAY }}>Share</span>
      {active.map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => handleShare(k)}
          className={`${SANS} text-[0.66rem] font-bold tracking-[0.08em] uppercase px-3 py-[5px] cursor-pointer transition-colors duration-150`}
          style={btnBase}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          {labels[k]}
        </button>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        className={`${SANS} text-[0.66rem] font-bold tracking-[0.08em] uppercase px-3 py-[5px] cursor-pointer transition-colors duration-150`}
        style={btnBase}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}

// ─── Body ─────────────────────────────────────────────────────────────────

function ArticleBody({ article, typography, dropCap = true, showPullquotes = true, showKeyPoints = true }) {
  const blocks = article._raw?.content?.length ? article._raw.content : SAMPLE_ARTICLE._raw.content;
  const bodySize = typography?.bodySize ?? 16;
  const lineHeight = typography?.lineHeight ?? 1.75;
  const fontWeight = typography?.fontWeight ?? 400;
  const titleSize = typography?.titleSize ?? 34;
  let firstParaSeen = false;

  return (
    <div className="mt-6">
      {blocks.map((block, i) => {
        if (block.type === "paragraph") {
          const isFirst = dropCap && !firstParaSeen;
          if (isFirst) firstParaSeen = true;
          const text = block.text || "";
          return (
            <p key={i} className={`${BODY} mb-[1.4em]`} style={{ fontSize: bodySize, lineHeight, fontWeight, color: INK }}>
              {isFirst && text.trim() ? (
                <>
                  <span className={`${HEAD} float-left font-black leading-[0.78] mr-2 mt-[6px]`} style={{ fontSize: bodySize * 4.2, color: RED }}>
                    {text.trim()[0]}
                  </span>
                  {text.trim().slice(1)}
                </>
              ) : text}
            </p>
          );
        }
        if (block.type === "subheading") {
          return (
            <h2
              key={i}
              className={`${HEAD} font-bold mt-[1.8em] mb-[0.6em] leading-[1.25] pb-2`}
              style={{ fontSize: titleSize * 0.48, color: INK, borderBottom: `1px solid ${LINE}` }}
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === "pullquote" && showPullquotes) {
          return (
            <div key={i} className="pl-5 py-[14px] my-7 relative" style={{ borderLeft: `4px solid ${RED}`, background: PAPER }}>
              <span className={`${HEAD} absolute top-[-10px] left-3 opacity-25 leading-none`} style={{ fontSize: "4rem", color: RED }}>&ldquo;</span>
              <p className={`${HEAD} italic leading-[1.5] mb-2 pl-2`} style={{ fontSize: "1.2rem", color: "#333333" }}>{block.text}</p>
              {block.attribution && (
                <cite className={`${SANS} not-italic tracking-[0.08em] uppercase pl-2 block text-[0.68rem]`} style={{ color: GRAY }}>
                  {block.attribution}
                </cite>
              )}
            </div>
          );
        }
        if (block.type === "image") {
          return (
            <figure key={i} className="my-7">
              <div style={imgStyle({ img: block.src }, "16/9")} />
              {block.caption && (
                <figcaption className={`${SANS} text-[0.68rem] mt-[6px] italic pl-2`} style={{ color: GRAY, borderLeft: `2px solid ${LINE_STRONG}` }}>
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }
        if (block.type === "at_a_glance" && showKeyPoints) {
          const rows = block.glanceRows || [];
          return (
            <div key={i} className="px-[18px] py-4 my-7" style={{ border: `1px solid ${LINE_STRONG}`, borderTop: `3px solid ${GOLD}`, background: PAPER }}>
              <div className={`${SANS} text-[0.65rem] font-extrabold tracking-[0.16em] uppercase mb-[10px]`} style={{ color: GOLD }}>
                {block.glanceTitle || "Key Points"}
              </div>
              <ul className="list-none">
                {rows.map((r, ri) => (
                  <li
                    key={ri}
                    className={`${SANS} text-[0.82rem] py-[6px] flex gap-2 items-start leading-[1.4]`}
                    style={{ color: "#333333", borderBottom: ri < rows.length - 1 ? `1px solid ${LINE}` : "none" }}
                  >
                    <span className="text-[0.6rem] flex-shrink-0 mt-[2px]" style={{ color: RED }}>▸</span>
                    <span>{r.value || r.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        if (block.type === "faq") {
          return (
            <div key={i} className="space-y-3 my-7">
              <p className={`${HEAD} font-bold`} style={{ fontSize: "1.05rem", color: INK }}>{block.faqTitle || "Frequently asked questions"}</p>
              {(block.faqItems || []).map((f, fi) => (
                <div key={fi}>
                  <p className={`${SANS} font-semibold text-[0.85rem]`} style={{ color: "#333333" }}>{f.question}</p>
                  <p className={`${BODY} text-[0.85rem] mt-1`} style={{ color: "#555555" }}>{f.answer}</p>
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

// ─── Author box / related cards ────────────────────────────────────────────

function AuthorBox({ article }) {
  const initials = (article.author || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const href = authorHref(article.authorSlug);
  return (
    <div className="mt-8 p-6 flex gap-[18px] items-start flex-wrap sm:flex-nowrap" style={{ border: `1px solid ${LINE}`, borderTop: `3px solid ${INK}`, background: PAPER }}>
      <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
        {article.authorImage ? (
          <img src={article.authorImage} alt={article.author} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl" style={{ background: `linear-gradient(135deg, ${gradFor(article.author)})` }}>
            {initials}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className={`${SANS} text-[0.6rem] font-extrabold tracking-[0.18em] uppercase mb-1`} style={{ color: RED }}>About the Author</div>
        <div className={`${HEAD} text-[1.2rem] font-bold mb-[2px]`} style={{ color: INK }}>{article.author || "Staff Writer"}</div>
        {article.authorRole && <div className={`${SANS} text-[0.72rem] mb-[10px] tracking-[0.03em]`} style={{ color: GRAY }}>{article.authorRole}</div>}
        {href ? (
          <Link href={href} className={`${SANS} text-[0.65rem] font-bold tracking-[0.08em] uppercase inline-block hover:opacity-75`} style={{ color: BLUE }}>
            View All Articles →
          </Link>
        ) : (
          <span className={`${SANS} text-[0.65rem] font-bold tracking-[0.08em] uppercase inline-block opacity-40`} style={{ color: BLUE }}>
            View All Articles →
          </span>
        )}
      </div>
    </div>
  );
}

function RelatedCard({ article }) {
  const href = articleHref(article);
  const Wrap = href ? Link : "div";
  return (
    <article>
      <div className="h-[110px] overflow-hidden mb-[10px]" style={bgFill(article)} />
      <div className={`${SANS} text-[0.68rem] font-bold tracking-[0.12em] uppercase`} style={{ color: article.categoryColor || RED }}>{article.category}</div>
      <h4 className={`${HEAD} text-[0.9rem] font-bold leading-[1.28] mb-[5px] mt-1`} style={{ color: INK }}>
        <Wrap {...(href ? { href } : {})} className="hover:opacity-75">{article.title}</Wrap>
      </h4>
      <div className={`${SANS} text-[0.72rem]`} style={{ color: GRAY }}>
        By {article.author || "Staff Writer"}{article.date ? ` • ${article.date}` : ""}
      </div>
    </article>
  );
}

// ─── Sidebar ────────────────────────────────────────────────────────────
//
// STICKY SIDEBAR IMPLEMENTATION:
// - Uses `position: sticky` with `top: 20px`
// - `align-self: flex-start` ensures it starts at the top of the flex container
// - The parent flex row has no overflow: hidden/auto/scroll
// - The sidebar sticks when it reaches top: 20px from the viewport and stops
//   at the bottom of the parent (bounded by the main content column's height)
// - On mobile/tablet the sidebar stacks below the main content, at 100% width
// - On desktop the sidebar always takes the remaining 25% of the row, with
//   the main column locked to 75%, so the layout uses the full page width
//   with no leftover whitespace on the right.

function Sidebar({ data, article, stacked }) {
  const widgets = data.sidebar?.widgets;
  const ad = data.sidebar?.ad;
  const latest = getAllPreviewArticlesSorted().filter((x) => x.id !== article.id);

  return (
    <aside
      className={stacked ? "w-full pt-6" : "min-w-0 pl-[22px] pt-1"}
      style={stacked ? {} : { width: "25%", flex: "0 0 25%", position: data.sidebar?.sticky ? "sticky" : "static", top: 20, alignSelf: "flex-start" }}
      aria-label="Sidebar"
    >
      {widgets?.mostRead && (
        <SidebarModule title="Most Read Today">
          <ul className="list-none">
            {latest.slice(0, data.sidebar?.mostReadCount ?? 5).map((art, i, arr) => {
              const href = articleHref(art);
              const Item = href ? Link : "div";
              return (
                <li key={art.id} className="flex gap-[10px] items-start py-[10px]" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : "none" }}>
                  <div className="w-[68px] h-[52px] flex-shrink-0 overflow-hidden" style={bgFill(art)} />
                  <div className="min-w-0">
                    <div className={`${SANS} text-[0.66rem] font-bold tracking-[0.1em] uppercase mb-[3px]`} style={{ color: RED }}>{art.category}</div>
                    <h5 className={`${HEAD} text-[0.82rem] font-bold leading-[1.25] mb-[3px]`} style={{ color: INK }}>
                      <Item {...(href ? { href } : {})} className="hover:opacity-75">{art.title}</Item>
                    </h5>
                    <div className={`${SANS} text-[0.72rem]`} style={{ color: GRAY }}>{art.date}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </SidebarModule>
      )}

      {data.sidebar?.newsletter?.enabled !== false && <NewsletterBox settings={data.sidebar?.newsletter} />}

      {widgets?.mostCommented && (
        <SidebarModule title="Most Commented">
          <ul className="list-none">
            {latest.slice(1, 1 + (data.sidebar?.mostCommentedCount ?? 4)).map((art, i, arr) => {
              const href = articleHref(art);
              const Item = href ? Link : "div";
              return (
                <li key={art.id} className="flex gap-[10px] items-start py-[9px]" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : "none" }}>
                  <span className={`${SANS} text-[0.76rem] font-extrabold w-4 flex-shrink-0 pt-[1px]`} style={{ color: GRAY }}>{i + 1}</span>
                  <div className="min-w-0">
                    <h5 className={`${BODY} text-[0.8rem] leading-[1.3]`} style={{ color: INK }}>
                      <Item {...(href ? { href } : {})} className="hover:opacity-75">{art.title}</Item>
                    </h5>
                    <div className={`${SANS} text-[0.72rem]`} style={{ color: GRAY }}>{art.date}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </SidebarModule>
      )}

      {widgets?.advertisement && <AdBox ad={ad} />}
    </aside>
  );
}

function SidebarModule({ title, children }) {
  return (
    <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${LINE}` }}>
      <div className={`${SANS} text-[0.62rem] font-extrabold tracking-[0.2em] uppercase mb-3 pb-[6px]`} style={{ color: INK, borderBottom: `2px solid ${INK}` }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function NewsletterBox({ settings }) {
  const s = settings || {};
  return (
    <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${LINE}` }}>
      <div className="p-[18px] text-center" style={{ background: s.bgColor || INK }}>
        <div className="text-[1.6rem] mb-2">✉</div>
        <div className={`${HEAD} text-[1.02rem] font-bold mb-[6px] leading-[1.3]`} style={{ color: s.titleColor || OFFWHITE }}>
          {s.title || "Stay Informed"}
        </div>
        <div className={`${SANS} text-[0.72rem] mb-[14px] leading-[1.5]`} style={{ color: s.textColor || "#888888" }}>
          {s.description || "Get our top stories delivered to your inbox — incisive, informed, and never breathless."}
        </div>
        <NewsletterForm
          source="article-sidebar"
          layout="stack"
          placeholder={s.placeholder || "Your email address"}
          buttonText={s.buttonText || "Subscribe Free →"}
          successMessage={s.successMessage || "You're subscribed! Please check your inbox."}
          buttonBg={s.buttonColor || RED}
          buttonTextColor={s.buttonTextColor || "#ffffff"}
          dark
        />
      </div>
    </div>
  );
}

function AdBox({ ad }) {
  const adW = ad?.width > 0 ? ad.width : "100%";
  const adH = ad?.height || 250;
  const adBody = ad?.imageUrl ? (
    <img src={ad.imageUrl} alt={ad.altText || "Advertisement"} className="w-full object-cover" style={{ height: adH }} />
  ) : (
    <div className="p-4" style={{ background: INK }}>
      <p className={`${SANS} text-[0.6rem] font-extrabold uppercase tracking-[0.18em]`} style={{ color: GOLD }}>Sponsored</p>
      <p className={`${HEAD} text-[0.98rem] font-bold leading-[1.3] mt-2`} style={{ color: OFFWHITE }}>Your advertisement appears here</p>
    </div>
  );
  return (
    <div style={{ width: adW, maxWidth: "100%", border: `1px solid ${LINE}`, overflow: "hidden" }}>
      {ad?.imageUrl && ad?.linkUrl ? (
        <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer sponsored" className="block">{adBody}</a>
      ) : adBody}
    </div>
  );
}
