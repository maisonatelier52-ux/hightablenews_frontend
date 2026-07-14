"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ArticleLivePreview from "@/components/article-builder/ArticleLivePreview";
import Skeleton from "@/components/ui/Skeleton";
import { getAllPreviewArticlesSorted } from "@/lib/articlesSource";
import { preloadCategoriesAndArticles } from "@/lib/categoriesArticlesApi";
import { preloadAuthors } from "@/lib/authorsApi";
import { getArticleDetailPageConfig } from "@/lib/articleDetailPageApi";
import { useResponsiveDevice } from "@/lib/useResponsiveDevice";

// The parent Server Component (app/(site)/[category]/[slug]/page.jsx) has
// already confirmed the article exists and generated its metadata,
// breadcrumbs, and NewsArticle JSON-LD — this only renders the interactive
// builder-driven article layout.
export default function ArticlePageClient() {
  const params = useParams();
  const device = useResponsiveDevice();
  const slug = params?.slug;

  const [state, setState] = useState({ loading: true, article: null, config: null });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [, , config] = await Promise.all([
        preloadCategoriesAndArticles(),
        preloadAuthors(),
        getArticleDetailPageConfig(),
      ]);
      const articles = getAllPreviewArticlesSorted();
      const article = articles.find((a) => a.slug === slug) || null;
      if (cancelled) return;
      setState({ loading: false, article, config });
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.loading || !state.article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
      </div>
    );
  }

  const { templateId, blocksByTemplate } = state.config;
  const data = blocksByTemplate[templateId];

  return <ArticleLivePreview key={device} templateId={templateId} data={data} article={state.article} device={device} />;
}
