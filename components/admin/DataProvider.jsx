"use client";

// components/admin/DataProvider.jsx
//
// Kicks off the initial backend fetch for categories/articles/authors once,
// application-wide, and re-renders its children when that data arrives so
// every already-mounted screen that reads the synchronous
// getCategories()/getArticles()/getAuthors() caches (see lib/categoriesArticlesApi.js
// and lib/authorsApi.js) picks up real data without each of them needing to
// manage their own fetch.

import { useEffect, useState } from "react";
import { preloadCategoriesAndArticlesAdmin, onDataChange } from "@/lib/categoriesArticlesApi";
import { preloadAuthorsAdmin, onAuthorsChange } from "@/lib/authorsApi";
import { getToken } from "@/lib/adminSession";

export default function DataProvider({ children }) {
  const [, forceRerender] = useState(0);

  useEffect(() => {
    // This layout also wraps /admin/login (there's no logged-out route
    // group to exclude it), so without this guard we'd fire authenticated
    // preload calls before the admin has signed in, get a 401 back, and
    // the axios interceptor would hard-reload to /admin/login — which
    // remounts this provider and repeats forever. Only preload once a
    // session token actually exists.
    if (!getToken()) return;

    const unsubData = onDataChange(() => forceRerender((n) => n + 1));
    const unsubAuthors = onAuthorsChange(() => forceRerender((n) => n + 1));
    preloadCategoriesAndArticlesAdmin().catch((err) => console.error("Failed to preload categories/articles:", err));
    preloadAuthorsAdmin().catch((err) => console.error("Failed to preload authors:", err));
    return () => {
      unsubData();
      unsubAuthors();
    };
  }, []);

  // NOTE: `return children;` means this component's own re-renders (from
  // forceRerender above) don't, by themselves, force already-mounted pages
  // deeper in the tree to re-read the now-updated getArticles()/
  // getCategories()/getAuthors() caches — React bails out when the child
  // element reference is unchanged. Rather than force a full remount here
  // (which would reset form state/scroll position everywhere any time any
  // article/category/author changes anywhere in the admin — too
  // destructive), pages whose live previews depend on this data subscribe
  // to onDataChange/onAuthorsChange themselves (see HomepageBuilder.jsx)
  // and trigger their own small, local re-render instead.
  return children;
}