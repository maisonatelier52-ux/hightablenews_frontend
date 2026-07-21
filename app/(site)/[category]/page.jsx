import { notFound } from "next/navigation";
import SiteChrome from "@/components/site/SiteChrome";
import CategoryPageClient from "../_client/CategoryPageClient";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import { serverApi } from "@/lib/serverApi";
import { buildMetadata, SITE_URL } from "@/lib/seo";

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
      <CategoryPageClient />
    </SiteChrome>
  );
}
