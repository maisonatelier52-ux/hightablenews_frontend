// "use client";

// import { useEffect, useState } from "react";
// import { HomepageBlocksRenderer } from "@/components/homepage-builder/LivePreviewPanel";
// import Skeleton from "@/components/ui/Skeleton";
// import { getHomepage } from "@/lib/api";
// import { preloadCategoriesAndArticles } from "@/lib/categoriesArticlesApi";
// import { useResponsiveDevice } from "@/lib/useResponsiveDevice";

// export default function HomePageClient() {
//   const [homepage, setHomepage] = useState(null);
//   const device = useResponsiveDevice();

//   useEffect(() => {
//     Promise.all([getHomepage(), preloadCategoriesAndArticles()]).then(([hp]) => setHomepage(hp));
//   }, []);

//   if (!homepage) {
//     return (
//       <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
//         <Skeleton className="h-72 w-full" />
//         <Skeleton className="h-6 w-2/3" />
//         <Skeleton className="h-6 w-1/2" />
//       </div>
//     );
//   }

//   return <HomepageBlocksRenderer key={device} blocks={homepage.blocks} device={device} />;
// }

// chnaged for seo


"use client";

import { useEffect, useState } from "react";
import { HomepageBlocksRenderer } from "@/components/homepage-builder/LivePreviewPanel";
import Skeleton from "@/components/ui/Skeleton";
import { getHomepage } from "@/lib/api";
import { preloadCategoriesAndArticles, seedCategoriesAndArticles } from "@/lib/categoriesArticlesApi";
import { useResponsiveDevice } from "@/lib/useResponsiveDevice";

export default function HomePageClient({
  initialHomepage = null,
  initialCategories = null,
  initialArticles = null,
  initialDevice = "desktop",
}) {
  // Seed the shared categories/articles cache synchronously, on the very
  // first render — not in an effect — so HomepageBlocksRenderer's children
  // (which read that cache synchronously) see real data on the same render
  // pass that produces the server HTML. Safe to call on every render:
  // seedCategoriesAndArticles() is a no-op once the cache is already
  // populated (see lib/categoriesArticlesApi.js).
  if (initialCategories && initialArticles) {
    seedCategoriesAndArticles(initialCategories, initialArticles);
  }

  const [homepage, setHomepage] = useState(initialHomepage);
  const device = useResponsiveDevice(initialDevice);

  useEffect(() => {
    // If the server already resolved the homepage blocks, there's nothing
    // to fetch — this avoids the redundant client round trip (and the
    // skeleton flash) that used to happen on every single load.
    if (initialHomepage) return;
    let cancelled = false;
    Promise.all([getHomepage(), preloadCategoriesAndArticles()]).then(([hp]) => {
      if (!cancelled) setHomepage(hp);
    });
    return () => {
      cancelled = true;
    };
  }, [initialHomepage]);

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
