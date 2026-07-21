// import HomePageClient from "./_client/HomePageClient";
// import JsonLd from "@/components/site/JsonLd";
// import SiteChrome from "@/components/site/SiteChrome";
// import { serverApi } from "@/lib/serverApi";
// import { buildMetadata, SITE_URL } from "@/lib/seo";

// export async function generateMetadata() {
//   const settings = await serverApi.getSiteSettings();
//   const title = settings?.seoDefaults?.metaTitle || `${settings?.siteName || "HighTableNews"} — Power, Technology & Culture`;
//   const description =
//     settings?.seoDefaults?.metaDescription ||
//     "HighTableNews covers power, technology, profiles, wealth, finance, lifestyle, and culture — with clarity, depth, and the courage to ask harder questions.";
//   return buildMetadata({
//     title,
//     description,
//     path: "/",
//     image: settings?.seoDefaults?.ogImage,
//     siteName: settings?.siteName,
//   });
// }

// export default async function HomePage() {
//   const settings = await serverApi.getSiteSettings();
//   const siteName = settings?.siteName || "HighTableNews";

//   const jsonLd = [
//     {
//       "@context": "https://schema.org",
//       "@type": "Organization",
//       name: siteName,
//       url: SITE_URL,
//       logo: settings?.logo || undefined,
//       sameAs: Object.values(settings?.socialLinks || {}).filter(Boolean),
//     },
//     {
//       "@context": "https://schema.org",
//       "@type": "WebSite",
//       name: siteName,
//       url: SITE_URL,
//       potentialAction: {
//         "@type": "SearchAction",
//         target: `${SITE_URL}/search?q={search_term_string}`,
//         "query-input": "required name=search_term_string",
//       },
//     },
//   ];

//   return (
//     <SiteChrome>
//       {jsonLd.map((d, i) => (
//         <JsonLd key={i} data={d} />
//       ))}
//       <HomePageClient />
//     </SiteChrome>
//   );
// }

// chnaged for seo
import HomePageClient from "./_client/HomePageClient";
import JsonLd from "@/components/site/JsonLd";
import SiteChrome from "@/components/site/SiteChrome";
import { serverApi } from "@/lib/serverApi";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { getInitialDeviceFromRequest } from "@/lib/getInitialDevice";

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
  // Everything the homepage needs is now fetched here, on the server, in
  // parallel — the page blocks config, the site settings, and the full
  // published categories/articles list the blocks resolve their cards
  // from. That data is passed straight into HomePageClient as props, which
  // renders it on its very first pass (server-side) instead of showing a
  // skeleton and fetching client-side. That's what puts real headings and
  // article text into the first HTML response instead of an empty shell.
  const [settings, homepage, categories, articlesRes, authors] = await Promise.all([
    serverApi.getSiteSettings(),
    serverApi.getHomepage(),
    serverApi.getCategories(),
    serverApi.getPublishedArticles(60),
    serverApi.getAuthors(),
  ]);
  const siteName = settings?.siteName || "HighTableNews";
  const device = getInitialDeviceFromRequest();

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

      {/* The page's one and only <h1>. Every hero block below renders its
       *  headline as an <h2> (a specific article's title isn't the page's
       *  title) — this is the tag that should read like the <title> tag,
       *  per SEO best practice, and it's what guarantees the page always
       *  has exactly one <h1> no matter which blocks the admin has
       *  configured for the homepage. Kept compact and on-brand rather
       *  than visually hidden, since it doubles as a real masthead line. */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <h1 className="text-[13px] sm:text-sm font-semibold uppercase tracking-widest text-gray-500">
          {settings?.seoDefaults?.metaTitle || `${siteName} — Power, Technology & Culture`}
        </h1>
        <p className="mt-1 text-sm text-gray-500 max-w-3xl">
          {settings?.seoDefaults?.metaDescription ||
            `${siteName} covers power, technology, profiles, wealth, finance, lifestyle, and culture — with clarity, depth, and the courage to ask harder questions.`}
        </p>
      </div>

      <HomePageClient
        initialHomepage={homepage}
        initialCategories={categories}
        initialArticles={articlesRes}
        initialAuthors={authors}
        initialDevice={device}
      />
    </SiteChrome>
  );
}
