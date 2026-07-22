
"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useCategoryContent, CategoryBanner, CategoryTag, Meta, imgStyle, ArticleLink } from "../shared";

/** Template 2 — Two-Column Grid: a plain, uniform 2-column article grid with
 *  a "Load More" button. No sidebar at all, matching the reference design
 *  exactly. Mobile collapses to a single column. */
export default function Grid2ColTemplate({ data, category, device = "desktop" }) {
  const totalCount = data.grid?.count ?? 12;
  const { rest } = useCategoryContent(category, { rest: totalCount + 12 });
  const batchSize = data.loadMore?.batchSize ?? 6;
  const [visible, setVisible] = useState(totalCount);
  const articles = rest.slice(0, visible);

  const isMobile = device === "mobile";

  return (
    <div className="bg-white">
      <CategoryBanner
        banner={data.banner}
        categoryName={category?.name}
        seoTitle={category?.seoTitle}
        description={category?.description}
      />
      <div className="mx-auto px-4 sm:px-6 py-7" style={{ maxWidth: 1200 }}>
        <div className={`grid gap-x-8 gap-y-7 ${isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
          {articles.map((a) => (
            <ArticleLink key={a.id} article={a} className="flex flex-col group">
              {data.grid?.showImage && (
                <div className="rounded-md overflow-hidden mb-3" style={imgStyle(a, data.grid?.imageRatio || "16/9")} />
              )}
              <CategoryTag color={a.categoryColor}>{a.category}</CategoryTag>
              <h2 className="font-semibold text-[15px] text-gray-900 leading-snug mt-1.5 line-clamp-3 group-hover:text-red-600 transition-colors">{a.title}</h2>
              {data.grid?.showDescription && (
                <p className="text-[12.5px] text-gray-500 mt-1.5 line-clamp-2 leading-snug">{a.excerpt}</p>
              )}
              <Meta
                author={a.author} date={a.date} readTime={a.readTime}
                showAuthor={data.grid?.showAuthor} showDate={data.grid?.showDate} showReadTime={data.grid?.showReadTime}
              />
            </ArticleLink>
          ))}
        </div>

        {data.loadMore?.enabled && visible < rest.length && (
          <div className="flex justify-center mt-9">
            <button
              type="button"
              onClick={() => setVisible((v) => v + batchSize)}
              className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-gray-700 border border-gray-300 rounded-md px-5 py-2.5 hover:bg-gray-50 transition-colors"
            >
              {data.loadMore?.label || "Load More Articles"}
              <ChevronDown size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}