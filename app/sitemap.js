import { serverApi } from "@/lib/serverApi";
import { SITE_URL } from "@/lib/seo";

// Next.js renders this file at GET /sitemap.xml automatically. It's kept
// fresh via `revalidate` inside serverApi.getSitemapData (10 min cache) so
// new articles/pages show up without a full redeploy.
export default async function sitemap() {
  const data = await serverApi.getSitemapData();
  if (!data) {
    return [{ url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 }];
  }

  const excluded = new Set(data.sitemapExcludedPaths || []);
  const entries = [];

  entries.push({ url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 });

  for (const c of data.categories || []) {
    const path = `/${c.slug}`;
    if (excluded.has(path)) continue;
    entries.push({ url: `${SITE_URL}${path}`, lastModified: c.updatedAt || new Date(), changeFrequency: "hourly", priority: 0.8 });
  }

  for (const a of data.articles || []) {
    const path = `/${a.categorySlug}/${a.slug}`;
    if (excluded.has(path)) continue;
    entries.push({ url: `${SITE_URL}${path}`, lastModified: a.updatedAt || new Date(), changeFrequency: "weekly", priority: 0.7 });
  }

  for (const a of data.authors || []) {
    const path = `/author/${a.slug}`;
    if (excluded.has(path)) continue;
    entries.push({ url: `${SITE_URL}${path}`, lastModified: a.updatedAt || new Date(), changeFrequency: "weekly", priority: 0.5 });
  }

  for (const p of data.pages || []) {
    const path = `/page/${p.slug}`;
    if (excluded.has(path)) continue;
    entries.push({ url: `${SITE_URL}${path}`, lastModified: p.updatedAt || new Date(), changeFrequency: "monthly", priority: 0.6 });
  }

  for (const extra of data.sitemapExtraUrls || []) {
    const path = extra.loc.startsWith("/") ? extra.loc : `/${extra.loc}`;
    if (excluded.has(path)) continue;
    entries.push({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: extra.changefreq || "monthly",
      priority: extra.priority ?? 0.5,
    });
  }

  return entries;
}
