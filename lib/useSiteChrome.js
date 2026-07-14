"use client";

// lib/useSiteChrome.js — loads the header + footer config that the admin
// saved in the Header Builder / Footer Builder (localStorage-backed, see
// lib/api.js) so every public page can render the exact same header/footer
// the admin designed, without duplicating the fetch logic in every page.

import { useEffect, useState } from "react";
import { getHeader, getFooter, DEFAULT_HEADER, DEFAULT_FOOTER } from "./api";

export function useSiteChrome() {
  const [header, setHeader] = useState(null);
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Fetch header and footer independently so a failure in one (e.g. the
    // backend being down, or one endpoint erroring) never blocks the other
    // from rendering. Each call falls back to the built-in defaults on
    // failure instead of leaving the chrome stuck on the loading skeleton
    // forever — a stuck skeleton is what previously looked like the
    // header/footer "not displaying".
    Promise.allSettled([getHeader(), getFooter()]).then(([hResult, fResult]) => {
      if (cancelled) return;
      setHeader(hResult.status === "fulfilled" ? hResult.value : DEFAULT_HEADER);
      setFooter(fResult.status === "fulfilled" ? fResult.value : DEFAULT_FOOTER);
      if (hResult.status === "rejected") console.error("Failed to load header config:", hResult.reason);
      if (fResult.status === "rejected") console.error("Failed to load footer config:", fResult.reason);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { header, footer, loading };
}
