// "use client";

// import { getRelatedArticles, getPrevNextArticle } from "@/lib/articlesSource";
// import {
//   Breadcrumb, CategoryTags, ShareRow, ByLine, ArticleBody, ArticleCard, AuthorBox,
//   PrevNextNav, imgStyle,
// } from "../shared";

// /** Template 3 — Split Column Magazine: title/meta/byline in a left text
//  *  column beside a large photo + author card + prev/next on the right.
//  *  Stacks to a single column on mobile (text first, then photo). The full
//  *  article body and related articles run full-width below both columns. */
// export default function SplitColumnTemplate({ data, article, device = "desktop" }) {
//   const isMobile = device === "mobile";
//   const isTablet = device === "tablet";
//   const a = article;
//   const related = data.relatedArticles?.enabled ? getRelatedArticles(a, data.relatedArticles?.count ?? 3) : [];
//   const { previous, next } = data.prevNext?.enabled ? getPrevNextArticle(a) : { previous: null, next: null };
//   const cols = isMobile ? 1 : (data.relatedArticles?.columns ?? 3);

//   return (
//     <div className="bg-white">
//       <div className="mx-auto px-4 sm:px-6 py-7" style={{ maxWidth: 1200 }}>
//         <div className={isMobile ? "flex flex-col gap-6" : "grid gap-10"} style={isMobile ? {} : { gridTemplateColumns: "0.85fr 1.15fr" }}>
//           {/* ── LEFT — text ── */}
//           <div>
//             {data.header?.showBreadcrumb && <Breadcrumb article={a} />}
//             <h1 className="font-serif font-bold text-gray-900 leading-tight mt-3" style={{ fontSize: data.typography?.titleSize || 28 }}>{a.title}</h1>
//             <p className="text-gray-500 mt-3" style={{ fontSize: data.typography?.subtitleSize || 15 }}>{a.excerpt}</p>
//             <div className="mt-4">
//               <ByLine article={a} />
//             </div>
//             {data.header?.showShare && (
//               <div className="mt-4">
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Share</p>
//                 <ShareRow article={a} platforms={data.header?.sharePlatforms} />
//               </div>
//             )}
//             {data.header?.showCategoryTags && <div className="mt-4"><CategoryTags article={a} /></div>}
//           </div>

//           {/* ── RIGHT — photo + author + prev/next ── */}
//           <div>
//             {data.hero?.enabled && (
//               <div className="rounded-lg overflow-hidden" style={imgStyle(a, data.hero?.ratio || "4/5")} />
//             )}
//             {data.authorBox?.enabled && <div className="mt-4"><AuthorBox article={a} /></div>}
//             {data.prevNext?.enabled && (previous || next) && (
//               <div className="mt-4">
//                 <PrevNextNav previous={previous} next={next} settings={data.prevNext} />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ── FULL WIDTH — body ── */}
//         <div className="mt-9 pt-8 border-t border-gray-100 mx-auto" style={{ maxWidth: data.body?.contentWidth || 680 }}>
//           <ArticleBody
//             article={a}
//             typography={data.typography}
//             dropCap={data.body?.dropCap}
//             showPullquotes={data.body?.showPullquotes}
//             showKeyPoints={data.body?.showKeyPoints}
//           />
//         </div>

//         {data.relatedArticles?.enabled && related.length > 0 && (
//           <div className="mt-9 pt-8 border-t border-gray-100">
//             <p className="text-[15px] font-bold text-gray-900 uppercase tracking-wide mb-4">{data.relatedArticles.title}</p>
//             <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
//               {related.map((r) => <ArticleCard key={r.id} article={r} imageRatio={data.card?.imageRatio} borderEnabled={data.card?.borderEnabled} />)}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { getRelatedArticles, getPrevNextArticle } from "@/lib/articlesSource";
import {
  Breadcrumb, CategoryTags, ShareRow, ByLine, ArticleBody, ArticleCard, AuthorBox,
  PrevNextNav, imgStyle,
} from "../shared";

/** Template 3 — Split Column Magazine: title/meta/byline in a left text
 *  column beside a large photo + author card + prev/next on the right.
 *  Stacks to a single column on mobile (text first, then photo). The full
 *  article body and related articles run full-width below both columns. */
export default function SplitColumnTemplate({ data, article, device = "desktop" }) {
  const isMobile = device === "mobile";
  const isTablet = device === "tablet";
  const a = article;
  const related = data.relatedArticles?.enabled ? getRelatedArticles(a, data.relatedArticles?.count ?? 3) : [];
  const { previous, next } = data.prevNext?.enabled ? getPrevNextArticle(a) : { previous: null, next: null };
  const cols = isMobile ? 1 : (data.relatedArticles?.columns ?? 3);

  return (
    <div className="bg-white">
      <div className="mx-auto px-4 sm:px-6 py-7" style={{ maxWidth: 1200 }}>
        <div className={isMobile ? "flex flex-col gap-6" : "grid gap-10 items-stretch"} style={isMobile ? {} : { gridTemplateColumns: "0.85fr 1.15fr" }}>
          {/* ── LEFT — text ── */}
          <div>
            {data.header?.showBreadcrumb && <Breadcrumb article={a} />}
            <h1 className="font-serif font-bold text-gray-900 leading-tight mt-3" style={{ fontSize: data.typography?.titleSize || 28 }}>{a.title}</h1>
            <p className="text-gray-500 mt-3" style={{ fontSize: data.typography?.subtitleSize || 15 }}>{a.excerpt}</p>
            <div className="mt-4">
              <ByLine article={a} />
            </div>
            {data.header?.showShare && (
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Share</p>
                <ShareRow article={a} platforms={data.header?.sharePlatforms} />
              </div>
            )}
            {data.header?.showCategoryTags && <div className="mt-4"><CategoryTags article={a} /></div>}
          </div>

          {/* ── RIGHT — photo, stretched to match the left column's height ── */}
          {data.hero?.enabled && (
            <div className={isMobile ? "" : "h-full"}>
              <div
                className="rounded-lg overflow-hidden w-full h-full"
                style={
                  isMobile
                    ? imgStyle(a, data.hero?.ratio || "4/5")
                    : { ...imgStyle(a, data.hero?.ratio || "4/5"), aspectRatio: "auto", minHeight: 260 }
                }
              />
            </div>
          )}
        </div>

        {/* ── FULL WIDTH — body ── */}
        <div className="mt-9 pt-8 border-t border-gray-100 mx-auto" style={{ maxWidth: data.body?.contentWidth || 680 }}>
          <ArticleBody
            article={a}
            typography={data.typography}
            dropCap={data.body?.dropCap}
            showPullquotes={data.body?.showPullquotes}
            showKeyPoints={data.body?.showKeyPoints}
          />
        </div>

        {/* ── FULL WIDTH — author box + prev/next, above related articles ── */}
        {data.authorBox?.enabled && (
          <div className="mt-8 mx-auto" style={{ maxWidth: data.body?.contentWidth || 680 }}>
            <AuthorBox article={a} />
          </div>
        )}

        {data.prevNext?.enabled && (previous || next) && (
          <div className="mt-7 pt-6 border-t border-gray-100 mx-auto" style={{ maxWidth: data.body?.contentWidth || 680 }}>
            <PrevNextNav previous={previous} next={next} settings={data.prevNext} />
          </div>
        )}

        {data.relatedArticles?.enabled && related.length > 0 && (
          <div className="mt-9 pt-8 border-t border-gray-100">
            <p className="text-[15px] font-bold text-gray-900 uppercase tracking-wide mb-4">{data.relatedArticles.title}</p>
            <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
              {related.map((r) => <ArticleCard key={r.id} article={r} imageRatio={data.card?.imageRatio} borderEnabled={data.card?.borderEnabled} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
