"use client";

// components/site/DataProvider.jsx
//
// Kicks off the initial backend fetch for categories/articles/authors once,
// site-wide, and re-renders its children (including SiteChrome/HeaderPreview,
// which reads the articles cache synchronously for the breaking-news ticker)
// when that data arrives.

import { useEffect, useState } from "react";
import { preloadCategoriesAndArticles, onDataChange } from "@/lib/categoriesArticlesApi";
import { preloadAuthors, onAuthorsChange } from "@/lib/authorsApi";

export default function DataProvider({ children }) {
  const [, forceRerender] = useState(0);

  useEffect(() => {
    const unsubData = onDataChange(() => forceRerender((n) => n + 1));
    const unsubAuthors = onAuthorsChange(() => forceRerender((n) => n + 1));
    preloadCategoriesAndArticles().catch((err) => console.error("Failed to preload categories/articles:", err));
    preloadAuthors().catch((err) => console.error("Failed to preload authors:", err));
    return () => {
      unsubData();
      unsubAuthors();
    };
  }, []);

  return children;
}
