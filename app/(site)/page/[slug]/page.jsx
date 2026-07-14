import { notFound } from "next/navigation";
import SiteChrome from "@/components/site/SiteChrome";
import CmsPageView from "@/components/page-builder/CmsPageView";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import { serverApi } from "@/lib/serverApi";
import { buildMetadata, SITE_URL, stripHtml, truncate } from "@/lib/seo";

// Custom CMS pages built in the admin **Pages** builder (About, Privacy
// Policy, Terms, Editorial Policy, Corrections Policy, etc.) live under
// /page/<slug> — deliberately separate from /[category] (news sections)
// and /[category]/[slug] (articles) so there's never a routing conflict
// between a category and a footer/legal page sharing the same slug.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await serverApi.getPageBySlug(slug);
  if (!page) {
    return buildMetadata({ title: "Not found", description: "This page could not be found.", path: `/page/${slug}`, noIndex: true });
  }

  return buildMetadata({
    title: page.seo?.metaTitle || page.title,
    description:
      page.seo?.metaDescription ||
      truncate(stripHtml(page.blocks?.find((b) => b.type === "richText")?.data?.html || ""), 160),
    path: `/page/${slug}`,
    image: page.seo?.ogImage,
    noIndex: page.seo?.noIndex,
  });
}

export default async function CmsPageRoute({ params }) {
  const { slug } = await params;
  const page = await serverApi.getPageBySlug(slug);
  if (!page) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    url: `${SITE_URL}/page/${slug}`,
    dateModified: page.updatedAt,
  };

  return (
    <SiteChrome>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ label: page.title }]} />
      <CmsPageView page={page} />
    </SiteChrome>
  );
}
