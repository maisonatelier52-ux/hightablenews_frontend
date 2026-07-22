// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import ArticleLivePreview from "@/components/article-builder/ArticleLivePreview";
// import Skeleton from "@/components/ui/Skeleton";
// import { getAllPreviewArticlesSorted } from "@/lib/articlesSource";
// import { preloadCategoriesAndArticles } from "@/lib/categoriesArticlesApi";
// import { preloadAuthors } from "@/lib/authorsApi";
// import { getArticleDetailPageConfig } from "@/lib/articleDetailPageApi";
// import { useResponsiveDevice } from "@/lib/useResponsiveDevice";

// // The parent Server Component (app/(site)/[category]/[slug]/page.jsx) has
// // already confirmed the article exists and generated its metadata,
// // breadcrumbs, and NewsArticle JSON-LD — this only renders the interactive
// // builder-driven article layout.
// export default function ArticlePageClient() {
//   const params = useParams();
//   const device = useResponsiveDevice();
//   const slug = params?.slug;

//   const [state, setState] = useState({ loading: true, article: null, config: null });

//   useEffect(() => {
//     let cancelled = false;
//     async function load() {
//       const [, , config] = await Promise.all([
//         preloadCategoriesAndArticles(),
//         preloadAuthors(),
//         getArticleDetailPageConfig(),
//       ]);
//       const articles = getAllPreviewArticlesSorted();
//       const article = articles.find((a) => a.slug === slug) || null;
//       if (cancelled) return;
//       setState({ loading: false, article, config });
//     }
//     load();
//     return () => {
//       cancelled = true;
//     };
//   }, [slug]);

//   if (state.loading || !state.article) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
//         <Skeleton className="h-6 w-1/3" />
//         <Skeleton className="h-10 w-full" />
//         <Skeleton className="h-80 w-full" />
//         <Skeleton className="h-6 w-full" />
//         <Skeleton className="h-6 w-5/6" />
//       </div>
//     );
//   }

//   const { templateId, blocksByTemplate } = state.config;
//   const data = blocksByTemplate[templateId];

//   return <ArticleLivePreview key={device} templateId={templateId} data={data} article={state.article} device={device} />;
// }


"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ArticleLivePreview from "@/components/article-builder/ArticleLivePreview";
import Skeleton from "@/components/ui/Skeleton";
import { getAllPreviewArticlesSorted } from "@/lib/articlesSource";
import { preloadCategoriesAndArticles, seedCategoriesAndArticles } from "@/lib/categoriesArticlesApi";
import { preloadAuthors, seedAuthors } from "@/lib/authorsApi";
import { getArticleDetailPageConfig } from "@/lib/articleDetailPageApi";
import { useResponsiveDevice } from "@/lib/useResponsiveDevice";

// The parent Server Component (app/(site)/[category]/[slug]/page.jsx) has
// already confirmed the article exists (and generated its metadata,
// breadcrumbs, and NewsArticle JSON-LD), and — as of the SEO fix below —
// has also fetched the article-detail-page builder config and the full
// categories/articles/authors lists on the server. Those are passed in as
// initial* props so this component can render the real template (the real
// <h1> article title, real body copy, real related-articles/sidebar
// headings) on its very first render pass instead of showing a loading
// skeleton. That's what fixes the "missing <h1>", "0% title/H1 coherence",
// and slow FCP/LCP/TTI issues an SEO/Lighthouse audit flags — those tools
// only see the first HTML response, which used to be an empty shell until
// a client-side useEffect fetch resolved. Mirrors CategoryPageClient.jsx.
export default function ArticlePageClient({
  initialCategories = null,
  initialArticles = null,
  initialAuthors = null,
  initialConfig = null,
  initialDevice = "desktop",
}) {
  const params = useParams();
  const slug = params?.slug;

  // Seed the shared categories/articles cache synchronously, on the very
  // first render — not in an effect — so getAllPreviewArticlesSorted()
  // below (which reads that cache synchronously) sees real data on the
  // same render pass that produces the server HTML. Safe on every render:
  // seedCategoriesAndArticles() is a no-op once the cache is populated.
  if (initialCategories && initialArticles) {
    seedCategoriesAndArticles(initialCategories, initialArticles);
  }
  // Same idea for authors — read by the sidebar's byline/author modules.
  if (initialAuthors) {
    seedAuthors(initialAuthors);
  }

  // Now that the cache is seeded (if the server provided data), this finds
  // the same preview-article shape the old client-only effect used to
  // fetch — just synchronously, on this render, instead of a tick later.
  const initialArticle =
    initialCategories && initialArticles
      ? getAllPreviewArticlesSorted().find((a) => a.slug === slug) || null
      : null;

  const device = useResponsiveDevice(initialDevice);
  const [state, setState] = useState({
    loading: !initialArticle || !initialConfig,
    article: initialArticle,
    config: initialConfig,
  });

  useEffect(() => {
    // If the server already resolved the article + config, there's
    // nothing to fetch — this avoids the redundant client round trip (and
    // the skeleton flash) that used to happen on every single load.
    if (initialArticle && initialConfig) return;
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
  }, [slug, initialArticle, initialConfig]);

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
