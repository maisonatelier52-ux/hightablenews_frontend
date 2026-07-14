"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CategoryLivePreview from "@/components/category-builder/CategoryLivePreview";
import Skeleton from "@/components/ui/Skeleton";
import { getCategories, preloadCategoriesAndArticles } from "@/lib/categoriesArticlesApi";
import { getCategoryPageConfig } from "@/lib/categoryPageApi";
import { useResponsiveDevice } from "@/lib/useResponsiveDevice";

// The parent Server Component (app/(site)/[category]/page.jsx) has already
// confirmed a category exists at this slug (and generated its metadata,
// breadcrumbs, and JSON-LD) — this client component only needs to render
// the interactive builder-driven layout.
export default function CategoryPageClient() {
  const params = useParams();
  const device = useResponsiveDevice();
  const slug = params?.category;

  const [state, setState] = useState({ loading: true, category: null, config: null });

  useEffect(() => {
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
  }, [slug]);

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
