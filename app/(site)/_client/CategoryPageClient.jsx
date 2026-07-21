// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import CategoryLivePreview from "@/components/category-builder/CategoryLivePreview";
// import Skeleton from "@/components/ui/Skeleton";
// import { getCategories, preloadCategoriesAndArticles } from "@/lib/categoriesArticlesApi";
// import { getCategoryPageConfig } from "@/lib/categoryPageApi";
// import { useResponsiveDevice } from "@/lib/useResponsiveDevice";

// // The parent Server Component (app/(site)/[category]/page.jsx) has already
// // confirmed a category exists at this slug (and generated its metadata,
// // breadcrumbs, and JSON-LD) — this client component only needs to render
// // the interactive builder-driven layout.
// export default function CategoryPageClient() {
//   const params = useParams();
//   const device = useResponsiveDevice();
//   const slug = params?.category;

//   const [state, setState] = useState({ loading: true, category: null, config: null });

//   useEffect(() => {
//     let cancelled = false;
//     async function load() {
//       const [, config] = await Promise.all([preloadCategoriesAndArticles(), getCategoryPageConfig()]);
//       const categories = getCategories();
//       const category = categories.find((c) => c.slug === slug) || null;
//       if (cancelled) return;
//       setState({ loading: false, category, config });
//     }
//     load();
//     return () => {
//       cancelled = true;
//     };
//   }, [slug]);

//   if (state.loading || !state.category) {
//     return (
//       <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
//         <Skeleton className="h-40 w-full" />
//         <Skeleton className="h-6 w-2/3" />
//         <Skeleton className="h-6 w-1/2" />
//       </div>
//     );
//   }

//   const { templateId, blocksByTemplate } = state.config;
//   const data = blocksByTemplate[templateId];

//   return <CategoryLivePreview key={device} templateId={templateId} data={data} category={state.category} device={device} />;
// }


"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CategoryLivePreview from "@/components/category-builder/CategoryLivePreview";
import Skeleton from "@/components/ui/Skeleton";
import { getCategories, preloadCategoriesAndArticles, seedCategoriesAndArticles } from "@/lib/categoriesArticlesApi";
import { getCategoryPageConfig } from "@/lib/categoryPageApi";
import { seedAuthors } from "@/lib/authorsApi";
import { useResponsiveDevice } from "@/lib/useResponsiveDevice";

// The parent Server Component (app/(site)/[category]/page.jsx) has already
// confirmed a category exists at this slug (and generated its metadata,
// breadcrumbs, and JSON-LD), and — as of the SEO fix below — has also
// fetched the category itself, the category-page builder config, and the
// full categories/articles list on the server. Those are passed in as
// initial* props so this component can render the real template (real
// <h1>/<h2>/<h3> headings, real article titles and links) on its very
// first render pass instead of showing a loading skeleton. That's what
// fixes the "missing H1/H2", "heading order", and slow FCP/LCP/TTI/CLS
// issues an SEO/Lighthouse audit flags — those tools only see the first
// HTML response, which used to be an empty shell until a client-side
// useEffect fetch resolved.
export default function CategoryPageClient({
  initialCategory = null,
  initialConfig = null,
  initialCategories = null,
  initialArticles = null,
  initialAuthors = null,
  initialDevice = "desktop",
}) {
  const params = useParams();
  const slug = params?.category;

  // Seed the shared categories/articles cache synchronously, on the very
  // first render — not in an effect — so CategoryLivePreview's templates
  // (which read that cache synchronously via lib/articlesSource.js) see
  // real data on the same render pass that produces the server HTML. Safe
  // to call on every render: seedCategoriesAndArticles() is a no-op once
  // the cache is already populated.
  if (initialCategories && initialArticles) {
    seedCategoriesAndArticles(initialCategories, initialArticles);
  }
  // Same idea for authors — this is what the sidebar's "Correspondents"
  // module (getAuthors()) reads synchronously. Previously it was only
  // populated by DataProvider's client-only preloadAuthors() effect, so
  // the very first HTML (and anything a crawler/Lighthouse sees) always
  // showed the "no authors yet" empty state before popping in the real
  // list a moment after hydration.
  if (initialAuthors) {
    seedAuthors(initialAuthors);
  }

  const device = useResponsiveDevice(initialDevice);
  const [state, setState] = useState({
    loading: !initialCategory || !initialConfig,
    category: initialCategory,
    config: initialConfig,
  });

  useEffect(() => {
    // If the server already resolved the category + config, there's
    // nothing to fetch — this avoids the redundant client round trip (and
    // the skeleton flash) that used to happen on every single load.
    // (Authors don't need a fallback fetch here: components/site/
    // DataProvider.jsx already calls preloadAuthors() once, site-wide, on
    // mount — seedAuthors() above just makes that call a no-op when the
    // server already provided the data.)
    if (initialCategory && initialConfig) return;
    let cancelled = false;
    async function load() {
      const [, config] = await Promise.all([preloadCategoriesAndArticles(), getCategoryPageConfig()]);
      const categories = getCategories();
      const category = categories.find((c) => c.slug === slug) || null;
      if (cancelled) return;
      setState({ loading: false, category, config });
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug, initialCategory, initialConfig]);

  if (state.loading || !state.category) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    );
  }

  const { templateId, blocksByTemplate } = state.config;
  const data = blocksByTemplate[templateId];

  return <CategoryLivePreview key={device} templateId={templateId} data={data} category={state.category} device={device} />;
}
