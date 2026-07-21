// lib/getInitialDevice.js — SERVER ONLY. Do not import from a "use client"
// file (it uses next/headers, which throws outside a Server Component).
//
// Best-effort guess of the visitor's device class from the request's
// User-Agent header. Used only to pick a *starting* value for
// lib/useResponsiveDevice.js and for server-rendered chrome (SiteChrome's
// footer) so the very first paint already matches the real viewport in the
// common case.
//
// Before this, every page always started every responsive block from a
// hardcoded "desktop" layout and swapped to the real layout a frame after
// mount — that swap (different column counts, image sizes, stacked vs.
// inline elements) is a direct, measurable cause of Cumulative Layout
// Shift, which is exactly what the Lighthouse/SEO report flagged.
//
// This is a heuristic, not a replacement for a real client-side check:
// lib/useResponsiveDevice.js still measures the actual viewport on mount
// and corrects itself if the guess was wrong (e.g. a desktop UA in a
// narrow/split window).

import { headers } from "next/headers";

export function getInitialDeviceFromRequest() {
  try {
    const ua = headers().get("user-agent") || "";
    if (/ipad|tablet|playbook|silk/i.test(ua)) return "tablet";
    if (/mobi|iphone|ipod|android.*mobile|windows phone/i.test(ua)) return "mobile";
    return "desktop";
  } catch {
    return "desktop";
  }
}
