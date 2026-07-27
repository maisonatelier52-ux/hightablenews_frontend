

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuthorLivePreview from "@/components/author-builder/AuthorLivePreview";
import Skeleton from "@/components/ui/Skeleton";
import { getAuthorBySlug, preloadAuthors, seedAuthors } from "@/lib/authorsApi";
import { seedCategoriesAndArticles, preloadCategoriesAndArticles } from "@/lib/categoriesArticlesApi";
import { getAuthorPageConfig } from "@/lib/authorPageApi";
import { useResponsiveDevice } from "@/lib/useResponsiveDevice";

// The parent Server Component (app/(site)/author/[slug]/page.jsx) has
// already confirmed the author exists (and generated its metadata,
// breadcrumbs, and Person JSON-LD), and — as of the SEO fix below — has
// also fetched the author-page builder config and the full
// categories/articles/authors lists on the server. Those are passed in as
// initial* props so this component can render the real template (the real
// <h1> author name, real bio, real "Articles by <author>" list) on its
// very first render pass instead of showing a loading skeleton. That's
// what fixes the "missing <h1>/<h2>", heading-order, and slow
// FCP/LCP/CLS issues an SEO/Lighthouse audit flags — those tools only see
// the first HTML response, which used to be an empty shell until a
// client-side useEffect fetch resolved (and the skeleton-to-real-content
// swap on hydration is exactly what was driving the layout shift too).
// Mirrors ArticlePageClient.jsx.
export default function AuthorPageClient({
  initialAuthor = null,
  initialCategories = null,
  initialArticles = null,
  initialAuthors = null,
  initialConfig = null,
  initialDevice = "desktop",
}) {
  const params = useParams();
  const slug = params?.slug;

  // Seed the shared categories/articles cache synchronously, on the very
  // first render — not in an effect — so useAuthorContent()'s
  // getArticlesForAuthor() (which reads that cache synchronously) sees
  // real data on the same render pass that produces the server HTML.
  if (initialCategories && initialArticles) {
    seedCategoriesAndArticles(initialCategories, initialArticles);
  }
  // Seed the authors cache too — read by getAuthorBySlug() below, and by
  // sibling modules (e.g. "More from this section") elsewhere on the page.
  if (initialAuthors) {
    seedAuthors(initialAuthors);
  }

  // Now that the caches are seeded, this resolves the same author the old
  // client-only effect used to fetch — synchronously, on this render,
  // instead of a tick later. Falls back to the author object the server
  // already fetched directly (initialAuthor) in case this particular
  // author was outside whatever page/limit initialAuthors covers.
  const initialResolvedAuthor =
    (initialAuthors && getAuthorBySlug(slug)) || initialAuthor || null;

  const device = useResponsiveDevice(initialDevice);
  const [state, setState] = useState({
    loading: !initialResolvedAuthor || !initialConfig,
    author: initialResolvedAuthor,
    config: initialConfig,
  });

  useEffect(() => {
    // If the server already resolved the author + config, there's nothing
    // to fetch — this avoids the redundant client round trip (and the
    // skeleton flash / layout shift) that used to happen on every load.
    if (initialResolvedAuthor && initialConfig) return;
    let cancelled = false;
    async function load() {
      const [, config] = await Promise.all([preloadAuthors(), preloadCategoriesAndArticles(), getAuthorPageConfig()]);
      const author = getAuthorBySlug(slug) || null;
      if (cancelled) return;
      setState({ loading: false, author, config });
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug, initialResolvedAuthor, initialConfig]);

  if (state.loading || !state.author) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-40 w-40 rounded-full" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    );
  }

  const { templateId, blocksByTemplate } = state.config;
  const data = blocksByTemplate[templateId];

  return <AuthorLivePreview key={device} templateId={templateId} data={data} author={state.author} device={device} />;
}