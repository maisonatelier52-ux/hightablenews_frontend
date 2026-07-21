// import { notFound } from "next/navigation";
// import SiteChrome from "@/components/site/SiteChrome";
// import CategoryPageClient from "../_client/CategoryPageClient";
// import Breadcrumbs from "@/components/site/Breadcrumbs";
// import JsonLd from "@/components/site/JsonLd";
// import { serverApi } from "@/lib/serverApi";
// import { buildMetadata, SITE_URL } from "@/lib/seo";

// // A single URL segment here is a news **category** (e.g. /technology).
// // Custom CMS pages built in the admin Pages builder (About, Privacy Policy,
// // etc.) live at /page/<slug> instead — see app/(site)/page/[slug]/page.jsx —
// // so there's no ambiguity between a category slug and a page slug.
// export async function generateMetadata({ params }) {
//   const { category: slug } = await params;
//   const category = await serverApi.getCategoryBySlug(slug);
//   if (!category) return buildMetadata({ title: "Not found", description: "This page could not be found.", path: `/${slug}`, noIndex: true });

//   return buildMetadata({
//     title: category.seoTitle || `${category.name} News, Analysis & Opinion`,
//     description: category.seoDescription || category.description || `The latest ${category.name} coverage from HighTableNews.`,
//     path: `/${slug}`,
//     image: category.image,
//   });
// }

// export default async function CategoryRoute({ params }) {
//   const { category: slug } = await params;
//   const category = await serverApi.getCategoryBySlug(slug);
//   if (!category) notFound();

//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "CollectionPage",
//     name: category.name,
//     url: `${SITE_URL}/${slug}`,
//     description: category.description || undefined,
//   };

//   return (
//     <SiteChrome>
//       <JsonLd data={jsonLd} />
//       <Breadcrumbs items={[{ label: category.name }]} />
//       <CategoryPageClient />
//     </SiteChrome>
//   );
// }


import { notFound } from "next/navigation";
import SiteChrome from "@/components/site/SiteChrome";
import CategoryPageClient from "../_client/CategoryPageClient";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import { serverApi } from "@/lib/serverApi";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { getInitialDeviceFromRequest } from "@/lib/getInitialDevice";

// A single URL segment here is a news **category** (e.g. /technology).
// Custom CMS pages built in the admin Pages builder (About, Privacy Policy,
// etc.) live at /page/<slug> instead — see app/(site)/page/[slug]/page.jsx —
// so there's no ambiguity between a category slug and a page slug.
export async function generateMetadata({ params }) {
  const { category: slug } = await params;
  const category = await serverApi.getCategoryBySlug(slug);
  if (!category) return buildMetadata({ title: "Not found", description: "This page could not be found.", path: `/${slug}`, noIndex: true });

  return buildMetadata({
    title: category.seoTitle || `${category.name} News, Analysis & Opinion`,
    description: category.seoDescription || category.description || `The latest ${category.name} coverage from HighTableNews.`,
    path: `/${slug}`,
    image: category.image,
  });
}

export default async function CategoryRoute({ params }) {
  const { category: slug } = await params;
  const category = await serverApi.getCategoryBySlug(slug);
  if (!category) notFound();

  // Everything the category page needs is now fetched here, on the server,
  // in parallel — the category-page-builder config (which template + block
  // settings are active) and the full published categories/articles list
  // the active template resolves its hero/cards from. Passed straight into
  // CategoryPageClient as props, it renders on its very first pass
  // (server-side) instead of showing a skeleton and fetching client-side.
  // That's what puts the template's real <h1> banner, headings, and
  // article copy into the first HTML response — previously this route did
  // zero server data-fetching, so SEO tools found no <h1>/<h2> tags at all
  // and Lighthouse measured very poor FCP/LCP/TTI/CLS on every category
  // page (e.g. /power), exactly like the homepage used to before its fix.
  const [config, categories, articlesRes] = await Promise.all([
    serverApi.getCategoryPageConfig(),
    serverApi.getCategories(),
    serverApi.getPublishedArticles(500),
  ]);
  const device = getInitialDeviceFromRequest();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    url: `${SITE_URL}/${slug}`,
    description: category.description || undefined,
  };

  return (
    <SiteChrome>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ label: category.name }]} />
      <CategoryPageClient
        initialCategory={category}
        initialConfig={config}
        initialCategories={categories}
        initialArticles={articlesRes}
        initialDevice={device}
      />
    </SiteChrome>
  );
}