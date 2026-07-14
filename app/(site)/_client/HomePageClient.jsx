"use client";

import { useEffect, useState } from "react";
import { HomepageBlocksRenderer } from "@/components/homepage-builder/LivePreviewPanel";
import Skeleton from "@/components/ui/Skeleton";
import { getHomepage } from "@/lib/api";
import { preloadCategoriesAndArticles } from "@/lib/categoriesArticlesApi";
import { useResponsiveDevice } from "@/lib/useResponsiveDevice";

export default function HomePageClient() {
  const [homepage, setHomepage] = useState(null);
  const device = useResponsiveDevice();

  useEffect(() => {
    Promise.all([getHomepage(), preloadCategoriesAndArticles()]).then(([hp]) => setHomepage(hp));
  }, []);

  if (!homepage) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    );
  }

  return <HomepageBlocksRenderer key={device} blocks={homepage.blocks} device={device} />;
}
