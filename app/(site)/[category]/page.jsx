
import { notFound } from "next/navigation";
import SiteChrome from "@/components/site/SiteChrome";
import CategoryPageClient from "../_client/CategoryPageClient";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import { serverApi } from "@/lib/serverApi";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { getInitialDeviceFromRequest } from "@/lib/getInitialDevice";
import { truncate } from "@/lib/seo";
 
// A single URL segment here is a news **category** (e.g. /technology).
// Custom CMS pages built in the admin Pages builder (About, Privacy Policy,
// etc.) live at /page/<slug> instead — see app/(site)/page/[slug]/page.jsx —
// so there's no ambiguity between a category slug and a page slug.
export async function generateMetadata({ params }) {
  const { category: slug } = await params;
  const category = await serverApi.getCategoryBySlug(slug);
  if (!category) return buildMetadata({ title: "Not found", description: "This page could not be found.", path: `/${slug}`, noIndex: true });
 
  return buildMetadata({
    // 60 chars is the practical cutoff before Google starts truncating
    // titles in the SERP; keep it well within that.
    title: truncate(category.seoTitle || `${category.name} News, Analysis & Opinion`, 60),
    // 155-160 chars is the practical cutoff for meta descriptions; the SEO
    // Description field in the admin has no hard limit, so enforce it here
    // rather than relying on the admin remembering to keep it short.
    description: truncate(
      category.seoDescription || category.description || `The latest ${category.name} coverage from HighTableNews.`,
      155
    ),
    path: `/${slug}`,
    image: category.image,
  });
}
 
export default async function CategoryRoute({ params }) {
  const { category: slug } = await params;
 
  // Everything the category page needs is now fetched here, on the server,
  // in parallel — the category itself, the (single, shared) category-page
  // builder config, and the full published categories/articles list the
  // template resolves its hero/cards from. That data is passed straight
  // into CategoryPageClient as props, which renders the real template on
  // its very first pass (server-side) instead of showing a skeleton and
  // fetching client-side. That's what puts a real <h1>, real <h2>/<h3>
  // article headings, and real link text into the first HTML response —
  // fixing the "missing H1/H2", "heading order", and slow FCP/LCP/TTI/CLS
  // issues, since crawlers and Lighthouse both only read/measure that
  // first response.
  const [category, config, categories, articlesRes, authors] = await Promise.all([
    serverApi.getCategoryBySlug(slug),
    serverApi.getCategoryPageConfig(),
    serverApi.getCategories(),
    serverApi.getPublishedArticles(100),
    serverApi.getAuthors(),
  ]);
  if (!category) notFound();
 
  // Category cards only ever show title/excerpt/image/author — strip the
  // heavy content/contentHtml fields the backend still sends per article,
  // which is what was bloating the page and tanking the Text/HTML ratio.
  const articlesForClient = (articlesRes || []).map(({ content, contentHtml, ...rest }) => rest);
  const publicConfig = config
    ? { templateId: config.templateId, blocksByTemplate: { [config.templateId]: config.blocksByTemplate[config.templateId] } }
    : config;
 
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
        initialConfig={publicConfig}
        initialCategories={categories}
        initialArticles={articlesForClient}
        initialAuthors={authors}
        initialDevice={device}
      />
    </SiteChrome>
  );
}