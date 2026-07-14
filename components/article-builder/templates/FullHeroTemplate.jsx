"use client";

import { getRelatedArticles, getPrevNextArticle } from "@/lib/articlesSource";
import {
  Breadcrumb, CategoryTags, ShareRow, ByLine, ArticleBody, ArticleCard, AuthorBox,
  PrevNextNav, imgStyle,
} from "../shared";

/** Template 2 — Full-Width Hero Editorial: edge-to-edge hero image, no
 *  sidebar at all — a single, wide reading column with previous/next
 *  navigation and a related-articles grid below. */
export default function FullHeroTemplate({ data, article, device = "desktop" }) {
  const isMobile = device === "mobile";
  const isTablet = device === "tablet";
  const a = article;
  const related = data.relatedArticles?.enabled ? getRelatedArticles(a, data.relatedArticles?.count ?? 4) : [];
  const { previous, next } = data.prevNext?.enabled ? getPrevNextArticle(a) : { previous: null, next: null };
  const cols = isMobile ? 1 : isTablet ? 2 : (data.relatedArticles?.columns ?? 4);

  return (
    <div className="bg-white">
      {data.hero?.enabled && (
        <div
          className="w-full"
          style={{ ...imgStyle(a, isMobile ? "4/3" : data.hero?.ratio || "21/9"), height: isMobile ? undefined : data.hero?.heightDesktop || 460, position: "relative" }}
        >
          {data.hero?.overlay && <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,.55), transparent 55%)" }} />}
        </div>
      )}

      <div className="mx-auto px-4 sm:px-6 py-7" style={{ maxWidth: data.body?.contentWidth || 760 }}>
        {data.header?.showBreadcrumb && <Breadcrumb article={a} />}
        {data.header?.showCategoryTags && <div className="mt-3"><CategoryTags article={a} /></div>}
        <h1 className="font-serif font-bold text-gray-900 leading-tight mt-3" style={{ fontSize: data.typography?.titleSize || 34 }}>{a.title}</h1>
        <p className="text-gray-500 mt-3" style={{ fontSize: data.typography?.subtitleSize || 17 }}>{a.excerpt}</p>

        <div className="flex items-center justify-between mt-5 pb-5 border-b border-gray-100">
          <ByLine article={a} />
          {data.header?.showShare && <ShareRow article={a} platforms={data.header?.sharePlatforms} />}
        </div>

        <div className="mt-6">
          <ArticleBody
            article={a}
            typography={data.typography}
            dropCap={data.body?.dropCap}
            showPullquotes={data.body?.showPullquotes}
            showKeyPoints={data.body?.showKeyPoints}
          />
        </div>

        {data.authorBox?.enabled && <div className="mt-8"><AuthorBox article={a} /></div>}

        {data.prevNext?.enabled && (previous || next) && (
          <div className="mt-7 pt-6 border-t border-gray-100">
            <PrevNextNav previous={previous} next={next} settings={data.prevNext} />
          </div>
        )}
      </div>

      {data.relatedArticles?.enabled && related.length > 0 && (
        <div className="mx-auto px-4 sm:px-6 pb-10" style={{ maxWidth: 1200 }}>
          <p className="text-[15px] font-bold text-gray-900 uppercase tracking-wide mb-4 pt-4 border-t border-gray-100">{data.relatedArticles.title}</p>
          <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
            {related.map((r) => <ArticleCard key={r.id} article={r} imageRatio={data.card?.imageRatio} borderEnabled={data.card?.borderEnabled} />)}
          </div>
        </div>
      )}
    </div>
  );
}
