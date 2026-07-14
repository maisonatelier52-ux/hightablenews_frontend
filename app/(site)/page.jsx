import HomePageClient from "./_client/HomePageClient";
import JsonLd from "@/components/site/JsonLd";
import SiteChrome from "@/components/site/SiteChrome";
import { serverApi } from "@/lib/serverApi";
import { buildMetadata, SITE_URL } from "@/lib/seo";

export async function generateMetadata() {
  const settings = await serverApi.getSiteSettings();
  const title = settings?.seoDefaults?.metaTitle || `${settings?.siteName || "HighTableNews"} — Power, Technology & Culture`;
  const description =
    settings?.seoDefaults?.metaDescription ||
    "HighTableNews covers power, technology, profiles, wealth, finance, lifestyle, and culture — with clarity, depth, and the courage to ask harder questions.";
  return buildMetadata({
    title,
    description,
    path: "/",
    image: settings?.seoDefaults?.ogImage,
    siteName: settings?.siteName,
  });
}

export default async function HomePage() {
  const settings = await serverApi.getSiteSettings();
  const siteName = settings?.siteName || "HighTableNews";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteName,
      url: SITE_URL,
      logo: settings?.logo || undefined,
      sameAs: Object.values(settings?.socialLinks || {}).filter(Boolean),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteName,
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <SiteChrome>
      {jsonLd.map((d, i) => (
        <JsonLd key={i} data={d} />
      ))}
      <HomePageClient />
    </SiteChrome>
  );
}
