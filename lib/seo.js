// lib/seo.js
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.hightablenews.com").replace(/\/$/, "");

/** Build a Next.js Metadata object with sensible fallbacks + canonical/OG/Twitter tags. */
export function buildMetadata({ title, description, path = "/", image, siteName = "HighTableNews", noIndex = false, type = "website" }) {
  const url = `${SITE_URL}${path}`;
  const ogImage = image || `${SITE_URL}/og-default.jpg`;
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
      images: ogImage ? [ogImage] : undefined,
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
