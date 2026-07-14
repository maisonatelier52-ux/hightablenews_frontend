"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useCategoryContent, CategoryBanner, CategoryTag, Meta, imgStyle, ArticleLink } from "../shared";

/** Template 3 — Three-Column Grid: a symmetric 3-column article grid with a
 *  "Load More" button. No sidebar, matching the reference design exactly.
 *  Tablet drops to 2 columns, mobile to 1. */
export default function Grid3ColTemplate({ data, category, device = "desktop" }) {
  const totalCount = data.grid?.count ?? 9;
  const { rest } = useCategoryContent(category, { rest: totalCount + 12 });
  const batchSize = data.loadMore?.batchSize ?? 6;
  const [visible, setVisible] = useState(totalCount);
  const articles = rest.slice(0, visible);

  const isMobile = device === "mobile";
  const isTablet = device === "tablet";

  const gridCols = isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3";

  return (
    <div className="bg-white">
      <CategoryBanner banner={data.banner} categoryName={category?.name} />
      <div className="mx-auto px-4 sm:px-6 py-7" style={{ maxWidth: 1200 }}>
        <div className={`grid gap-x-7 gap-y-8 ${gridCols}`}>
          {articles.map((a) => (
            <ArticleLink key={a.id} article={a} className="flex flex-col group">
              {data.grid?.showImage && (
                <div className="rounded-md overflow-hidden mb-3" style={imgStyle(a, data.grid?.imageRatio || "16/9")} />
              )}
              <CategoryTag color={a.categoryColor}>{a.category}</CategoryTag>
              <h3 className="font-semibold text-[14.5px] text-gray-900 leading-snug mt-1.5 line-clamp-2 group-hover:text-red-600 transition-colors">{a.title}</h3>
              {data.grid?.showDescription && (
                <p className="text-[12px] text-gray-500 mt-1.5 line-clamp-2 leading-snug">{a.excerpt}</p>
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
