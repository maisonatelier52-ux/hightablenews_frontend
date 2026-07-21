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
import { useResponsiveDevice } from "@/lib/useResponsiveDevice";

// The parent Server Component (app/(site)/[category]/page.jsx) has already
// confirmed a category exists at this slug (and generated its metadata,
// breadcrumbs, and JSON-LD), and — this is the SEO/performance fix — has
// already fetched the category-page-builder config plus the full
// categories/articles list on the server. Those are passed in as
// initialCategory/initialConfig/initialCategories/initialArticles so this
// component can render the real template (with its real <h1> banner, real
// headings, real article cards) on its very first render pass instead of
// showing a loading skeleton and fetching everything client-side after
// mount. That's what fixes the "no <h1>/<h2>" SEO findings (the first HTML
// response used to contain none of this) and the very poor mobile/desktop
// FCP, LCP, TTI, and CLS scores (the page used to visibly swap from a
// skeleton to real content after the client fetch resolved).
export default function CategoryPageClient({
  initialCategory = null,
  initialConfig = null,
  initialCategories = null,
  initialArticles = null,
  initialDevice = "desktop",
}) {
  const params = useParams();
  const device = useResponsiveDevice(initialDevice);
  const slug = params?.category;

  // Seed the shared categories/articles cache synchronously, on the very
  // first render — not in an effect — so CategoryLivePreview's children
  // (which read that cache synchronously, e.g. useCategoryContent in
  // components/category-builder/shared.jsx) see real data immediately, on
  // both the server-rendered HTML and the client render that hydrates it.
  // seedCategoriesAndArticles() is a no-op once the cache is already
  // populated, so this is safe to call on every render.
  if (initialCategories && initialArticles) {
    seedCategoriesAndArticles(initialCategories, initialArticles);
  }

  const [state, setState] = useState({
    loading: !(initialCategory && initialConfig),
    category: initialCategory,
    config: initialConfig,
  });

  useEffect(() => {
    // If the server already resolved the category + config, there's
    // nothing to fetch — this avoids the redundant client round trip (and
    // the skeleton flash) that used to happen on every single load.
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