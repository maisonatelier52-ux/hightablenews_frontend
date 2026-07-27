// lib/socialPlatforms.js
//
// Single source of truth for which social platforms the site supports, and
// the icon/label used to represent each one. Used by:
//   - the admin Settings page, where the author adds a platform + its URL
//     (this is now the single source of truth for social account URLs)
//   - the Header Builder (Top Bar / Right Side social icon pickers)
//   - the Footer Builder (Social Icon Manager)
//   - the public Header/Footer preview renderers (icon + link lookup)
//
// Keep this list in sync with the `platform` enum in the backend's
// models/Settings.js.

import {
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Music2,
  BookOpen,
  Rss,
  MessageCircle,
  Pin,
  Globe,
} from "lucide-react";

export const SOCIAL_PLATFORM_OPTIONS = [
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "twitter", label: "X (Twitter)", icon: Twitter },
  { key: "facebook", label: "Facebook", icon: Facebook },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin },
  { key: "youtube", label: "YouTube", icon: Youtube },
  { key: "tiktok", label: "TikTok", icon: Music2 },
  { key: "medium", label: "Medium", icon: BookOpen },
  { key: "substack", label: "Substack", icon: Rss },
  { key: "reddit", label: "Reddit", icon: MessageCircle },
  { key: "pinterest", label: "Pinterest", icon: Pin },
];

export const SOCIAL_ICON_MAP = SOCIAL_PLATFORM_OPTIONS.reduce((acc, p) => {
  acc[p.key] = p.icon;
  return acc;
}, {});

/**
 * Normalizes whatever gets passed in into a plain platform-key string.
 * Callers are supposed to always pass a string like "twitter", but some
 * footer/header configs saved before the Settings-based refactor still
 * store social entries as legacy `{ platform, url }` objects. Rather than
 * throwing (as `key.charAt` did when `key` was an object), unwrap the
 * `.platform` field when present, and fall back to "" for anything else
 * unusable (null, undefined, number, etc).
 */
function toPlatformKey(key) {
  if (typeof key === "string") return key;
  if (key && typeof key === "object" && typeof key.platform === "string") {
    return key.platform;
  }
  return "";
}

export function socialPlatformLabel(key) {
  const platform = toPlatformKey(key);
  const opt = SOCIAL_PLATFORM_OPTIONS.find((p) => p.key === platform);
  if (opt) return opt.label;
  return platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "Social link";
}

export function socialPlatformIcon(key) {
  const platform = toPlatformKey(key);
  return SOCIAL_ICON_MAP[platform] || Globe;
}