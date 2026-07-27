// lib/seo.js
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.hightablenews.com").replace(/\/$/, "");

/**
 * Build a Next.js Metadata object with sensible fallbacks + canonical/OG/
 * Twitter tags.
 *
 * Image resolution order:
 *   1. `image` / `twitterImage` passed in explicitly by the calling page
 *      (e.g. an article's own featured image, a category's own image).
 *   2. The site-wide default OpenGraph/Twitter images set in the admin
 *      Settings page (Settings → SEO defaults), fetched here on demand.
 *   3. A static /og-default.jpg as the last-resort fallback.
 *
 * This is what makes every page that doesn't set its own image — home,
 * category, about, privacy policy, and any other CMS page — automatically
 * pick up the site-wide OG/Twitter image configured in Settings, instead
 * of showing no image (or a broken one) in link previews.
 *
 * `buildMetadata` is async because step 2 may need a network call; every
 * call site already runs inside an async `generateMetadata()`, and
 * returning a promise from an async function is automatically awaited by
 * Next.js, so no call site needs to change.
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

  let ogImage = image || "";
  let twImage = twitterImage || image || "";

  // Only hit the network for a fallback when the caller didn't already
  // supply everything it needs.
  if (!ogImage || !twImage) {
    let settings = null;
    try {
      const { serverApi } = await import("./serverApi");
      settings = await serverApi.getSiteSettings();
    } catch {
      settings = null;
    }
    const fallbackOg = settings?.seoDefaults?.ogImage || `${SITE_URL}/og-default.jpg`;
    const fallbackTwitter = settings?.seoDefaults?.twitterImage || fallbackOg;
    if (!ogImage) ogImage = fallbackOg;
    if (!twImage) twImage = fallbackTwitter;
  }

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
      images: ogImage ? [{ url: ogImage }] : undefined,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: twImage ? [twImage] : undefined,
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