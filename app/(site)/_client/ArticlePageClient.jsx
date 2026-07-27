"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ArticleLivePreview from "@/components/article-builder/ArticleLivePreview";
import Skeleton from "@/components/ui/Skeleton";
import { getAllPreviewArticlesSorted, toPreviewArticle } from "@/lib/articlesSource";
import {
  preloadCategoriesAndArticles,
  seedCategoriesAndArticles,
  normalizeArticles,
  normalizeCategories,
} from "@/lib/categoriesArticlesApi";
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
//
// IMPORTANT — resolving the CURRENT article:
// `seedCategoriesAndArticles()` only ever seeds the shared module-level
// cache ONCE per page load. That's fine for the *other* articles on the
// page (related/most-read/prev-next cards only need lightweight preview
// data), but the server strips `content`/`contentHtml` from every article
// in that list EXCEPT the one currently being viewed (see page.jsx). So if
// this component read the current article back out of that shared cache,
// clicking through to a second article (client-side nav, same component
// instance reused by Next.js) would find that second article still
// stripped of content from the FIRST page load's seed — showing a short/
// teaser body instead of the real one. A hard reload "fixed" it only
// because a full page load resets the module cache from scratch.
// To avoid that, the current article is resolved directly from this
// render's own fresh `initialArticles` prop (normalized on the spot, not
// via the shared cache) every single time.
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
  // first render — not in an effect — so other widgets that read
  // getAllPreviewArticlesSorted() (related articles, sidebar, prev/next)
  // see real data immediately. This is a one-time seed by design (see
  // note in categoriesArticlesApi.js) and is NOT what determines the
  // current article's content — see below.
  if (initialCategories && initialArticles) {
    seedCategoriesAndArticles(initialCategories, initialArticles);
  }
  // Same idea for authors — read by the sidebar's byline/author modules.
  if (initialAuthors) {
    seedAuthors(initialAuthors);
  }

  // Resolve the CURRENT article straight from this render's own fresh
  // props, normalized the same way the cache would, but WITHOUT going
  // through the (possibly stale, one-time-seeded) shared cache. This
  // guarantees the full article body is always the one that belongs to
  // `slug`, on every navigation — not just the first one.
  const initialArticle = (() => {
    if (!initialCategories || !initialArticles) return null;
    const normalizedArticles = normalizeArticles(initialArticles);
    const raw = normalizedArticles.find((a) => a.slug === slug);
    if (!raw) return null;
    const categories = normalizeCategories(initialCategories);
    const categoriesById = Object.fromEntries(categories.map((c) => [c._id, c.name || c.title]));
    const categorySlugsById = Object.fromEntries(categories.map((c) => [c._id, c.slug || ""]));
    const authorsById = Object.fromEntries((initialAuthors || []).map((a) => [a._id, a]));
    return toPreviewArticle(raw, categoriesById, authorsById, categorySlugsById);
  })();

  const device = useResponsiveDevice(initialDevice);
  const [state, setState] = useState({
    loading: !initialArticle || !initialConfig,
    article: initialArticle,
    config: initialConfig,
  });

  // Keep state in sync with fresh props on every navigation. Next.js
  // reuses this same component instance when navigating between two
  // articles under the same [category]/[slug] route (it doesn't remount
  // by default), so `useState`'s initial value alone is only ever applied
  // once — without this, a later navigation's correctly-resolved
  // `initialArticle` would compute correctly above but never actually
  // reach the screen, since the render below reads from `state`, not from
  // `initialArticle` directly. (The parent also passes `key={slug}` to
  // force a clean remount as a second line of defense — see page.jsx.)
  useEffect(() => {
    if (initialArticle && initialConfig) {
      setState({ loading: false, article: initialArticle, config: initialConfig });
      return;
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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