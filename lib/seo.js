// lib/seo.js
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.hightablenews.com").replace(/\/$/, "");

/**
 * Static brand assets, stored in /public (served from the site root).
 *
 *   public/image/hightablenews-logo.webp  → 1200×630 logo card used for OpenGraph + Twitter
 *   public/favicon.ico         → site favicon
 *
 * To change the logo later, just replace the file in /public/image — no code
 * change needed. Keep the same file name (or update the path below).
 */
export const DEFAULT_OG_IMAGE_PATH = "/image/hightablenews-logo.webp";
export const DEFAULT_OG_IMAGE = `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`;
export const FAVICON_PATH = "/favicon.ico";

// Make sure an image URL is absolute (social crawlers need absolute URLs).
function absoluteUrl(src) {
  if (!src || typeof src !== "string") return "";
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("//")) return `https:${src}`;
  return `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
}

/**
 * Build a Next.js Metadata object with canonical/OG/Twitter tags.
 *
 * Image rules:
 *   - Pages that pass their own `image` (ONLY the article detail page and the
 *     author detail page do this) → that image is used for OpenGraph and
 *     Twitter (article's featured image / author's profile image).
 *   - Every other page (home, category, About, Privacy Policy, other CMS
 *     pages, not-found, etc.) passes no image → the static HTN logo from
 *     /public/image/hightablenews-logo.webp is used.
 *   - If an article/author has no image of its own, it also falls back to
 *     the static logo, so a link preview is never image-less.
 *
 * `buildMetadata` stays async so no call site needs to change.
 */
export async function buildMetadata({
  title,
  description,
  path = "/",
  image,
  twitterImage,
  siteName = "HighTableNews",
  noIndex = false,
  type = "website",
}) {
  const url = `${SITE_URL}${path}`;

  const ogImage = absoluteUrl(image) || DEFAULT_OG_IMAGE;
  const twImage = absoluteUrl(twitterImage) || absoluteUrl(image) || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [{ url: ogImage }],
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [twImage],
    },
  };
}

export function stripHtml(html = "") {
  return String(html).replace(/<[^>]+>/g, "").trim();
}

export function truncate(str = "", n = 160) {
  const s = String(str);
  return s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s;
}