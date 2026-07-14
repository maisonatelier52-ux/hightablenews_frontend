

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Monitor, Tablet, Smartphone, X, Plus } from "lucide-react";
// import { resolveArticlesForBlock, resolveSingleArticle, resolveArticlesByCategoryName, resolveTrendingArticles, pinArticleAtIndex, clearArticlePin, createArticleUsageTracker, articleHref, categoryHref, authorHref, getArticlesForAuthor, getAllPreviewArticlesSorted } from "@/lib/articlesSource";
// import { getCategories } from "@/lib/categoriesArticlesApi";
// import { getAuthors } from "@/lib/authorsApi";
// import ArticlePickerModal from "./ArticlePickerModal";
// import NewsletterForm from "@/components/site/NewsletterForm";

// /** Wraps card content in a real Next.js Link to the article when we have a
//  *  resolvable URL (real published article); otherwise renders a plain,
//  *  non-clickable wrapper so sample/placeholder content never links to a
//  *  dead "#" route. `as` controls the wrapper element used in the fallback
//  *  case so layout doesn't shift (e.g. "div", "li", "article"). */
// function CardLink({ article, className, style, as: As = "div", children }) {
//   const href = articleHref(article);
//   if (!href) {
//     return (
//       <As className={className} style={style}>
//         {children}
//       </As>
//     );
//   }
//   return (
//     <Link href={href} className={className} style={style}>
//       {children}
//     </Link>
//   );
// }

// /**
//  * Cover-image div used throughout the Newspaper Editorial template (hero,
//  * left/right sidebar cards, category-section cards). Renders the gradient
//  * placeholder as the base background always, then layers a real <img> on
//  * top only once it has actually finished loading. If a real article's image
//  * URL is broken/unreachable, onError hides the <img> again so the card
//  * falls back to the gradient instead of sitting there blank/white — this is
//  * what previously made cards with a bad image URL look empty in the admin
//  * preview instead of showing *something*.
//  */
// function CoverImage({ src, gradient, className = "", style = {} }) {
//   const [failed, setFailed] = useState(false);
//   const showImg = !!src && !failed;
//   return (
//     <div className={className} style={{ background: gradient, ...style }}>
//       {showImg && (
//         <img
//           src={src}
//           alt=""
//           className="w-full h-full object-cover"
//           onError={() => setFailed(true)}
//         />
//       )}
//     </div>
//   );
// }

// /** Resolves the public URL for a category name/id shown on a homepage block
//  *  (e.g. the "More →" link on a Category Section). Homepage blocks usually
//  *  only carry a category *name* string, so this looks the real category up
//  *  by name (case-insensitive) to find its slug. */
// function categoryHrefByName(name) {
//   if (typeof window === "undefined" || !name) return null;
//   const categories = getCategories();
//   const match = categories.find((c) => (c.name || c.title || "").toLowerCase() === String(name).toLowerCase());
//   return match ? categoryHref(match) : null;
// }

// /** Resolves the public "View All" URL for a category-grid item. Prefers the
//  *  stable `categoryId` stored on the item (set when the admin picks the
//  *  category from the dropdown) so the link is exact even if the category
//  *  was later renamed; falls back to matching by name for older saved data
//  *  that only has a text label. */
// function categoryHrefForCatItem(cat) {
//   if (typeof window === "undefined" || !cat) return null;
//   if (cat.categoryId) {
//     const categories = getCategories();
//     const match = categories.find((c) => c._id === cat.categoryId);
//     if (match) return categoryHref(match);
//   }
//   return categoryHrefByName(cat.name);
// }

// // Fallback sample data — only used for preview when no real articles have
// // been added yet on the Articles page, so the builder never looks broken.
// const SAMPLE_ARTICLES = [
//   { id: 1, category: "POLITICS", categoryColor: "#7c3aed", title: "Live updates from The White House: A new chapter in transatlantic diplomacy", excerpt: "Senior diplomats from twelve nations convened in an extraordinary tension yesterday as mounting trade tensions threatened...", date: "2h ago", img: null, featured: true },
//   { id: 2, category: "HEALTH", categoryColor: "#059669", title: "How Sarah Caped With Her Chronic Disease — And Found Clarity", excerpt: "She found new strength in unexpected places...", date: "3h ago", img: null },
//   { id: 3, category: "ECONOMY", categoryColor: "#d97706", title: "A Global Economic Redress: Asia strategies with high inflation", excerpt: "Markets are responding to unprecedented policy shifts across the continent...", date: "4h ago", img: null },
//   { id: 4, category: "JUSTICE", categoryColor: "#dc2626", title: "Regulating technology: how courts are reshaping AI liability law", excerpt: "In a landmark ruling, three appeals courts simultaneously held tech firms accountable...", date: "5h ago", img: null },
//   { id: 5, category: "BUSINESS", categoryColor: "#2563eb", title: "It's Never Been More Expensive to Visit New York City", excerpt: "The average nightly rate in Manhattan has crossed $489 for the second consecutive quarter...", date: "6h ago", img: null, featured: true },
//   { id: 6, category: "FREE SPEECH", categoryColor: "#7c3aed", title: "The new showdown: how governments are reshaping modern rhetoric", excerpt: "From Brussels to Washington, legislators are testing the boundaries of protected speech...", date: "7h ago", img: null },
//   { id: 7, category: "WHITE HOUSE", categoryColor: "#dc2626", title: "Extra £2: is for half a price? The surcharge economy strikes again", excerpt: "Restaurants, hotels, transport and the broader hospitality industry is quietly normalizing...", date: "8h ago", img: null },
//   { id: 8, category: "OPINION", categoryColor: "#6b7280", title: "The year for deliberate slowness in an age of algorithmic haste", excerpt: "A celebrated technology critic says we must reclaim intentional pause from the machines...", date: "1d ago", img: null },
// ];

// const DEVICE_SIZES = {
//   desktop: { label: "Desktop", icon: Monitor, width: "100%", maxWidth: "none" },
//   tablet: { label: "Tablet", icon: Tablet, width: "768px", maxWidth: "768px" },
//   mobile: { label: "Mobile", icon: Smartphone, width: "390px", maxWidth: "390px" },
// };

// export default function LivePreviewPanel({ blocks, onClose, inline = false, onUpdateBlock }) {
//   const [device, setDevice] = useState("desktop");
//   const cfg = DEVICE_SIZES[device];

//   // ── Inline mode: rendered directly inside builder page ──────────────────
//   if (inline) {
//     return (
//       <div className="w-full">
//         {/* Device switcher bar */}
//         <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-gray-50/60">
//           {Object.entries(DEVICE_SIZES).map(([key, d]) => {
//             const Icon = d.icon;
//             return (
//               <button
//                 key={key}
//                 onClick={() => setDevice(key)}
//                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[14px] font-medium transition-colors ${device === key ? "bg-primary text-white" : "border border-border text-ink-500 hover:bg-gray-50"}`}
//               >
//                 <Icon size={13} />{d.label}
//               </button>
//             );
//           })}
//         </div>

//         {/* Preview body */}
//         <div className="bg-gray-100 flex justify-center p-5">
//           <div
//             className="bg-white shadow rounded-lg overflow-hidden transition-all duration-300 w-full"
//             style={{
//               maxWidth: cfg.maxWidth === "none" ? "100%" : cfg.maxWidth,
//               minHeight: "400px",
//             }}
//           >
//             <div className="divide-y divide-gray-100">
//               {blocks.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-20 text-center">
//                   <p className="text-[15px] text-ink-400 font-medium">No blocks added yet</p>
//                   <p className="text-[14px] text-ink-300 mt-1">Add blocks from the left panel to see a preview here.</p>
//                 </div>
//               ) : (
//                 blocks.map((block) => (
//                   <BlockRenderer key={block.id} blockId={block.id} type={block.type} data={block.data} device={device} onUpdateBlock={onUpdateBlock} />
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── Modal / fullscreen mode (legacy — kept for backward compat) ──────────
//   return (
//     <div className="fixed inset-0 z-50 bg-ink-900/60 flex flex-col" style={{ backdropFilter: "blur(2px)" }}>
//       {/* Top bar */}
//       <div className="bg-white border-b border-border flex items-center justify-between px-5 py-3 shrink-0">
//         <div className="flex items-center gap-3">
//           <p className="text-[16px] font-bold text-ink-900">Homepage Preview</p>
//           <span className="text-[13px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Live preview</span>
//         </div>
//         <div className="flex items-center gap-2">
//           {Object.entries(DEVICE_SIZES).map(([key, d]) => {
//             const Icon = d.icon;
//             return (
//               <button key={key} onClick={() => setDevice(key)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[14px] font-medium transition-colors ${device === key ? "bg-primary text-white" : "border border-border text-ink-500 hover:bg-gray-50"}`}>
//                 <Icon size={13} />{d.label}
//               </button>
//             );
//           })}
//           <div className="w-px h-5 bg-border mx-1" />
//           <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-gray-100 hover:text-ink-700 transition-colors">
//             <X size={17} />
//           </button>
//         </div>
//       </div>

//       {/* Preview body */}
//       <div className="flex-1 overflow-auto bg-gray-100 flex justify-center p-6">
//         <div
//           className="bg-white shadow-2xl rounded-lg overflow-auto transition-all duration-300"
//           style={{ width: cfg.width, maxWidth: cfg.maxWidth === "none" ? "100%" : cfg.maxWidth, minHeight: "600px", maxHeight: "100%" }}
//         >
//           {/* Render blocks */}
//           <div className="divide-y divide-gray-100">
//             {blocks.map((block) => (
//               <BlockRenderer key={block.id} type={block.type} data={block.data} device={device} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function SiteHeader({ device }) {
//   const isMobile = device === "mobile";
//   return (
//     <div>
//       {/* Top bar */}
//       <div className="bg-black text-white flex items-center justify-between px-4 py-1.5 text-[13px]">
//         <span className="text-gray-400">Friday · Jun 27, 2026</span>
//         <div className="flex items-center gap-3">
//           <span className="text-gray-400">Login</span>
//           <span className="bg-red-700 text-white px-2 py-0.5 rounded font-bold text-[12px]">Subscribe</span>
//         </div>
//       </div>
//       {/* Masthead */}
//       <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
//         {isMobile ? (
//           <>
//             <div className="text-[12px] text-gray-500">☰</div>
//             <span className="font-black text-[17px] tracking-tight">HighTableNews</span>
//             <div className="text-[12px] text-gray-500">🔍</div>
//           </>
//         ) : (
//           <>
//             <div />
//             <span className="font-black text-[22px] tracking-tight">HighTableNews</span>
//             <div className="flex items-center gap-2 text-[13px] text-gray-500">
//               <span>Login</span>
//               <span className="bg-red-700 text-white px-2 py-1 rounded font-bold text-[12px]">Subscribe</span>
//             </div>
//           </>
//         )}
//       </div>
//       {/* Nav */}
//       {!isMobile && (
//         <div className="border-b border-gray-200 px-4 py-2 flex items-center gap-5 text-[13px] font-bold uppercase tracking-wide text-gray-700 overflow-x-auto">
//           {["Power", "Technology", "Profiles", "Interviews", "Power Lists", "Companies", "Media"].map((item) => (
//             <span key={item} className="whitespace-nowrap hover:text-red-600 cursor-pointer transition-colors">{item}</span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function SiteFooter() {
//   return (
//     <div className="bg-black text-white px-6 py-8 mt-4">
//       <div className="text-[18px] font-black mb-2">HighTableNews</div>
//       <p className="text-gray-400 text-[14px]">Clarity, depth, and the courage to ask harder questions.</p>
//       <div className="border-t border-gray-800 mt-6 pt-4 text-[13px] text-gray-500">© 2026 HighTableNews Ltd.</div>
//     </div>
//   );
// }

// /** Homepage "Breaking News" block — a scrolling ticker of the latest real
//  *  articles. Pauses on hover and each headline links to its article. */
// function BreakingNewsTicker({ data, articles }) {
//   const [paused, setPaused] = useState(false);
//   const duration = Math.max(8, Math.round(1400 / (data.speed || 80)));
//   const track = (
//     <>
//       {articles.map((a, i) => (
//         <span key={`${a.id}-${i}`} className="inline-flex items-center">
//           {a.slug ? (
//             <Link href={articleHref(a)} className="hover:underline underline-offset-2">{a.title}</Link>
//           ) : (
//             <span>{a.title}</span>
//           )}
//           <span className="mx-3 opacity-50">•</span>
//         </span>
//       ))}
//     </>
//   );
//   return (
//     <div className="flex items-stretch overflow-hidden" style={{ backgroundColor: data.bg || "#111" }}>
//       <div className="px-3 py-2 font-bold text-[13px] shrink-0 flex items-center" style={{ backgroundColor: data.labelBg || "#cc0000", color: data.textColor || "#fff" }}>
//         {data.labelText || "BREAKING"}
//       </div>
//       <div
//         className="flex-1 overflow-hidden flex items-center"
//         onMouseEnter={() => setPaused(true)}
//         onMouseLeave={() => setPaused(false)}
//       >
//         <div
//           className="whitespace-nowrap py-2 px-3 text-[13px]"
//           style={{ color: data.textColor || "#fff", animation: `htn-ticker ${duration}s linear infinite`, animationPlayState: paused ? "paused" : "running" }}
//         >
//           {track}
//           {track}
//         </div>
//       </div>
//     </div>
//   );
// }

// function BlockRenderer({ type, data, device, blockId, onUpdateBlock }) {
//   const isMobile = device === "mobile";

//   switch (type) {
//     case "breakingNews": {
//       if (data.enabled === false) return null;
//       const tickerArticles = resolveArticlesForBlock(data, data.limit || 5, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES.slice(0, 5) });
//       if (tickerArticles.length === 0) return null;
//       return <BreakingNewsTicker data={data} articles={tickerArticles} />;
//     }

//     case "stickyNotice":
//       if (data.enabled === false) return null;
//       return (
//         <div className="flex items-center justify-between gap-3 px-4 py-2.5" style={{ backgroundColor: data.bg || "#1a1a1a" }}>
//           <p className="text-[14px]" style={{ color: data.textColor || "#fff" }}>{data.text}</p>
//           {data.ctaLabel && (
//             <a href={data.ctaUrl} className="shrink-0 text-[13px] font-bold px-3 py-1 rounded" style={{ backgroundColor: data.ctaBg || "#cc0000", color: "#fff" }}>{data.ctaLabel}</a>
//           )}
//         </div>
//       );

//     case "heroStory": {
//       const heroArticle = resolveSingleArticle(data, { idKey: "articleId", sampleFallback: SAMPLE_ARTICLES[0] });
//       const heroTitle = data.title || heroArticle?.title || "Global Markets Rally As Inflation Fears Ease";
//       const heroExcerpt = data.subheadline || heroArticle?.excerpt || "";
//       const heroCategory = data.category || heroArticle?.category || "";
//       const heroImg = data.bgImage || heroArticle?.img;
//       const heroUrl = (data.ctaUrl && data.ctaUrl !== "#") ? data.ctaUrl : articleHref(heroArticle);
//       return (
//         <div
//           className="relative overflow-hidden"
//           style={{
//             background: heroImg ? `linear-gradient(rgba(0,0,0,${(data.overlayOpacity ?? 50)/100}),rgba(0,0,0,${(data.overlayOpacity ?? 50)/100})), url(${heroImg}) center/cover no-repeat` : "linear-gradient(135deg, #1a1a2e 0%, #2d1b1b 50%, #0d1117 100%)",
//             paddingTop: isMobile ? 32 : (data.paddingTop || 48),
//             paddingBottom: isMobile ? 32 : (data.paddingBottom || 48),
//             paddingLeft: isMobile ? 16 : 40,
//             paddingRight: isMobile ? 16 : 40,
//             textAlign: data.alignment || "left",
//           }}
//         >
//           {data.showCategory && heroCategory && (
//             <span className="inline-block text-[12px] font-bold uppercase tracking-widest text-red-400 mb-2">{heroCategory}</span>
//           )}
//           <h1
//             className="text-white leading-tight font-bold mb-3"
//             style={{
//               fontSize: isMobile ? Math.max((data.titleSize || 28) * 0.7, 18) : (data.titleSize || 28),
//               fontWeight: data.titleWeight === "extrabold" ? 800 : data.titleWeight === "bold" ? 700 : data.titleWeight === "semibold" ? 600 : 400,
//               color: data.titleColor || "#ffffff",
//               fontFamily: data.fontFamily === "serif" || data.fontFamily === "georgia" || data.fontFamily === "playfair" ? "Georgia, serif" : "inherit",
//             }}
//           >
//             {heroUrl ? (
//               <Link href={heroUrl} className="hover:underline underline-offset-4">{heroTitle}</Link>
//             ) : (
//               heroTitle
//             )}
//           </h1>
//           {heroExcerpt && (
//             <p className="text-white/75 mb-4" style={{ fontSize: isMobile ? 13 : 15 }}>{heroExcerpt}</p>
//           )}
//           {data.showCta && data.ctaLabel && heroUrl && (
//             <Link href={heroUrl} className="inline-block text-[14px] font-bold bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">{data.ctaLabel}</Link>
//           )}
//         </div>
//       );
//     }

//     case "threeColumnLayout":
//       if (isMobile) return <ThreeColumnMobile data={data} />;
//       return <ThreeColumnDesktop data={data} />;

//     case "newsFeed":
//       return (
//         <div className="px-4 py-5">
//           {data.title && (
//             <div className="flex items-center gap-2 mb-4">
//               <h2 className="text-[15px] font-bold uppercase tracking-widest text-gray-900">{data.title}</h2>
//               <div className="flex-1 h-px bg-gray-200" />
//             </div>
//           )}
//           {data.layout === "grid" ? (
//             <div className="grid grid-cols-2 gap-3">
//               {resolveArticlesForBlock(data, data.limit || 6, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
//                 <ArticleCard key={`${a.id}-${i}`} article={a} showImage={data.showImages !== false} showCategory={data.showCategory !== false} showDate={data.showDate !== false} showExcerpt={false} compact />
//               ))}
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {resolveArticlesForBlock(data, data.limit || 6, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
//                 <ArticleRow key={`${a.id}-${i}`} article={a} showImage={data.showImages !== false} showCategory={data.showCategory !== false} showDate={data.showDate !== false} showExcerpt={data.showExcerpt !== false} imageSize={data.imageSize} />
//               ))}
//             </div>
//           )}
//         </div>
//       );

//     case "topStoriesGrid":
//       return (
//         <div className="px-4 py-4">
//           <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${isMobile ? 2 : (data.columns || 4)}, 1fr)` }}>
//             {resolveArticlesForBlock(data, data.limit || 4, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
//               <ArticleCard
//                 key={`${a.id}-${i}`} article={a}
//                 showImage={data.showImage !== false}
//                 showCategory={data.showCategory !== false}
//                 showDate compact
//                 cardWidth={data.cardWidth || 0}
//                 cardHeight={data.cardHeight || 0}
//                 titleFontSize={data.titleFontSize || 12}
//                 categoryFontSize={data.categoryFontSize || 9}
//                 metaFontSize={data.metaFontSize || 10}
//               />
//             ))}
//           </div>
//         </div>
//       );

//     case "categorySection": {
//       const moreHref = categoryHrefByName(data.category);
//       return (
//         <div className="px-4 py-5" style={{ backgroundColor: data.bg || "#fff" }}>
//           <div className="flex items-center gap-2 mb-4">
//             <h2 className="text-[14px] font-black uppercase tracking-widest" style={{ color: data.textColor || "#111" }}>{data.title || data.category}</h2>
//             <div className="flex-1 h-px" style={{ backgroundColor: data.textColor ? data.textColor + "30" : "#e5e7eb" }} />
//             {moreHref ? (
//               <Link href={moreHref} className="text-[13px] font-medium text-red-600 hover:underline">More →</Link>
//             ) : (
//               <span className="text-[13px] font-medium text-red-600/50">More →</span>
//             )}
//           </div>
//           {data.layout === "list" ? (
//             <div className="divide-y divide-gray-100">
//               {resolveArticlesForBlock(data, data.limit || 4, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
//                 <ArticleRow key={`${a.id}-${i}`} article={a} showImage={data.showImages !== false} showCategory={false} showDate showExcerpt={false} />
//               ))}
//             </div>
//           ) : data.layout === "carousel" ? (
//             <div className="flex gap-3 overflow-x-auto pb-2">
//               {resolveArticlesForBlock(data, data.limit || 5, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
//                 <div key={`${a.id}-${i}`} className="flex-none w-48">
//                   <ArticleCard article={a} showImage={data.showImages !== false} showCategory compact />
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
//               {resolveArticlesForBlock(data, data.limit || 6, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
//                 <ArticleCard key={`${a.id}-${i}`} article={a} showImage={data.showImages !== false} showCategory compact />
//               ))}
//             </div>
//           )}
//         </div>
//       );
//     }

//     case "featuredStoriesRow":
//       return (
//         <div className="px-4 py-5">
//           {data.title && (
//             <div className="flex items-center gap-2 mb-3">
//               <h2 className="text-[14px] font-black uppercase tracking-widest text-gray-900">{data.title}</h2>
//               <div className="flex-1 h-px bg-gray-200" />
//             </div>
//           )}
//           <div className="flex gap-3 overflow-x-auto">
//             {resolveArticlesForBlock(data, data.limit || 4, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
//               <div key={`${a.id}-${i}`} className="flex-none" style={{ width: isMobile ? 160 : 200 }}>
//                 {data.showImage !== false && (
//                   <div
//                     className="rounded-md mb-2 flex items-end p-2 relative overflow-hidden"
//                     style={{
//                       height: data.imageHeight || 120,
//                       background: `linear-gradient(135deg, ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]})`
//                     }}
//                   >
//                     <span className="text-[11px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded" style={{ backgroundColor: a.categoryColor, color: "#fff" }}>{a.category}</span>
//                   </div>
//                 )}
//                 <p className="text-[14px] font-semibold text-gray-900 leading-snug line-clamp-2">{a.title}</p>
//                 <p className="text-[12px] text-gray-400 mt-1">{a.date}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       );

//     case "opinion":
//       return (
//         <div className="px-4 py-5" style={{ backgroundColor: data.bg || "#f8f8f6" }}>
//           <div className="flex items-center gap-2 mb-3">
//             <span className="text-[12px] font-black uppercase tracking-widest text-gray-400">Opinion</span>
//             <div className="flex-1 h-px bg-gray-200" />
//           </div>
//           <div className="flex gap-4">
//             <div className="w-20 h-20 rounded-md bg-gradient-to-br from-gray-300 to-gray-400 flex-none" />
//             <div>
//               <p className="text-[17px] font-serif font-bold leading-snug text-gray-900 italic mb-2">"{data.title}"</p>
//               {data.author && <p className="text-[13px] text-gray-500 font-medium">— {data.author}</p>}
//             </div>
//           </div>
//         </div>
//       );

//     case "authorSpotlight":
//       return (
//         <div className="px-4 py-5">
//           {data.title && <h2 className="text-[14px] font-black uppercase tracking-widest text-gray-900 mb-3">{data.title}</h2>}
//           <div className="flex gap-4 overflow-x-auto">
//             {Array.from({ length: data.limit || 3 }).map((_, i) => (
//               <div key={i} className="flex flex-col items-center gap-2 flex-none">
//                 <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border-2 border-white shadow-md" />
//                 <div className="text-center">
//                   <div className="h-2 w-16 rounded bg-gray-200 mb-1" />
//                   <div className="h-1.5 w-12 rounded bg-gray-100" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       );

//     case "advertisement": {
//       const adInner = (
//         <div
//           className="border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 rounded-md mx-auto"
//           style={{ height: data.height || 90, width: data.width > 0 ? data.width : "100%", maxWidth: "100%" }}
//         >
//           {data.imageUrl ? (
//             <img src={data.imageUrl} alt={data.altText || "Advertisement"} className="w-full h-full object-cover rounded-md" />
//           ) : (
//             <>
//               <span className="text-[12px] font-bold uppercase tracking-widest mb-1">Advertisement</span>
//               <span className="text-[13px]">{data.size || "leaderboard"} · {data.height || 90}px</span>
//             </>
//           )}
//         </div>
//       );
//       return (
//         <div className="px-4 py-3">
//           {data.imageUrl && data.linkUrl ? (
//             <a href={data.linkUrl} target="_blank" rel="noopener noreferrer sponsored" className="block" style={{ width: data.width > 0 ? data.width : "100%", maxWidth: "100%", marginInline: "auto" }}>
//               {adInner}
//             </a>
//           ) : adInner}
//         </div>
//       );
//     }

//     case "newsletter":
//       if (data.enabled === false) return null;
//       return (
//         <div className="px-4 py-8 text-center" style={{ backgroundColor: data.bg || "#f5f5f0" }}>
//           <h3 className="text-[18px] font-bold mb-1" style={{ color: data.textColor || "#111" }}>{data.heading}</h3>
//           <p className="text-[15px] mb-4" style={{ color: (data.textColor || "#111") + "99" }}>{data.subheading}</p>
//           <div className="max-w-sm mx-auto">
//             <NewsletterForm
//               source="sidebar"
//               placeholder={data.placeholder || "Enter your email"}
//               buttonText={data.ctaLabel || "Subscribe"}
//               buttonBg={data.ctaBg || "#cc0000"}
//               buttonTextColor={data.ctaTextColor || "#fff"}
//             />
//           </div>
//         </div>
//       );

//     case "fullWidthBanner":
//       return (
//         <div
//           className="relative overflow-hidden flex flex-col items-start justify-center px-8"
//           style={{
//             height: isMobile ? Math.min(data.height || 320, 200) : (data.height || 320),
//             background: data.imageUrl ? `${data.overlayColor || "rgba(0,0,0,0.45)"}, url(${data.imageUrl}) center/cover no-repeat` : `linear-gradient(135deg, #1a1a2e, #8b1a1a)`,
//           }}
//         >
//           <h2 className="text-white font-bold mb-2" style={{ fontSize: isMobile ? 18 : 28 }}>{data.heading}</h2>
//           {data.subheading && <p className="text-white/75 mb-3 text-[15px]">{data.subheading}</p>}
//           {data.ctaLabel && (
//             <a href={data.ctaUrl} className="inline-block bg-white text-gray-900 text-[14px] font-bold px-4 py-2 rounded hover:bg-gray-100 transition-colors">{data.ctaLabel}</a>
//           )}
//         </div>
//       );

//     case "video":
//       return (
//         <div className="px-4 py-4">
//           <div className="relative rounded-md overflow-hidden bg-gray-900 flex items-center justify-center" style={{ height: isMobile ? 180 : 260 }}>
//             <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
//               <div className="h-0 w-0 border-y-[8px] border-y-transparent border-l-[14px] border-l-gray-900 ml-1" />
//             </div>
//             <p className="absolute bottom-3 left-4 text-white text-[14px] font-semibold">{data.title || "Featured video"}</p>
//             {data.caption && <p className="absolute bottom-8 left-4 text-white/60 text-[13px]">{data.caption}</p>}
//           </div>
//         </div>
//       );

//     case "customHtml":
//       if (data.enabled === false) return null;
//       return (
//         <div className="px-4 py-4">
//           {data.html && data.html !== "<!-- Add custom markup -->" ? (
//             <div className="text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: data.html }} />
//           ) : (
//             <div className="border-2 border-dashed border-gray-200 rounded-md p-6 text-center text-[14px] text-gray-400">Custom HTML block — no content added yet</div>
//           )}
//         </div>
//       );

//     case "newspaperEditorial":
//       return <NewspaperEditorialRenderer data={data} device={device} blockId={blockId} onUpdateBlock={onUpdateBlock} />;

//     case "modernMagazineLayout":
//       return <ModernMagazineRenderer data={data} device={device} blockId={blockId} onUpdateBlock={onUpdateBlock} />;

//     case "darkNewsLayout":
//       return <DarkNewsRenderer data={data} device={device} blockId={blockId} onUpdateBlock={onUpdateBlock} />;

//     case "masonryEditorialLayout":
//       return <MasonryEditorialRenderer data={data} device={device} blockId={blockId} onUpdateBlock={onUpdateBlock} />;

//     default:
//       return null;
//   }
// }

// const GRADIENT_COLORS = [
//   "#1a1a2e, #16213e",
//   "#1a2e1a, #163016",
//   "#2e1a1a, #301616",
//   "#1a1e2e, #161630",
//   "#2e2a1a, #302816",
// ];

// function gradientIndexFor(id) {
//   const key = String(id ?? "0");
//   let hash = 0;
//   for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
//   return hash % GRADIENT_COLORS.length;
// }

// function ArticleCard({ article, showImage, showCategory, showDate, showExcerpt, compact,
//   cardWidth = 0, cardHeight = 0, titleFontSize = 12, categoryFontSize = 9, metaFontSize = 10
// }) {
//   const cardStyle = {};
//   if (cardWidth > 0) cardStyle.width = cardWidth;
//   if (cardHeight > 0) { cardStyle.height = cardHeight; cardStyle.overflow = "hidden"; }
//   return (
//     <CardLink article={article} className="group block cursor-pointer" style={cardStyle}>
//       {showImage && (
//         <div
//           className="rounded-md mb-2 overflow-hidden relative bg-cover bg-center"
//           style={{
//             height: compact ? 80 : 120,
//             background: article.img
//               ? `url(${article.img}) center/cover no-repeat`
//               : `linear-gradient(135deg, ${GRADIENT_COLORS[gradientIndexFor(article.id)]})`,
//           }}
//         >
//           {showCategory && article.category && (
//             <span className="absolute bottom-1.5 left-1.5 font-bold uppercase px-1.5 py-0.5 rounded" style={{ fontSize: categoryFontSize, backgroundColor: article.categoryColor, color: "#fff" }}>{article.category}</span>
//           )}
//         </div>
//       )}
//       {showCategory && !showImage && article.category && (
//         <span className="font-bold uppercase tracking-wide mb-0.5 block" style={{ fontSize: categoryFontSize, color: article.categoryColor }}>{article.category}</span>
//       )}
//       <p className="font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors" style={{ fontSize: titleFontSize }}>{article.title}</p>
//       {showDate && <p className="text-gray-400 mt-1" style={{ fontSize: metaFontSize }}>{article.date}</p>}
//     </CardLink>
//   );
// }

// function ArticleRow({ article, showImage, showCategory, showDate, showExcerpt, imageSize }) {
//   const imgWidth = imageSize === "large" ? 120 : imageSize === "small" ? 60 : 90;
//   const imgHeight = imageSize === "large" ? 80 : imageSize === "small" ? 50 : 64;
//   return (
//     <CardLink article={article} className="flex gap-3 py-3 group cursor-pointer">
//       {showImage && (
//         <div
//           className="flex-none rounded-md overflow-hidden"
//           style={{
//             width: imgWidth,
//             height: imgHeight,
//             background: article.img
//               ? `url(${article.img}) center/cover no-repeat`
//               : `linear-gradient(135deg, ${GRADIENT_COLORS[gradientIndexFor(article.id)]})`,
//           }}
//         />
//       )}
//       <div className="flex-1 min-w-0">
//         {showCategory && article.category && (
//           <span className="text-[11px] font-bold uppercase tracking-wide mb-0.5 block" style={{ color: article.categoryColor }}>{article.category}</span>
//         )}
//         <p className="text-[14px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{article.title}</p>
//         {showExcerpt && article.excerpt && <p className="text-[13px] text-gray-500 mt-0.5 line-clamp-2 leading-snug">{article.excerpt}</p>}
//         {showDate && <p className="text-[12px] text-gray-400 mt-1">{article.date}</p>}
//       </div>
//     </CardLink>
//   );
// }

// function ThreeColumnDesktop({ data }) {
//   return (
//     <div className="grid grid-cols-[200px_1fr_220px] gap-0 divide-x divide-gray-100">
//       {/* Left: Most Read */}
//       <div className="px-4 py-5">
//         <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-1.5">
//           <span className="h-2 w-2 rounded-full bg-primary-500 inline-block" />
//           {data.leftTitle || "Most Read"}
//         </h3>
//         <ol className="space-y-3">
//           {(data.leftItems || []).map((item, i) => (
//             <li key={item.id || i} className="flex gap-2 group cursor-pointer">
//               {data.leftShowNumbers && <span className="text-[13px] font-black text-primary-500/60 shrink-0 w-4 mt-0.5">{i + 1}</span>}
//               <span className="text-[14px] font-semibold text-gray-800 leading-snug group-hover:text-primary-600 transition-colors">{item.label}</span>
//             </li>
//           ))}
//         </ol>
//       </div>

//       {/* Center: Latest News */}
//       <div className="px-5 py-5">
//         <div className="flex items-center gap-2 mb-4">
//           <h2 className="text-[14px] font-black uppercase tracking-widest text-gray-900">{data.centerTitle || "Latest News"}</h2>
//           {data.centerCategory && data.centerCategory !== "All" && (
//             <span className="text-[12px] font-medium bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded">{data.centerCategory}</span>
//           )}
//           <div className="flex-1 h-px bg-gray-200" />
//         </div>
//         {data.centerLayout === "grid" ? (
//           <div className="grid grid-cols-2 gap-3">
//             {resolveArticlesForBlock(data, data.centerLimit || 5, { idsKey: "centerArticleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
//               <ArticleCard key={`${a.id}-${i}`} article={a} showImage showCategory showDate compact />
//             ))}
//           </div>
//         ) : (
//           <div className="divide-y divide-gray-100">
//             {resolveArticlesForBlock(data, data.centerLimit || 5, { idsKey: "centerArticleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
//               <ArticleRow key={`${a.id}-${i}`} article={a} showImage showCategory showDate showExcerpt={false} />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Right: In Brief */}
//       <div className="px-4 py-5 space-y-4">
//         <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-500">{data.rightTitle || "In Brief"}</h3>
//         <div className="space-y-2">
//           {["Macron calls for 'new chapter' in EU defence cooperation", "Apple unveils major iOS update at WWDC", "Oil prices steady ahead of OPEC meeting", "Tesla reports record Q2 deliveries"].map((s, i) => (
//             <div key={i} className="flex gap-2">
//               <span className="h-1.5 w-1.5 rounded-full bg-gray-400 shrink-0 mt-1.5" />
//               <div>
//                 <p className="text-[13px] text-gray-700 leading-snug">{s}</p>
//                 <p className="text-[11px] text-gray-400 mt-0.5">{i + 2}h ago</p>
//               </div>
//             </div>
//           ))}
//         </div>
//         {data.rightShowNewsletter && (
//           <div className="rounded-lg border border-primary-100 bg-primary-50 p-3">
//             <p className="text-[14px] font-bold text-gray-900 mb-1">{data.rightNewsletterHeading || "Stay ahead of the story"}</p>
//             <NewsletterForm
//               source="sidebar"
//               layout="stack"
//               size="sm"
//               placeholder="Your email"
//               buttonText="Subscribe"
//               buttonBg="#2563eb"
//             />
//           </div>
//         )}
//         {data.rightShowAd && (() => {
//           const rH = data.rightAdHeight > 0 ? data.rightAdHeight : (data.rightAdSize === "square" ? 180 : 250);
//           const rW = data.rightAdWidth > 0 ? data.rightAdWidth : "100%";
//           const adBody = data.rightAdImage ? (
//             <img src={data.rightAdImage} alt="Advertisement" className="w-full object-cover rounded-md" style={{ height: rH }} />
//           ) : (
//             <div className="border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center text-[12px] text-gray-400 font-medium uppercase" style={{ height: rH }}>
//               Ad — {data.rightAdSize || "sidebar"}
//             </div>
//           );
//           return (
//             <div style={{ width: rW, maxWidth: "100%", marginInline: "auto" }}>
//               {data.rightAdImage && data.rightAdLinkUrl ? (
//                 <a href={data.rightAdLinkUrl} target="_blank" rel="noopener noreferrer sponsored" className="block">{adBody}</a>
//               ) : adBody}
//             </div>
//           );
//         })()}
//       </div>
//     </div>
//   );
// }

// function ThreeColumnMobile({ data }) {
//   return (
//     <div>
//       {/* Most Read on mobile */}
//       <div className="px-4 py-4 border-b border-gray-100">
//         <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-500 mb-3">{data.leftTitle || "Most Read"}</h3>
//         <ol className="space-y-2">
//           {(data.leftItems || []).slice(0, 3).map((item, i) => (
//             <li key={item.id || i} className="flex gap-2">
//               {data.leftShowNumbers && <span className="text-[13px] font-black text-primary-500/60 shrink-0 w-4">{i + 1}</span>}
//               <span className="text-[14px] font-semibold text-gray-800 leading-snug">{item.label}</span>
//             </li>
//           ))}
//         </ol>
//       </div>
//       {/* Latest News */}
//       <div className="px-4 py-4">
//         <h2 className="text-[13px] font-black uppercase tracking-widest text-gray-900 mb-3">{data.centerTitle || "Latest News"}</h2>
//         <div className="divide-y divide-gray-100">
//           {resolveArticlesForBlock(data, Math.min(data.centerLimit || 5, 4), { idsKey: "centerArticleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
//             <ArticleRow key={`${a.id}-${i}`} article={a} showImage showCategory showDate showExcerpt={false} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Sample data for editorial layout ────────────────────────────────────────
// const EDITORIAL_ARTICLES = [
//   { id: 1, category: "ARTS • CULTURE", categoryColor: "#7c3aed", title: "Artist & Teacher in Classical Voice joins staff as lead contributor", excerpt: "A rare appointment signals a commitment to cultural depth across the editorial board.", author: "James Whitmore", date: "January 8, 2026", img: null },
//   { id: 2, category: "OPINION", categoryColor: "#6b7280", title: "The new geography of influence: Why soft power is being redrawn", excerpt: "Traditional alliances are shifting as middle powers assert themselves with new boldness.", author: "Maya Chen", date: "January 8, 2026", img: null },
//   { id: 3, category: "POLITICS", categoryColor: "#dc2626", title: "A state comptroller reservation bill heads to the governor's desk", excerpt: "Activists from full-day sit-ins at the state capitol as tension rises over fiscal oversight.", author: "Marcus Reid", date: "January 8, 2026", img: null },
//   { id: 4, category: "BUSINESS", categoryColor: "#2563eb", title: "Global economic growth forecasts slashed, Asia blue struggles with high inflation", excerpt: "The IMF issues a revised outlook citing persistent supply chain fragility.", author: "Anna Cole", date: "January 8, 2026", img: null },
//   { id: 5, category: "WHITE HOUSE • LIVE", categoryColor: "#dc2626", title: "Live updates from The White House: diplomatic tensions mount", excerpt: "Senior officials confirm back-channel talks with three European counterparts are ongoing.", author: "James Whitmore", date: "January 8, 2026", img: null },
//   { id: 6, category: "ECONOMY", categoryColor: "#d97706", title: "It's Never Been More Expensive to Visit New York City", excerpt: "The average nightly rate in Manhattan has crossed $400 for the first time, pricing out middle-income travellers entirely.", author: "Anna Cole", date: "January 8, 2026", img: null },
//   { id: 7, category: "HEALTH", categoryColor: "#059669", title: "How Sarah Coped With Her Chronic Disease — and Found Clarity", excerpt: "She found new strength in unexpected places, discovering how mindset shapes recovery.", author: "Mark Wells", date: "January 8, 2026", img: null },
//   { id: 8, category: "ECONOMY", categoryColor: "#d97706", title: "It's Never Been More Expensive to Visit New York City this winter season", excerpt: "Visitor numbers remain robust even as costs spiral — but analysts warn the city may be pricing itself out of the mid-market travel segment permanently.", author: "James Thornton", date: "January 8, 2026", img: null },
//   { id: 9, category: "FREE SPEECH • LAW", categoryColor: "#7c3aed", title: "Climate protest crackdown shows how wrong the ruling party is about free speech", excerpt: "Heavy-handed policing of environmental demonstrations has reignited a fierce constitutional debate that shows no sign of abating.", author: "Anna Leclerc", date: "January 8, 2026", img: null },
//   { id: 10, category: "ARTS • CULTURE", categoryColor: "#7c3aed", title: "The new classicism: how ancient forms are reshaping modern galleries", excerpt: "From Athens to New York, curators are rediscovering the power of pre-modern aesthetics.", author: "Marcus Reid", date: "January 8, 2026", img: null },
//   { id: 11, category: "FINANCE", categoryColor: "#2563eb", title: "Extra £2.50 for half a prawn? The surcharge economy has fully arrived", excerpt: "From service charges to optional gratuities at self-checkouts, Britain's hospitality industry is quietly rewriting the bill.", author: "Marcus Reid", date: "January 8, 2026", img: null },
//   { id: 12, category: "BUSINESS", categoryColor: "#2563eb", title: "US aerospace operations revamp face unexpected turbulence", excerpt: "Budget reallocations and supply delays are reshaping the sector.", author: "Claire Fontaine", date: "January 8, 2026", img: null },
//   { id: 13, category: "BUSINESS", categoryColor: "#2563eb", title: "Did You Know You Can Unsend and Edit Text Messages on Your iPhone", excerpt: "A feature many users still don't know about is changing how they communicate.", author: "Neil Harrison", date: "January 8, 2026", img: null },
//   { id: 14, category: "BUSINESS", categoryColor: "#2563eb", title: "Live updates from The White House after defense bill passes Senate", excerpt: "Congressional approval sets the stage for major restructuring of military priorities.", author: "Mateo Vargas", date: "January 8, 2026", img: null },
//   { id: 15, category: "BUSINESS", categoryColor: "#2563eb", title: "Guard Dog Protects Sheep From Prowling Puma in First Of Its Kind Footage", excerpt: "Wildlife conservationists are calling the video a landmark moment in livestock protection.", author: "Isabella Crane", date: "January 8, 2026", img: null },
// ];

// const GRADIENT_COLORS_EDITORIAL = [
//   "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
//   "linear-gradient(135deg, #1a2e1a 0%, #163016 100%)",
//   "linear-gradient(135deg, #2e1a1a 0%, #301616 100%)",
//   "linear-gradient(135deg, #1a1e2e 0%, #161630 100%)",
//   "linear-gradient(135deg, #2e2a1a 0%, #302816 100%)",
// ];

// function NewspaperEditorialRenderer({ data, device, blockId, onUpdateBlock }) {
//   const isMobile = device === "mobile";
//   const isTablet = device === "tablet";
//   const topStoriesCount = data.topStoriesCount || 4;
//   // Single tracker shared by every section on this template (top stories,
//   // left sidebar, hero, category sections, right sidebar) so the page
//   // prefers unused articles everywhere, and — only once real articles run
//   // short — reuses whichever article has been shown the fewest times
//   // instead of the same one or two stories repeating in every widget.
//   const tracker = createArticleUsageTracker();
//   const topStoriesArticles = resolveArticlesForBlock(data, topStoriesCount, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES, usageCounts: tracker.counts() });
//   tracker.track(topStoriesArticles);

//   function pinTopStory(index, articleId) {
//     if (!onUpdateBlock) return;
//     onUpdateBlock(blockId, pinArticleAtIndex(data, "articleIds", index, articleId, topStoriesCount));
//   }
//   function clearTopStory(index) {
//     if (!onUpdateBlock) return;
//     onUpdateBlock(blockId, clearArticlePin(data, "articleIds", index, topStoriesCount));
//   }

//   return (
//     <div style={{ backgroundColor: data.bg || "#ffffff" }}>
//       {/* ── Top Stories Grid ── */}
//       {data.showTopStories !== false && (
//         <div className="px-4 pt-5 pb-4">
//           <div className="flex items-center gap-3 mb-4">
//             <h2 className="text-[13px] font-black uppercase tracking-widest text-gray-900">{data.topStoriesTitle || "FEATURED STORIES"}</h2>
//             <div className="flex-1 h-px bg-gray-200" />
//           </div>
//           <div
//             className="grid gap-4"
//             style={{ gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : `repeat(${topStoriesCount}, 1fr)` }}
//           >
//             {Array.from({ length: topStoriesCount }).map((_, i) => {
//               const a = topStoriesArticles[i];
//               const cardW = data.topStoriesCardWidth || 0;
//               const cardH = data.topStoriesCardHeight || 0;
//               const titleSz = data.topStoriesTitleSize || 12;
//               const catSz = data.topStoriesCategorySize || 9;
//               const cardStyle = {};
//               if (cardW > 0) cardStyle.width = cardW;
//               if (cardH > 0) { cardStyle.height = cardH; cardStyle.overflow = "hidden"; }
//               const isPinned = Array.isArray(data.articleIds) && !!data.articleIds[i];
//               return (
//                 <EditableArticleSlot
//                   key={a?.id ?? `empty-${i}`}
//                   article={a}
//                   pinned={isPinned}
//                   editable={!!onUpdateBlock}
//                   onPick={(articleId) => pinTopStory(i, articleId)}
//                   onClear={() => clearTopStory(i)}
//                   currentArticleId={isPinned ? (data.articleIds || [])[i] : null}
//                 >
//                   <div className="group cursor-pointer" style={cardStyle}>
//                     <CoverImage
//                       src={a?.img}
//                       gradient={GRADIENT_COLORS_EDITORIAL[i % GRADIENT_COLORS_EDITORIAL.length]}
//                       className="rounded-sm mb-2 relative overflow-hidden"
//                       style={{ aspectRatio: data.topStoriesImageRatio || "4/3" }}
//                     />
//                     {a ? (
//                       <>
//                         <span className="font-bold uppercase tracking-wide block mb-0.5" style={{ fontSize: catSz, color: a.categoryColor || data.topStoriesCategoryColor }}>{a.category}</span>
//                         <p className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors" style={{ fontSize: titleSz }}>{a.title}</p>
//                         <p className="text-gray-500 mt-1 line-clamp-2 leading-snug" style={{ fontSize: Math.max(titleSz - 1, 9) }}>{a.excerpt}</p>
//                       </>
//                     ) : (
//                       <p className="text-gray-400 leading-snug" style={{ fontSize: titleSz }}>No article yet — click + to choose one</p>
//                     )}
//                   </div>
//                 </EditableArticleSlot>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* ── Three-Column Editorial ── */}
//       {isMobile ? (
//         <EditorialMobile data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
//       ) : isTablet ? (
//         <EditorialTablet data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
//       ) : (
//         <EditorialDesktop data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
//       )}
//     </div>
//   );
// }

// /**
//  * Wraps a single article card so the admin can hover it in the live preview
//  * and click "+" to pin a real article (created on the Articles page) to that
//  * exact card, or "×" to release the pin back to auto/latest. Renders children
//  * untouched when `editable` is false (e.g. legacy modal preview with no
//  * onUpdateBlock handler wired up).
//  */
// function EditableArticleSlot({ children, article, pinned, editable, onPick, onClear, className = "", style, excludeIds = [], currentArticleId = null }) {
//   const [open, setOpen] = useState(false);

//   // Public-facing (non-admin) rendering: make the whole card a real link to
//   // the article's detail page instead of an inert, non-clickable div. Falls
//   // back to a plain wrapper (no link) when there's no resolvable article yet
//   // (e.g. empty slot or sample/placeholder content with no real slug).
//   if (!editable) {
//     const href = article ? articleHref(article) : null;
//     const wrapClass = className ? `${className} block` : "block";
//     if (href) {
//       return (
//         <Link href={href} className={wrapClass} style={style}>
//           {children}
//         </Link>
//       );
//     }
//     return (
//       <div className={wrapClass} style={style}>
//         {children}
//       </div>
//     );
//   }

//   return (
//     <div className={`relative group ${className}`} style={style}>
//       {children}
//       <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
//         <button
//           type="button"
//           title={pinned ? "Change article" : "Choose article"}
//           onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
//           className="h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors shadow"
//         >
//           <Plus size={13} />
//         </button>
//         {pinned && (
//           <button
//             type="button"
//             title="Reset to latest"
//             onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClear(); }}
//             className="h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors shadow"
//           >
//             <X size={12} />
//           </button>
//         )}
//       </div>
//       {open && (
//         <ArticlePickerModal
//           mode="single"
//           excludeIds={excludeIds}
//           initialSelectedIds={currentArticleId ? [currentArticleId] : []}
//           onClose={() => setOpen(false)}
//           onConfirm={(ids) => { onPick(ids[0]); setOpen(false); }}
//         />
//       )}
//     </div>
//   );
// }

// /**
//  * Generic helper that wires up "pin this card to a specific article" controls
//  * for any list of cards in any template. `idsKey` is the field on the block's
//  * data object that stores the per-card pin array (kept separate per section
//  * so pinning a card in one section never disturbs another section).
//  */
// function makePinHelpers(data, idsKey, count, blockId, onUpdateBlock) {
//   return {
//     isPinned: (i) => Array.isArray(data?.[idsKey]) && !!data[idsKey][i],
//     pin: (i, articleId) => {
//       if (!onUpdateBlock) return;
//       onUpdateBlock(blockId, pinArticleAtIndex(data, idsKey, i, articleId, count));
//     },
//     clear: (i) => {
//       if (!onUpdateBlock) return;
//       onUpdateBlock(blockId, clearArticlePin(data, idsKey, i, count));
//     },
//   };
// }

// /** Same idea as makePinHelpers but for a single-article slot (e.g. a hero). */
// function makeSinglePinHelpers(idKey, blockId, onUpdateBlock) {
//   return {
//     pin: (articleId) => {
//       if (!onUpdateBlock) return;
//       onUpdateBlock(blockId, { [idKey]: articleId });
//     },
//     clear: () => {
//       if (!onUpdateBlock) return;
//       onUpdateBlock(blockId, { [idKey]: null });
//     },
//   };
// }

// function EditorialDesktop({ data, blockId, onUpdateBlock, tracker }) {
//   const gap = data.columnGap || 24;

//   return (
//     <div
//       className="mx-auto px-4 pb-8"
//       style={{ maxWidth: data.maxWidth || 1600 }}
//     >
//       {/*
//         CSS sticky sidebar:
//         - Outer container: display flex, align-items start
//         - Left sidebar wrapper: position sticky, top 20px
//         - This means sidebar sticks until its parent (the flex row) ends
//       */}
//       <div className="flex items-start" style={{ gap }}>

//         {/* ── LEFT SIDEBAR (25%) ── sticky via CSS */}
//         <div
//           className="shrink-0"
//           style={{ width: "25%", position: "sticky", top: 20, alignSelf: "flex-start" }}
//         >
//           <div className="divide-y divide-gray-100">
//             {(data.leftBlocks || []).filter(b => b.visible !== false).map((block, idx) => (
//               <LeftSidebarBlock key={block.id} block={block} idx={idx} data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
//             ))}
//           </div>
//         </div>

//         {/* ── CENTER COLUMN (50%) ── */}
//         <div className="flex-1 min-w-0 border-x border-gray-100" style={{ paddingLeft: gap, paddingRight: gap }}>
//           <EditorialCenter data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
//         </div>

//         {/* ── RIGHT SIDEBAR (25%) ── */}
//         <div
//           className="shrink-0"
//           style={{ width: "25%", position: "sticky", top: 20, alignSelf: "flex-start" }}
//         >
//           <RightSidebar data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
//         </div>
//       </div>
//     </div>
//   );
// }

// function EditorialTablet({ data, blockId, onUpdateBlock, tracker }) {
//   return (
//     <div className="px-4 pb-8">
//       <EditorialCenter data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
//       <div className="mt-6 grid grid-cols-2 gap-4">
//         <div className="divide-y divide-gray-100">
//           {(data.leftBlocks || []).filter(b => b.visible !== false).slice(0, 4).map((block, idx) => (
//             <LeftSidebarBlock key={block.id} block={block} idx={idx} data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
//           ))}
//         </div>
//         <RightSidebar data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
//       </div>
//     </div>
//   );
// }

// function EditorialMobile({ data, blockId, onUpdateBlock, tracker }) {
//   return (
//     <div className="px-4 pb-8">
//       <EditorialCenter data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
//       <div className="mt-4 divide-y divide-gray-100">
//         {(data.leftBlocks || []).filter(b => b.visible !== false).slice(0, 3).map((block, idx) => (
//           <LeftSidebarBlock key={block.id} block={block} idx={idx} data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
//         ))}
//       </div>
//       <div className="mt-6">
//         <RightSidebar data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
//       </div>
//     </div>
//   );
// }

// function LeftSidebarBlock({ block, idx, data, blockId, onUpdateBlock, tracker }) {
//   const editable = !!onUpdateBlock;
//   const idKey = `leftBlock_${block.id}_articleId`;
//   const isPinned = !!data?.[idKey];
//   const pinnedArticle = isPinned ? resolveSingleArticle(data, { idKey, sampleFallback: null }) : null;
//   // Snapshot of everything already used elsewhere on the page *before* this
//   // card claims its own article — used both to pick this card's auto-fill
//   // and to hide those same articles from this card's "+" picker modal.
//   const usedSoFar = tracker ? tracker.exclude() : [];
//   // Not pinned -> auto-fill the next unused real article (newest first),
//   // excluding every article already shown elsewhere on this page. Only when
//   // there are no real articles at all does this fall back to static sample
//   // copy, so the builder/homepage never looks broken on a brand-new site.
//   const autoArticle = !pinnedArticle
//     ? (resolveArticlesForBlock(data, 1, { idsKey: `__leftAuto_${block.id}`, excludeIds: usedSoFar, sampleFallback: [], usageCounts: tracker ? tracker.counts() : null })[0] || null)
//     : null;
//   const article = pinnedArticle || autoArticle;
//   if (article && tracker) tracker.track(article);
//   const fallbackArticle = EDITORIAL_ARTICLES[idx % EDITORIAL_ARTICLES.length];
//   const bgSourceArticle = article || fallbackArticle;
//   const bgGradient = GRADIENT_COLORS_EDITORIAL[idx % GRADIENT_COLORS_EDITORIAL.length];
//   const helpers = makeSinglePinHelpers(idKey, blockId, onUpdateBlock);
//   const headlineSz = block.headlineFontSize || 12;
//   const catSz = block.categoryFontSize || 9;
//   const descSz = block.descFontSize || 11;
//   const cardW = block.cardWidth || 0;
//   const cardH = block.cardHeight || 0;
//   const cardStyle = {};
//   if (cardW > 0) cardStyle.width = cardW;
//   if (cardH > 0) { cardStyle.height = cardH; cardStyle.overflow = "hidden"; }

//   if (block.type === "opinionCard") {
//     return (
//       <div className="py-4" style={cardStyle}>
//         <div className="bg-gray-900 rounded p-3 mb-2">
//           {block.label2 && <span className="font-bold uppercase tracking-widest text-gray-400 block mb-1" style={{ fontSize: catSz }}>{block.label2}</span>}
//           <p className="text-white font-semibold leading-snug italic" style={{ fontSize: headlineSz }}>{article ? article.title : block.headline}</p>
//           {block.showAuthor && <p className="text-gray-400 mt-2" style={{ fontSize: descSz }}>{article ? article.author || block.author : block.author}</p>}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <EditableArticleSlot article={article} pinned={isPinned} editable={editable} onPick={helpers.pin} onClear={helpers.clear} excludeIds={usedSoFar} currentArticleId={data?.[idKey] || null} className="block">
//       <div className="py-4" style={cardStyle}>
//         {block.showImage && (
//           <CoverImage
//             src={bgSourceArticle?.img}
//             gradient={bgGradient}
//             className="rounded-sm mb-2 relative overflow-hidden"
//             style={{ aspectRatio: "16/9" }}
//           />
//         )}
//         <span className="font-bold uppercase tracking-wide block mb-1" style={{ fontSize: catSz, color: block.categoryColor || "#dc2626" }}>
//           {article ? article.category : block.category}
//         </span>
//         <p className="font-bold text-gray-900 leading-snug mb-1 cursor-pointer hover:text-red-600 transition-colors" style={{ fontSize: headlineSz }}>
//           {article ? article.title : block.headline}
//         </p>
//         {block.showDesc && (article ? article.excerpt : block.description) && (
//           <p className="text-gray-500 leading-snug mb-1" style={{ fontSize: descSz }}>{article ? article.excerpt : block.description}</p>
//         )}
//         {(block.showAuthor || block.showDate) && (
//           <p className="text-gray-400" style={{ fontSize: Math.max(descSz - 1, 9) }}>
//             {block.showAuthor && `By ${article ? (article.author || block.author) : block.author}`}{block.showAuthor && block.showDate && ` • `}{block.showDate && (article ? article.date : block.date)}
//           </p>
//         )}
//       </div>
//     </EditableArticleSlot>
//   );
// }

// function EditorialCenter({ data, blockId, onUpdateBlock, tracker }) {
//   const heroHeadlineSz = data.heroHeadlineSize || 22;
//   const heroSummarySz = data.heroSummarySize || 13;
//   const heroCatSz = data.heroCategorySize || 10;
//   const editable = !!onUpdateBlock;
//   const heroPinned = !!data.heroArticleId;
//   const heroExclude = tracker ? tracker.exclude() : [];
//   // Not pinned -> auto-fill via resolveSingleArticle so the "client news"
//   // rule applies here too (the newest article tagged newsType === "client
//   // news" always leads the homepage when nothing is explicitly pinned),
//   // excluding whatever the top-stories grid / left sidebar already used.
//   const heroArticle = resolveSingleArticle(data, { idKey: "heroArticleId", sampleFallback: null, excludeIds: heroExclude, usageCounts: tracker ? tracker.counts() : null });
//   if (heroArticle && tracker) tracker.track(heroArticle);
//   const heroAuthorHref = heroArticle ? authorHref(heroArticle.authorSlug) : null;
//   const heroHelpers = makeSinglePinHelpers("heroArticleId", blockId, onUpdateBlock);
//   return (
//     <div>
//       {/* Hero story */}
//       <EditableArticleSlot article={heroArticle} pinned={heroPinned} editable={editable} onPick={heroHelpers.pin} onClear={heroHelpers.clear} excludeIds={heroExclude} currentArticleId={data.heroArticleId} className="block">
//       <div className="pb-5 border-b border-gray-200 mb-5">
//         <div className="font-bold uppercase tracking-widest text-gray-500 mb-2" style={{ fontSize: heroCatSz }}>
//           {(heroArticle ? heroArticle.category : data.heroCategory) || "WORLD • POLITICS"} · <span className="text-gray-400">{(heroArticle ? heroArticle.date : data.heroDate) || "JANUARY 8, 2026"}</span>
//         </div>
//         <h1 className="font-black text-gray-900 leading-tight mb-4" style={{ fontFamily: "Georgia, serif", fontSize: heroHeadlineSz }}>
//           {(heroArticle ? heroArticle.title : data.heroHeadline) || "Live updates from The White House: A new chapter in transatlantic diplomacy"}
//         </h1>
//         {/* Hero image */}
//         <CoverImage
//           src={heroArticle?.img}
//           gradient={GRADIENT_COLORS_EDITORIAL[0]}
//           className="rounded-sm mb-3 overflow-hidden"
//           style={{ aspectRatio: "16/9" }}
//         />
//         <p className="text-gray-600 leading-relaxed mb-3" style={{ fontSize: heroSummarySz }}>{heroArticle ? heroArticle.excerpt : data.heroSummary}</p>
//         <div className="flex items-center gap-2">
//           <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-[11px] font-bold text-gray-600">
//             {((heroArticle ? heroArticle.author : data.heroAuthor) || "JW")[0]}
//           </div>
//           <div>
//             <span className="text-[13px] font-semibold text-gray-700">
//               By {heroAuthorHref && !editable ? (
//                 <Link href={heroAuthorHref} className="hover:text-red-600 transition-colors">{heroArticle.author || data.heroAuthor || "James Whitmore"}</Link>
//               ) : (
//                 (heroArticle ? heroArticle.author : data.heroAuthor) || "James Whitmore"
//               )}
//             </span>
//             {(heroArticle ? heroArticle.authorRole : data.heroAuthorRole) && (
//               <span className="text-[12px] text-gray-400"> · {heroArticle ? heroArticle.authorRole : data.heroAuthorRole}</span>
//             )}
//           </div>
//         </div>
//       </div>
//       </EditableArticleSlot>

//       {/* Category sections */}
//       {(data.centerSections || []).map((section, sIdx) => {
//         const sectionIdsKey = `centerSection_${section.id}_ids`;
//         const sectionHelpers = makePinHelpers(data, sectionIdsKey, section.stories || 2, blockId, onUpdateBlock);
//         const sectionExclude = tracker ? tracker.exclude() : [];
//         // Only real articles that actually belong to this section's
//         // category (e.g. "ECONOMY") are shown — never topped up with
//         // articles from other categories, and never a repeat of an
//         // article already shown elsewhere on the page. If the category is
//         // short on articles, this section simply renders fewer cards.
//         const sectionArticles = resolveArticlesByCategoryName(section.category, section.stories || 2, { data, idsKey: sectionIdsKey, excludeIds: sectionExclude, sampleFallback: EDITORIAL_ARTICLES.slice(sIdx * 2, sIdx * 2 + (section.stories || 2)), categoryId: section.categoryId || null, usageCounts: tracker ? tracker.counts() : null });
//         if (tracker) tracker.track(sectionArticles);
//         const sectionHref = categoryHrefByName(section.category);
//         return (
//           <div key={section.id} className="mb-6 pb-6 border-b border-gray-100 last:border-0">
//             <div className="flex items-center gap-2 mb-3">
//               <div className="w-1 h-4 rounded-full shrink-0" style={{ backgroundColor: section.color }} />
//               <h2 className="text-[13px] font-black uppercase tracking-widest" style={{ color: section.color }}>{section.category}</h2>
//               <div className="flex-1 h-px bg-gray-100" />
//               {sectionHref ? (
//                 <Link href={sectionHref} className="text-[12px] text-gray-400 font-medium hover:text-red-600 transition-colors cursor-pointer">More →</Link>
//               ) : (
//                 <span className="text-[12px] text-gray-400 font-medium hover:text-red-600 transition-colors cursor-pointer">More →</span>
//               )}
//             </div>

//             {(() => {
//               const tSz = section.titleFontSize || 11;
//               const dSz = section.descFontSize || 10;
//               const cSz = 8;
//               const cW = section.cardWidth || 0;
//               const cH = section.cardHeight || 0;
//               const cStyle = {};
//               if (cW > 0) cStyle.width = cW;
//               if (cH > 0) { cStyle.height = cH; cStyle.overflow = "hidden"; }
//               if (section.imagePosition === "top") return (
//                 <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(section.stories || 2, 3)}, 1fr)` }}>
//                   {sectionArticles.map((a, i) => (
//                     <EditableArticleSlot article={a} key={`${a.id}-${i}`} pinned={sectionHelpers.isPinned(i)} editable={!!onUpdateBlock} onPick={(id) => sectionHelpers.pin(i, id)} onClear={() => sectionHelpers.clear(i)} excludeIds={sectionExclude} currentArticleId={(data[sectionIdsKey] || [])[i]}>
//                       <div className="group cursor-pointer" style={cStyle}>
//                         <CoverImage src={a.img} gradient={GRADIENT_COLORS_EDITORIAL[(sIdx + i) % GRADIENT_COLORS_EDITORIAL.length]} className="rounded-sm mb-2 overflow-hidden" style={{ aspectRatio: "16/9" }} />
//                         <span className="font-bold uppercase tracking-wide block mb-0.5" style={{ fontSize: cSz, color: a.categoryColor }}>{a.category}</span>
//                         <p className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors" style={{ fontSize: tSz }}>{a.title}</p>
//                         {section.showDesc && <p className="text-gray-500 mt-0.5 line-clamp-2" style={{ fontSize: dSz }}>{a.excerpt}</p>}
//                         {section.showDate && (
//                           <p className="text-gray-400 mt-1" style={{ fontSize: Math.max(dSz - 1, 8) }}>{a.date}</p>
//                         )}
//                       </div>
//                     </EditableArticleSlot>
//                   ))}
//                 </div>
//               );
//               if (section.imagePosition === "left") return (
//                 <div className="space-y-4">
//                   {sectionArticles.map((a, i) => (
//                     <EditableArticleSlot article={a} key={`${a.id}-${i}`} className="block" pinned={sectionHelpers.isPinned(i)} editable={!!onUpdateBlock} onPick={(id) => sectionHelpers.pin(i, id)} onClear={() => sectionHelpers.clear(i)} excludeIds={sectionExclude} currentArticleId={(data[sectionIdsKey] || [])[i]}>
//                       <div className="flex gap-3 group cursor-pointer" style={cStyle}>
//                         <CoverImage src={a.img} gradient={GRADIENT_COLORS_EDITORIAL[(sIdx + i) % GRADIENT_COLORS_EDITORIAL.length]} className="rounded-sm shrink-0 overflow-hidden" style={{ width: 100, height: 70 }} />
//                         <div className="flex-1 min-w-0">
//                           <span className="font-bold uppercase tracking-wide block mb-0.5" style={{ fontSize: cSz, color: section.color }}>{a.category}</span>
//                           <p className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors" style={{ fontSize: tSz }}>{a.title}</p>
//                           {section.showDesc && <p className="text-gray-500 mt-0.5 line-clamp-2" style={{ fontSize: dSz }}>{a.excerpt}</p>}
//                           {section.showDate && (
//                             <p className="text-gray-400 mt-1" style={{ fontSize: Math.max(dSz - 1, 8) }}>{a.date}</p>
//                           )}
//                         </div>
//                       </div>
//                     </EditableArticleSlot>
//                   ))}
//                 </div>
//               );
//               return (
//                 <div className="divide-y divide-gray-100">
//                   {sectionArticles.map((a, i) => (
//                     <EditableArticleSlot article={a} key={`${a.id}-${i}`} className="block" pinned={sectionHelpers.isPinned(i)} editable={!!onUpdateBlock} onPick={(id) => sectionHelpers.pin(i, id)} onClear={() => sectionHelpers.clear(i)} excludeIds={sectionExclude} currentArticleId={(data[sectionIdsKey] || [])[i]}>
//                       <div className="py-3 group cursor-pointer" style={cStyle}>
//                         <span className="font-bold uppercase tracking-wide block mb-0.5" style={{ fontSize: cSz, color: section.color }}>{a.category}</span>
//                         <p className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors" style={{ fontSize: tSz }}>{a.title}</p>
//                         {section.showDesc && <p className="text-gray-500 mt-0.5 line-clamp-2" style={{ fontSize: dSz }}>{a.excerpt}</p>}
//                         {section.showDate && (
//                           <p className="text-gray-400 mt-1" style={{ fontSize: Math.max(dSz - 1, 8) }}>{a.date}</p>
//                         )}
//                       </div>
//                     </EditableArticleSlot>
//                   ))}
//                 </div>
//               );
//             })()}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// function RightSidebar({ data, blockId, onUpdateBlock, tracker }) {
//   const editable = !!onUpdateBlock;
//   const TOP_MONTH_ARTICLES = EDITORIAL_ARTICLES.slice(0, 3);
//   const MORE_NEWS_SAMPLE = EDITORIAL_ARTICLES.slice(3, 8);
//   const TOP_AUTHORS_SAMPLE = [
//     { name: "Neil Harrison", role: "Aviation & aerospace correspondent", initials: "NH" },
//     { name: "Mateo Vargas", role: "Technology & consumer affairs", initials: "MV" },
//     { name: "Isabella Crane", role: "Environment & foreign policy", initials: "IC" },
//     { name: "Claire Fontaine", role: "White House & foreign policy", initials: "CF" },
//   ];

//   // Real authors created by the admin on the Authors page, ranked by how
//   // many published articles they have (most prolific first) so "Top
//   // Authors" reflects real activity instead of a hard-coded name list.
//   const realAuthors = getAuthors();
//   const rankedAuthors = realAuthors.length
//     ? [...realAuthors]
//         .map((a) => ({ ...a, _articleCount: getArticlesForAuthor(a).length }))
//         .sort((a, b) => b._articleCount - a._articleCount)
//     : [];

//   return (
//     <div className="space-y-5">
//       {(data.rightBlocks || []).filter(b => b.visible !== false).map(block => {
//         if (!block.enabled && block.type !== "advertisement") return null;

//         switch (block.type) {
//           case "futureStory": {
//             const fsIdKey = `rightBlock_${block.id}_articleId`;
//             const fsPinned = !!data?.[fsIdKey];
//             const fsExclude = tracker ? tracker.exclude() : [];
//             const fsPinnedArticle = fsPinned ? resolveSingleArticle(data, { idKey: fsIdKey, sampleFallback: null }) : null;
//             // Not pinned -> auto-fill with the next unused real article so
//             // this card never sits stuck on static placeholder copy.
//             const fsAutoArticle = !fsPinnedArticle
//               ? (resolveArticlesForBlock(data, 1, { idsKey: `__futureAuto_${block.id}`, excludeIds: fsExclude, sampleFallback: [], usageCounts: tracker ? tracker.counts() : null })[0] || null)
//               : null;
//             const fsArticle = fsPinnedArticle || fsAutoArticle;
//             if (fsArticle && tracker) tracker.track(fsArticle);
//             const fsHelpers = makeSinglePinHelpers(fsIdKey, blockId, onUpdateBlock);
//             return (
//               <EditableArticleSlot article={fsArticle} key={block.id} pinned={fsPinned} editable={editable} onPick={fsHelpers.pin} onClear={fsHelpers.clear} excludeIds={fsExclude} currentArticleId={data?.[fsIdKey] || null} className="block">
//                 <div>
//                   <p className="text-[12px] font-black uppercase tracking-widest text-gray-500 mb-2">{block.title}</p>
//                   <CoverImage src={fsArticle?.img} gradient={GRADIENT_COLORS_EDITORIAL[1]} className="rounded-sm overflow-hidden mb-2" style={{ aspectRatio: "4/3" }} />
//                   <span className="text-[10px] font-bold uppercase tracking-wide text-purple-600 block mb-0.5">{fsArticle ? `${fsArticle.category} • ${fsArticle.date}` : "ARTS • CULTURE • JANUARY 8, 2026"}</span>
//                   <p className="text-[14px] font-bold text-gray-900 leading-snug cursor-pointer hover:text-red-600 transition-colors">{fsArticle?.title || "The Future of Contemporary Art in the Age of AI"}</p>
//                   {block.showExcerpt && <p className="text-[12px] text-gray-500 mt-1 leading-snug">{fsArticle?.excerpt || "As algorithms begin generating gallery-ready work, curators and critics are asking what — if anything — separates human creativity from its digital imitator."}</p>}
//                   {block.showDate && <p className="text-[12px] text-gray-400 mt-1">{fsArticle ? fsArticle.date : "10 min read · In Arts"}</p>}
//                 </div>
//               </EditableArticleSlot>
//             );
//           }

//           case "topOfMonth": {
//             const tomIdsKey = `rightBlock_${block.id}_ids`;
//             const tomCount = block.itemCount || 3;
//             const tomHelpers = makePinHelpers(data, tomIdsKey, tomCount, blockId, onUpdateBlock);
//             const tomExclude = tracker ? tracker.exclude() : [];
//             const tomArticles = resolveArticlesForBlock(data, tomCount, { idsKey: tomIdsKey, excludeIds: tomExclude, sampleFallback: TOP_MONTH_ARTICLES, usageCounts: tracker ? tracker.counts() : null });
//             if (tracker) tracker.track(tomArticles);
//             return (
//               <div key={block.id} className="border-t border-gray-200 pt-4">
//                 <p className="text-[12px] font-black uppercase tracking-widest text-gray-500 mb-3">{block.title}</p>
//                 <div className="space-y-3">
//                   {tomArticles.map((a, i) => (
//                     <EditableArticleSlot article={a} key={`${a.id}-${i}`} className="block" pinned={tomHelpers.isPinned(i)} editable={editable} onPick={(id) => tomHelpers.pin(i, id)} onClear={() => tomHelpers.clear(i)} excludeIds={tomExclude} currentArticleId={(data[tomIdsKey] || [])[i]}>
//                       <div className="flex gap-2 group cursor-pointer">
//                         <span className="text-[15px] font-black text-gray-300 shrink-0 w-5">{i + 1}</span>
//                         {block.showImages && (
//                           <CoverImage src={a.img} gradient={GRADIENT_COLORS_EDITORIAL[i % 5]} className="shrink-0 rounded overflow-hidden" style={{ width: 40, height: 30 }} />
//                         )}
//                         <div className="flex-1 min-w-0">
//                           <p className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{a.title}</p>
//                           {block.showDates && <p className="text-[11px] text-gray-400 mt-0.5">{a.category} · {a.date}</p>}
//                         </div>
//                       </div>
//                     </EditableArticleSlot>
//                   ))}
//                 </div>
//               </div>
//             );
//           }

//           // "Most Commented" is repurposed as a real "Trending" widget: the
//           // Article model has no comment-count field, but it does track
//           // `views`, so this ranks by most-viewed first (falling back to
//           // newest for ties) instead of just repeating the latest-unused
//           // pattern used everywhere else on the page.
//           case "mostCommented": {
//             const mnIdsKey = `rightBlock_${block.id}_ids`;
//             const mnCount = block.itemCount || 5;
//             const mnHelpers = makePinHelpers(data, mnIdsKey, mnCount, blockId, onUpdateBlock);
//             const mnExclude = tracker ? tracker.exclude() : [];
//             const mnPins = Array.isArray(data?.[mnIdsKey]) ? data[mnIdsKey] : [];
//             const mnPinnedIds = new Set(mnPins.filter(Boolean));
//             const mnTrending = resolveTrendingArticles(mnCount, { excludeIds: [...mnExclude, ...mnPinnedIds], sampleFallback: MORE_NEWS_SAMPLE, usageCounts: tracker ? tracker.counts() : null });
//             let mnCursor = 0;
//             const mnArticles = Array.from({ length: mnCount }).map((_, i) => {
//               if (mnPins[i]) {
//                 const pinnedReal = getAllPreviewArticlesSorted().find((a) => a.id === mnPins[i]);
//                 if (pinnedReal) return pinnedReal;
//               }
//               const next = mnTrending[mnCursor];
//               if (next) mnCursor += 1;
//               return next;
//             }).filter(Boolean);
//             if (tracker) tracker.track(mnArticles);
//             return (
//               <div key={block.id} className="border-t border-gray-200 pt-4">
//                 <p className="text-[12px] font-black uppercase tracking-widest text-gray-500 mb-3">{block.title || "Trending Now"}</p>
//                 <div className="space-y-2">
//                   {mnArticles.map((a, i) => (
//                     <EditableArticleSlot article={a} key={`${a.id}-${i}`} className="block" pinned={mnHelpers.isPinned(i)} editable={editable} onPick={(id) => mnHelpers.pin(i, id)} onClear={() => mnHelpers.clear(i)} excludeIds={mnExclude} currentArticleId={(data[mnIdsKey] || [])[i]}>
//                       <div className="flex gap-2 group cursor-pointer">
//                         <span className="text-[13px] font-black text-gray-300 shrink-0 w-4">{i + 1}</span>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-[13px] text-gray-700 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">{a.title}</p>
//                           {block.showDates && <p className="text-[11px] text-gray-400 mt-0.5">{a.category} · {a.date}</p>}
//                         </div>
//                       </div>
//                     </EditableArticleSlot>
//                   ))}
//                 </div>
//               </div>
//             );
//           }

//           case "topAuthors": {
//             const list = rankedAuthors.length
//               ? rankedAuthors.slice(0, block.itemCount || 4)
//               : TOP_AUTHORS_SAMPLE.slice(0, block.itemCount || 4);
//             return (
//               <div key={block.id} className="border-t border-gray-200 pt-4">
//                 <p className="text-[12px] font-black uppercase tracking-widest text-gray-500 mb-3">{block.title}</p>
//                 <div className="space-y-3">
//                   {list.map((author, i) => {
//                     const href = rankedAuthors.length ? authorHref(author.slug) : null;
//                     const initials = rankedAuthors.length
//                       ? (author.name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
//                       : author.initials;
//                     const inner = (
//                       <>
//                         {block.showImages && (
//                           author.profileImage ? (
//                             <img src={author.profileImage} alt={author.name} className="h-8 w-8 rounded-full object-cover shrink-0" />
//                           ) : (
//                             <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-[11px] font-bold text-gray-600 shrink-0">
//                               {initials}
//                             </div>
//                           )
//                         )}
//                         <div className="min-w-0">
//                           <p className="text-[13px] font-semibold text-gray-900 group-hover:text-red-600 transition-colors truncate">{author.name}</p>
//                           <p className="text-[12px] text-gray-400 truncate">{author.role}</p>
//                         </div>
//                       </>
//                     );
//                     return href ? (
//                       <Link href={href} key={author._id || author.name || i} className="flex items-center gap-2 group cursor-pointer">
//                         {inner}
//                       </Link>
//                     ) : (
//                       <div key={author._id || author.name || i} className="flex items-center gap-2">
//                         {inner}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//           }

//           case "advertisement": {
//             const adW = block.width > 0 ? block.width : "100%";
//             const adH = block.height || 250;
//             const adBody = block.imageUrl ? (
//               <img src={block.imageUrl} alt={block.altText || "Advertisement"} className="w-full h-full object-cover rounded" style={{ height: adH }} />
//             ) : (
//               <div className="rounded border border-gray-800 bg-gray-900 p-4 text-center">
//                 <p className="text-yellow-400 text-[16px] font-black tracking-wide mb-1">HTN Premium</p>
//                 <p className="text-gray-400 text-[12px] mb-2">Unlimited Access. No Ads.</p>
//                 <button className="bg-red-700 text-white text-[12px] font-bold px-4 py-1.5 rounded hover:bg-red-600 transition-colors">
//                   Start for Free →
//                 </button>
//               </div>
//             );
//             return (
//               <div key={block.id} className="border-t border-gray-200 pt-4">
//                 <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 text-center">Advertisement</p>
//                 <div style={{ width: adW, maxWidth: "100%", marginInline: "auto" }}>
//                   {block.imageUrl && block.linkUrl ? (
//                     <a href={block.linkUrl} target="_blank" rel="noopener noreferrer sponsored" className="block">{adBody}</a>
//                   ) : adBody}
//                 </div>
//               </div>
//             );
//           }

//           case "newsletter":
//             return (
//               <div key={block.id} className="border-t border-gray-200 pt-4">
//                 <p className="text-[12px] font-black uppercase tracking-widest text-gray-500 mb-2">{block.title}</p>
//                 <p className="text-[13px] text-gray-600 mb-2">Get the headlines that matter, delivered every morning.</p>
//                 <NewsletterForm source="sidebar" layout="stack" size="sm" placeholder="Your email address" buttonText="Subscribe" buttonBg="#b91c1c" />
//               </div>
//             );

//           default:
//             return null;
//         }
//       })}
//     </div>
//   );
// }

// // ─── Shared sample data for Template 2 / 3 / 7 ───────────────────────────────
// const TRENDING_SAMPLE = [
//   { title: "Markets close mixed as inflation data exceeds forecasts", time: "2h ago" },
//   { title: "AI tools transform the way businesses operate", time: "3h ago" },
//   { title: "Cybersecurity threats rise in global financial sector", time: "4h ago" },
//   { title: "Retail sales rebound stronger than expected", time: "5h ago" },
//   { title: "Oil prices climb on supply concerns and demand outlook", time: "6h ago" },
//   { title: "Tech giants invest in renewable energy projects", time: "7h ago" },
// ];

// const POPULAR_SAMPLE = [
//   "Global economy outlook for the rest of 2026",
//   "New defense bill passes house with bipartisan support",
//   "Startups secure record funding in Q2 2026",
//   "Election campaigns heat up in key battleground states",
//   "Electric vehicles drive future of clean energy",
// ];

// const AUTHORS_SAMPLE = [
//   { name: "James Whitmore", role: "White House Correspondent", initials: "JW" },
//   { name: "Anna Cole", role: "Economics Editor", initials: "AC" },
//   { name: "Marcus Reid", role: "Justice & Policy", initials: "MR" },
//   { name: "Maya Chen", role: "Technology Reporter", initials: "MC" },
//   { name: "Mark Wells", role: "Health Correspondent", initials: "MW" },
//   { name: "Claire Fontaine", role: "Foreign Affairs", initials: "CF" },
// ];

// function adSizeToHeight(size) {
//   if (size === "970x250") return 250;
//   if (size === "728x90") return 90;
//   if (size === "970x90") return 90;
//   if (size === "300x250") return 250;
//   return 90;
// }

// /** Full-width advertisement banner used by the big page templates (Modern
//  *  Magazine, Dark News, Masonry). Shows the admin-uploaded image at the
//  *  admin-controlled width/height when present, otherwise a placeholder. */
// function AdBanner({ image, linkUrl, altText, width, height, sizeLabel, className = "", dark = false }) {
//   const w = width > 0 ? width : "100%";
//   const body = image ? (
//     <img src={image} alt={altText || "Advertisement"} className="w-full object-cover rounded" style={{ height }} />
//   ) : (
//     <div
//       className={`rounded border-2 border-dashed flex items-center justify-center text-[13px] font-medium uppercase tracking-wide ${dark ? "border-white/10 text-gray-500" : "border-gray-200 text-gray-400"}`}
//       style={{ height }}
//     >
//       Advertisement — {sizeLabel}
//     </div>
//   );
//   return (
//     <div className={className} style={{ width: w, maxWidth: "100%", marginInline: "auto" }}>
//       {image && linkUrl ? (
//         <a href={linkUrl} target="_blank" rel="noopener noreferrer sponsored" className="block">{body}</a>
//       ) : body}
//     </div>
//   );
// }

// // ─── Generic sidebar widget renderer (used by Template 2, 3, 7) ─────────────
// function SidebarWidget({ widget, dark, data, blockId, onUpdateBlock, excludeIds = [] }) {
//   if (widget.enabled === false) return null;
//   const labelClass = dark ? "text-gray-500" : "text-gray-500";
//   const titleClass = dark ? "text-white" : "text-gray-900";
//   const editable = !!onUpdateBlock;

//   switch (widget.type) {
//     case "trending": {
//       const trendIdsKey = `sidebarWidget_${widget.id}_ids`;
//       const count = widget.itemCount || 5;
//       const helpers = makePinHelpers(data || {}, trendIdsKey, count, blockId, onUpdateBlock);
//       const articles = resolveArticlesForBlock(data || {}, count, { idsKey: trendIdsKey, sampleFallback: SAMPLE_ARTICLES, excludeIds });
//       return (
//         <div>
//           <p className={`text-[12px] font-black uppercase tracking-widest ${labelClass} mb-3`}>{widget.title || "Trending Now"}</p>
//           <div className="space-y-3">
//             {articles.map((a, i) => (
//               <EditableArticleSlot article={a} key={`${a.id}-${i}`} className="block" pinned={helpers.isPinned(i)} editable={editable} onPick={(id) => helpers.pin(i, id)} onClear={() => helpers.clear(i)} excludeIds={excludeIds} currentArticleId={((data || {})[trendIdsKey] || [])[i]}>
//                 <div className="flex gap-2 group cursor-pointer">
//                   {widget.showImages !== false && (
//                     <div className="shrink-0 rounded overflow-hidden" style={{ width: 44, height: 32, background: a.img ? `url(${a.img}) center/cover no-repeat` : GRADIENT_COLORS_EDITORIAL[i % GRADIENT_COLORS_EDITORIAL.length] }} />
//                   )}
//                   <div className="flex-1 min-w-0">
//                     <p className={`text-[11.5px] font-semibold leading-snug line-clamp-2 ${titleClass} group-hover:text-red-500 transition-colors`}>{a.title}</p>
//                     {widget.showTime !== false && <p className="text-[9.5px] text-gray-400 mt-0.5">{a.date}</p>}
//                   </div>
//                 </div>
//               </EditableArticleSlot>
//             ))}
//           </div>
//         </div>
//       );
//     }

//     case "popular": {
//       const popIdsKey = `sidebarWidget_${widget.id}_ids`;
//       const count = widget.itemCount || 5;
//       const helpers = makePinHelpers(data || {}, popIdsKey, count, blockId, onUpdateBlock);
//       const articles = resolveArticlesForBlock(data || {}, count, { idsKey: popIdsKey, sampleFallback: SAMPLE_ARTICLES, excludeIds });
//       return (
//         <div>
//           <p className={`text-[12px] font-black uppercase tracking-widest ${labelClass} mb-3`}>{widget.title || "Popular Articles"}</p>
//           <div className="space-y-2.5">
//             {articles.map((a, i) => (
//               <EditableArticleSlot article={a} key={`${a.id}-${i}`} className="block" pinned={helpers.isPinned(i)} editable={editable} onPick={(id) => helpers.pin(i, id)} onClear={() => helpers.clear(i)} excludeIds={excludeIds} currentArticleId={((data || {})[popIdsKey] || [])[i]}>
//                 <div className="flex gap-2 group cursor-pointer">
//                   {widget.showNumbers && <span className="text-[14px] font-black text-gray-300 shrink-0 w-4">{i + 1}</span>}
//                   <p className={`text-[11.5px] leading-snug ${dark ? "text-gray-300" : "text-gray-700"} group-hover:text-red-500 transition-colors`}>{a.title}</p>
//                 </div>
//               </EditableArticleSlot>
//             ))}
//           </div>
//         </div>
//       );
//     }

//     case "newsletter":
//       return (
//         <div className={dark ? "rounded-lg p-3" : "rounded-lg border border-primary-100 bg-primary-50 p-3"} style={dark ? { backgroundColor: "#1a1a1a" } : undefined}>
//           <p className={`text-[14px] font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>{widget.title || "Newsletter"}</p>
//           {widget.description && <p className={`text-[10.5px] mb-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>{widget.description}</p>}
//           <NewsletterForm source="sidebar" layout="stack" size="sm" placeholder="Your email" buttonText="Subscribe" buttonBg="#cc0000" dark={dark} />
//         </div>
//       );

//     case "categories":
//       return (
//         <div>
//           <p className={`text-[12px] font-black uppercase tracking-widest ${labelClass} mb-3`}>{widget.title || "Categories"}</p>
//           <div className="space-y-1.5">
//             {(widget.categories || []).map((cat, i) => (
//               <div key={i} className={`flex items-center justify-between py-1.5 px-2 rounded group cursor-pointer ${dark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}>
//                 <span className={`text-[11.5px] font-medium ${dark ? "text-gray-300" : "text-gray-700"} group-hover:text-red-500 transition-colors`}>{cat}</span>
//                 <span className="text-gray-400 text-[13px]">→</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       );

//     case "advertisement": {
//       const wH = widget.height > 0 ? widget.height : (widget.size === "square" ? 180 : 250);
//       const wW = widget.width > 0 ? widget.width : "100%";
//       const adBody = widget.imageUrl ? (
//         <img src={widget.imageUrl} alt={widget.altText || "Advertisement"} className="w-full object-cover rounded" style={{ height: wH }} />
//       ) : (
//         <div
//           className={`rounded border-2 border-dashed flex items-center justify-center text-[12px] font-medium uppercase ${dark ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}
//           style={{ height: wH }}
//         >
//           Ad — {widget.size || "sidebar"}
//         </div>
//       );
//       return (
//         <div>
//           <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 text-center">Advertisement</p>
//           <div style={{ width: wW, maxWidth: "100%", marginInline: "auto" }}>
//             {widget.imageUrl && widget.linkUrl ? (
//               <a href={widget.linkUrl} target="_blank" rel="noopener noreferrer sponsored" className="block">{adBody}</a>
//             ) : adBody}
//           </div>
//         </div>
//       );
//     }

//     default:
//       return null;
//   }
// }

// // ─── Template 2: Modern Magazine ─────────────────────────────────────────────
// function ModernMagazineRenderer({ data, device, blockId, onUpdateBlock }) {
//   const isMobile = device === "mobile";
//   const isTablet = device === "tablet";
//   const gap = data.columnGap || 24;
//   const editable = !!onUpdateBlock;
//   const tracker = createArticleUsageTracker();
//   const totalArticlesAvailable = Math.max(getAllPreviewArticlesSorted().length, SAMPLE_ARTICLES.length);
//   const [latestGridVisible, setLatestGridVisible] = useState(data.latestGridLimit || 9);

//   const heroHelpers = makeSinglePinHelpers("heroArticleId", blockId, onUpdateBlock);
//   const heroArticle = tracker.track(resolveSingleArticle(data, { idKey: "heroArticleId", sampleFallback: SAMPLE_ARTICLES[0] }));

//   const topStoriesExclude = tracker.exclude();
//   const topStoriesHelpers = makePinHelpers(data, "topStoriesIds", data.topStoriesCount || 4, blockId, onUpdateBlock);
//   const topStoriesArticles = tracker.track(resolveArticlesForBlock(data, data.topStoriesCount || 4, { idsKey: "topStoriesIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: topStoriesExclude }));

//   const latestNewsExclude = tracker.exclude();
//   const latestNewsHelpers = makePinHelpers(data, "latestNewsIds", data.latestNewsLimit || 8, blockId, onUpdateBlock);
//   const latestNewsArticles = tracker.track(resolveArticlesForBlock(data, data.latestNewsLimit || 8, { idsKey: "latestNewsIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: latestNewsExclude }));

//   const editorsPicksMainHelpers = makeSinglePinHelpers("editorsPicksMainId", blockId, onUpdateBlock);
//   const editorsPicksMainArticle = tracker.track(resolveSingleArticle(data, { idKey: "editorsPicksMainId", sampleFallback: SAMPLE_ARTICLES[0], excludeIds: tracker.exclude() }));

//   const editorsPicksExclude = tracker.exclude();
//   const editorsPicksHelpers = makePinHelpers(data, "editorsPicksIds", 3, blockId, onUpdateBlock);
//   const editorsPicksArticles = tracker.track(resolveArticlesForBlock(data, 3, { idsKey: "editorsPicksIds", sampleFallback: SAMPLE_ARTICLES.slice(1, 4), excludeIds: editorsPicksExclude }));

//   const latestGridExclude0 = tracker.exclude();
//   const latestGridHelpers = makePinHelpers(data, "latestGridIds", latestGridVisible, blockId, onUpdateBlock);

//   const MainContent = (
//     <div className="min-w-0">
//       {/* Section 1: Hero */}
//       {data.heroEnabled !== false && (
//         <EditableArticleSlot article={heroArticle} pinned={!!data.heroArticleId} editable={editable} onPick={heroHelpers.pin} onClear={heroHelpers.clear} excludeIds={topStoriesExclude} currentArticleId={data.heroArticleId} className="block">
//         <div
//           className="relative overflow-hidden rounded-sm mb-6 flex flex-col items-start justify-end p-6"
//           style={{
//             height: isMobile ? Math.min(data.heroHeight || 420, 260) : (data.heroHeight || 420),
//             background: (data.heroImage || heroArticle?.img)
//               ? `linear-gradient(rgba(0,0,0,${(data.heroOverlayOpacity ?? 55) / 100}),rgba(0,0,0,${(data.heroOverlayOpacity ?? 55) / 100})), url(${data.heroImage || heroArticle?.img}) center/cover no-repeat`
//               : `linear-gradient(135deg, ${data.heroBg || "#1a1a2e"} 0%, #2d1b1b 100%)`,
//           }}
//         >
//           {(data.heroCategory || heroArticle?.category) && (
//             <span className="inline-block text-[12px] font-bold uppercase tracking-widest text-red-400 mb-2 bg-red-600/90 text-white px-2 py-0.5 rounded">{data.heroCategory || heroArticle?.category}</span>
//           )}
//           <h1 className="text-white font-bold leading-tight mb-3" style={{ fontSize: isMobile ? 20 : (data.heroTitleSize || 32) }}>
//             {data.heroHeadline || heroArticle?.title || "No article yet — click + to choose one"}
//           </h1>
//           {(data.heroDescription || heroArticle?.excerpt) && <p className="text-white/80 text-[15px] max-w-xl mb-4">{data.heroDescription || heroArticle?.excerpt}</p>}
//           {data.heroCtaLabel && (
//             <a href={data.heroCtaUrl} className="inline-block text-[14px] font-bold bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-100 transition-colors">{data.heroCtaLabel}</a>
//           )}
//         </div>
//         </EditableArticleSlot>
//       )}

//       {/* Section 2: Top Stories */}
//       {data.topStoriesEnabled !== false && (
//         <div className="mb-8">
//           <div className="flex items-center gap-2 mb-4">
//             <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.topStoriesTitle || "Top Stories"}</h2>
//             <div className="flex-1 h-px bg-gray-200" />
//             <a href="#" className="text-[13px] font-medium text-red-600 hover:underline whitespace-nowrap">View All →</a>
//           </div>
//           <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${isMobile ? 1 : isTablet ? 2 : Math.min(data.topStoriesCount || 4, 4)}, 1fr)` }}>
//             {topStoriesArticles.map((a, i) => (
//               <EditableArticleSlot key={`${a.id}-${i}`} pinned={topStoriesHelpers.isPinned(i)} editable={editable} onPick={(id) => topStoriesHelpers.pin(i, id)} onClear={() => topStoriesHelpers.clear(i)} excludeIds={topStoriesExclude} currentArticleId={(data.topStoriesIds || [])[i]}>
//                 <ArticleCard article={a} showImage showCategory showDate compact />
//               </EditableArticleSlot>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Section 3: Latest News */}
//       {data.latestNewsEnabled !== false && (
//         <div className="mb-8">
//           <div className="flex items-center gap-2 mb-4">
//             <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.latestNewsTitle || "Latest News"}</h2>
//             <div className="flex-1 h-px bg-gray-200" />
//           </div>
//           <div className="divide-y divide-gray-100">
//             {latestNewsArticles.map((a, i) => (
//               <EditableArticleSlot key={`${a.id}-${i}`} pinned={latestNewsHelpers.isPinned(i)} editable={editable} onPick={(id) => latestNewsHelpers.pin(i, id)} onClear={() => latestNewsHelpers.clear(i)} excludeIds={latestNewsExclude} currentArticleId={(data.latestNewsIds || [])[i]}>
//                 <ArticleRow article={a} showImage showCategory showDate showExcerpt imageSize="medium" />
//               </EditableArticleSlot>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Section 4: Editor's Picks */}
//       {data.editorsPicksEnabled !== false && (
//         <div className="mb-8">
//           <div className="flex items-center gap-2 mb-4">
//             <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.editorsPicksTitle || "Editor's Picks"}</h2>
//             <div className="flex-1 h-px bg-gray-200" />
//           </div>
//           <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
//             <EditableArticleSlot article={editorsPicksMainArticle} pinned={!!data.editorsPicksMainId} editable={editable} onPick={editorsPicksMainHelpers.pin} onClear={editorsPicksMainHelpers.clear} excludeIds={latestNewsExclude} currentArticleId={data.editorsPicksMainId}>
//               <div className="group cursor-pointer">
//                 <div className="rounded-sm mb-2 overflow-hidden" style={{ aspectRatio: "16/9", background: editorsPicksMainArticle?.img ? `url(${editorsPicksMainArticle.img}) center/cover no-repeat` : GRADIENT_COLORS_EDITORIAL[0] }} />
//                 <span className="text-[11px] font-bold uppercase tracking-wide text-purple-600 block mb-1">{editorsPicksMainArticle?.category || "ARTS • CULTURE"}</span>
//                 <p className="text-[17px] font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors">{editorsPicksMainArticle?.title || "Central banks maintain cautious stance amid global volatility"}</p>
//                 <p className="text-[11.5px] text-gray-500 mt-1 leading-snug line-clamp-2">{editorsPicksMainArticle?.excerpt || "Officials agree to keep rates steady as inflation cools gradually across major economies."}</p>
//               </div>
//             </EditableArticleSlot>
//             <div className="divide-y divide-gray-100">
//               {editorsPicksArticles.map((a, i) => (
//                 <EditableArticleSlot key={`${a.id}-${i}`} pinned={editorsPicksHelpers.isPinned(i)} editable={editable} onPick={(id) => editorsPicksHelpers.pin(i, id)} onClear={() => editorsPicksHelpers.clear(i)} excludeIds={editorsPicksExclude} currentArticleId={(data.editorsPicksIds || [])[i]}>
//                   <ArticleRow article={{ ...a, excerpt: undefined }} showImage showCategory showDate showExcerpt={false} imageSize="small" />
//                 </EditableArticleSlot>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Section 5: Category Grid */}
//       {data.categoryGridEnabled !== false && (data.categoryGridCategories || []).map((cat) => {
//         const catIdsKey = `catGrid_${cat.id}_ids`;
//         const catHelpers = makePinHelpers(data, catIdsKey, cat.articleCount || 4, blockId, onUpdateBlock);
//         const catExclude = tracker.exclude();
//         const catArticles = tracker.track(resolveArticlesByCategoryName(cat.name, cat.articleCount || 4, { data, idsKey: catIdsKey, excludeIds: catExclude, categoryId: cat.categoryId, sampleFallback: SAMPLE_ARTICLES }));
//         const catHref = categoryHrefForCatItem(cat);
//         return (
//           <div key={cat.id} className="mb-8">
//             <div className="flex items-center gap-2 mb-4">
//               <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{cat.name}</h2>
//               <div className="flex-1 h-px bg-gray-200" />
//               {catHref ? (
//                 <Link href={catHref} className="text-[13px] font-medium text-red-600 hover:underline whitespace-nowrap">View All →</Link>
//               ) : (
//                 <span className="text-[13px] font-medium text-gray-400 whitespace-nowrap">View All →</span>
//               )}
//             </div>
//             <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-4"}`}>
//               {catArticles.map((a, i) => (
//                 <EditableArticleSlot key={`${a.id}-${i}`} pinned={catHelpers.isPinned(i)} editable={editable} onPick={(id) => catHelpers.pin(i, id)} onClear={() => catHelpers.clear(i)} excludeIds={catExclude} currentArticleId={(data[catIdsKey] || [])[i]}>
//                   <ArticleCard article={a} showImage showCategory={false} showDate compact />
//                 </EditableArticleSlot>
//               ))}
//             </div>
//           </div>
//         );
//       })}

//       {/* Section 6: Advertisement */}
//       {data.adEnabled !== false && (
//         <AdBanner image={data.adImage} linkUrl={data.adLinkUrl} altText={data.adAltText} width={data.adWidth} height={data.adHeight || adSizeToHeight(data.adSize)} sizeLabel={data.adSize || "970x90"} className="mb-8" dark={false} />
//       )}

//       {/* Section 7: Latest Articles Grid */}
//       {data.latestGridEnabled !== false && (
//         <div className="mb-8">
//           <div className="flex items-center gap-2 mb-4">
//             <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.latestGridTitle || "Latest Articles"}</h2>
//             <div className="flex-1 h-px bg-gray-200" />
//           </div>
//           <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : ""}`} style={!isMobile && !isTablet ? { gridTemplateColumns: `repeat(${data.latestGridColumns || 3}, 1fr)` } : undefined}>
//             {tracker.track(resolveArticlesForBlock(data, latestGridVisible, { idsKey: "latestGridIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: latestGridExclude0 })).map((a, i) => (
//               <EditableArticleSlot key={`${a.id || i}-${i}`} pinned={latestGridHelpers.isPinned(i)} editable={editable} onPick={(id) => latestGridHelpers.pin(i, id)} onClear={() => latestGridHelpers.clear(i)} excludeIds={latestGridExclude0} currentArticleId={(data.latestGridIds || [])[i]}>
//                 <ArticleCard article={a} showImage showCategory showDate compact />
//               </EditableArticleSlot>
//             ))}
//           </div>
//         </div>
//       )}


//       {/* Section 8: Newsletter (inline within main on mobile/tablet stacking handled below at full width) */}

//       {/* Section 9: Load More */}
//       {data.loadMoreEnabled !== false && data.latestGridEnabled !== false && latestGridVisible < totalArticlesAvailable && (
//         <div className="flex justify-center mb-2">
//           <button
//             onClick={() => setLatestGridVisible((c) => Math.min(c + Math.max(data.loadMoreIncrement || 3, 3), totalArticlesAvailable))}
//             className="px-6 py-2.5 text-[14px] font-bold border-2 transition-colors hover:bg-gray-50"
//             style={{ color: data.loadMoreColor || "#cc0000", borderColor: data.loadMoreColor || "#cc0000", borderRadius: data.loadMoreRadius ?? 6 }}
//           >
//             {data.loadMoreLabel || "Load More Articles"}
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   const Sidebar = (
//     <div className="divide-y divide-gray-100 [&>*]:py-5 first:[&>*]:pt-0">
//       {(data.sidebarWidgets || []).map((w) => (
//         <div key={w.id}><SidebarWidget widget={w} data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} excludeIds={tracker.exclude()} /></div>
//       ))}
//     </div>
//   );

//   return (
//     <div style={{ backgroundColor: data.bg || "#ffffff" }}>
//       <div className="mx-auto px-4 py-6" style={{ maxWidth: data.maxWidth || 1600 }}>
//         {isMobile || isTablet ? (
//           <div>
//             {MainContent}
//             <div className="mt-2 border-t border-gray-100 pt-6">{Sidebar}</div>
//           </div>
//         ) : (
//           <div className="flex items-start" style={{ gap }}>
//             <div style={{ width: "75%" }}>{MainContent}</div>
//             <div style={{ width: "25%", position: "sticky", top: 20, alignSelf: "flex-start" }} className="shrink-0">{Sidebar}</div>
//           </div>
//         )}
//       </div>

//       {/* Section 8: Newsletter — full width */}
//       {data.newsletterEnabled !== false && (
//         <div className="px-4 py-8 text-center" style={{ backgroundColor: data.newsletterBg || "#f5f5f0" }}>
//           <h3 className="text-[18px] font-bold mb-1 text-gray-900">{data.newsletterHeading}</h3>
//           <p className="text-[15px] mb-4 text-gray-500">{data.newsletterSubheading}</p>
//           <div className="max-w-sm mx-auto">
//             <NewsletterForm source="sidebar" buttonText={data.newsletterCtaLabel || "Subscribe"} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Template 3: Dark News ───────────────────────────────────────────────────
// function DarkArticleRow({ article, showExcerpt = true }) {
//   return (
//     <CardLink article={article} className="flex gap-3 py-3 group cursor-pointer">
//       <div className="flex-none rounded-sm overflow-hidden" style={{ width: 96, height: 68, background: article.img ? `url(${article.img}) center/cover no-repeat` : GRADIENT_COLORS_EDITORIAL[gradientIndexFor(article.id)] }} />
//       <div className="flex-1 min-w-0">
//         <span className="text-[11px] font-bold uppercase tracking-wide mb-0.5 block" style={{ color: article.categoryColor }}>{article.category}</span>
//         <p className="text-[12.5px] font-semibold text-white leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">{article.title}</p>
//         {showExcerpt && <p className="text-[13px] text-gray-400 mt-0.5 line-clamp-1 leading-snug">{article.excerpt}</p>}
//         <p className="text-[12px] text-gray-500 mt-1">{article.date}</p>
//       </div>
//     </CardLink>
//   );
// }

// function DarkArticleCard({ article, cardBg }) {
//   return (
//     <CardLink article={article} className="rounded overflow-hidden group block cursor-pointer" style={{ backgroundColor: cardBg || "#1a1a1a" }}>
//       <div className="overflow-hidden" style={{ aspectRatio: "16/9", background: article.img ? `url(${article.img}) center/cover no-repeat` : GRADIENT_COLORS_EDITORIAL[gradientIndexFor(article.id)] }} />
//       <div className="p-3">
//         <span className="text-[11px] font-bold uppercase tracking-wide mb-1 block" style={{ color: article.categoryColor }}>{article.category}</span>
//         <p className="text-[12.5px] font-semibold text-white leading-snug line-clamp-2 group-hover:text-red-400 transition-colors mb-1.5">{article.title}</p>
//         <p className="text-[12px] text-gray-500">{article.author ? `By ${article.author} · ` : ""}{article.date}</p>
//       </div>
//     </CardLink>
//   );
// }

// function DarkNewsRenderer({ data, device, blockId, onUpdateBlock }) {
//   const isMobile = device === "mobile";
//   const isTablet = device === "tablet";
//   const gap = data.columnGap || 24;
//   const cardBg = data.cardBg || "#1a1a1a";
//   const accent = data.accentColor || "#cc0000";
//   const editable = !!onUpdateBlock;
//   const tracker = createArticleUsageTracker();
//   const totalArticlesAvailable = Math.max(getAllPreviewArticlesSorted().length, SAMPLE_ARTICLES.length);
//   const [darkLatestGridVisible, setDarkLatestGridVisible] = useState(data.latestGridLimit || 6);

//   const heroHelpers = makeSinglePinHelpers("heroArticleId", blockId, onUpdateBlock);
//   const heroArticle = tracker.track(resolveSingleArticle(data, { idKey: "heroArticleId", sampleFallback: SAMPLE_ARTICLES[0] }));

//   const featuredExclude = tracker.exclude();
//   const featuredHelpers = makePinHelpers(data, "featuredStoriesIds", data.featuredStoriesCount || 4, blockId, onUpdateBlock);
//   const featuredArticles = tracker.track(resolveArticlesForBlock(data, data.featuredStoriesCount || 4, { idsKey: "featuredStoriesIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: featuredExclude }));

//   const darkLatestNewsExclude = tracker.exclude();
//   const darkLatestNewsHelpers = makePinHelpers(data, "darkLatestNewsIds", data.latestNewsLimit || 6, blockId, onUpdateBlock);
//   const darkLatestNewsArticles = tracker.track(resolveArticlesForBlock(data, data.latestNewsLimit || 6, { idsKey: "darkLatestNewsIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: darkLatestNewsExclude }));

//   const mostReadExclude = tracker.exclude();
//   const mostReadHelpers = makePinHelpers(data, "mostReadIds", data.mostReadCount || 5, blockId, onUpdateBlock);
//   const mostReadArticles = tracker.track(resolveArticlesForBlock(data, data.mostReadCount || 5, { idsKey: "mostReadIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: mostReadExclude }));

//   const editorsChoiceExclude = tracker.exclude();
//   const editorsChoiceHelpers = makePinHelpers(data, "editorsChoiceIds", data.editorsChoiceCount || 4, blockId, onUpdateBlock);
//   const editorsChoiceArticles = tracker.track(resolveArticlesForBlock(data, data.editorsChoiceCount || 4, { idsKey: "editorsChoiceIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: editorsChoiceExclude }));

//   const darkLatestGridHelpers = makePinHelpers(data, "darkLatestGridIds", darkLatestGridVisible, blockId, onUpdateBlock);

//   return (
//     <div style={{ backgroundColor: data.bg || "#111111" }}>
//       <div className="mx-auto px-4 py-6" style={{ maxWidth: data.maxWidth || 1600 }}>
//         {/* Section 1 + Sidebar row */}
//         <div className={isMobile || isTablet ? "" : "flex items-start"} style={isMobile || isTablet ? undefined : { gap }}>
//           <div style={isMobile || isTablet ? undefined : { width: "75%" }} className="min-w-0">
//             {data.heroEnabled !== false && (
//               <EditableArticleSlot article={heroArticle} pinned={!!data.heroArticleId} editable={editable} onPick={heroHelpers.pin} onClear={heroHelpers.clear} excludeIds={featuredExclude} currentArticleId={data.heroArticleId} className="block">
//               <div
//                 className="relative overflow-hidden rounded-sm flex flex-col items-start justify-end p-6"
//                 style={{
//                   height: isMobile ? Math.min(data.heroHeight || 460, 260) : (data.heroHeight || 460),
//                   background: (data.heroImage || heroArticle?.img)
//                     ? `linear-gradient(rgba(0,0,0,${(data.heroOverlayOpacity ?? 65) / 100}),rgba(0,0,0,${(data.heroOverlayOpacity ?? 65) / 100})), url(${data.heroImage || heroArticle?.img}) center/cover no-repeat`
//                     : `linear-gradient(135deg, #2a2a2a 0%, #0a0a0a 100%)`,
//                 }}
//               >
//                 {(data.heroCategory || heroArticle?.category) && (
//                   <span className="inline-block text-[12px] font-bold uppercase tracking-widest text-white mb-2 px-2 py-0.5 rounded" style={{ backgroundColor: accent }}>{data.heroCategory || heroArticle?.category}</span>
//                 )}
//                 <h1 className="text-white font-bold leading-tight mb-3" style={{ fontSize: isMobile ? 20 : (data.heroTitleSize || 34) }}>
//                   {data.heroHeadline || heroArticle?.title || "No article yet — click + to choose one"}
//                 </h1>
//                 {(data.heroDescription || heroArticle?.excerpt) && <p className="text-gray-300 text-[15px] max-w-xl mb-4">{data.heroDescription || heroArticle?.excerpt}</p>}
//                 {data.heroCtaLabel && (
//                   <a href={data.heroCtaUrl} className="inline-block text-[14px] font-bold text-white px-4 py-2 rounded hover:opacity-90 transition-opacity" style={{ backgroundColor: accent }}>{data.heroCtaLabel}</a>
//                 )}
//               </div>
//               </EditableArticleSlot>
//             )}
//           </div>
//           {!isMobile && !isTablet && (
//             <div style={{ width: "25%", position: "sticky", top: 20, alignSelf: "flex-start" }} className="shrink-0 divide-y divide-white/10 [&>*]:py-5 first:[&>*]:pt-0">
//               {(data.sidebarWidgets || []).map((w) => (
//                 <div key={w.id}><SidebarWidget widget={w} dark data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} excludeIds={tracker.exclude()} /></div>
//               ))}
//             </div>
//           )}
//         </div>

//         {(isMobile || isTablet) && (
//           <div className="mt-6 mb-2 divide-y divide-white/10 [&>*]:py-5 first:[&>*]:pt-0">
//             {(data.sidebarWidgets || []).map((w) => (
//               <div key={w.id}><SidebarWidget widget={w} dark data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} excludeIds={tracker.exclude()} /></div>
//             ))}
//           </div>
//         )}

//         {/* Section 2: Featured Stories */}
//         {data.featuredStoriesEnabled !== false && (
//           <div className="mt-8 mb-8">
//             <div className="flex items-center gap-2 mb-4">
//               <h2 className="text-[15px] font-black uppercase tracking-widest text-white">{data.featuredStoriesTitle || "Featured Stories"}</h2>
//               <div className="flex-1 h-px bg-white/10" />
//               <a href="#" className="text-[13px] font-medium whitespace-nowrap hover:underline" style={{ color: accent }}>View All →</a>
//             </div>
//             <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${isMobile ? 2 : isTablet ? 2 : Math.min(data.featuredStoriesCount || 4, 4)}, 1fr)` }}>
//               {featuredArticles.map((a, i) => (
//                 <EditableArticleSlot key={`${a.id}-${i}`} pinned={featuredHelpers.isPinned(i)} editable={editable} onPick={(id) => featuredHelpers.pin(i, id)} onClear={() => featuredHelpers.clear(i)} excludeIds={featuredExclude} currentArticleId={(data.featuredStoriesIds || [])[i]}>
//                   <DarkArticleCard article={a} cardBg={cardBg} />
//                 </EditableArticleSlot>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Section 3: Latest News + Section 4: Most Read, side by side on desktop */}
//         <div className={isMobile || isTablet ? "" : "grid grid-cols-2"} style={isMobile || isTablet ? undefined : { gap }}>
//           {data.latestNewsEnabled !== false && (
//             <div className="mb-8">
//               <div className="flex items-center gap-2 mb-4">
//                 <h2 className="text-[15px] font-black uppercase tracking-widest text-white">{data.latestNewsTitle || "Latest News"}</h2>
//                 <div className="flex-1 h-px bg-white/10" />
//                 <a href="#" className="text-[13px] font-medium whitespace-nowrap hover:underline" style={{ color: accent }}>View All →</a>
//               </div>
//               <div className="divide-y divide-white/10">
//                 {darkLatestNewsArticles.map((a, i) => (
//                   <EditableArticleSlot key={`${a.id}-${i}`} pinned={darkLatestNewsHelpers.isPinned(i)} editable={editable} onPick={(id) => darkLatestNewsHelpers.pin(i, id)} onClear={() => darkLatestNewsHelpers.clear(i)} excludeIds={darkLatestNewsExclude} currentArticleId={(data.darkLatestNewsIds || [])[i]}>
//                     <DarkArticleRow article={a} />
//                   </EditableArticleSlot>
//                 ))}
//               </div>
//             </div>
//           )}

//           {data.mostReadEnabled !== false && (
//             <div className="mb-8">
//               <div className="flex items-center gap-2 mb-4">
//                 <h2 className="text-[15px] font-black uppercase tracking-widest text-white">{data.mostReadTitle || "Most Read"}</h2>
//                 <div className="flex-1 h-px bg-white/10" />
//               </div>
//               <div className="space-y-4">
//                 {mostReadArticles.map((a, i) => (
//                   <EditableArticleSlot article={a} key={`${a.id}-${i}`} pinned={mostReadHelpers.isPinned(i)} editable={editable} onPick={(id) => mostReadHelpers.pin(i, id)} onClear={() => mostReadHelpers.clear(i)} excludeIds={mostReadExclude} currentArticleId={(data.mostReadIds || [])[i]}>
//                     <div className="flex gap-3 group cursor-pointer">
//                       <span className="text-[20px] font-black shrink-0 w-7" style={{ color: accent }}>{String(i + 1).padStart(2, "0")}</span>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-[12.5px] font-semibold text-white leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">{a.title}</p>
//                         <p className="text-[12px] text-gray-500 mt-1">{(i + 1) * 2.4}K views</p>
//                       </div>
//                     </div>
//                   </EditableArticleSlot>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Section 5: Editor's Choice */}
//         {data.editorsChoiceEnabled !== false && (
//           <div className="mb-8">
//             <div className="flex items-center gap-2 mb-4">
//               <h2 className="text-[15px] font-black uppercase tracking-widest text-white">{data.editorsChoiceTitle || "Editor's Choice"}</h2>
//               <div className="flex-1 h-px bg-white/10" />
//               <a href="#" className="text-[13px] font-medium whitespace-nowrap hover:underline" style={{ color: accent }}>View All →</a>
//             </div>
//             <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${isMobile ? 2 : isTablet ? 2 : Math.min(data.editorsChoiceCount || 4, 4)}, 1fr)` }}>
//               {editorsChoiceArticles.map((a, i) => (
//                 <EditableArticleSlot key={`${a.id}-${i}`} pinned={editorsChoiceHelpers.isPinned(i)} editable={editable} onPick={(id) => editorsChoiceHelpers.pin(i, id)} onClear={() => editorsChoiceHelpers.clear(i)} excludeIds={editorsChoiceExclude} currentArticleId={(data.editorsChoiceIds || [])[i]}>
//                   <DarkArticleCard article={a} cardBg={cardBg} />
//                 </EditableArticleSlot>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Section 6: Category Blocks + lower sidebar */}
//         {data.categoryBlocksEnabled !== false && (
//           <div className={isMobile || isTablet ? "" : "flex items-start"} style={isMobile || isTablet ? undefined : { gap }}>
//             <div style={isMobile || isTablet ? undefined : { width: "75%" }} className="min-w-0 grid gap-6" >
//               {(data.categoryBlocks || []).map((cat) => {
//                 const catIdsKey = `catBlock_${cat.id}_ids`;
//                 const catHelpers = makePinHelpers(data, catIdsKey, cat.articleCount || 2, blockId, onUpdateBlock);
//                 const catExclude = tracker.exclude();
//                 const catArticles = tracker.track(resolveArticlesByCategoryName(cat.name, cat.articleCount || 2, { data, idsKey: catIdsKey, excludeIds: catExclude, categoryId: cat.categoryId, sampleFallback: SAMPLE_ARTICLES }));
//                 const catHref = categoryHrefForCatItem(cat);
//                 return (
//                   <div key={cat.id}>
//                     <div className="flex items-center gap-2 mb-3">
//                       <h3 className="text-[14px] font-black uppercase tracking-widest text-white">{cat.name}</h3>
//                       <div className="flex-1 h-px bg-white/10" />
//                       {catHref ? (
//                         <Link href={catHref} className="text-[10.5px] font-medium whitespace-nowrap hover:underline" style={{ color: accent }}>View All →</Link>
//                       ) : (
//                         <span className="text-[10.5px] font-medium whitespace-nowrap" style={{ color: accent, opacity: 0.6 }}>View All →</span>
//                       )}
//                     </div>
//                     <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
//                       {catArticles.map((a, i) => (
//                         <EditableArticleSlot key={`${a.id}-${i}`} pinned={catHelpers.isPinned(i)} editable={editable} onPick={(id) => catHelpers.pin(i, id)} onClear={() => catHelpers.clear(i)} excludeIds={catExclude} currentArticleId={(data[catIdsKey] || [])[i]}>
//                           <DarkArticleRow article={a} showExcerpt={false} />
//                         </EditableArticleSlot>
//                       ))}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//             {!isMobile && !isTablet && (
//               <div style={{ width: "25%" }} className="shrink-0 divide-y divide-white/10 [&>*]:py-5 first:[&>*]:pt-0">
//                 {(data.lowerSidebarWidgets || []).map((w) => (
//                   <div key={w.id}><SidebarWidget widget={w} dark data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} excludeIds={tracker.exclude()} /></div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Section 7: Advertisement */}
//         {data.adEnabled !== false && (
//           <AdBanner image={data.adImage} linkUrl={data.adLinkUrl} altText={data.adAltText} width={data.adWidth} height={data.adHeight || adSizeToHeight(data.adSize)} sizeLabel={data.adSize || "728x90"} className="my-8" dark />
//         )}

//         {/* Section 8: Latest Articles */}
//         {data.latestGridEnabled !== false && (
//           <div className="mb-8">
//             <div className="flex items-center gap-2 mb-4">
//               <h2 className="text-[15px] font-black uppercase tracking-widest text-white">{data.latestGridTitle || "Latest Articles"}</h2>
//               <div className="flex-1 h-px bg-white/10" />
//             </div>
//             <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : ""}`} style={!isMobile && !isTablet ? { gridTemplateColumns: `repeat(${data.latestGridColumns || 3}, 1fr)` } : undefined}>
//               {tracker.track(resolveArticlesForBlock(data, darkLatestGridVisible, { idsKey: "darkLatestGridIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: tracker.exclude() })).map((a, i) => (
//                 <EditableArticleSlot key={`${a.id || i}-${i}`} pinned={darkLatestGridHelpers.isPinned(i)} editable={editable} onPick={(id) => darkLatestGridHelpers.pin(i, id)} onClear={() => darkLatestGridHelpers.clear(i)} excludeIds={tracker.exclude()} currentArticleId={(data.darkLatestGridIds || [])[i]}>
//                   <DarkArticleCard article={a} cardBg={cardBg} />
//                 </EditableArticleSlot>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Section 10: Load More */}
//         {data.loadMoreEnabled !== false && data.latestGridEnabled !== false && darkLatestGridVisible < totalArticlesAvailable && (
//           <div className="flex justify-center mb-2">
//             <button
//               onClick={() => setDarkLatestGridVisible((c) => Math.min(c + Math.max(data.loadMoreIncrement || 3, 3), totalArticlesAvailable))}
//               className="px-6 py-2.5 text-[14px] font-bold border-2 transition-colors hover:bg-white/5"
//               style={{ color: data.loadMoreColor || accent, borderColor: data.loadMoreColor || accent, borderRadius: data.loadMoreRadius ?? 6 }}
//             >
//               {data.loadMoreLabel || "Load More Articles"}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Section 9: Newsletter — full width dark card */}
//       {data.newsletterEnabled !== false && (
//         <div className="px-4 py-10 text-center" style={{ backgroundColor: cardBg }}>
//           <h3 className="text-[18px] font-bold mb-1 text-white">{data.newsletterHeading}</h3>
//           <p className="text-[15px] mb-4 text-gray-400">{data.newsletterSubheading}</p>
//           <div className="max-w-sm mx-auto">
//             <NewsletterForm source="sidebar" dark buttonText={data.newsletterCtaLabel || "Subscribe"} buttonBg={accent} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Template 7: Masonry Editorial Layout ───────────────────────────────────
// function MasonryEditorialLayout({ data, device, blockId, onUpdateBlock }) {
//   const isMobile = device === "mobile";
//   const isTablet = device === "tablet";
//   const gap = data.columnGap || 24;
//   const pad = data.padding ?? 24;
//   const editable = !!onUpdateBlock;
//   const tracker = createArticleUsageTracker();
//   const totalArticlesAvailable = Math.max(getAllPreviewArticlesSorted().length, SAMPLE_ARTICLES.length);
//   const [masonryLatestGridVisible, setMasonryLatestGridVisible] = useState(data.latestGridLimit || 8);

//   const heroHelpers = makeSinglePinHelpers("heroArticleId", blockId, onUpdateBlock);
//   const heroArticle = tracker.track(resolveSingleArticle(data, { idKey: "heroArticleId", sampleFallback: SAMPLE_ARTICLES[0] }));

//   const heroSmallExclude = tracker.exclude();
//   const heroSmallHelpers = makePinHelpers(data, "heroSmallIds", data.heroSmallStories || 2, blockId, onUpdateBlock);
//   const heroSmallArticles = tracker.track(resolveArticlesForBlock(data, data.heroSmallStories || 2, { idsKey: "heroSmallIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: heroSmallExclude }));

//   const editorsPicksExclude = tracker.exclude();
//   const masonryEditorsPicksHelpers = makePinHelpers(data, "masonryEditorsPicksIds", data.editorsPicksCount || 4, blockId, onUpdateBlock);
//   const masonryEditorsPicksArticles = tracker.track(resolveArticlesForBlock(data, data.editorsPicksCount || 4, { idsKey: "masonryEditorsPicksIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: editorsPicksExclude }));

//   const masonryLatestNewsExclude = tracker.exclude();
//   const masonryLatestNewsHelpers = makePinHelpers(data, "masonryLatestNewsIds", data.latestNewsLimit || 6, blockId, onUpdateBlock);
//   const masonryLatestNewsArticles = tracker.track(resolveArticlesForBlock(data, data.latestNewsLimit || 6, { idsKey: "masonryLatestNewsIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: masonryLatestNewsExclude }));

//   const moreNewsExclude = tracker.exclude();
//   const moreNewsHelpers = makePinHelpers(data, "moreNewsIds", data.moreNewsCount || 6, blockId, onUpdateBlock);
//   const moreNewsArticles = tracker.track(resolveArticlesForBlock(data, data.moreNewsCount || 6, { idsKey: "moreNewsIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: moreNewsExclude }));

//   const trendingHelpers = makePinHelpers(data, "trendingIds", data.trendingCount || 6, blockId, onUpdateBlock);
//   const masonryLatestGridHelpers = makePinHelpers(data, "masonryLatestGridIds", masonryLatestGridVisible, blockId, onUpdateBlock);

//   return (
//     <div style={{ backgroundColor: data.bg || "#ffffff" }}>
//       <div className="mx-auto" style={{ maxWidth: data.maxWidth || 1600, padding: pad }}>

//         {/* Section 1: Hero Masonry */}
//         <div className="mb-6" style={{ display: isMobile ? "flex" : "grid", flexDirection: isMobile ? "column" : undefined, gridTemplateColumns: isMobile ? undefined : "1fr 1fr", gap, gridTemplateRows: isMobile ? undefined : "auto" }}>
//           <EditableArticleSlot article={heroArticle} pinned={!!data.heroArticleId} editable={editable} onPick={heroHelpers.pin} onClear={heroHelpers.clear} excludeIds={heroSmallExclude} currentArticleId={data.heroArticleId} className="block" style={{ gridRow: isMobile ? undefined : "1 / 2" }}>
//           <div
//             className="relative overflow-hidden rounded-sm flex flex-col items-start justify-end p-6"
//             style={{
//               height: isMobile ? 240 : (data.heroImageHeight || 420),
//               background: (data.heroImage || heroArticle?.img)
//                 ? `linear-gradient(rgba(0,0,0,${(data.heroOverlayOpacity ?? 45) / 100}),rgba(0,0,0,${(data.heroOverlayOpacity ?? 45) / 100})), url(${data.heroImage || heroArticle?.img}) center/cover no-repeat`
//                 : `linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`,
//             }}
//           >
//             {(data.heroCategory || heroArticle?.category) && (
//               <span className="inline-block text-[12px] font-bold uppercase tracking-widest text-white mb-2 bg-red-600 px-2 py-0.5 rounded">{data.heroCategory || heroArticle?.category}</span>
//             )}
//             <h1 className="text-white font-bold leading-tight mb-2" style={{ fontSize: isMobile ? 20 : 28 }}>{data.heroHeadline || heroArticle?.title || "No article yet — click + to choose one"}</h1>
//             {(data.heroDescription || heroArticle?.excerpt) && <p className="text-white/80 text-[15px] max-w-md mb-3">{data.heroDescription || heroArticle?.excerpt}</p>}
//             <div className="flex items-center gap-3">
//               {data.heroCtaLabel && (
//                 <a href={data.heroCtaUrl} className="inline-block text-[14px] font-bold bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-100 transition-colors">{data.heroCtaLabel}</a>
//               )}
//               <span className="text-white/70 text-[13px]">{data.heroAuthor || heroArticle?.author} · {data.heroDate || heroArticle?.date}</span>
//             </div>
//           </div>
//           </EditableArticleSlot>

//           <div className="flex flex-col" style={{ gap, height: isMobile ? undefined : (data.heroImageHeight || 420) }}>
//             {heroSmallArticles.map((a, i) => (
//               <EditableArticleSlot article={a} key={`${a.id}-${i}`} className="flex-1" pinned={heroSmallHelpers.isPinned(i)} editable={editable} onPick={(id) => heroSmallHelpers.pin(i, id)} onClear={() => heroSmallHelpers.clear(i)} excludeIds={heroSmallExclude} currentArticleId={(data.heroSmallIds || [])[i]}>
//                 <div className="rounded-sm overflow-hidden relative group cursor-pointer h-full" style={{ background: a.img ? `url(${a.img}) center/cover no-repeat` : GRADIENT_COLORS_EDITORIAL[(i + 1) % GRADIENT_COLORS_EDITORIAL.length] }}>
//                   <div className="absolute inset-0 flex flex-col items-start justify-end p-4" style={{ background: "linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.55))" }}>
//                     <span className="text-[11px] font-bold uppercase tracking-wide text-white/90 mb-1">{a.category}</span>
//                     <p className="text-white text-[16px] font-bold leading-snug line-clamp-2 group-hover:text-red-300 transition-colors">{a.title}</p>
//                   </div>
//                 </div>
//               </EditableArticleSlot>
//             ))}
//           </div>
//         </div>

//         {/* Section 2: Editor's Picks */}
//         {data.editorsPicksEnabled !== false && (
//           <div className="mb-8">
//             <div className="flex items-center gap-2 mb-4">
//               <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.editorsPicksTitle || "Editor's Picks"}</h2>
//               <div className="flex-1 h-px bg-gray-200" />
//             </div>
//             <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${isMobile ? 2 : isTablet ? 2 : Math.min(data.editorsPicksCount || 4, 6)}, 1fr)` }}>
//               {masonryEditorsPicksArticles.map((a, i) => (
//                 <EditableArticleSlot key={`${a.id}-${i}`} pinned={masonryEditorsPicksHelpers.isPinned(i)} editable={editable} onPick={(id) => masonryEditorsPicksHelpers.pin(i, id)} onClear={() => masonryEditorsPicksHelpers.clear(i)} excludeIds={editorsPicksExclude} currentArticleId={(data.masonryEditorsPicksIds || [])[i]}>
//                   <ArticleCard article={a} showImage showCategory showDate compact />
//                 </EditableArticleSlot>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Section 3: Latest News + Sidebar */}
//         {data.latestNewsEnabled !== false && (
//           <div className={isMobile || isTablet ? "" : "flex items-start"} style={isMobile || isTablet ? undefined : { gap }}>
//             <div style={isMobile || isTablet ? undefined : { width: "70%" }} className="min-w-0 mb-8">
//               <div className="flex items-center gap-2 mb-4">
//                 <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.latestNewsTitle || "Latest News"}</h2>
//                 <div className="flex-1 h-px bg-gray-200" />
//               </div>
//               <div className="divide-y divide-gray-100">
//                 {masonryLatestNewsArticles.map((a, i) => (
//                   <EditableArticleSlot key={`${a.id}-${i}`} pinned={masonryLatestNewsHelpers.isPinned(i)} editable={editable} onPick={(id) => masonryLatestNewsHelpers.pin(i, id)} onClear={() => masonryLatestNewsHelpers.clear(i)} excludeIds={masonryLatestNewsExclude} currentArticleId={(data.masonryLatestNewsIds || [])[i]}>
//                     <ArticleRow article={a} showImage showCategory showDate showExcerpt={false} imageSize="medium" />
//                   </EditableArticleSlot>
//                 ))}
//               </div>
//             </div>
//             {!isMobile && !isTablet && (
//               <div style={{ width: "30%" }} className="shrink-0 divide-y divide-gray-100 [&>*]:py-5 first:[&>*]:pt-0 mb-8">
//                 {(data.sidebarWidgets || []).map((w) => (
//                   <div key={w.id}><SidebarWidget widget={w} data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} excludeIds={tracker.exclude()} /></div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {(isMobile || isTablet) && data.latestNewsEnabled !== false && (
//           <div className="mb-8 divide-y divide-gray-100 [&>*]:py-5 first:[&>*]:pt-0">
//             {(data.sidebarWidgets || []).map((w) => (
//               <div key={w.id}><SidebarWidget widget={w} data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} excludeIds={tracker.exclude()} /></div>
//             ))}
//           </div>
//         )}

//         {/* Section 4: More News Masonry Grid */}
//         {data.moreNewsEnabled !== false && (
//           <div className="mb-8">
//             <div className="flex items-center gap-2 mb-4">
//               <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.moreNewsTitle || "More News"}</h2>
//               <div className="flex-1 h-px bg-gray-200" />
//             </div>
//             <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-3"}`} style={{ gridAutoFlow: "dense" }}>
//               {moreNewsArticles.map((a, i) => {
//                 const isLarge = i % 3 === 0;
//                 return (
//                   <EditableArticleSlot key={`${a.id}-${i}`} article={a} style={!isMobile && isLarge ? { gridRow: "span 2" } : undefined} pinned={moreNewsHelpers.isPinned(i)} editable={editable} onPick={(id) => moreNewsHelpers.pin(i, id)} onClear={() => moreNewsHelpers.clear(i)} excludeIds={moreNewsExclude} currentArticleId={(data.moreNewsIds || [])[i]}>
//                     <div className="group cursor-pointer">
//                       <div className="rounded-sm mb-2 overflow-hidden" style={{ aspectRatio: isLarge ? "1/1" : "16/9", background: a.img ? `url(${a.img}) center/cover no-repeat` : GRADIENT_COLORS_EDITORIAL[i % GRADIENT_COLORS_EDITORIAL.length] }} />
//                       <span className="text-[11px] font-bold uppercase tracking-wide block mb-0.5" style={{ color: a.categoryColor }}>{a.category}</span>
//                       <p className="text-[12.5px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{a.title}</p>
//                       <p className="text-[12px] text-gray-400 mt-1">{a.date}</p>
//                     </div>
//                   </EditableArticleSlot>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Section 5: Category Grid */}
//         {data.categoryGridEnabled !== false && (data.categoryGridCategories || []).map((cat) => {
//           const catIdsKey = `masonryCatGrid_${cat.id}_ids`;
//           const catHelpers = makePinHelpers(data, catIdsKey, cat.articleCount || 4, blockId, onUpdateBlock);
//           const catExclude = tracker.exclude();
//           const catArticles = tracker.track(resolveArticlesByCategoryName(cat.name, cat.articleCount || 4, { data, idsKey: catIdsKey, excludeIds: catExclude, categoryId: cat.categoryId, sampleFallback: SAMPLE_ARTICLES }));
//           const catHref = categoryHrefForCatItem(cat);
//           return (
//             <div key={cat.id} className="mb-8">
//               <div className="flex items-center gap-2 mb-4">
//                 <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{cat.name}</h2>
//                 <div className="flex-1 h-px bg-gray-200" />
//                 {catHref ? (
//                   <Link href={catHref} className="text-[13px] font-medium text-red-600 hover:underline whitespace-nowrap">View All →</Link>
//                 ) : (
//                   <span className="text-[13px] font-medium text-gray-400 whitespace-nowrap">View All →</span>
//                 )}
//               </div>
//               <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : ""}`} style={!isMobile && !isTablet ? { gridTemplateColumns: `repeat(${data.categoryGridColumns || 4}, 1fr)` } : undefined}>
//                 {catArticles.map((a, i) => (
//                   <EditableArticleSlot article={a} key={`${a.id}-${i}`} pinned={catHelpers.isPinned(i)} editable={editable} onPick={(id) => catHelpers.pin(i, id)} onClear={() => catHelpers.clear(i)} excludeIds={catExclude} currentArticleId={(data[catIdsKey] || [])[i]}>
//                     <div className="group cursor-pointer">
//                       <div className="rounded-sm mb-2 overflow-hidden" style={{ aspectRatio: data.categoryGridImageRatio || "4/3", background: a.img ? `url(${a.img}) center/cover no-repeat` : GRADIENT_COLORS_EDITORIAL[gradientIndexFor(a.id)] }} />
//                       <p className="text-[14px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{a.title}</p>
//                       <p className="text-[12px] text-gray-400 mt-1">{a.date}</p>
//                     </div>
//                   </EditableArticleSlot>
//                 ))}
//               </div>
//             </div>
//           );
//         })}

//         {/* Section 6: Trending Stories */}
//         {data.trendingEnabled !== false && (
//           <div className="mb-8">
//             <div className="flex items-center gap-2 mb-4">
//               <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.trendingTitle || "Trending Stories"}</h2>
//               <div className="flex-1 h-px bg-gray-200" />
//             </div>
//             <div className="flex gap-4 overflow-x-auto pb-1">
//               {tracker.track(resolveArticlesForBlock(data, data.trendingCount || 6, { idsKey: "trendingIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: tracker.exclude() })).map((a, i) => (
//                 <EditableArticleSlot article={a} key={`${a.id}-${i}`} className="flex-none" pinned={trendingHelpers.isPinned(i)} editable={editable} onPick={(id) => trendingHelpers.pin(i, id)} onClear={() => trendingHelpers.clear(i)} excludeIds={tracker.exclude()} currentArticleId={(data.trendingIds || [])[i]}>
//                   <div className="group cursor-pointer" style={{ width: isMobile ? 200 : 240 }}>
//                     <div className="rounded-sm mb-2 overflow-hidden" style={{ aspectRatio: "4/3", background: a.img ? `url(${a.img}) center/cover no-repeat` : GRADIENT_COLORS_EDITORIAL[i % GRADIENT_COLORS_EDITORIAL.length] }} />
//                     <p className="text-[14px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{a.title}</p>
//                     <p className="text-[10.5px] text-gray-500 mt-1 line-clamp-2 leading-snug">{a.excerpt}</p>
//                   </div>
//                 </EditableArticleSlot>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Section 7: Newsletter — full width */}
//       {data.newsletterEnabled !== false && (
//         <div className="px-4 py-10 text-center">
//           <div className="max-w-lg mx-auto rounded-xl p-8" style={{ backgroundColor: data.newsletterBg || "#f5f5f0", borderRadius: data.newsletterRadius ?? 12 }}>
//             <h3 className="text-[18px] font-bold mb-1 text-gray-900">{data.newsletterHeading}</h3>
//             <p className="text-[12.5px] mb-4 text-gray-500">{data.newsletterSubheading}</p>
//             <NewsletterForm source="sidebar" buttonText={data.newsletterCtaLabel || "Subscribe"} />
//           </div>
//         </div>
//       )}

//       <div className="mx-auto" style={{ maxWidth: data.maxWidth || 1600, padding: pad }}>
//         {/* Section 8: Featured Authors */}
//         {data.authorsEnabled !== false && (
//           <div className="mb-8">
//             <div className="flex items-center gap-2 mb-5">
//               <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.authorsTitle || "Featured Authors"}</h2>
//               <div className="flex-1 h-px bg-gray-200" />
//             </div>
//             <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${isMobile ? 2 : Math.min(data.authorsCount || 4, 8)}, 1fr)` }}>
//               {AUTHORS_SAMPLE.slice(0, data.authorsCount || 4).map((author, i) => (
//                 <div key={i} className="flex flex-col items-center text-center">
//                   <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-[16px] font-bold text-gray-600 mb-2">{author.initials}</div>
//                   <p className="text-[12.5px] font-bold text-gray-900">{author.name}</p>
//                   <p className="text-[10.5px] text-gray-500 mb-1.5">{author.role}</p>
//                   <div className="flex gap-1.5 text-[12px] text-gray-400">
//                     <span className="hover:text-red-600 cursor-pointer">●</span>
//                     <span className="hover:text-red-600 cursor-pointer">●</span>
//                     <span className="hover:text-red-600 cursor-pointer">●</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Section 9: Advertisement */}
//         {data.adEnabled !== false && (
//           <AdBanner image={data.adImage} linkUrl={data.adLinkUrl} altText={data.adAltText} width={data.adWidth} height={data.adHeight || adSizeToHeight(data.adSize)} sizeLabel={data.adSize || "970x250"} className="mb-8" dark={false} />
//         )}

//         {/* Section 10: Latest Articles Grid */}
//         {data.latestGridEnabled !== false && (
//           <div className="mb-8">
//             <div className="flex items-center gap-2 mb-4">
//               <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.latestGridTitle || "Latest Articles"}</h2>
//               <div className="flex-1 h-px bg-gray-200" />
//             </div>
//             <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-4"}`}>
//               {tracker.track(resolveArticlesForBlock(data, masonryLatestGridVisible, { idsKey: "masonryLatestGridIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: tracker.exclude() })).map((a, i) => (
//                 <EditableArticleSlot key={`${a.id || i}-${i}`} pinned={masonryLatestGridHelpers.isPinned(i)} editable={editable} onPick={(id) => masonryLatestGridHelpers.pin(i, id)} onClear={() => masonryLatestGridHelpers.clear(i)} excludeIds={tracker.exclude()} currentArticleId={(data.masonryLatestGridIds || [])[i]}>
//                   <ArticleCard article={a} showImage showCategory showDate compact />
//                 </EditableArticleSlot>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Load More */}
//         {data.loadMoreEnabled !== false && data.latestGridEnabled !== false && masonryLatestGridVisible < totalArticlesAvailable && (
//           <div className="flex justify-center mb-2">
//             <button
//               onClick={() => setMasonryLatestGridVisible((c) => Math.min(c + Math.max(data.loadMoreIncrement || 3, 3), totalArticlesAvailable))}
//               className="px-6 py-2.5 text-[14px] font-bold border-2 transition-colors hover:bg-gray-50"
//               style={{ color: data.loadMoreColor || "#cc0000", borderColor: data.loadMoreColor || "#cc0000", borderRadius: data.loadMoreRadius ?? 6 }}
//             >
//               {data.loadMoreLabel || "Load More Articles"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function MasonryEditorialRenderer({ data, device, blockId, onUpdateBlock }) {
//   return <MasonryEditorialLayout data={data} device={device} blockId={blockId} onUpdateBlock={onUpdateBlock} />;
// }

// /** Renders just the homepage blocks (no admin chrome, no device switcher, no
//  *  edit affordances since onUpdateBlock is never passed) — this is what the
//  *  public homepage (app/page.jsx) renders, so the site always matches
//  *  exactly what the admin sees in the builder's live preview. */
// export function HomepageBlocksRenderer({ blocks, device = "desktop" }) {
//   if (!blocks || blocks.length === 0) return null;
//   return (
//     <div className="divide-y divide-gray-100">
//       {blocks.map((block) => (
//         <BlockRenderer key={block.id} blockId={block.id} type={block.type} data={block.data} device={device} />
//       ))}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import { Monitor, Tablet, Smartphone, X, Plus } from "lucide-react";
import { resolveArticlesForBlock, resolveSingleArticle, resolveArticlesByCategoryName, resolveTrendingArticles, pinArticleAtIndex, clearArticlePin, createArticleUsageTracker, articleHref, categoryHref, authorHref, getArticlesForAuthor, getAllPreviewArticlesSorted } from "@/lib/articlesSource";
import { getCategories } from "@/lib/categoriesArticlesApi";
import { getAuthors } from "@/lib/authorsApi";
import ArticlePickerModal from "./ArticlePickerModal";
import NewsletterForm from "@/components/site/NewsletterForm";

/** Wraps card content in a real Next.js Link to the article when we have a
 *  resolvable URL (real published article); otherwise renders a plain,
 *  non-clickable wrapper so sample/placeholder content never links to a
 *  dead "#" route. `as` controls the wrapper element used in the fallback
 *  case so layout doesn't shift (e.g. "div", "li", "article"). */
function CardLink({ article, className, style, as: As = "div", children }) {
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

/**
 * Cover-image div used throughout the Newspaper Editorial template (hero,
 * left/right sidebar cards, category-section cards). Renders the gradient
 * placeholder as the base background always, then layers a real <img> on
 * top only once it has actually finished loading. If a real article's image
 * URL is broken/unreachable, onError hides the <img> again so the card
 * falls back to the gradient instead of sitting there blank/white — this is
 * what previously made cards with a bad image URL look empty in the admin
 * preview instead of showing *something*.
 */
function CoverImage({ src, gradient, className = "", style = {} }) {
  const [failed, setFailed] = useState(false);
  const showImg = !!src && !failed;
  return (
    <div className={className} style={{ background: gradient, ...style }}>
      {showImg && (
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

/** Resolves the public URL for a category name/id shown on a homepage block
 *  (e.g. the "More →" link on a Category Section). Homepage blocks usually
 *  only carry a category *name* string, so this looks the real category up
 *  by name (case-insensitive) to find its slug. */
function categoryHrefByName(name) {
  if (typeof window === "undefined" || !name) return null;
  const categories = getCategories();
  const match = categories.find((c) => (c.name || c.title || "").toLowerCase() === String(name).toLowerCase());
  return match ? categoryHref(match) : null;
}

/** Resolves the public "View All" URL for a category-grid item. Prefers the
 *  stable `categoryId` stored on the item (set when the admin picks the
 *  category from the dropdown) so the link is exact even if the category
 *  was later renamed; falls back to matching by name for older saved data
 *  that only has a text label. */
function categoryHrefForCatItem(cat) {
  if (typeof window === "undefined" || !cat) return null;
  if (cat.categoryId) {
    const categories = getCategories();
    const match = categories.find((c) => c._id === cat.categoryId);
    if (match) return categoryHref(match);
  }
  return categoryHrefByName(cat.name);
}

// Fallback sample data — only used for preview when no real articles have
// been added yet on the Articles page, so the builder never looks broken.
const SAMPLE_ARTICLES = [
  { id: 1, category: "POLITICS", categoryColor: "#7c3aed", title: "Live updates from The White House: A new chapter in transatlantic diplomacy", excerpt: "Senior diplomats from twelve nations convened in an extraordinary tension yesterday as mounting trade tensions threatened...", date: "2h ago", img: null, featured: true },
  { id: 2, category: "HEALTH", categoryColor: "#059669", title: "How Sarah Caped With Her Chronic Disease — And Found Clarity", excerpt: "She found new strength in unexpected places...", date: "3h ago", img: null },
  { id: 3, category: "ECONOMY", categoryColor: "#d97706", title: "A Global Economic Redress: Asia strategies with high inflation", excerpt: "Markets are responding to unprecedented policy shifts across the continent...", date: "4h ago", img: null },
  { id: 4, category: "JUSTICE", categoryColor: "#dc2626", title: "Regulating technology: how courts are reshaping AI liability law", excerpt: "In a landmark ruling, three appeals courts simultaneously held tech firms accountable...", date: "5h ago", img: null },
  { id: 5, category: "BUSINESS", categoryColor: "#2563eb", title: "It's Never Been More Expensive to Visit New York City", excerpt: "The average nightly rate in Manhattan has crossed $489 for the second consecutive quarter...", date: "6h ago", img: null, featured: true },
  { id: 6, category: "FREE SPEECH", categoryColor: "#7c3aed", title: "The new showdown: how governments are reshaping modern rhetoric", excerpt: "From Brussels to Washington, legislators are testing the boundaries of protected speech...", date: "7h ago", img: null },
  { id: 7, category: "WHITE HOUSE", categoryColor: "#dc2626", title: "Extra £2: is for half a price? The surcharge economy strikes again", excerpt: "Restaurants, hotels, transport and the broader hospitality industry is quietly normalizing...", date: "8h ago", img: null },
  { id: 8, category: "OPINION", categoryColor: "#6b7280", title: "The year for deliberate slowness in an age of algorithmic haste", excerpt: "A celebrated technology critic says we must reclaim intentional pause from the machines...", date: "1d ago", img: null },
];

const DEVICE_SIZES = {
  desktop: { label: "Desktop", icon: Monitor, width: "100%", maxWidth: "none" },
  tablet: { label: "Tablet", icon: Tablet, width: "768px", maxWidth: "768px" },
  mobile: { label: "Mobile", icon: Smartphone, width: "390px", maxWidth: "390px" },
};

export default function LivePreviewPanel({ blocks, onClose, inline = false, onUpdateBlock }) {
  const [device, setDevice] = useState("desktop");
  const cfg = DEVICE_SIZES[device];

  // ── Inline mode: rendered directly inside builder page ──────────────────
  if (inline) {
    return (
      <div className="w-full">
        {/* Device switcher bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-gray-50/60">
          {Object.entries(DEVICE_SIZES).map(([key, d]) => {
            const Icon = d.icon;
            return (
              <button
                key={key}
                onClick={() => setDevice(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[14px] font-medium transition-colors ${device === key ? "bg-primary text-white" : "border border-border text-ink-500 hover:bg-gray-50"}`}
              >
                <Icon size={13} />{d.label}
              </button>
            );
          })}
        </div>

        {/* Preview body */}
        <div className="bg-gray-100 flex justify-center p-5">
          <div
            className="bg-white shadow rounded-lg overflow-hidden transition-all duration-300 w-full"
            style={{
              maxWidth: cfg.maxWidth === "none" ? "100%" : cfg.maxWidth,
              minHeight: "400px",
            }}
          >
            <div className="divide-y divide-gray-100">
              {blocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-[15px] text-ink-400 font-medium">No blocks added yet</p>
                  <p className="text-[14px] text-ink-300 mt-1">Add blocks from the left panel to see a preview here.</p>
                </div>
              ) : (
                blocks.map((block) => (
                  <BlockRenderer key={block.id} blockId={block.id} type={block.type} data={block.data} device={device} onUpdateBlock={onUpdateBlock} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Modal / fullscreen mode (legacy — kept for backward compat) ──────────
  return (
    <div className="fixed inset-0 z-50 bg-ink-900/60 flex flex-col" style={{ backdropFilter: "blur(2px)" }}>
      {/* Top bar */}
      <div className="bg-white border-b border-border flex items-center justify-between px-5 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <p className="text-[16px] font-bold text-ink-900">Homepage Preview</p>
          <span className="text-[13px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Live preview</span>
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(DEVICE_SIZES).map(([key, d]) => {
            const Icon = d.icon;
            return (
              <button key={key} onClick={() => setDevice(key)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[14px] font-medium transition-colors ${device === key ? "bg-primary text-white" : "border border-border text-ink-500 hover:bg-gray-50"}`}>
                <Icon size={13} />{d.label}
              </button>
            );
          })}
          <div className="w-px h-5 bg-border mx-1" />
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-gray-100 hover:text-ink-700 transition-colors">
            <X size={17} />
          </button>
        </div>
      </div>

      {/* Preview body */}
      <div className="flex-1 overflow-auto bg-gray-100 flex justify-center p-6">
        <div
          className="bg-white shadow-2xl rounded-lg overflow-auto transition-all duration-300"
          style={{ width: cfg.width, maxWidth: cfg.maxWidth === "none" ? "100%" : cfg.maxWidth, minHeight: "600px", maxHeight: "100%" }}
        >
          {/* Render blocks */}
          <div className="divide-y divide-gray-100">
            {blocks.map((block) => (
              <BlockRenderer key={block.id} type={block.type} data={block.data} device={device} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SiteHeader({ device }) {
  const isMobile = device === "mobile";
  return (
    <div>
      {/* Top bar */}
      <div className="bg-black text-white flex items-center justify-between px-4 py-1.5 text-[13px]">
        <span className="text-gray-400">Friday · Jun 27, 2026</span>
        <div className="flex items-center gap-3">
          <span className="text-gray-400">Login</span>
          <span className="bg-red-700 text-white px-2 py-0.5 rounded font-bold text-[12px]">Subscribe</span>
        </div>
      </div>
      {/* Masthead */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        {isMobile ? (
          <>
            <div className="text-[12px] text-gray-500">☰</div>
            <span className="font-black text-[17px] tracking-tight">HighTableNews</span>
            <div className="text-[12px] text-gray-500">🔍</div>
          </>
        ) : (
          <>
            <div />
            <span className="font-black text-[22px] tracking-tight">HighTableNews</span>
            <div className="flex items-center gap-2 text-[13px] text-gray-500">
              <span>Login</span>
              <span className="bg-red-700 text-white px-2 py-1 rounded font-bold text-[12px]">Subscribe</span>
            </div>
          </>
        )}
      </div>
      {/* Nav */}
      {!isMobile && (
        <div className="border-b border-gray-200 px-4 py-2 flex items-center gap-5 text-[13px] font-bold uppercase tracking-wide text-gray-700 overflow-x-auto">
          {["Power", "Technology", "Profiles", "Interviews", "Power Lists", "Companies", "Media"].map((item) => (
            <span key={item} className="whitespace-nowrap hover:text-red-600 cursor-pointer transition-colors">{item}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function SiteFooter() {
  return (
    <div className="bg-black text-white px-6 py-8 mt-4">
      <div className="text-[18px] font-black mb-2">HighTableNews</div>
      <p className="text-gray-400 text-[14px]">Clarity, depth, and the courage to ask harder questions.</p>
      <div className="border-t border-gray-800 mt-6 pt-4 text-[13px] text-gray-500">© 2026 HighTableNews Ltd.</div>
    </div>
  );
}

/** Homepage "Breaking News" block — a scrolling ticker of the latest real
 *  articles. Pauses on hover and each headline links to its article. */
function BreakingNewsTicker({ data, articles }) {
  const [paused, setPaused] = useState(false);
  const duration = Math.max(8, Math.round(1400 / (data.speed || 80)));
  const track = (
    <>
      {articles.map((a, i) => (
        <span key={`${a.id}-${i}`} className="inline-flex items-center">
          {a.slug ? (
            <Link href={articleHref(a)} className="hover:underline underline-offset-2">{a.title}</Link>
          ) : (
            <span>{a.title}</span>
          )}
          <span className="mx-3 opacity-50">•</span>
        </span>
      ))}
    </>
  );
  return (
    <div className="flex items-stretch overflow-hidden" style={{ backgroundColor: data.bg || "#111" }}>
      <div className="px-3 py-2 font-bold text-[13px] shrink-0 flex items-center" style={{ backgroundColor: data.labelBg || "#cc0000", color: data.textColor || "#fff" }}>
        {data.labelText || "BREAKING"}
      </div>
      <div
        className="flex-1 overflow-hidden flex items-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="whitespace-nowrap py-2 px-3 text-[13px]"
          style={{ color: data.textColor || "#fff", animation: `htn-ticker ${duration}s linear infinite`, animationPlayState: paused ? "paused" : "running" }}
        >
          {track}
          {track}
        </div>
      </div>
    </div>
  );
}

function BlockRenderer({ type, data, device, blockId, onUpdateBlock }) {
  const isMobile = device === "mobile";

  switch (type) {
    case "breakingNews": {
      if (data.enabled === false) return null;
      const tickerArticles = resolveArticlesForBlock(data, data.limit || 5, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES.slice(0, 5) });
      if (tickerArticles.length === 0) return null;
      return <BreakingNewsTicker data={data} articles={tickerArticles} />;
    }

    case "stickyNotice":
      if (data.enabled === false) return null;
      return (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5" style={{ backgroundColor: data.bg || "#1a1a1a" }}>
          <p className="text-[14px]" style={{ color: data.textColor || "#fff" }}>{data.text}</p>
          {data.ctaLabel && (
            <a href={data.ctaUrl} className="shrink-0 text-[13px] font-bold px-3 py-1 rounded" style={{ backgroundColor: data.ctaBg || "#cc0000", color: "#fff" }}>{data.ctaLabel}</a>
          )}
        </div>
      );

    case "heroStory": {
      const heroArticle = resolveSingleArticle(data, { idKey: "articleId", sampleFallback: SAMPLE_ARTICLES[0] });
      const heroTitle = data.title || heroArticle?.title || "Global Markets Rally As Inflation Fears Ease";
      const heroExcerpt = data.subheadline || heroArticle?.excerpt || "";
      const heroCategory = data.category || heroArticle?.category || "";
      const heroImg = data.bgImage || heroArticle?.img;
      const heroUrl = (data.ctaUrl && data.ctaUrl !== "#") ? data.ctaUrl : articleHref(heroArticle);
      return (
        <div
          className="relative overflow-hidden"
          style={{
            background: heroImg ? `linear-gradient(rgba(0,0,0,${(data.overlayOpacity ?? 50)/100}),rgba(0,0,0,${(data.overlayOpacity ?? 50)/100})), url(${heroImg}) center/cover no-repeat` : "linear-gradient(135deg, #1a1a2e 0%, #2d1b1b 50%, #0d1117 100%)",
            paddingTop: isMobile ? 32 : (data.paddingTop || 48),
            paddingBottom: isMobile ? 32 : (data.paddingBottom || 48),
            paddingLeft: isMobile ? 16 : 40,
            paddingRight: isMobile ? 16 : 40,
            textAlign: data.alignment || "left",
          }}
        >
          {data.showCategory && heroCategory && (
            <span className="inline-block text-[12px] font-bold uppercase tracking-widest text-red-400 mb-2">{heroCategory}</span>
          )}
          <h1
            className="text-white leading-tight font-bold mb-3"
            style={{
              fontSize: isMobile ? Math.max((data.titleSize || 38) * 0.7, 22) : (data.titleSize || 38),
              fontWeight: data.titleWeight === "extrabold" ? 800 : data.titleWeight === "bold" ? 700 : data.titleWeight === "semibold" ? 600 : 400,
              color: data.titleColor || "#ffffff",
              fontFamily: data.fontFamily === "serif" || data.fontFamily === "georgia" || data.fontFamily === "playfair" ? "Georgia, serif" : "inherit",
            }}
          >
            {heroUrl ? (
              <Link href={heroUrl} className="hover:underline underline-offset-4">{heroTitle}</Link>
            ) : (
              heroTitle
            )}
          </h1>
          {heroExcerpt && (
            <p className="text-white/75 mb-4" style={{ fontSize: isMobile ? 16 : 18 }}>{heroExcerpt}</p>
          )}
          {data.showCta && data.ctaLabel && heroUrl && (
            <Link href={heroUrl} className="inline-block text-[14px] font-bold bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">{data.ctaLabel}</Link>
          )}
        </div>
      );
    }

    case "threeColumnLayout":
      if (isMobile) return <ThreeColumnMobile data={data} />;
      return <ThreeColumnDesktop data={data} />;

    case "newsFeed":
      return (
        <div className="px-4 py-5">
          {data.title && (
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-[15px] font-bold uppercase tracking-widest text-gray-900">{data.title}</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          )}
          {data.layout === "grid" ? (
            <div className="grid grid-cols-2 gap-3">
              {resolveArticlesForBlock(data, data.limit || 6, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
                <ArticleCard key={`${a.id}-${i}`} article={a} showImage={data.showImages !== false} showCategory={data.showCategory !== false} showDate={data.showDate !== false} showExcerpt={false} compact />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {resolveArticlesForBlock(data, data.limit || 6, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
                <ArticleRow key={`${a.id}-${i}`} article={a} showImage={data.showImages !== false} showCategory={data.showCategory !== false} showDate={data.showDate !== false} showExcerpt={data.showExcerpt !== false} imageSize={data.imageSize} />
              ))}
            </div>
          )}
        </div>
      );

    case "topStoriesGrid":
      return (
        <div className="px-4 py-4">
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${isMobile ? 2 : (data.columns || 4)}, 1fr)` }}>
            {resolveArticlesForBlock(data, data.limit || 4, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
              <ArticleCard
                key={`${a.id}-${i}`} article={a}
                showImage={data.showImage !== false}
                showCategory={data.showCategory !== false}
                showDate compact
                cardWidth={data.cardWidth || 0}
                cardHeight={data.cardHeight || 0}
                titleFontSize={data.titleFontSize || 15}
                categoryFontSize={data.categoryFontSize || 11}
                metaFontSize={data.metaFontSize || 12}
              />
            ))}
          </div>
        </div>
      );

    case "categorySection": {
      const moreHref = categoryHrefByName(data.category);
      return (
        <div className="px-4 py-5" style={{ backgroundColor: data.bg || "#fff" }}>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[14px] font-black uppercase tracking-widest" style={{ color: data.textColor || "#111" }}>{data.title || data.category}</h2>
            <div className="flex-1 h-px" style={{ backgroundColor: data.textColor ? data.textColor + "30" : "#e5e7eb" }} />
            {moreHref ? (
              <Link href={moreHref} className="text-[13px] font-medium text-red-600 hover:underline">More →</Link>
            ) : (
              <span className="text-[13px] font-medium text-red-600/50">More →</span>
            )}
          </div>
          {data.layout === "list" ? (
            <div className="divide-y divide-gray-100">
              {resolveArticlesForBlock(data, data.limit || 4, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
                <ArticleRow key={`${a.id}-${i}`} article={a} showImage={data.showImages !== false} showCategory={false} showDate showExcerpt={false} />
              ))}
            </div>
          ) : data.layout === "carousel" ? (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {resolveArticlesForBlock(data, data.limit || 5, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
                <div key={`${a.id}-${i}`} className="flex-none w-48">
                  <ArticleCard article={a} showImage={data.showImages !== false} showCategory compact />
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
              {resolveArticlesForBlock(data, data.limit || 6, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
                <ArticleCard key={`${a.id}-${i}`} article={a} showImage={data.showImages !== false} showCategory compact />
              ))}
            </div>
          )}
        </div>
      );
    }

    case "featuredStoriesRow":
      return (
        <div className="px-4 py-5">
          {data.title && (
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-[14px] font-black uppercase tracking-widest text-gray-900">{data.title}</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          )}
          <div className="flex gap-3 overflow-x-auto">
            {resolveArticlesForBlock(data, data.limit || 4, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
              <div key={`${a.id}-${i}`} className="flex-none" style={{ width: isMobile ? 160 : 200 }}>
                {data.showImage !== false && (
                  <div
                    className="rounded-md mb-2 flex items-end p-2 relative overflow-hidden"
                    style={{
                      height: data.imageHeight || 120,
                      background: `linear-gradient(135deg, ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]})`
                    }}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded" style={{ backgroundColor: a.categoryColor, color: "#fff" }}>{a.category}</span>
                  </div>
                )}
                <p className="text-[14px] font-semibold text-gray-900 leading-snug line-clamp-2">{a.title}</p>
                <p className="text-[12px] text-gray-400 mt-1">{a.date}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "opinion":
      return (
        <div className="px-4 py-5" style={{ backgroundColor: data.bg || "#f8f8f6" }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[12px] font-black uppercase tracking-widest text-gray-400">Opinion</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-md bg-gradient-to-br from-gray-300 to-gray-400 flex-none" />
            <div>
              <p className="text-[17px] font-serif font-bold leading-snug text-gray-900 italic mb-2">"{data.title}"</p>
              {data.author && <p className="text-[13px] text-gray-500 font-medium">— {data.author}</p>}
            </div>
          </div>
        </div>
      );

    case "authorSpotlight":
      return (
        <div className="px-4 py-5">
          {data.title && <h2 className="text-[14px] font-black uppercase tracking-widest text-gray-900 mb-3">{data.title}</h2>}
          <div className="flex gap-4 overflow-x-auto">
            {Array.from({ length: data.limit || 3 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-none">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border-2 border-white shadow-md" />
                <div className="text-center">
                  <div className="h-2 w-16 rounded bg-gray-200 mb-1" />
                  <div className="h-1.5 w-12 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "advertisement": {
      const adInner = (
        <div
          className="border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 rounded-md mx-auto"
          style={{ height: data.height || 90, width: data.width > 0 ? data.width : "100%", maxWidth: "100%" }}
        >
          {data.imageUrl ? (
            <img src={data.imageUrl} alt={data.altText || "Advertisement"} className="w-full h-full object-cover rounded-md" />
          ) : (
            <>
              <span className="text-[12px] font-bold uppercase tracking-widest mb-1">Advertisement</span>
              <span className="text-[13px]">{data.size || "leaderboard"} · {data.height || 90}px</span>
            </>
          )}
        </div>
      );
      return (
        <div className="px-4 py-3">
          {data.imageUrl && data.linkUrl ? (
            <a href={data.linkUrl} target="_blank" rel="noopener noreferrer sponsored" className="block" style={{ width: data.width > 0 ? data.width : "100%", maxWidth: "100%", marginInline: "auto" }}>
              {adInner}
            </a>
          ) : adInner}
        </div>
      );
    }

    case "newsletter":
      if (data.enabled === false) return null;
      return (
        <div className="px-4 py-8 text-center" style={{ backgroundColor: data.bg || "#f5f5f0" }}>
          <h3 className="text-[18px] font-bold mb-1" style={{ color: data.textColor || "#111" }}>{data.heading}</h3>
          <p className="text-[15px] mb-4" style={{ color: (data.textColor || "#111") + "99" }}>{data.subheading}</p>
          <div className="max-w-sm mx-auto">
            <NewsletterForm
              source="sidebar"
              placeholder={data.placeholder || "Enter your email"}
              buttonText={data.ctaLabel || "Subscribe"}
              buttonBg={data.ctaBg || "#cc0000"}
              buttonTextColor={data.ctaTextColor || "#fff"}
            />
          </div>
        </div>
      );

    case "fullWidthBanner":
      return (
        <div
          className="relative overflow-hidden flex flex-col items-start justify-center px-8"
          style={{
            height: isMobile ? Math.min(data.height || 320, 200) : (data.height || 320),
            background: data.imageUrl ? `${data.overlayColor || "rgba(0,0,0,0.45)"}, url(${data.imageUrl}) center/cover no-repeat` : `linear-gradient(135deg, #1a1a2e, #8b1a1a)`,
          }}
        >
          <h2 className="text-white font-bold mb-2" style={{ fontSize: isMobile ? 22 : 34 }}>{data.heading}</h2>
          {data.subheading && <p className="text-white/75 mb-3 text-[15px]">{data.subheading}</p>}
          {data.ctaLabel && (
            <a href={data.ctaUrl} className="inline-block bg-white text-gray-900 text-[14px] font-bold px-4 py-2 rounded hover:bg-gray-100 transition-colors">{data.ctaLabel}</a>
          )}
        </div>
      );

    case "video":
      return (
        <div className="px-4 py-4">
          <div className="relative rounded-md overflow-hidden bg-gray-900 flex items-center justify-center" style={{ height: isMobile ? 180 : 260 }}>
            <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <div className="h-0 w-0 border-y-[8px] border-y-transparent border-l-[14px] border-l-gray-900 ml-1" />
            </div>
            <p className="absolute bottom-3 left-4 text-white text-[14px] font-semibold">{data.title || "Featured video"}</p>
            {data.caption && <p className="absolute bottom-8 left-4 text-white/60 text-[13px]">{data.caption}</p>}
          </div>
        </div>
      );

    case "customHtml":
      if (data.enabled === false) return null;
      return (
        <div className="px-4 py-4">
          {data.html && data.html !== "<!-- Add custom markup -->" ? (
            <div className="text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: data.html }} />
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-md p-6 text-center text-[14px] text-gray-400">Custom HTML block — no content added yet</div>
          )}
        </div>
      );

    case "newspaperEditorial":
      return <NewspaperEditorialRenderer data={data} device={device} blockId={blockId} onUpdateBlock={onUpdateBlock} />;

    case "modernMagazineLayout":
      return <ModernMagazineRenderer data={data} device={device} blockId={blockId} onUpdateBlock={onUpdateBlock} />;

    case "darkNewsLayout":
      return <DarkNewsRenderer data={data} device={device} blockId={blockId} onUpdateBlock={onUpdateBlock} />;

    case "masonryEditorialLayout":
      return <MasonryEditorialRenderer data={data} device={device} blockId={blockId} onUpdateBlock={onUpdateBlock} />;

    default:
      return null;
  }
}

const GRADIENT_COLORS = [
  "#1a1a2e, #16213e",
  "#1a2e1a, #163016",
  "#2e1a1a, #301616",
  "#1a1e2e, #161630",
  "#2e2a1a, #302816",
];

function gradientIndexFor(id) {
  const key = String(id ?? "0");
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return hash % GRADIENT_COLORS.length;
}

function ArticleCard({ article, showImage, showCategory, showDate, showExcerpt, compact,
  cardWidth = 0, cardHeight = 0, titleFontSize = 15, categoryFontSize = 11, metaFontSize = 12
}) {
  const cardStyle = {};
  if (cardWidth > 0) cardStyle.width = cardWidth;
  if (cardHeight > 0) { cardStyle.height = cardHeight; cardStyle.overflow = "hidden"; }
  return (
    <CardLink article={article} className="group block cursor-pointer" style={cardStyle}>
      {showImage && (
        <div
          className="rounded-md mb-2 overflow-hidden relative bg-cover bg-center"
          style={{
            height: compact ? 112 : 168,
            background: article.img
              ? `url(${article.img}) center/cover no-repeat`
              : `linear-gradient(135deg, ${GRADIENT_COLORS[gradientIndexFor(article.id)]})`,
          }}
        >
          {showCategory && article.category && (
            <span className="absolute bottom-1.5 left-1.5 font-bold uppercase px-1.5 py-0.5 rounded" style={{ fontSize: categoryFontSize, backgroundColor: article.categoryColor, color: "#fff" }}>{article.category}</span>
          )}
        </div>
      )}
      {showCategory && !showImage && article.category && (
        <span className="font-bold uppercase tracking-wide mb-0.5 block" style={{ fontSize: categoryFontSize, color: article.categoryColor }}>{article.category}</span>
      )}
      <p className="font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors" style={{ fontSize: titleFontSize }}>{article.title}</p>
      {showDate && <p className="text-gray-400 mt-1" style={{ fontSize: metaFontSize }}>{article.date}</p>}
    </CardLink>
  );
}

function ArticleRow({ article, showImage, showCategory, showDate, showExcerpt, imageSize }) {
  const imgWidth = imageSize === "large" ? 168 : imageSize === "small" ? 84 : 128;
  const imgHeight = imageSize === "large" ? 118 : imageSize === "small" ? 62 : 92;
  return (
    <CardLink article={article} className="flex gap-3 py-3 group cursor-pointer">
      {showImage && (
        <div
          className="flex-none rounded-md overflow-hidden"
          style={{
            width: imgWidth,
            height: imgHeight,
            background: article.img
              ? `url(${article.img}) center/cover no-repeat`
              : `linear-gradient(135deg, ${GRADIENT_COLORS[gradientIndexFor(article.id)]})`,
          }}
        />
      )}
      <div className="flex-1 min-w-0">
        {showCategory && article.category && (
          <span className="text-[11px] font-bold uppercase tracking-wide mb-0.5 block" style={{ color: article.categoryColor }}>{article.category}</span>
        )}
        <p className="text-[14px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{article.title}</p>
        {showExcerpt && article.excerpt && <p className="text-[13px] text-gray-500 mt-0.5 line-clamp-2 leading-snug">{article.excerpt}</p>}
        {showDate && <p className="text-[12px] text-gray-400 mt-1">{article.date}</p>}
      </div>
    </CardLink>
  );
}

function ThreeColumnDesktop({ data }) {
  return (
    <div className="grid grid-cols-[200px_1fr_220px] gap-0 divide-x divide-gray-100">
      {/* Left: Most Read */}
      <div className="px-4 py-5">
        <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary-500 inline-block" />
          {data.leftTitle || "Most Read"}
        </h3>
        <ol className="space-y-3">
          {(data.leftItems || []).map((item, i) => (
            <li key={item.id || i} className="flex gap-2 group cursor-pointer">
              {data.leftShowNumbers && <span className="text-[13px] font-black text-primary-500/60 shrink-0 w-4 mt-0.5">{i + 1}</span>}
              <span className="text-[14px] font-semibold text-gray-800 leading-snug group-hover:text-primary-600 transition-colors">{item.label}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Center: Latest News */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-[14px] font-black uppercase tracking-widest text-gray-900">{data.centerTitle || "Latest News"}</h2>
          {data.centerCategory && data.centerCategory !== "All" && (
            <span className="text-[12px] font-medium bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded">{data.centerCategory}</span>
          )}
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        {data.centerLayout === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {resolveArticlesForBlock(data, data.centerLimit || 5, { idsKey: "centerArticleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
              <ArticleCard key={`${a.id}-${i}`} article={a} showImage showCategory showDate compact />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {resolveArticlesForBlock(data, data.centerLimit || 5, { idsKey: "centerArticleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
              <ArticleRow key={`${a.id}-${i}`} article={a} showImage showCategory showDate showExcerpt={false} />
            ))}
          </div>
        )}
      </div>

      {/* Right: In Brief */}
      <div className="px-4 py-5 space-y-4">
        <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-500">{data.rightTitle || "In Brief"}</h3>
        <div className="space-y-2">
          {["Macron calls for 'new chapter' in EU defence cooperation", "Apple unveils major iOS update at WWDC", "Oil prices steady ahead of OPEC meeting", "Tesla reports record Q2 deliveries"].map((s, i) => (
            <div key={i} className="flex gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-400 shrink-0 mt-1.5" />
              <div>
                <p className="text-[13px] text-gray-700 leading-snug">{s}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{i + 2}h ago</p>
              </div>
            </div>
          ))}
        </div>
        {data.rightShowNewsletter && (
          <div className="rounded-lg border border-primary-100 bg-primary-50 p-3">
            <p className="text-[14px] font-bold text-gray-900 mb-1">{data.rightNewsletterHeading || "Stay ahead of the story"}</p>
            <NewsletterForm
              source="sidebar"
              layout="stack"
              size="sm"
              placeholder="Your email"
              buttonText="Subscribe"
              buttonBg="#2563eb"
            />
          </div>
        )}
        {data.rightShowAd && (() => {
          const rH = data.rightAdHeight > 0 ? data.rightAdHeight : (data.rightAdSize === "square" ? 180 : 250);
          const rW = data.rightAdWidth > 0 ? data.rightAdWidth : "100%";
          const adBody = data.rightAdImage ? (
            <img src={data.rightAdImage} alt="Advertisement" className="w-full object-cover rounded-md" style={{ height: rH }} />
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center text-[12px] text-gray-400 font-medium uppercase" style={{ height: rH }}>
              Ad — {data.rightAdSize || "sidebar"}
            </div>
          );
          return (
            <div style={{ width: rW, maxWidth: "100%", marginInline: "auto" }}>
              {data.rightAdImage && data.rightAdLinkUrl ? (
                <a href={data.rightAdLinkUrl} target="_blank" rel="noopener noreferrer sponsored" className="block">{adBody}</a>
              ) : adBody}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function ThreeColumnMobile({ data }) {
  return (
    <div>
      {/* Most Read on mobile */}
      <div className="px-4 py-4 border-b border-gray-100">
        <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-500 mb-3">{data.leftTitle || "Most Read"}</h3>
        <ol className="space-y-2">
          {(data.leftItems || []).slice(0, 3).map((item, i) => (
            <li key={item.id || i} className="flex gap-2">
              {data.leftShowNumbers && <span className="text-[13px] font-black text-primary-500/60 shrink-0 w-4">{i + 1}</span>}
              <span className="text-[14px] font-semibold text-gray-800 leading-snug">{item.label}</span>
            </li>
          ))}
        </ol>
      </div>
      {/* Latest News */}
      <div className="px-4 py-4">
        <h2 className="text-[13px] font-black uppercase tracking-widest text-gray-900 mb-3">{data.centerTitle || "Latest News"}</h2>
        <div className="divide-y divide-gray-100">
          {resolveArticlesForBlock(data, Math.min(data.centerLimit || 5, 4), { idsKey: "centerArticleIds", sampleFallback: SAMPLE_ARTICLES }).map((a, i) => (
            <ArticleRow key={`${a.id}-${i}`} article={a} showImage showCategory showDate showExcerpt={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Sample data for editorial layout ────────────────────────────────────────
const EDITORIAL_ARTICLES = [
  { id: 1, category: "ARTS • CULTURE", categoryColor: "#7c3aed", title: "Artist & Teacher in Classical Voice joins staff as lead contributor", excerpt: "A rare appointment signals a commitment to cultural depth across the editorial board.", author: "James Whitmore", date: "January 8, 2026", img: null },
  { id: 2, category: "OPINION", categoryColor: "#6b7280", title: "The new geography of influence: Why soft power is being redrawn", excerpt: "Traditional alliances are shifting as middle powers assert themselves with new boldness.", author: "Maya Chen", date: "January 8, 2026", img: null },
  { id: 3, category: "POLITICS", categoryColor: "#dc2626", title: "A state comptroller reservation bill heads to the governor's desk", excerpt: "Activists from full-day sit-ins at the state capitol as tension rises over fiscal oversight.", author: "Marcus Reid", date: "January 8, 2026", img: null },
  { id: 4, category: "BUSINESS", categoryColor: "#2563eb", title: "Global economic growth forecasts slashed, Asia blue struggles with high inflation", excerpt: "The IMF issues a revised outlook citing persistent supply chain fragility.", author: "Anna Cole", date: "January 8, 2026", img: null },
  { id: 5, category: "WHITE HOUSE • LIVE", categoryColor: "#dc2626", title: "Live updates from The White House: diplomatic tensions mount", excerpt: "Senior officials confirm back-channel talks with three European counterparts are ongoing.", author: "James Whitmore", date: "January 8, 2026", img: null },
  { id: 6, category: "ECONOMY", categoryColor: "#d97706", title: "It's Never Been More Expensive to Visit New York City", excerpt: "The average nightly rate in Manhattan has crossed $400 for the first time, pricing out middle-income travellers entirely.", author: "Anna Cole", date: "January 8, 2026", img: null },
  { id: 7, category: "HEALTH", categoryColor: "#059669", title: "How Sarah Coped With Her Chronic Disease — and Found Clarity", excerpt: "She found new strength in unexpected places, discovering how mindset shapes recovery.", author: "Mark Wells", date: "January 8, 2026", img: null },
  { id: 8, category: "ECONOMY", categoryColor: "#d97706", title: "It's Never Been More Expensive to Visit New York City this winter season", excerpt: "Visitor numbers remain robust even as costs spiral — but analysts warn the city may be pricing itself out of the mid-market travel segment permanently.", author: "James Thornton", date: "January 8, 2026", img: null },
  { id: 9, category: "FREE SPEECH • LAW", categoryColor: "#7c3aed", title: "Climate protest crackdown shows how wrong the ruling party is about free speech", excerpt: "Heavy-handed policing of environmental demonstrations has reignited a fierce constitutional debate that shows no sign of abating.", author: "Anna Leclerc", date: "January 8, 2026", img: null },
  { id: 10, category: "ARTS • CULTURE", categoryColor: "#7c3aed", title: "The new classicism: how ancient forms are reshaping modern galleries", excerpt: "From Athens to New York, curators are rediscovering the power of pre-modern aesthetics.", author: "Marcus Reid", date: "January 8, 2026", img: null },
  { id: 11, category: "FINANCE", categoryColor: "#2563eb", title: "Extra £2.50 for half a prawn? The surcharge economy has fully arrived", excerpt: "From service charges to optional gratuities at self-checkouts, Britain's hospitality industry is quietly rewriting the bill.", author: "Marcus Reid", date: "January 8, 2026", img: null },
  { id: 12, category: "BUSINESS", categoryColor: "#2563eb", title: "US aerospace operations revamp face unexpected turbulence", excerpt: "Budget reallocations and supply delays are reshaping the sector.", author: "Claire Fontaine", date: "January 8, 2026", img: null },
  { id: 13, category: "BUSINESS", categoryColor: "#2563eb", title: "Did You Know You Can Unsend and Edit Text Messages on Your iPhone", excerpt: "A feature many users still don't know about is changing how they communicate.", author: "Neil Harrison", date: "January 8, 2026", img: null },
  { id: 14, category: "BUSINESS", categoryColor: "#2563eb", title: "Live updates from The White House after defense bill passes Senate", excerpt: "Congressional approval sets the stage for major restructuring of military priorities.", author: "Mateo Vargas", date: "January 8, 2026", img: null },
  { id: 15, category: "BUSINESS", categoryColor: "#2563eb", title: "Guard Dog Protects Sheep From Prowling Puma in First Of Its Kind Footage", excerpt: "Wildlife conservationists are calling the video a landmark moment in livestock protection.", author: "Isabella Crane", date: "January 8, 2026", img: null },
];

const GRADIENT_COLORS_EDITORIAL = [
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  "linear-gradient(135deg, #1a2e1a 0%, #163016 100%)",
  "linear-gradient(135deg, #2e1a1a 0%, #301616 100%)",
  "linear-gradient(135deg, #1a1e2e 0%, #161630 100%)",
  "linear-gradient(135deg, #2e2a1a 0%, #302816 100%)",
];

function NewspaperEditorialRenderer({ data, device, blockId, onUpdateBlock }) {
  const isMobile = device === "mobile";
  const isTablet = device === "tablet";
  const topStoriesCount = data.topStoriesCount || 4;
  // Single tracker shared by every section on this template (top stories,
  // left sidebar, hero, category sections, right sidebar) so the page
  // prefers unused articles everywhere, and — only once real articles run
  // short — reuses whichever article has been shown the fewest times
  // instead of the same one or two stories repeating in every widget.
  const tracker = createArticleUsageTracker();
  const topStoriesArticles = resolveArticlesForBlock(data, topStoriesCount, { idsKey: "articleIds", sampleFallback: SAMPLE_ARTICLES, usageCounts: tracker.counts() });
  tracker.track(topStoriesArticles);

  function pinTopStory(index, articleId) {
    if (!onUpdateBlock) return;
    onUpdateBlock(blockId, pinArticleAtIndex(data, "articleIds", index, articleId, topStoriesCount));
  }
  function clearTopStory(index) {
    if (!onUpdateBlock) return;
    onUpdateBlock(blockId, clearArticlePin(data, "articleIds", index, topStoriesCount));
  }

  return (
    <div style={{ backgroundColor: data.bg || "#ffffff" }}>
      {/* ── Top Stories Grid ── */}
      {data.showTopStories !== false && (
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-[13px] font-black uppercase tracking-widest text-gray-900">{data.topStoriesTitle || "FEATURED STORIES"}</h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : `repeat(${topStoriesCount}, 1fr)` }}
          >
            {Array.from({ length: topStoriesCount }).map((_, i) => {
              const a = topStoriesArticles[i];
              const cardW = data.topStoriesCardWidth || 0;
              const cardH = data.topStoriesCardHeight || 0;
              const titleSz = data.topStoriesTitleSize || 12;
              const catSz = data.topStoriesCategorySize || 11;
              const cardStyle = {};
              if (cardW > 0) cardStyle.width = cardW;
              if (cardH > 0) { cardStyle.height = cardH; cardStyle.overflow = "hidden"; }
              const isPinned = Array.isArray(data.articleIds) && !!data.articleIds[i];
              return (
                <EditableArticleSlot
                  key={a?.id ?? `empty-${i}`}
                  article={a}
                  pinned={isPinned}
                  editable={!!onUpdateBlock}
                  onPick={(articleId) => pinTopStory(i, articleId)}
                  onClear={() => clearTopStory(i)}
                  currentArticleId={isPinned ? (data.articleIds || [])[i] : null}
                >
                  <div className="group cursor-pointer" style={cardStyle}>
                    <CoverImage
                      src={a?.img}
                      gradient={GRADIENT_COLORS_EDITORIAL[i % GRADIENT_COLORS_EDITORIAL.length]}
                      className="rounded-sm mb-2 relative overflow-hidden"
                      style={{ aspectRatio: data.topStoriesImageRatio || "4/3" }}
                    />
                    {a ? (
                      <>
                        <span className="font-bold uppercase tracking-wide block mb-0.5" style={{ fontSize: catSz, color: a.categoryColor || data.topStoriesCategoryColor }}>{a.category}</span>
                        <p className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors" style={{ fontSize: titleSz }}>{a.title}</p>
                        <p className="text-gray-500 mt-1 line-clamp-2 leading-snug" style={{ fontSize: Math.max(titleSz - 1, 9) }}>{a.excerpt}</p>
                      </>
                    ) : (
                      <p className="text-gray-400 leading-snug" style={{ fontSize: titleSz }}>No article yet — click + to choose one</p>
                    )}
                  </div>
                </EditableArticleSlot>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Three-Column Editorial ── */}
      {isMobile ? (
        <EditorialMobile data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
      ) : isTablet ? (
        <EditorialTablet data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
      ) : (
        <EditorialDesktop data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
      )}
    </div>
  );
}

/**
 * Wraps a single article card so the admin can hover it in the live preview
 * and click "+" to pin a real article (created on the Articles page) to that
 * exact card, or "×" to release the pin back to auto/latest. Renders children
 * untouched when `editable` is false (e.g. legacy modal preview with no
 * onUpdateBlock handler wired up).
 */
function EditableArticleSlot({ children, article, pinned, editable, onPick, onClear, className = "", style, excludeIds = [], currentArticleId = null }) {
  const [open, setOpen] = useState(false);

  // Public-facing (non-admin) rendering: make the whole card a real link to
  // the article's detail page instead of an inert, non-clickable div. Falls
  // back to a plain wrapper (no link) when there's no resolvable article yet
  // (e.g. empty slot or sample/placeholder content with no real slug).
  if (!editable) {
    const href = article ? articleHref(article) : null;
    const wrapClass = className ? `${className} block` : "block";
    if (href) {
      return (
        <Link href={href} className={wrapClass} style={style}>
          {children}
        </Link>
      );
    }
    return (
      <div className={wrapClass} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`} style={style}>
      {children}
      <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          type="button"
          title={pinned ? "Change article" : "Choose article"}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
          className="h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors shadow"
        >
          <Plus size={13} />
        </button>
        {pinned && (
          <button
            type="button"
            title="Reset to latest"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClear(); }}
            className="h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors shadow"
          >
            <X size={12} />
          </button>
        )}
      </div>
      {open && (
        <ArticlePickerModal
          mode="single"
          excludeIds={excludeIds}
          initialSelectedIds={currentArticleId ? [currentArticleId] : []}
          onClose={() => setOpen(false)}
          onConfirm={(ids) => { onPick(ids[0]); setOpen(false); }}
        />
      )}
    </div>
  );
}

/**
 * Generic helper that wires up "pin this card to a specific article" controls
 * for any list of cards in any template. `idsKey` is the field on the block's
 * data object that stores the per-card pin array (kept separate per section
 * so pinning a card in one section never disturbs another section).
 */
function makePinHelpers(data, idsKey, count, blockId, onUpdateBlock) {
  return {
    isPinned: (i) => Array.isArray(data?.[idsKey]) && !!data[idsKey][i],
    pin: (i, articleId) => {
      if (!onUpdateBlock) return;
      onUpdateBlock(blockId, pinArticleAtIndex(data, idsKey, i, articleId, count));
    },
    clear: (i) => {
      if (!onUpdateBlock) return;
      onUpdateBlock(blockId, clearArticlePin(data, idsKey, i, count));
    },
  };
}

/** Same idea as makePinHelpers but for a single-article slot (e.g. a hero). */
function makeSinglePinHelpers(idKey, blockId, onUpdateBlock) {
  return {
    pin: (articleId) => {
      if (!onUpdateBlock) return;
      onUpdateBlock(blockId, { [idKey]: articleId });
    },
    clear: () => {
      if (!onUpdateBlock) return;
      onUpdateBlock(blockId, { [idKey]: null });
    },
  };
}

function EditorialDesktop({ data, blockId, onUpdateBlock, tracker }) {
  const gap = data.columnGap || 24;

  return (
    <div
      className="mx-auto px-4 pb-8"
      style={{ maxWidth: data.maxWidth || 1600 }}
    >
      {/*
        CSS sticky sidebar:
        - Outer container: display flex, align-items start
        - Left sidebar wrapper: position sticky, top 20px
        - This means sidebar sticks until its parent (the flex row) ends
      */}
      <div className="flex items-start" style={{ gap }}>

        {/* ── LEFT SIDEBAR (25%) ── sticky via CSS */}
        <div
          className="shrink-0"
          style={{ width: "25%", position: "sticky", top: 20, alignSelf: "flex-start" }}
        >
          <div className="divide-y divide-gray-100">
            {(data.leftBlocks || []).filter(b => b.visible !== false).map((block, idx) => (
              <LeftSidebarBlock key={block.id} block={block} idx={idx} data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
            ))}
          </div>
        </div>

        {/* ── CENTER COLUMN (50%) ── */}
        <div className="flex-1 min-w-0 border-x border-gray-100" style={{ paddingLeft: gap, paddingRight: gap }}>
          <EditorialCenter data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
        </div>

        {/* ── RIGHT SIDEBAR (25%) ── */}
        <div
          className="shrink-0"
          style={{ width: "25%", position: "sticky", top: 20, alignSelf: "flex-start" }}
        >
          <RightSidebar data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
        </div>
      </div>
    </div>
  );
}

function EditorialTablet({ data, blockId, onUpdateBlock, tracker }) {
  return (
    <div className="px-4 pb-8">
      <EditorialCenter data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="divide-y divide-gray-100">
          {(data.leftBlocks || []).filter(b => b.visible !== false).slice(0, 4).map((block, idx) => (
            <LeftSidebarBlock key={block.id} block={block} idx={idx} data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
          ))}
        </div>
        <RightSidebar data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
      </div>
    </div>
  );
}

function EditorialMobile({ data, blockId, onUpdateBlock, tracker }) {
  return (
    <div className="px-4 pb-8">
      <EditorialCenter data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
      <div className="mt-4 divide-y divide-gray-100">
        {(data.leftBlocks || []).filter(b => b.visible !== false).slice(0, 3).map((block, idx) => (
          <LeftSidebarBlock key={block.id} block={block} idx={idx} data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
        ))}
      </div>
      <div className="mt-6">
        <RightSidebar data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} tracker={tracker} />
      </div>
    </div>
  );
}

function LeftSidebarBlock({ block, idx, data, blockId, onUpdateBlock, tracker }) {
  const editable = !!onUpdateBlock;
  const idKey = `leftBlock_${block.id}_articleId`;
  const isPinned = !!data?.[idKey];
  const pinnedArticle = isPinned ? resolveSingleArticle(data, { idKey, sampleFallback: null }) : null;
  // Snapshot of everything already used elsewhere on the page *before* this
  // card claims its own article — used both to pick this card's auto-fill
  // and to hide those same articles from this card's "+" picker modal.
  const usedSoFar = tracker ? tracker.exclude() : [];
  // Not pinned -> auto-fill the next unused real article (newest first),
  // excluding every article already shown elsewhere on this page. Only when
  // there are no real articles at all does this fall back to static sample
  // copy, so the builder/homepage never looks broken on a brand-new site.
  const autoArticle = !pinnedArticle
    ? (resolveArticlesForBlock(data, 1, { idsKey: `__leftAuto_${block.id}`, excludeIds: usedSoFar, sampleFallback: [], usageCounts: tracker ? tracker.counts() : null })[0] || null)
    : null;
  const article = pinnedArticle || autoArticle;
  if (article && tracker) tracker.track(article);
  const fallbackArticle = EDITORIAL_ARTICLES[idx % EDITORIAL_ARTICLES.length];
  const bgSourceArticle = article || fallbackArticle;
  const bgGradient = GRADIENT_COLORS_EDITORIAL[idx % GRADIENT_COLORS_EDITORIAL.length];
  const helpers = makeSinglePinHelpers(idKey, blockId, onUpdateBlock);
  const headlineSz = block.headlineFontSize || 15;
  const catSz = block.categoryFontSize || 11;
  const descSz = block.descFontSize || 13;
  const cardW = block.cardWidth || 0;
  const cardH = block.cardHeight || 0;
  const cardStyle = {};
  if (cardW > 0) cardStyle.width = cardW;
  if (cardH > 0) { cardStyle.height = cardH; cardStyle.overflow = "hidden"; }

  if (block.type === "opinionCard") {
    return (
      <div className="py-4" style={cardStyle}>
        <div className="bg-gray-900 rounded p-3 mb-2">
          {block.label2 && <span className="font-bold uppercase tracking-widest text-gray-400 block mb-1" style={{ fontSize: catSz }}>{block.label2}</span>}
          <p className="text-white font-semibold leading-snug italic" style={{ fontSize: headlineSz }}>{article ? article.title : block.headline}</p>
          {block.showAuthor && <p className="text-gray-400 mt-2" style={{ fontSize: descSz }}>{article ? article.author || block.author : block.author}</p>}
        </div>
      </div>
    );
  }

  return (
    <EditableArticleSlot article={article} pinned={isPinned} editable={editable} onPick={helpers.pin} onClear={helpers.clear} excludeIds={usedSoFar} currentArticleId={data?.[idKey] || null} className="block">
      <div className="py-4" style={cardStyle}>
        {block.showImage && (
          <CoverImage
            src={bgSourceArticle?.img}
            gradient={bgGradient}
            className="rounded-sm mb-2 relative overflow-hidden"
            style={{ aspectRatio: "16/9" }}
          />
        )}
        <span className="font-bold uppercase tracking-wide block mb-1" style={{ fontSize: catSz, color: block.categoryColor || "#dc2626" }}>
          {article ? article.category : block.category}
        </span>
        <p className="font-bold text-gray-900 leading-snug mb-1 cursor-pointer hover:text-red-600 transition-colors" style={{ fontSize: headlineSz }}>
          {article ? article.title : block.headline}
        </p>
        {block.showDesc && (article ? article.excerpt : block.description) && (
          <p className="text-gray-500 leading-snug mb-1" style={{ fontSize: descSz }}>{article ? article.excerpt : block.description}</p>
        )}
        {(block.showAuthor || block.showDate) && (
          <p className="text-gray-400" style={{ fontSize: Math.max(descSz - 1, 9) }}>
            {block.showAuthor && `By ${article ? (article.author || block.author) : block.author}`}{block.showAuthor && block.showDate && ` • `}{block.showDate && (article ? article.date : block.date)}
          </p>
        )}
      </div>
    </EditableArticleSlot>
  );
}

function EditorialCenter({ data, blockId, onUpdateBlock, tracker }) {
  const heroHeadlineSz = data.heroHeadlineSize || 22;
  const heroSummarySz = data.heroSummarySize || 13;
  const heroCatSz = data.heroCategorySize || 12;
  const editable = !!onUpdateBlock;
  const heroPinned = !!data.heroArticleId;
  const heroExclude = tracker ? tracker.exclude() : [];
  // Not pinned -> auto-fill via resolveSingleArticle so the "client news"
  // rule applies here too (the newest article tagged newsType === "client
  // news" always leads the homepage when nothing is explicitly pinned),
  // excluding whatever the top-stories grid / left sidebar already used.
  const heroArticle = resolveSingleArticle(data, { idKey: "heroArticleId", sampleFallback: null, excludeIds: heroExclude, usageCounts: tracker ? tracker.counts() : null });
  if (heroArticle && tracker) tracker.track(heroArticle);
  const heroAuthorHref = heroArticle ? authorHref(heroArticle.authorSlug) : null;
  const heroHelpers = makeSinglePinHelpers("heroArticleId", blockId, onUpdateBlock);
  return (
    <div>
      {/* Hero story */}
      <EditableArticleSlot article={heroArticle} pinned={heroPinned} editable={editable} onPick={heroHelpers.pin} onClear={heroHelpers.clear} excludeIds={heroExclude} currentArticleId={data.heroArticleId} className="block">
      <div className="pb-5 border-b border-gray-200 mb-5">
        <div className="font-bold uppercase tracking-widest text-gray-500 mb-2" style={{ fontSize: heroCatSz }}>
          {(heroArticle ? heroArticle.category : data.heroCategory) || "WORLD • POLITICS"} · <span className="text-gray-400">{(heroArticle ? heroArticle.date : data.heroDate) || "JANUARY 8, 2026"}</span>
        </div>
        <h1 className="font-black text-gray-900 leading-tight mb-4" style={{ fontFamily: "Georgia, serif", fontSize: heroHeadlineSz }}>
          {(heroArticle ? heroArticle.title : data.heroHeadline) || "Live updates from The White House: A new chapter in transatlantic diplomacy"}
        </h1>
        {/* Hero image */}
        <CoverImage
          src={heroArticle?.img}
          gradient={GRADIENT_COLORS_EDITORIAL[0]}
          className="rounded-sm mb-3 overflow-hidden"
          style={{ aspectRatio: "16/9" }}
        />
        <p className="text-gray-600 leading-relaxed mb-3" style={{ fontSize: heroSummarySz }}>{heroArticle ? heroArticle.excerpt : data.heroSummary}</p>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-[11px] font-bold text-gray-600">
            {((heroArticle ? heroArticle.author : data.heroAuthor) || "JW")[0]}
          </div>
          <div>
            <span className="text-[13px] font-semibold text-gray-700">
              By {heroAuthorHref && !editable ? (
                <Link href={heroAuthorHref} className="hover:text-red-600 transition-colors">{heroArticle.author || data.heroAuthor || "James Whitmore"}</Link>
              ) : (
                (heroArticle ? heroArticle.author : data.heroAuthor) || "James Whitmore"
              )}
            </span>
            {(heroArticle ? heroArticle.authorRole : data.heroAuthorRole) && (
              <span className="text-[12px] text-gray-400"> · {heroArticle ? heroArticle.authorRole : data.heroAuthorRole}</span>
            )}
          </div>
        </div>
      </div>
      </EditableArticleSlot>

      {/* Category sections */}
      {(data.centerSections || []).map((section, sIdx) => {
        const sectionIdsKey = `centerSection_${section.id}_ids`;
        const sectionHelpers = makePinHelpers(data, sectionIdsKey, section.stories || 2, blockId, onUpdateBlock);
        const sectionExclude = tracker ? tracker.exclude() : [];
        // Only real articles that actually belong to this section's
        // category (e.g. "ECONOMY") are shown — never topped up with
        // articles from other categories, and never a repeat of an
        // article already shown elsewhere on the page. If the category is
        // short on articles, this section simply renders fewer cards.
        const sectionArticles = resolveArticlesByCategoryName(section.category, section.stories || 2, { data, idsKey: sectionIdsKey, excludeIds: sectionExclude, sampleFallback: EDITORIAL_ARTICLES.slice(sIdx * 2, sIdx * 2 + (section.stories || 2)), categoryId: section.categoryId || null, usageCounts: tracker ? tracker.counts() : null });
        if (tracker) tracker.track(sectionArticles);
        const sectionHref = categoryHrefByName(section.category);
        return (
          <div key={section.id} className="mb-6 pb-6 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full shrink-0" style={{ backgroundColor: section.color }} />
              <h2 className="text-[13px] font-black uppercase tracking-widest" style={{ color: section.color }}>{section.category}</h2>
              <div className="flex-1 h-px bg-gray-100" />
              {sectionHref ? (
                <Link href={sectionHref} className="text-[12px] text-gray-400 font-medium hover:text-red-600 transition-colors cursor-pointer">More →</Link>
              ) : (
                <span className="text-[12px] text-gray-400 font-medium hover:text-red-600 transition-colors cursor-pointer">More →</span>
              )}
            </div>

            {(() => {
              const tSz = section.titleFontSize || 14;
              const dSz = section.descFontSize || 12;
              const cSz = 8;
              const cW = section.cardWidth || 0;
              const cH = section.cardHeight || 0;
              const cStyle = {};
              if (cW > 0) cStyle.width = cW;
              if (cH > 0) { cStyle.height = cH; cStyle.overflow = "hidden"; }
              if (section.imagePosition === "top") return (
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(section.stories || 2, 3)}, 1fr)` }}>
                  {sectionArticles.map((a, i) => (
                    <EditableArticleSlot article={a} key={`${a.id}-${i}`} pinned={sectionHelpers.isPinned(i)} editable={!!onUpdateBlock} onPick={(id) => sectionHelpers.pin(i, id)} onClear={() => sectionHelpers.clear(i)} excludeIds={sectionExclude} currentArticleId={(data[sectionIdsKey] || [])[i]}>
                      <div className="group cursor-pointer" style={cStyle}>
                        <CoverImage src={a.img} gradient={GRADIENT_COLORS_EDITORIAL[(sIdx + i) % GRADIENT_COLORS_EDITORIAL.length]} className="rounded-sm mb-2 overflow-hidden" style={{ aspectRatio: "16/9" }} />
                        <span className="font-bold uppercase tracking-wide block mb-0.5" style={{ fontSize: cSz, color: a.categoryColor }}>{a.category}</span>
                        <p className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors" style={{ fontSize: tSz }}>{a.title}</p>
                        {section.showDesc && <p className="text-gray-500 mt-0.5 line-clamp-2" style={{ fontSize: dSz }}>{a.excerpt}</p>}
                        {section.showDate && (
                          <p className="text-gray-400 mt-1" style={{ fontSize: Math.max(dSz - 1, 8) }}>{a.date}</p>
                        )}
                      </div>
                    </EditableArticleSlot>
                  ))}
                </div>
              );
              if (section.imagePosition === "left") return (
                <div className="space-y-4">
                  {sectionArticles.map((a, i) => (
                    <EditableArticleSlot article={a} key={`${a.id}-${i}`} className="block" pinned={sectionHelpers.isPinned(i)} editable={!!onUpdateBlock} onPick={(id) => sectionHelpers.pin(i, id)} onClear={() => sectionHelpers.clear(i)} excludeIds={sectionExclude} currentArticleId={(data[sectionIdsKey] || [])[i]}>
                      <div className="flex gap-3 group cursor-pointer" style={cStyle}>
                        <CoverImage src={a.img} gradient={GRADIENT_COLORS_EDITORIAL[(sIdx + i) % GRADIENT_COLORS_EDITORIAL.length]} className="rounded-sm shrink-0 overflow-hidden" style={{ width: 136, height: 96 }} />
                        <div className="flex-1 min-w-0">
                          <span className="font-bold uppercase tracking-wide block mb-0.5" style={{ fontSize: cSz, color: section.color }}>{a.category}</span>
                          <p className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors" style={{ fontSize: tSz }}>{a.title}</p>
                          {section.showDesc && <p className="text-gray-500 mt-0.5 line-clamp-2" style={{ fontSize: dSz }}>{a.excerpt}</p>}
                          {section.showDate && (
                            <p className="text-gray-400 mt-1" style={{ fontSize: Math.max(dSz - 1, 8) }}>{a.date}</p>
                          )}
                        </div>
                      </div>
                    </EditableArticleSlot>
                  ))}
                </div>
              );
              return (
                <div className="divide-y divide-gray-100">
                  {sectionArticles.map((a, i) => (
                    <EditableArticleSlot article={a} key={`${a.id}-${i}`} className="block" pinned={sectionHelpers.isPinned(i)} editable={!!onUpdateBlock} onPick={(id) => sectionHelpers.pin(i, id)} onClear={() => sectionHelpers.clear(i)} excludeIds={sectionExclude} currentArticleId={(data[sectionIdsKey] || [])[i]}>
                      <div className="py-3 group cursor-pointer" style={cStyle}>
                        <span className="font-bold uppercase tracking-wide block mb-0.5" style={{ fontSize: cSz, color: section.color }}>{a.category}</span>
                        <p className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors" style={{ fontSize: tSz }}>{a.title}</p>
                        {section.showDesc && <p className="text-gray-500 mt-0.5 line-clamp-2" style={{ fontSize: dSz }}>{a.excerpt}</p>}
                        {section.showDate && (
                          <p className="text-gray-400 mt-1" style={{ fontSize: Math.max(dSz - 1, 8) }}>{a.date}</p>
                        )}
                      </div>
                    </EditableArticleSlot>
                  ))}
                </div>
              );
            })()}
          </div>
        );
      })}
    </div>
  );
}

function RightSidebar({ data, blockId, onUpdateBlock, tracker }) {
  const editable = !!onUpdateBlock;
  const TOP_MONTH_ARTICLES = EDITORIAL_ARTICLES.slice(0, 3);
  const MORE_NEWS_SAMPLE = EDITORIAL_ARTICLES.slice(3, 8);
  const TOP_AUTHORS_SAMPLE = [
    { name: "Neil Harrison", role: "Aviation & aerospace correspondent", initials: "NH" },
    { name: "Mateo Vargas", role: "Technology & consumer affairs", initials: "MV" },
    { name: "Isabella Crane", role: "Environment & foreign policy", initials: "IC" },
    { name: "Claire Fontaine", role: "White House & foreign policy", initials: "CF" },
  ];

  // Real authors created by the admin on the Authors page, ranked by how
  // many published articles they have (most prolific first) so "Top
  // Authors" reflects real activity instead of a hard-coded name list.
  const realAuthors = getAuthors();
  const rankedAuthors = realAuthors.length
    ? [...realAuthors]
        .map((a) => ({ ...a, _articleCount: getArticlesForAuthor(a).length }))
        .sort((a, b) => b._articleCount - a._articleCount)
    : [];

  return (
    <div className="space-y-5">
      {(data.rightBlocks || []).filter(b => b.visible !== false).map(block => {
        if (!block.enabled && block.type !== "advertisement") return null;

        switch (block.type) {
          case "futureStory": {
            const fsIdKey = `rightBlock_${block.id}_articleId`;
            const fsPinned = !!data?.[fsIdKey];
            const fsExclude = tracker ? tracker.exclude() : [];
            const fsPinnedArticle = fsPinned ? resolveSingleArticle(data, { idKey: fsIdKey, sampleFallback: null }) : null;
            // Not pinned -> auto-fill with the next unused real article so
            // this card never sits stuck on static placeholder copy.
            const fsAutoArticle = !fsPinnedArticle
              ? (resolveArticlesForBlock(data, 1, { idsKey: `__futureAuto_${block.id}`, excludeIds: fsExclude, sampleFallback: [], usageCounts: tracker ? tracker.counts() : null })[0] || null)
              : null;
            const fsArticle = fsPinnedArticle || fsAutoArticle;
            if (fsArticle && tracker) tracker.track(fsArticle);
            const fsHelpers = makeSinglePinHelpers(fsIdKey, blockId, onUpdateBlock);
            return (
              <EditableArticleSlot article={fsArticle} key={block.id} pinned={fsPinned} editable={editable} onPick={fsHelpers.pin} onClear={fsHelpers.clear} excludeIds={fsExclude} currentArticleId={data?.[fsIdKey] || null} className="block">
                <div>
                  <p className="text-[12px] font-black uppercase tracking-widest text-gray-500 mb-2">{block.title}</p>
                  <CoverImage src={fsArticle?.img} gradient={GRADIENT_COLORS_EDITORIAL[1]} className="rounded-sm overflow-hidden mb-2" style={{ aspectRatio: "4/3" }} />
                  <span className="text-[10px] font-bold uppercase tracking-wide text-purple-600 block mb-0.5">{fsArticle ? `${fsArticle.category} • ${fsArticle.date}` : "ARTS • CULTURE • JANUARY 8, 2026"}</span>
                  <p className="text-[14px] font-bold text-gray-900 leading-snug cursor-pointer hover:text-red-600 transition-colors">{fsArticle?.title || "The Future of Contemporary Art in the Age of AI"}</p>
                  {block.showExcerpt && <p className="text-[12px] text-gray-500 mt-1 leading-snug">{fsArticle?.excerpt || "As algorithms begin generating gallery-ready work, curators and critics are asking what — if anything — separates human creativity from its digital imitator."}</p>}
                  {block.showDate && <p className="text-[12px] text-gray-400 mt-1">{fsArticle ? fsArticle.date : "10 min read · In Arts"}</p>}
                </div>
              </EditableArticleSlot>
            );
          }

          case "topOfMonth": {
            const tomIdsKey = `rightBlock_${block.id}_ids`;
            const tomCount = block.itemCount || 3;
            const tomHelpers = makePinHelpers(data, tomIdsKey, tomCount, blockId, onUpdateBlock);
            const tomExclude = tracker ? tracker.exclude() : [];
            const tomArticles = resolveArticlesForBlock(data, tomCount, { idsKey: tomIdsKey, excludeIds: tomExclude, sampleFallback: TOP_MONTH_ARTICLES, usageCounts: tracker ? tracker.counts() : null });
            if (tracker) tracker.track(tomArticles);
            return (
              <div key={block.id} className="border-t border-gray-200 pt-4">
                <p className="text-[12px] font-black uppercase tracking-widest text-gray-500 mb-3">{block.title}</p>
                <div className="space-y-3">
                  {tomArticles.map((a, i) => (
                    <EditableArticleSlot article={a} key={`${a.id}-${i}`} className="block" pinned={tomHelpers.isPinned(i)} editable={editable} onPick={(id) => tomHelpers.pin(i, id)} onClear={() => tomHelpers.clear(i)} excludeIds={tomExclude} currentArticleId={(data[tomIdsKey] || [])[i]}>
                      <div className="flex gap-2 group cursor-pointer">
                        <span className="text-[15px] font-black text-gray-300 shrink-0 w-5">{i + 1}</span>
                        {block.showImages && (
                          <CoverImage src={a.img} gradient={GRADIENT_COLORS_EDITORIAL[i % 5]} className="shrink-0 rounded overflow-hidden" style={{ width: 60, height: 44 }} />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{a.title}</p>
                          {block.showDates && <p className="text-[11px] text-gray-400 mt-0.5">{a.category} · {a.date}</p>}
                        </div>
                      </div>
                    </EditableArticleSlot>
                  ))}
                </div>
              </div>
            );
          }

          // "Most Commented" is repurposed as a real "Trending" widget: the
          // Article model has no comment-count field, but it does track
          // `views`, so this ranks by most-viewed first (falling back to
          // newest for ties) instead of just repeating the latest-unused
          // pattern used everywhere else on the page.
          case "mostCommented": {
            const mnIdsKey = `rightBlock_${block.id}_ids`;
            const mnCount = block.itemCount || 5;
            const mnHelpers = makePinHelpers(data, mnIdsKey, mnCount, blockId, onUpdateBlock);
            const mnExclude = tracker ? tracker.exclude() : [];
            const mnPins = Array.isArray(data?.[mnIdsKey]) ? data[mnIdsKey] : [];
            const mnPinnedIds = new Set(mnPins.filter(Boolean));
            const mnTrending = resolveTrendingArticles(mnCount, { excludeIds: [...mnExclude, ...mnPinnedIds], sampleFallback: MORE_NEWS_SAMPLE, usageCounts: tracker ? tracker.counts() : null });
            let mnCursor = 0;
            const mnArticles = Array.from({ length: mnCount }).map((_, i) => {
              if (mnPins[i]) {
                const pinnedReal = getAllPreviewArticlesSorted().find((a) => a.id === mnPins[i]);
                if (pinnedReal) return pinnedReal;
              }
              const next = mnTrending[mnCursor];
              if (next) mnCursor += 1;
              return next;
            }).filter(Boolean);
            if (tracker) tracker.track(mnArticles);
            return (
              <div key={block.id} className="border-t border-gray-200 pt-4">
                <p className="text-[12px] font-black uppercase tracking-widest text-gray-500 mb-3">{block.title || "Trending Now"}</p>
                <div className="space-y-2">
                  {mnArticles.map((a, i) => (
                    <EditableArticleSlot article={a} key={`${a.id}-${i}`} className="block" pinned={mnHelpers.isPinned(i)} editable={editable} onPick={(id) => mnHelpers.pin(i, id)} onClear={() => mnHelpers.clear(i)} excludeIds={mnExclude} currentArticleId={(data[mnIdsKey] || [])[i]}>
                      <div className="flex gap-2 group cursor-pointer">
                        <span className="text-[13px] font-black text-gray-300 shrink-0 w-4">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-gray-700 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">{a.title}</p>
                          {block.showDates && <p className="text-[11px] text-gray-400 mt-0.5">{a.category} · {a.date}</p>}
                        </div>
                      </div>
                    </EditableArticleSlot>
                  ))}
                </div>
              </div>
            );
          }

          case "topAuthors": {
            const list = rankedAuthors.length
              ? rankedAuthors.slice(0, block.itemCount || 4)
              : TOP_AUTHORS_SAMPLE.slice(0, block.itemCount || 4);
            return (
              <div key={block.id} className="border-t border-gray-200 pt-4">
                <p className="text-[12px] font-black uppercase tracking-widest text-gray-500 mb-3">{block.title}</p>
                <div className="space-y-3">
                  {list.map((author, i) => {
                    const href = rankedAuthors.length ? authorHref(author.slug) : null;
                    const initials = rankedAuthors.length
                      ? (author.name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
                      : author.initials;
                    const inner = (
                      <>
                        {block.showImages && (
                          author.profileImage ? (
                            <img src={author.profileImage} alt={author.name} className="h-8 w-8 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-[11px] font-bold text-gray-600 shrink-0">
                              {initials}
                            </div>
                          )
                        )}
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-gray-900 group-hover:text-red-600 transition-colors truncate">{author.name}</p>
                          <p className="text-[12px] text-gray-400 truncate">{author.role}</p>
                        </div>
                      </>
                    );
                    return href ? (
                      <Link href={href} key={author._id || author.name || i} className="flex items-center gap-2 group cursor-pointer">
                        {inner}
                      </Link>
                    ) : (
                      <div key={author._id || author.name || i} className="flex items-center gap-2">
                        {inner}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          case "advertisement": {
            const adW = block.width > 0 ? block.width : "100%";
            const adH = block.height || 250;
            const adBody = block.imageUrl ? (
              <img src={block.imageUrl} alt={block.altText || "Advertisement"} className="w-full h-full object-cover rounded" style={{ height: adH }} />
            ) : (
              <div className="rounded border border-gray-800 bg-gray-900 p-4 text-center">
                <p className="text-yellow-400 text-[16px] font-black tracking-wide mb-1">HTN Premium</p>
                <p className="text-gray-400 text-[12px] mb-2">Unlimited Access. No Ads.</p>
                <button className="bg-red-700 text-white text-[12px] font-bold px-4 py-1.5 rounded hover:bg-red-600 transition-colors">
                  Start for Free →
                </button>
              </div>
            );
            return (
              <div key={block.id} className="border-t border-gray-200 pt-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 text-center">Advertisement</p>
                <div style={{ width: adW, maxWidth: "100%", marginInline: "auto" }}>
                  {block.imageUrl && block.linkUrl ? (
                    <a href={block.linkUrl} target="_blank" rel="noopener noreferrer sponsored" className="block">{adBody}</a>
                  ) : adBody}
                </div>
              </div>
            );
          }

          case "newsletter":
            return (
              <div key={block.id} className="border-t border-gray-200 pt-4">
                <p className="text-[12px] font-black uppercase tracking-widest text-gray-500 mb-2">{block.title}</p>
                <p className="text-[13px] text-gray-600 mb-2">Get the headlines that matter, delivered every morning.</p>
                <NewsletterForm source="sidebar" layout="stack" size="sm" placeholder="Your email address" buttonText="Subscribe" buttonBg="#b91c1c" />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

// ─── Shared sample data for Template 2 / 3 / 7 ───────────────────────────────
const TRENDING_SAMPLE = [
  { title: "Markets close mixed as inflation data exceeds forecasts", time: "2h ago" },
  { title: "AI tools transform the way businesses operate", time: "3h ago" },
  { title: "Cybersecurity threats rise in global financial sector", time: "4h ago" },
  { title: "Retail sales rebound stronger than expected", time: "5h ago" },
  { title: "Oil prices climb on supply concerns and demand outlook", time: "6h ago" },
  { title: "Tech giants invest in renewable energy projects", time: "7h ago" },
];

const POPULAR_SAMPLE = [
  "Global economy outlook for the rest of 2026",
  "New defense bill passes house with bipartisan support",
  "Startups secure record funding in Q2 2026",
  "Election campaigns heat up in key battleground states",
  "Electric vehicles drive future of clean energy",
];

const AUTHORS_SAMPLE = [
  { name: "James Whitmore", role: "White House Correspondent", initials: "JW" },
  { name: "Anna Cole", role: "Economics Editor", initials: "AC" },
  { name: "Marcus Reid", role: "Justice & Policy", initials: "MR" },
  { name: "Maya Chen", role: "Technology Reporter", initials: "MC" },
  { name: "Mark Wells", role: "Health Correspondent", initials: "MW" },
  { name: "Claire Fontaine", role: "Foreign Affairs", initials: "CF" },
];

function adSizeToHeight(size) {
  if (size === "970x250") return 250;
  if (size === "728x90") return 90;
  if (size === "970x90") return 90;
  if (size === "300x250") return 250;
  return 90;
}

/** Full-width advertisement banner used by the big page templates (Modern
 *  Magazine, Dark News, Masonry). Shows the admin-uploaded image at the
 *  admin-controlled width/height when present, otherwise a placeholder. */
function AdBanner({ image, linkUrl, altText, width, height, sizeLabel, className = "", dark = false }) {
  const w = width > 0 ? width : "100%";
  const body = image ? (
    <img src={image} alt={altText || "Advertisement"} className="w-full object-cover rounded" style={{ height }} />
  ) : (
    <div
      className={`rounded border-2 border-dashed flex items-center justify-center text-[13px] font-medium uppercase tracking-wide ${dark ? "border-white/10 text-gray-500" : "border-gray-200 text-gray-400"}`}
      style={{ height }}
    >
      Advertisement — {sizeLabel}
    </div>
  );
  return (
    <div className={className} style={{ width: w, maxWidth: "100%", marginInline: "auto" }}>
      {image && linkUrl ? (
        <a href={linkUrl} target="_blank" rel="noopener noreferrer sponsored" className="block">{body}</a>
      ) : body}
    </div>
  );
}

// ─── Generic sidebar widget renderer (used by Template 2, 3, 7) ─────────────
function SidebarWidget({ widget, dark, data, blockId, onUpdateBlock, excludeIds = [] }) {
  if (widget.enabled === false) return null;
  const labelClass = dark ? "text-gray-500" : "text-gray-500";
  const titleClass = dark ? "text-white" : "text-gray-900";
  const editable = !!onUpdateBlock;

  switch (widget.type) {
    case "trending": {
      const trendIdsKey = `sidebarWidget_${widget.id}_ids`;
      const count = widget.itemCount || 5;
      const helpers = makePinHelpers(data || {}, trendIdsKey, count, blockId, onUpdateBlock);
      const articles = resolveArticlesForBlock(data || {}, count, { idsKey: trendIdsKey, sampleFallback: SAMPLE_ARTICLES, excludeIds });
      return (
        <div>
          <p className={`text-[12px] font-black uppercase tracking-widest ${labelClass} mb-3`}>{widget.title || "Trending Now"}</p>
          <div className="space-y-3">
            {articles.map((a, i) => (
              <EditableArticleSlot article={a} key={`${a.id}-${i}`} className="block" pinned={helpers.isPinned(i)} editable={editable} onPick={(id) => helpers.pin(i, id)} onClear={() => helpers.clear(i)} excludeIds={excludeIds} currentArticleId={((data || {})[trendIdsKey] || [])[i]}>
                <div className="flex gap-2 group cursor-pointer">
                  {widget.showImages !== false && (
                    <div className="shrink-0 rounded overflow-hidden" style={{ width: 64, height: 46, background: a.img ? `url(${a.img}) center/cover no-repeat` : GRADIENT_COLORS_EDITORIAL[i % GRADIENT_COLORS_EDITORIAL.length] }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11.5px] font-semibold leading-snug line-clamp-2 ${titleClass} group-hover:text-red-500 transition-colors`}>{a.title}</p>
                    {widget.showTime !== false && <p className="text-[9.5px] text-gray-400 mt-0.5">{a.date}</p>}
                  </div>
                </div>
              </EditableArticleSlot>
            ))}
          </div>
        </div>
      );
    }

    case "popular": {
      const popIdsKey = `sidebarWidget_${widget.id}_ids`;
      const count = widget.itemCount || 5;
      const helpers = makePinHelpers(data || {}, popIdsKey, count, blockId, onUpdateBlock);
      const articles = resolveArticlesForBlock(data || {}, count, { idsKey: popIdsKey, sampleFallback: SAMPLE_ARTICLES, excludeIds });
      return (
        <div>
          <p className={`text-[12px] font-black uppercase tracking-widest ${labelClass} mb-3`}>{widget.title || "Popular Articles"}</p>
          <div className="space-y-2.5">
            {articles.map((a, i) => (
              <EditableArticleSlot article={a} key={`${a.id}-${i}`} className="block" pinned={helpers.isPinned(i)} editable={editable} onPick={(id) => helpers.pin(i, id)} onClear={() => helpers.clear(i)} excludeIds={excludeIds} currentArticleId={((data || {})[popIdsKey] || [])[i]}>
                <div className="flex gap-2 group cursor-pointer">
                  {widget.showNumbers && <span className="text-[14px] font-black text-gray-300 shrink-0 w-4">{i + 1}</span>}
                  <p className={`text-[11.5px] leading-snug ${dark ? "text-gray-300" : "text-gray-700"} group-hover:text-red-500 transition-colors`}>{a.title}</p>
                </div>
              </EditableArticleSlot>
            ))}
          </div>
        </div>
      );
    }

    case "newsletter":
      return (
        <div className={dark ? "rounded-lg p-3" : "rounded-lg border border-primary-100 bg-primary-50 p-3"} style={dark ? { backgroundColor: "#1a1a1a" } : undefined}>
          <p className={`text-[14px] font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>{widget.title || "Newsletter"}</p>
          {widget.description && <p className={`text-[10.5px] mb-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>{widget.description}</p>}
          <NewsletterForm source="sidebar" layout="stack" size="sm" placeholder="Your email" buttonText="Subscribe" buttonBg="#cc0000" dark={dark} />
        </div>
      );

    case "categories":
      // Category widget removed from the right sidebar (Modern Magazine & Masonry
      // Editorial templates) — intentionally not rendered, even if older saved
      // homepage data still references this widget type.
      return null;

    case "advertisement": {
      const wH = widget.height > 0 ? widget.height : (widget.size === "square" ? 180 : 250);
      const wW = widget.width > 0 ? widget.width : "100%";
      const adBody = widget.imageUrl ? (
        <img src={widget.imageUrl} alt={widget.altText || "Advertisement"} className="w-full object-cover rounded" style={{ height: wH }} />
      ) : (
        <div
          className={`rounded border-2 border-dashed flex items-center justify-center text-[12px] font-medium uppercase ${dark ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}
          style={{ height: wH }}
        >
          Ad — {widget.size || "sidebar"}
        </div>
      );
      return (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 text-center">Advertisement</p>
          <div style={{ width: wW, maxWidth: "100%", marginInline: "auto" }}>
            {widget.imageUrl && widget.linkUrl ? (
              <a href={widget.linkUrl} target="_blank" rel="noopener noreferrer sponsored" className="block">{adBody}</a>
            ) : adBody}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

// ─── Template 2: Modern Magazine ─────────────────────────────────────────────
function ModernMagazineRenderer({ data, device, blockId, onUpdateBlock }) {
  const isMobile = device === "mobile";
  const isTablet = device === "tablet";
  const gap = data.columnGap || 24;
  const editable = !!onUpdateBlock;
  const tracker = createArticleUsageTracker();
  const totalArticlesAvailable = Math.max(getAllPreviewArticlesSorted().length, SAMPLE_ARTICLES.length);
  const [latestGridVisible, setLatestGridVisible] = useState(data.latestGridLimit || 9);

  const heroHelpers = makeSinglePinHelpers("heroArticleId", blockId, onUpdateBlock);
  const heroArticle = tracker.track(resolveSingleArticle(data, { idKey: "heroArticleId", sampleFallback: SAMPLE_ARTICLES[0] }));

  const topStoriesExclude = tracker.exclude();
  const topStoriesHelpers = makePinHelpers(data, "topStoriesIds", data.topStoriesCount || 4, blockId, onUpdateBlock);
  const topStoriesArticles = tracker.track(resolveArticlesForBlock(data, data.topStoriesCount || 4, { idsKey: "topStoriesIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: topStoriesExclude }));

  const latestNewsExclude = tracker.exclude();
  const latestNewsHelpers = makePinHelpers(data, "latestNewsIds", data.latestNewsLimit || 8, blockId, onUpdateBlock);
  const latestNewsArticles = tracker.track(resolveArticlesForBlock(data, data.latestNewsLimit || 8, { idsKey: "latestNewsIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: latestNewsExclude }));

  const editorsPicksMainHelpers = makeSinglePinHelpers("editorsPicksMainId", blockId, onUpdateBlock);
  const editorsPicksMainArticle = tracker.track(resolveSingleArticle(data, { idKey: "editorsPicksMainId", sampleFallback: SAMPLE_ARTICLES[0], excludeIds: tracker.exclude() }));

  const editorsPicksExclude = tracker.exclude();
  const editorsPicksHelpers = makePinHelpers(data, "editorsPicksIds", 3, blockId, onUpdateBlock);
  const editorsPicksArticles = tracker.track(resolveArticlesForBlock(data, 3, { idsKey: "editorsPicksIds", sampleFallback: SAMPLE_ARTICLES.slice(1, 4), excludeIds: editorsPicksExclude }));

  const latestGridExclude0 = tracker.exclude();
  const latestGridHelpers = makePinHelpers(data, "latestGridIds", latestGridVisible, blockId, onUpdateBlock);

  const MainContent = (
    <div className="min-w-0">
      {/* Section 1: Hero */}
      {data.heroEnabled !== false && (
        <EditableArticleSlot article={heroArticle} pinned={!!data.heroArticleId} editable={editable} onPick={heroHelpers.pin} onClear={heroHelpers.clear} excludeIds={topStoriesExclude} currentArticleId={data.heroArticleId} className="block">
        <div
          className="relative overflow-hidden rounded-sm mb-6 flex flex-col items-start justify-end p-6"
          style={{
            height: isMobile ? Math.min(data.heroHeight || 420, 260) : (data.heroHeight || 420),
            background: (data.heroImage || heroArticle?.img)
              ? `linear-gradient(rgba(0,0,0,${(data.heroOverlayOpacity ?? 55) / 100}),rgba(0,0,0,${(data.heroOverlayOpacity ?? 55) / 100})), url(${data.heroImage || heroArticle?.img}) center/cover no-repeat`
              : `linear-gradient(135deg, ${data.heroBg || "#1a1a2e"} 0%, #2d1b1b 100%)`,
          }}
        >
          {(data.heroCategory || heroArticle?.category) && (
            <span className="inline-block text-[12px] font-bold uppercase tracking-widest text-red-400 mb-2 bg-red-600/90 text-white px-2 py-0.5 rounded">{data.heroCategory || heroArticle?.category}</span>
          )}
          <h1 className="text-white font-bold leading-tight mb-3" style={{ fontSize: isMobile ? 24 : (data.heroTitleSize || 40) }}>
            {data.heroHeadline || heroArticle?.title || "No article yet — click + to choose one"}
          </h1>
          {(data.heroDescription || heroArticle?.excerpt) && <p className="text-white/80 text-[15px] max-w-xl mb-4">{data.heroDescription || heroArticle?.excerpt}</p>}
          {data.heroCtaLabel && (
            <a href={data.heroCtaUrl} className="inline-block text-[14px] font-bold bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-100 transition-colors">{data.heroCtaLabel}</a>
          )}
        </div>
        </EditableArticleSlot>
      )}

      {/* Section 2: Top Stories */}
      {data.topStoriesEnabled !== false && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.topStoriesTitle || "Top Stories"}</h2>
            <div className="flex-1 h-px bg-gray-200" />
            <a href="#" className="text-[13px] font-medium text-red-600 hover:underline whitespace-nowrap">View All →</a>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${isMobile ? 1 : isTablet ? 2 : Math.min(data.topStoriesCount || 4, 4)}, 1fr)` }}>
            {topStoriesArticles.map((a, i) => (
              <EditableArticleSlot key={`${a.id}-${i}`} pinned={topStoriesHelpers.isPinned(i)} editable={editable} onPick={(id) => topStoriesHelpers.pin(i, id)} onClear={() => topStoriesHelpers.clear(i)} excludeIds={topStoriesExclude} currentArticleId={(data.topStoriesIds || [])[i]}>
                <ArticleCard article={a} showImage showCategory showDate compact />
              </EditableArticleSlot>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Latest News */}
      {data.latestNewsEnabled !== false && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.latestNewsTitle || "Latest News"}</h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="divide-y divide-gray-100">
            {latestNewsArticles.map((a, i) => (
              <EditableArticleSlot key={`${a.id}-${i}`} pinned={latestNewsHelpers.isPinned(i)} editable={editable} onPick={(id) => latestNewsHelpers.pin(i, id)} onClear={() => latestNewsHelpers.clear(i)} excludeIds={latestNewsExclude} currentArticleId={(data.latestNewsIds || [])[i]}>
                <ArticleRow article={a} showImage showCategory showDate showExcerpt imageSize="medium" />
              </EditableArticleSlot>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: Editor's Picks */}
      {data.editorsPicksEnabled !== false && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.editorsPicksTitle || "Editor's Picks"}</h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            <EditableArticleSlot article={editorsPicksMainArticle} pinned={!!data.editorsPicksMainId} editable={editable} onPick={editorsPicksMainHelpers.pin} onClear={editorsPicksMainHelpers.clear} excludeIds={latestNewsExclude} currentArticleId={data.editorsPicksMainId}>
              <div className="group cursor-pointer">
                <div className="rounded-sm mb-2 overflow-hidden" style={{ aspectRatio: "16/9", background: editorsPicksMainArticle?.img ? `url(${editorsPicksMainArticle.img}) center/cover no-repeat` : GRADIENT_COLORS_EDITORIAL[0] }} />
                <span className="text-[11px] font-bold uppercase tracking-wide text-purple-600 block mb-1">{editorsPicksMainArticle?.category || "ARTS • CULTURE"}</span>
                <p className="text-[17px] font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors">{editorsPicksMainArticle?.title || "Central banks maintain cautious stance amid global volatility"}</p>
                <p className="text-[11.5px] text-gray-500 mt-1 leading-snug line-clamp-2">{editorsPicksMainArticle?.excerpt || "Officials agree to keep rates steady as inflation cools gradually across major economies."}</p>
              </div>
            </EditableArticleSlot>
            <div className="divide-y divide-gray-100">
              {editorsPicksArticles.map((a, i) => (
                <EditableArticleSlot key={`${a.id}-${i}`} pinned={editorsPicksHelpers.isPinned(i)} editable={editable} onPick={(id) => editorsPicksHelpers.pin(i, id)} onClear={() => editorsPicksHelpers.clear(i)} excludeIds={editorsPicksExclude} currentArticleId={(data.editorsPicksIds || [])[i]}>
                  <ArticleRow article={{ ...a, excerpt: undefined }} showImage showCategory showDate showExcerpt={false} imageSize="small" />
                </EditableArticleSlot>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Category Grid */}
      {data.categoryGridEnabled !== false && (data.categoryGridCategories || []).map((cat) => {
        const catIdsKey = `catGrid_${cat.id}_ids`;
        const catHelpers = makePinHelpers(data, catIdsKey, cat.articleCount || 4, blockId, onUpdateBlock);
        const catExclude = tracker.exclude();
        const catArticles = tracker.track(resolveArticlesByCategoryName(cat.name, cat.articleCount || 4, { data, idsKey: catIdsKey, excludeIds: catExclude, categoryId: cat.categoryId, sampleFallback: SAMPLE_ARTICLES }));
        const catHref = categoryHrefForCatItem(cat);
        return (
          <div key={cat.id} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{cat.name}</h2>
              <div className="flex-1 h-px bg-gray-200" />
              {catHref ? (
                <Link href={catHref} className="text-[13px] font-medium text-red-600 hover:underline whitespace-nowrap">View All →</Link>
              ) : (
                <span className="text-[13px] font-medium text-gray-400 whitespace-nowrap">View All →</span>
              )}
            </div>
            <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-4"}`}>
              {catArticles.map((a, i) => (
                <EditableArticleSlot key={`${a.id}-${i}`} pinned={catHelpers.isPinned(i)} editable={editable} onPick={(id) => catHelpers.pin(i, id)} onClear={() => catHelpers.clear(i)} excludeIds={catExclude} currentArticleId={(data[catIdsKey] || [])[i]}>
                  <ArticleCard article={a} showImage showCategory={false} showDate compact />
                </EditableArticleSlot>
              ))}
            </div>
          </div>
        );
      })}

      {/* Section 6: Advertisement */}
      {data.adEnabled !== false && (
        <AdBanner image={data.adImage} linkUrl={data.adLinkUrl} altText={data.adAltText} width={data.adWidth} height={data.adHeight || adSizeToHeight(data.adSize)} sizeLabel={data.adSize || "970x90"} className="mb-8" dark={false} />
      )}

      {/* Section 7: Latest Articles Grid */}
      {data.latestGridEnabled !== false && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.latestGridTitle || "Latest Articles"}</h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : ""}`} style={!isMobile && !isTablet ? { gridTemplateColumns: `repeat(${data.latestGridColumns || 3}, 1fr)` } : undefined}>
            {tracker.track(resolveArticlesForBlock(data, latestGridVisible, { idsKey: "latestGridIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: latestGridExclude0 })).map((a, i) => (
              <EditableArticleSlot key={`${a.id || i}-${i}`} pinned={latestGridHelpers.isPinned(i)} editable={editable} onPick={(id) => latestGridHelpers.pin(i, id)} onClear={() => latestGridHelpers.clear(i)} excludeIds={latestGridExclude0} currentArticleId={(data.latestGridIds || [])[i]}>
                <ArticleCard article={a} showImage showCategory showDate compact />
              </EditableArticleSlot>
            ))}
          </div>
        </div>
      )}


      {/* Section 8: Newsletter (inline within main on mobile/tablet stacking handled below at full width) */}

      {/* Section 9: Load More */}
      {data.loadMoreEnabled !== false && data.latestGridEnabled !== false && latestGridVisible < totalArticlesAvailable && (
        <div className="flex justify-center mb-2">
          <button
            onClick={() => setLatestGridVisible((c) => Math.min(c + Math.max(data.loadMoreIncrement || 3, 3), totalArticlesAvailable))}
            className="px-6 py-2.5 text-[14px] font-bold border-2 transition-colors hover:bg-gray-50"
            style={{ color: data.loadMoreColor || "#cc0000", borderColor: data.loadMoreColor || "#cc0000", borderRadius: data.loadMoreRadius ?? 6 }}
          >
            {data.loadMoreLabel || "Load More Articles"}
          </button>
        </div>
      )}
    </div>
  );

  const Sidebar = (
    <div className="divide-y divide-gray-100 [&>*]:py-5 first:[&>*]:pt-0">
      {(data.sidebarWidgets || []).map((w) => (
        <div key={w.id}><SidebarWidget widget={w} data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} excludeIds={tracker.exclude()} /></div>
      ))}
    </div>
  );

  return (
    <div style={{ backgroundColor: data.bg || "#ffffff" }}>
      <div className="mx-auto px-4 py-6" style={{ maxWidth: data.maxWidth || 1600 }}>
        {isMobile || isTablet ? (
          <div>
            {MainContent}
            <div className="mt-2 border-t border-gray-100 pt-6">{Sidebar}</div>
          </div>
        ) : (
          <div className="flex items-start" style={{ gap }}>
            <div style={{ width: "75%" }}>{MainContent}</div>
            <div style={{ width: "25%", position: "sticky", top: 20, alignSelf: "flex-start" }} className="shrink-0">{Sidebar}</div>
          </div>
        )}
      </div>

      {/* Section 8: Newsletter — full width */}
      {data.newsletterEnabled !== false && (
        <div className="px-4 py-8 text-center" style={{ backgroundColor: data.newsletterBg || "#f5f5f0" }}>
          <h3 className="text-[18px] font-bold mb-1 text-gray-900">{data.newsletterHeading}</h3>
          <p className="text-[15px] mb-4 text-gray-500">{data.newsletterSubheading}</p>
          <div className="max-w-sm mx-auto">
            <NewsletterForm source="sidebar" buttonText={data.newsletterCtaLabel || "Subscribe"} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Template 3: Dark News ───────────────────────────────────────────────────
function DarkArticleRow({ article, showExcerpt = true }) {
  return (
    <CardLink article={article} className="flex gap-3 py-3 group cursor-pointer">
      <div className="flex-none rounded-sm overflow-hidden" style={{ width: 132, height: 94, background: article.img ? `url(${article.img}) center/cover no-repeat` : GRADIENT_COLORS_EDITORIAL[gradientIndexFor(article.id)] }} />
      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-bold uppercase tracking-wide mb-0.5 block" style={{ color: article.categoryColor }}>{article.category}</span>
        <p className="text-[12.5px] font-semibold text-white leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">{article.title}</p>
        {showExcerpt && <p className="text-[13px] text-gray-400 mt-0.5 line-clamp-1 leading-snug">{article.excerpt}</p>}
        <p className="text-[12px] text-gray-500 mt-1">{article.date}</p>
      </div>
    </CardLink>
  );
}

function DarkArticleCard({ article, cardBg }) {
  return (
    <CardLink article={article} className="rounded overflow-hidden group block cursor-pointer" style={{ backgroundColor: cardBg || "#1a1a1a" }}>
      <div className="overflow-hidden" style={{ aspectRatio: "16/9", background: article.img ? `url(${article.img}) center/cover no-repeat` : GRADIENT_COLORS_EDITORIAL[gradientIndexFor(article.id)] }} />
      <div className="p-3">
        <span className="text-[11px] font-bold uppercase tracking-wide mb-1 block" style={{ color: article.categoryColor }}>{article.category}</span>
        <p className="text-[12.5px] font-semibold text-white leading-snug line-clamp-2 group-hover:text-red-400 transition-colors mb-1.5">{article.title}</p>
        <p className="text-[12px] text-gray-500">{article.author ? `By ${article.author} · ` : ""}{article.date}</p>
      </div>
    </CardLink>
  );
}

function DarkNewsRenderer({ data, device, blockId, onUpdateBlock }) {
  const isMobile = device === "mobile";
  const isTablet = device === "tablet";
  const gap = data.columnGap || 24;
  const cardBg = data.cardBg || "#1a1a1a";
  const accent = data.accentColor || "#cc0000";
  const editable = !!onUpdateBlock;
  const tracker = createArticleUsageTracker();
  const totalArticlesAvailable = Math.max(getAllPreviewArticlesSorted().length, SAMPLE_ARTICLES.length);
  const [darkLatestGridVisible, setDarkLatestGridVisible] = useState(data.latestGridLimit || 6);

  const heroHelpers = makeSinglePinHelpers("heroArticleId", blockId, onUpdateBlock);
  const heroArticle = tracker.track(resolveSingleArticle(data, { idKey: "heroArticleId", sampleFallback: SAMPLE_ARTICLES[0] }));

  const featuredExclude = tracker.exclude();
  const featuredHelpers = makePinHelpers(data, "featuredStoriesIds", data.featuredStoriesCount || 4, blockId, onUpdateBlock);
  const featuredArticles = tracker.track(resolveArticlesForBlock(data, data.featuredStoriesCount || 4, { idsKey: "featuredStoriesIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: featuredExclude }));

  const darkLatestNewsExclude = tracker.exclude();
  const darkLatestNewsHelpers = makePinHelpers(data, "darkLatestNewsIds", data.latestNewsLimit || 6, blockId, onUpdateBlock);
  const darkLatestNewsArticles = tracker.track(resolveArticlesForBlock(data, data.latestNewsLimit || 6, { idsKey: "darkLatestNewsIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: darkLatestNewsExclude }));

  const mostReadExclude = tracker.exclude();
  const mostReadHelpers = makePinHelpers(data, "mostReadIds", data.mostReadCount || 5, blockId, onUpdateBlock);
  const mostReadArticles = tracker.track(resolveArticlesForBlock(data, data.mostReadCount || 5, { idsKey: "mostReadIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: mostReadExclude }));

  const editorsChoiceExclude = tracker.exclude();
  const editorsChoiceHelpers = makePinHelpers(data, "editorsChoiceIds", data.editorsChoiceCount || 4, blockId, onUpdateBlock);
  const editorsChoiceArticles = tracker.track(resolveArticlesForBlock(data, data.editorsChoiceCount || 4, { idsKey: "editorsChoiceIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: editorsChoiceExclude }));

  const darkLatestGridHelpers = makePinHelpers(data, "darkLatestGridIds", darkLatestGridVisible, blockId, onUpdateBlock);

  return (
    <div style={{ backgroundColor: data.bg || "#111111" }}>
      <div className="mx-auto px-4 py-6" style={{ maxWidth: data.maxWidth || 1600 }}>
        {/* Section 1 + Sidebar row */}
        <div className={isMobile || isTablet ? "" : "flex items-start"} style={isMobile || isTablet ? undefined : { gap }}>
          <div style={isMobile || isTablet ? undefined : { width: "75%", position: "sticky", top: 20, alignSelf: "flex-start" }} className="min-w-0">
            {data.heroEnabled !== false && (
              <EditableArticleSlot article={heroArticle} pinned={!!data.heroArticleId} editable={editable} onPick={heroHelpers.pin} onClear={heroHelpers.clear} excludeIds={featuredExclude} currentArticleId={data.heroArticleId} className="block">
              <div
                className="relative overflow-hidden rounded-sm flex flex-col items-start justify-end p-6"
                style={{
                  height: isMobile ? Math.min(data.heroHeight || 460, 260) : (data.heroHeight || 460),
                  background: (data.heroImage || heroArticle?.img)
                    ? `linear-gradient(rgba(0,0,0,${(data.heroOverlayOpacity ?? 65) / 100}),rgba(0,0,0,${(data.heroOverlayOpacity ?? 65) / 100})), url(${data.heroImage || heroArticle?.img}) center/cover no-repeat`
                    : `linear-gradient(135deg, #2a2a2a 0%, #0a0a0a 100%)`,
                }}
              >
                {(data.heroCategory || heroArticle?.category) && (
                  <span className="inline-block text-[12px] font-bold uppercase tracking-widest text-white mb-2 px-2 py-0.5 rounded" style={{ backgroundColor: accent }}>{data.heroCategory || heroArticle?.category}</span>
                )}
                <h1 className="text-white font-bold leading-tight mb-3" style={{ fontSize: isMobile ? 24 : (data.heroTitleSize || 42) }}>
                  {data.heroHeadline || heroArticle?.title || "No article yet — click + to choose one"}
                </h1>
                {(data.heroDescription || heroArticle?.excerpt) && <p className="text-gray-300 text-[15px] max-w-xl mb-4">{data.heroDescription || heroArticle?.excerpt}</p>}
                {data.heroCtaLabel && (
                  <a href={data.heroCtaUrl} className="inline-block text-[14px] font-bold text-white px-4 py-2 rounded hover:opacity-90 transition-opacity" style={{ backgroundColor: accent }}>{data.heroCtaLabel}</a>
                )}
              </div>
              </EditableArticleSlot>
            )}
          </div>
          {!isMobile && !isTablet && (
            <div style={{ width: "25%" }} className="shrink-0 divide-y divide-white/10 [&>*]:py-5 first:[&>*]:pt-0">
              {(data.sidebarWidgets || []).map((w) => (
                <div key={w.id}><SidebarWidget widget={w} dark data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} excludeIds={tracker.exclude()} /></div>
              ))}
            </div>
          )}
        </div>

        {(isMobile || isTablet) && (
          <div className="mt-6 mb-2 divide-y divide-white/10 [&>*]:py-5 first:[&>*]:pt-0">
            {(data.sidebarWidgets || []).map((w) => (
              <div key={w.id}><SidebarWidget widget={w} dark data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} excludeIds={tracker.exclude()} /></div>
            ))}
          </div>
        )}

        {/* Section 2: Featured Stories */}
        {data.featuredStoriesEnabled !== false && (
          <div className="mt-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-[15px] font-black uppercase tracking-widest text-white">{data.featuredStoriesTitle || "Featured Stories"}</h2>
              <div className="flex-1 h-px bg-white/10" />
              <a href="#" className="text-[13px] font-medium whitespace-nowrap hover:underline" style={{ color: accent }}>View All →</a>
            </div>
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${isMobile ? 2 : isTablet ? 2 : Math.min(data.featuredStoriesCount || 4, 4)}, 1fr)` }}>
              {featuredArticles.map((a, i) => (
                <EditableArticleSlot key={`${a.id}-${i}`} pinned={featuredHelpers.isPinned(i)} editable={editable} onPick={(id) => featuredHelpers.pin(i, id)} onClear={() => featuredHelpers.clear(i)} excludeIds={featuredExclude} currentArticleId={(data.featuredStoriesIds || [])[i]}>
                  <DarkArticleCard article={a} cardBg={cardBg} />
                </EditableArticleSlot>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Latest News + Section 4: Most Read, side by side on desktop */}
        <div className={isMobile || isTablet ? "" : "flex items-start"} style={isMobile || isTablet ? undefined : { gap }}>
          {data.latestNewsEnabled !== false && (
            <div className="mb-8" style={isMobile || isTablet ? undefined : { width: "50%" }}>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-[15px] font-black uppercase tracking-widest text-white">{data.latestNewsTitle || "Latest News"}</h2>
                <div className="flex-1 h-px bg-white/10" />
                <a href="#" className="text-[13px] font-medium whitespace-nowrap hover:underline" style={{ color: accent }}>View All →</a>
              </div>
              <div className="divide-y divide-white/10">
                {darkLatestNewsArticles.map((a, i) => (
                  <EditableArticleSlot key={`${a.id}-${i}`} pinned={darkLatestNewsHelpers.isPinned(i)} editable={editable} onPick={(id) => darkLatestNewsHelpers.pin(i, id)} onClear={() => darkLatestNewsHelpers.clear(i)} excludeIds={darkLatestNewsExclude} currentArticleId={(data.darkLatestNewsIds || [])[i]}>
                    <DarkArticleRow article={a} />
                  </EditableArticleSlot>
                ))}
              </div>
            </div>
          )}

          {data.mostReadEnabled !== false && (
            <div className="mb-8" style={isMobile || isTablet ? undefined : { width: "50%", position: "sticky", top: 20, alignSelf: "flex-start" }}>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-[15px] font-black uppercase tracking-widest text-white">{data.mostReadTitle || "Most Read"}</h2>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <div className="space-y-4">
                {mostReadArticles.map((a, i) => (
                  <EditableArticleSlot article={a} key={`${a.id}-${i}`} pinned={mostReadHelpers.isPinned(i)} editable={editable} onPick={(id) => mostReadHelpers.pin(i, id)} onClear={() => mostReadHelpers.clear(i)} excludeIds={mostReadExclude} currentArticleId={(data.mostReadIds || [])[i]}>
                    <div className="flex gap-3 group cursor-pointer">
                      <span className="text-[20px] font-black shrink-0 w-7" style={{ color: accent }}>{String(i + 1).padStart(2, "0")}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] font-semibold text-white leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">{a.title}</p>
                        <p className="text-[12px] text-gray-500 mt-1">{(i + 1) * 2.4}K views</p>
                      </div>
                    </div>
                  </EditableArticleSlot>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Editor's Choice */}
        {data.editorsChoiceEnabled !== false && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-[15px] font-black uppercase tracking-widest text-white">{data.editorsChoiceTitle || "Editor's Choice"}</h2>
              <div className="flex-1 h-px bg-white/10" />
              <a href="#" className="text-[13px] font-medium whitespace-nowrap hover:underline" style={{ color: accent }}>View All →</a>
            </div>
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${isMobile ? 2 : isTablet ? 2 : Math.min(data.editorsChoiceCount || 4, 4)}, 1fr)` }}>
              {editorsChoiceArticles.map((a, i) => (
                <EditableArticleSlot key={`${a.id}-${i}`} pinned={editorsChoiceHelpers.isPinned(i)} editable={editable} onPick={(id) => editorsChoiceHelpers.pin(i, id)} onClear={() => editorsChoiceHelpers.clear(i)} excludeIds={editorsChoiceExclude} currentArticleId={(data.editorsChoiceIds || [])[i]}>
                  <DarkArticleCard article={a} cardBg={cardBg} />
                </EditableArticleSlot>
              ))}
            </div>
          </div>
        )}

        {/* Section 6: Category Blocks + lower sidebar */}
        {data.categoryBlocksEnabled !== false && (
          <div className={isMobile || isTablet ? "" : "flex items-start"} style={isMobile || isTablet ? undefined : { gap }}>
            <div style={isMobile || isTablet ? undefined : { width: "75%" }} className="min-w-0 grid gap-6" >
              {(data.categoryBlocks || []).map((cat) => {
                const catIdsKey = `catBlock_${cat.id}_ids`;
                const catHelpers = makePinHelpers(data, catIdsKey, cat.articleCount || 2, blockId, onUpdateBlock);
                const catExclude = tracker.exclude();
                const catArticles = tracker.track(resolveArticlesByCategoryName(cat.name, cat.articleCount || 2, { data, idsKey: catIdsKey, excludeIds: catExclude, categoryId: cat.categoryId, sampleFallback: SAMPLE_ARTICLES }));
                const catHref = categoryHrefForCatItem(cat);
                return (
                  <div key={cat.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-[14px] font-black uppercase tracking-widest text-white">{cat.name}</h3>
                      <div className="flex-1 h-px bg-white/10" />
                      {catHref ? (
                        <Link href={catHref} className="text-[10.5px] font-medium whitespace-nowrap hover:underline" style={{ color: accent }}>View All →</Link>
                      ) : (
                        <span className="text-[10.5px] font-medium whitespace-nowrap" style={{ color: accent, opacity: 0.6 }}>View All →</span>
                      )}
                    </div>
                    <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                      {catArticles.map((a, i) => (
                        <EditableArticleSlot key={`${a.id}-${i}`} pinned={catHelpers.isPinned(i)} editable={editable} onPick={(id) => catHelpers.pin(i, id)} onClear={() => catHelpers.clear(i)} excludeIds={catExclude} currentArticleId={(data[catIdsKey] || [])[i]}>
                          <DarkArticleRow article={a} showExcerpt={false} />
                        </EditableArticleSlot>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {!isMobile && !isTablet && (
              <div style={{ width: "25%", position: "sticky", top: 20, alignSelf: "flex-start" }} className="shrink-0 divide-y divide-white/10 [&>*]:py-5 first:[&>*]:pt-0">
                {(data.lowerSidebarWidgets || []).map((w) => (
                  <div key={w.id}><SidebarWidget widget={w} dark data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} excludeIds={tracker.exclude()} /></div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 7: Advertisement */}
        {data.adEnabled !== false && (
          <AdBanner image={data.adImage} linkUrl={data.adLinkUrl} altText={data.adAltText} width={data.adWidth} height={data.adHeight || adSizeToHeight(data.adSize)} sizeLabel={data.adSize || "728x90"} className="my-8" dark />
        )}

        {/* Section 8: Latest Articles */}
        {data.latestGridEnabled !== false && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-[15px] font-black uppercase tracking-widest text-white">{data.latestGridTitle || "Latest Articles"}</h2>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : ""}`} style={!isMobile && !isTablet ? { gridTemplateColumns: `repeat(${data.latestGridColumns || 3}, 1fr)` } : undefined}>
              {tracker.track(resolveArticlesForBlock(data, darkLatestGridVisible, { idsKey: "darkLatestGridIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: tracker.exclude() })).map((a, i) => (
                <EditableArticleSlot key={`${a.id || i}-${i}`} pinned={darkLatestGridHelpers.isPinned(i)} editable={editable} onPick={(id) => darkLatestGridHelpers.pin(i, id)} onClear={() => darkLatestGridHelpers.clear(i)} excludeIds={tracker.exclude()} currentArticleId={(data.darkLatestGridIds || [])[i]}>
                  <DarkArticleCard article={a} cardBg={cardBg} />
                </EditableArticleSlot>
              ))}
            </div>
          </div>
        )}

        {/* Section 10: Load More */}
        {data.loadMoreEnabled !== false && data.latestGridEnabled !== false && darkLatestGridVisible < totalArticlesAvailable && (
          <div className="flex justify-center mb-2">
            <button
              onClick={() => setDarkLatestGridVisible((c) => Math.min(c + Math.max(data.loadMoreIncrement || 3, 3), totalArticlesAvailable))}
              className="px-6 py-2.5 text-[14px] font-bold border-2 transition-colors hover:bg-white/5"
              style={{ color: data.loadMoreColor || accent, borderColor: data.loadMoreColor || accent, borderRadius: data.loadMoreRadius ?? 6 }}
            >
              {data.loadMoreLabel || "Load More Articles"}
            </button>
          </div>
        )}
      </div>

      {/* Section 9: Newsletter — full width dark card */}
      {data.newsletterEnabled !== false && (
        <div className="px-4 py-10 text-center" style={{ backgroundColor: cardBg }}>
          <h3 className="text-[18px] font-bold mb-1 text-white">{data.newsletterHeading}</h3>
          <p className="text-[15px] mb-4 text-gray-400">{data.newsletterSubheading}</p>
          <div className="max-w-sm mx-auto">
            <NewsletterForm source="sidebar" dark buttonText={data.newsletterCtaLabel || "Subscribe"} buttonBg={accent} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Template 7: Masonry Editorial Layout ───────────────────────────────────
function MasonryEditorialLayout({ data, device, blockId, onUpdateBlock }) {
  const isMobile = device === "mobile";
  const isTablet = device === "tablet";
  const gap = data.columnGap || 24;
  const pad = data.padding ?? 24;
  const editable = !!onUpdateBlock;
  const tracker = createArticleUsageTracker();
  const totalArticlesAvailable = Math.max(getAllPreviewArticlesSorted().length, SAMPLE_ARTICLES.length);
  const [masonryLatestGridVisible, setMasonryLatestGridVisible] = useState(data.latestGridLimit || 8);

  const heroHelpers = makeSinglePinHelpers("heroArticleId", blockId, onUpdateBlock);
  const heroArticle = tracker.track(resolveSingleArticle(data, { idKey: "heroArticleId", sampleFallback: SAMPLE_ARTICLES[0] }));

  const heroSmallExclude = tracker.exclude();
  const heroSmallHelpers = makePinHelpers(data, "heroSmallIds", data.heroSmallStories || 2, blockId, onUpdateBlock);
  const heroSmallArticles = tracker.track(resolveArticlesForBlock(data, data.heroSmallStories || 2, { idsKey: "heroSmallIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: heroSmallExclude }));

  const editorsPicksExclude = tracker.exclude();
  const masonryEditorsPicksHelpers = makePinHelpers(data, "masonryEditorsPicksIds", data.editorsPicksCount || 4, blockId, onUpdateBlock);
  const masonryEditorsPicksArticles = tracker.track(resolveArticlesForBlock(data, data.editorsPicksCount || 4, { idsKey: "masonryEditorsPicksIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: editorsPicksExclude }));

  const masonryLatestNewsExclude = tracker.exclude();
  const masonryLatestNewsHelpers = makePinHelpers(data, "masonryLatestNewsIds", data.latestNewsLimit || 6, blockId, onUpdateBlock);
  const masonryLatestNewsArticles = tracker.track(resolveArticlesForBlock(data, data.latestNewsLimit || 6, { idsKey: "masonryLatestNewsIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: masonryLatestNewsExclude }));

  const moreNewsExclude = tracker.exclude();
  const moreNewsHelpers = makePinHelpers(data, "moreNewsIds", data.moreNewsCount || 6, blockId, onUpdateBlock);
  const moreNewsArticles = tracker.track(resolveArticlesForBlock(data, data.moreNewsCount || 6, { idsKey: "moreNewsIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: moreNewsExclude }));

  const trendingHelpers = makePinHelpers(data, "trendingIds", data.trendingCount || 6, blockId, onUpdateBlock);
  const masonryLatestGridHelpers = makePinHelpers(data, "masonryLatestGridIds", masonryLatestGridVisible, blockId, onUpdateBlock);

  return (
    <div style={{ backgroundColor: data.bg || "#ffffff" }}>
      <div className="mx-auto" style={{ maxWidth: data.maxWidth || 1600, padding: pad }}>

        {/* Section 1: Hero Masonry */}
        <div className="mb-6" style={{ display: isMobile ? "flex" : "grid", flexDirection: isMobile ? "column" : undefined, gridTemplateColumns: isMobile ? undefined : "1fr 1fr", gap, gridTemplateRows: isMobile ? undefined : "auto" }}>
          <EditableArticleSlot article={heroArticle} pinned={!!data.heroArticleId} editable={editable} onPick={heroHelpers.pin} onClear={heroHelpers.clear} excludeIds={heroSmallExclude} currentArticleId={data.heroArticleId} className="block" style={{ gridRow: isMobile ? undefined : "1 / 2" }}>
          <div
            className="relative overflow-hidden rounded-sm flex flex-col items-start justify-end p-6"
            style={{
              height: isMobile ? 240 : (data.heroImageHeight || 420),
              background: (data.heroImage || heroArticle?.img)
                ? `linear-gradient(rgba(0,0,0,${(data.heroOverlayOpacity ?? 45) / 100}),rgba(0,0,0,${(data.heroOverlayOpacity ?? 45) / 100})), url(${data.heroImage || heroArticle?.img}) center/cover no-repeat`
                : `linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`,
            }}
          >
            {(data.heroCategory || heroArticle?.category) && (
              <span className="inline-block text-[12px] font-bold uppercase tracking-widest text-white mb-2 bg-red-600 px-2 py-0.5 rounded">{data.heroCategory || heroArticle?.category}</span>
            )}
            <h1 className="text-white font-bold leading-tight mb-2" style={{ fontSize: isMobile ? 24 : 36 }}>{data.heroHeadline || heroArticle?.title || "No article yet — click + to choose one"}</h1>
            {(data.heroDescription || heroArticle?.excerpt) && <p className="text-white/80 text-[15px] max-w-md mb-3">{data.heroDescription || heroArticle?.excerpt}</p>}
            <div className="flex items-center gap-3">
              {data.heroCtaLabel && (
                <a href={data.heroCtaUrl} className="inline-block text-[14px] font-bold bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-100 transition-colors">{data.heroCtaLabel}</a>
              )}
              <span className="text-white/70 text-[13px]">{data.heroAuthor || heroArticle?.author} · {data.heroDate || heroArticle?.date}</span>
            </div>
          </div>
          </EditableArticleSlot>

          <div className="flex flex-col" style={{ gap, height: isMobile ? undefined : (data.heroImageHeight || 420) }}>
            {heroSmallArticles.map((a, i) => (
              <EditableArticleSlot article={a} key={`${a.id}-${i}`} className="flex-1" pinned={heroSmallHelpers.isPinned(i)} editable={editable} onPick={(id) => heroSmallHelpers.pin(i, id)} onClear={() => heroSmallHelpers.clear(i)} excludeIds={heroSmallExclude} currentArticleId={(data.heroSmallIds || [])[i]}>
                <div className="rounded-sm overflow-hidden relative group cursor-pointer h-full" style={{ background: a.img ? `url(${a.img}) center/cover no-repeat` : GRADIENT_COLORS_EDITORIAL[(i + 1) % GRADIENT_COLORS_EDITORIAL.length] }}>
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-4" style={{ background: "linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.55))" }}>
                    <span className="text-[11px] font-bold uppercase tracking-wide text-white/90 mb-1">{a.category}</span>
                    <p className="text-white text-[16px] font-bold leading-snug line-clamp-2 group-hover:text-red-300 transition-colors">{a.title}</p>
                  </div>
                </div>
              </EditableArticleSlot>
            ))}
          </div>
        </div>

        {/* Section 2: Editor's Picks */}
        {data.editorsPicksEnabled !== false && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.editorsPicksTitle || "Editor's Picks"}</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${isMobile ? 2 : isTablet ? 2 : Math.min(data.editorsPicksCount || 4, 6)}, 1fr)` }}>
              {masonryEditorsPicksArticles.map((a, i) => (
                <EditableArticleSlot key={`${a.id}-${i}`} pinned={masonryEditorsPicksHelpers.isPinned(i)} editable={editable} onPick={(id) => masonryEditorsPicksHelpers.pin(i, id)} onClear={() => masonryEditorsPicksHelpers.clear(i)} excludeIds={editorsPicksExclude} currentArticleId={(data.masonryEditorsPicksIds || [])[i]}>
                  <ArticleCard article={a} showImage showCategory showDate compact />
                </EditableArticleSlot>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Latest News + Sidebar */}
        {data.latestNewsEnabled !== false && (
          <div className={isMobile || isTablet ? "" : "flex items-start"} style={isMobile || isTablet ? undefined : { gap }}>
            <div style={isMobile || isTablet ? undefined : { width: "70%", position: "sticky", top: 20, alignSelf: "flex-start" }} className="min-w-0 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.latestNewsTitle || "Latest News"}</h2>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="divide-y divide-gray-100">
                {masonryLatestNewsArticles.map((a, i) => (
                  <EditableArticleSlot key={`${a.id}-${i}`} pinned={masonryLatestNewsHelpers.isPinned(i)} editable={editable} onPick={(id) => masonryLatestNewsHelpers.pin(i, id)} onClear={() => masonryLatestNewsHelpers.clear(i)} excludeIds={masonryLatestNewsExclude} currentArticleId={(data.masonryLatestNewsIds || [])[i]}>
                    <ArticleRow article={a} showImage showCategory showDate showExcerpt={false} imageSize="medium" />
                  </EditableArticleSlot>
                ))}
              </div>
            </div>
            {!isMobile && !isTablet && (
              <div style={{ width: "30%" }} className="shrink-0 divide-y divide-gray-100 [&>*]:py-5 first:[&>*]:pt-0 mb-8">
                {(data.sidebarWidgets || []).map((w) => (
                  <div key={w.id}><SidebarWidget widget={w} data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} excludeIds={tracker.exclude()} /></div>
                ))}
              </div>
            )}
          </div>
        )}

        {(isMobile || isTablet) && data.latestNewsEnabled !== false && (
          <div className="mb-8 divide-y divide-gray-100 [&>*]:py-5 first:[&>*]:pt-0">
            {(data.sidebarWidgets || []).map((w) => (
              <div key={w.id}><SidebarWidget widget={w} data={data} blockId={blockId} onUpdateBlock={onUpdateBlock} excludeIds={tracker.exclude()} /></div>
            ))}
          </div>
        )}

        {/* Section 4: More News Masonry Grid */}
        {data.moreNewsEnabled !== false && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.moreNewsTitle || "More News"}</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-3"}`} style={{ gridAutoFlow: "dense" }}>
              {moreNewsArticles.map((a, i) => {
                const isLarge = i % 3 === 0;
                return (
                  <EditableArticleSlot key={`${a.id}-${i}`} article={a} style={!isMobile && isLarge ? { gridRow: "span 2" } : undefined} pinned={moreNewsHelpers.isPinned(i)} editable={editable} onPick={(id) => moreNewsHelpers.pin(i, id)} onClear={() => moreNewsHelpers.clear(i)} excludeIds={moreNewsExclude} currentArticleId={(data.moreNewsIds || [])[i]}>
                    <div className="group cursor-pointer">
                      <div className="rounded-sm mb-2 overflow-hidden" style={{ aspectRatio: isLarge ? "1/1" : "16/9", background: a.img ? `url(${a.img}) center/cover no-repeat` : GRADIENT_COLORS_EDITORIAL[i % GRADIENT_COLORS_EDITORIAL.length] }} />
                      <span className="text-[11px] font-bold uppercase tracking-wide block mb-0.5" style={{ color: a.categoryColor }}>{a.category}</span>
                      <p className="text-[12.5px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{a.title}</p>
                      <p className="text-[12px] text-gray-400 mt-1">{a.date}</p>
                    </div>
                  </EditableArticleSlot>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 5: Category Grid */}
        {data.categoryGridEnabled !== false && (data.categoryGridCategories || []).map((cat) => {
          const catIdsKey = `masonryCatGrid_${cat.id}_ids`;
          const catHelpers = makePinHelpers(data, catIdsKey, cat.articleCount || 4, blockId, onUpdateBlock);
          const catExclude = tracker.exclude();
          const catArticles = tracker.track(resolveArticlesByCategoryName(cat.name, cat.articleCount || 4, { data, idsKey: catIdsKey, excludeIds: catExclude, categoryId: cat.categoryId, sampleFallback: SAMPLE_ARTICLES }));
          const catHref = categoryHrefForCatItem(cat);
          return (
            <div key={cat.id} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{cat.name}</h2>
                <div className="flex-1 h-px bg-gray-200" />
                {catHref ? (
                  <Link href={catHref} className="text-[13px] font-medium text-red-600 hover:underline whitespace-nowrap">View All →</Link>
                ) : (
                  <span className="text-[13px] font-medium text-gray-400 whitespace-nowrap">View All →</span>
                )}
              </div>
              <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : ""}`} style={!isMobile && !isTablet ? { gridTemplateColumns: `repeat(${data.categoryGridColumns || 4}, 1fr)` } : undefined}>
                {catArticles.map((a, i) => (
                  <EditableArticleSlot article={a} key={`${a.id}-${i}`} pinned={catHelpers.isPinned(i)} editable={editable} onPick={(id) => catHelpers.pin(i, id)} onClear={() => catHelpers.clear(i)} excludeIds={catExclude} currentArticleId={(data[catIdsKey] || [])[i]}>
                    <div className="group cursor-pointer">
                      <div className="rounded-sm mb-2 overflow-hidden" style={{ aspectRatio: data.categoryGridImageRatio || "4/3", background: a.img ? `url(${a.img}) center/cover no-repeat` : GRADIENT_COLORS_EDITORIAL[gradientIndexFor(a.id)] }} />
                      <p className="text-[14px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{a.title}</p>
                      <p className="text-[12px] text-gray-400 mt-1">{a.date}</p>
                    </div>
                  </EditableArticleSlot>
                ))}
              </div>
            </div>
          );
        })}

        {/* Section 6: Trending Stories */}
        {data.trendingEnabled !== false && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.trendingTitle || "Trending Stories"}</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-1">
              {tracker.track(resolveArticlesForBlock(data, data.trendingCount || 6, { idsKey: "trendingIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: tracker.exclude() })).map((a, i) => (
                <EditableArticleSlot article={a} key={`${a.id}-${i}`} className="flex-none" pinned={trendingHelpers.isPinned(i)} editable={editable} onPick={(id) => trendingHelpers.pin(i, id)} onClear={() => trendingHelpers.clear(i)} excludeIds={tracker.exclude()} currentArticleId={(data.trendingIds || [])[i]}>
                  <div className="group cursor-pointer" style={{ width: isMobile ? 200 : 240 }}>
                    <div className="rounded-sm mb-2 overflow-hidden" style={{ aspectRatio: "4/3", background: a.img ? `url(${a.img}) center/cover no-repeat` : GRADIENT_COLORS_EDITORIAL[i % GRADIENT_COLORS_EDITORIAL.length] }} />
                    <p className="text-[14px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{a.title}</p>
                    <p className="text-[10.5px] text-gray-500 mt-1 line-clamp-2 leading-snug">{a.excerpt}</p>
                  </div>
                </EditableArticleSlot>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 7: Newsletter — full width */}
      {data.newsletterEnabled !== false && (
        <div className="px-4 py-10 text-center">
          <div className="max-w-lg mx-auto rounded-xl p-8" style={{ backgroundColor: data.newsletterBg || "#f5f5f0", borderRadius: data.newsletterRadius ?? 12 }}>
            <h3 className="text-[18px] font-bold mb-1 text-gray-900">{data.newsletterHeading}</h3>
            <p className="text-[12.5px] mb-4 text-gray-500">{data.newsletterSubheading}</p>
            <NewsletterForm source="sidebar" buttonText={data.newsletterCtaLabel || "Subscribe"} />
          </div>
        </div>
      )}

      <div className="mx-auto" style={{ maxWidth: data.maxWidth || 1600, padding: pad }}>
        {/* Section 8: Featured Authors */}
        {data.authorsEnabled !== false && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-5">
              <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.authorsTitle || "Featured Authors"}</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${isMobile ? 2 : Math.min(data.authorsCount || 4, 8)}, 1fr)` }}>
              {(getAuthors().length ? getAuthors() : AUTHORS_SAMPLE).slice(0, data.authorsCount || 4).map((author, i) => {
                const isReal = !!author._id;
                const href = isReal ? authorHref(author.slug) : null;
                const initials = isReal
                  ? (author.name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
                  : author.initials;
                const inner = (
                  <>
                    {author.profileImage ? (
                      <img src={author.profileImage} alt={author.name} className="h-16 w-16 rounded-full object-cover mb-2" />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-[16px] font-bold text-gray-600 mb-2">{initials}</div>
                    )}
                    <p className="text-[12.5px] font-bold text-gray-900">{author.name}</p>
                    <p className="text-[10.5px] text-gray-500 mb-1.5">{author.role}</p>
                  </>
                );
                return href ? (
                  <Link href={href} key={author._id || author.name || i} className="flex flex-col items-center text-center group">
                    {inner}
                  </Link>
                ) : (
                  <div key={author._id || author.name || i} className="flex flex-col items-center text-center">
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 9: Advertisement */}
        {data.adEnabled !== false && (
          <AdBanner image={data.adImage} linkUrl={data.adLinkUrl} altText={data.adAltText} width={data.adWidth} height={data.adHeight || adSizeToHeight(data.adSize)} sizeLabel={data.adSize || "970x250"} className="mb-8" dark={false} />
        )}

        {/* Section 10: Latest Articles Grid */}
        {data.latestGridEnabled !== false && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-[15px] font-black uppercase tracking-widest text-gray-900">{data.latestGridTitle || "Latest Articles"}</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-4"}`}>
              {tracker.track(resolveArticlesForBlock(data, masonryLatestGridVisible, { idsKey: "masonryLatestGridIds", sampleFallback: SAMPLE_ARTICLES, excludeIds: tracker.exclude() })).map((a, i) => (
                <EditableArticleSlot key={`${a.id || i}-${i}`} pinned={masonryLatestGridHelpers.isPinned(i)} editable={editable} onPick={(id) => masonryLatestGridHelpers.pin(i, id)} onClear={() => masonryLatestGridHelpers.clear(i)} excludeIds={tracker.exclude()} currentArticleId={(data.masonryLatestGridIds || [])[i]}>
                  <ArticleCard article={a} showImage showCategory showDate compact />
                </EditableArticleSlot>
              ))}
            </div>
          </div>
        )}

        {/* Load More */}
        {data.loadMoreEnabled !== false && data.latestGridEnabled !== false && masonryLatestGridVisible < totalArticlesAvailable && (
          <div className="flex justify-center mb-2">
            <button
              onClick={() => setMasonryLatestGridVisible((c) => Math.min(c + Math.max(data.loadMoreIncrement || 3, 3), totalArticlesAvailable))}
              className="px-6 py-2.5 text-[14px] font-bold border-2 transition-colors hover:bg-gray-50"
              style={{ color: data.loadMoreColor || "#cc0000", borderColor: data.loadMoreColor || "#cc0000", borderRadius: data.loadMoreRadius ?? 6 }}
            >
              {data.loadMoreLabel || "Load More Articles"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MasonryEditorialRenderer({ data, device, blockId, onUpdateBlock }) {
  return <MasonryEditorialLayout data={data} device={device} blockId={blockId} onUpdateBlock={onUpdateBlock} />;
}

/** Renders just the homepage blocks (no admin chrome, no device switcher, no
 *  edit affordances since onUpdateBlock is never passed) — this is what the
 *  public homepage (app/page.jsx) renders, so the site always matches
 *  exactly what the admin sees in the builder's live preview. */
export function HomepageBlocksRenderer({ blocks, device = "desktop" }) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <div className="divide-y divide-gray-100">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} blockId={block.id} type={block.type} data={block.data} device={device} />
      ))}
    </div>
  );
}