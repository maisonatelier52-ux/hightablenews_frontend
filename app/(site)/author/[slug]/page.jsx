import { notFound } from "next/navigation";
import SiteChrome from "@/components/site/SiteChrome";
import AuthorPageClient from "../../_client/AuthorPageClient";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import { serverApi } from "@/lib/serverApi";
import { buildMetadata, SITE_URL, truncate, stripHtml } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const author = await serverApi.getAuthorBySlug(slug);
  if (!author) return buildMetadata({ title: "Author not found", description: "This author profile could not be found.", noIndex: true });

  return buildMetadata({
    title: `${author.name} — Articles & Profile`,
    description: truncate(stripHtml(author.bio || `Read the latest articles by ${author.name} on HighTableNews.`), 160),
    path: `/author/${slug}`,
    image: author.avatar,
    type: "profile",
  });
}

export default async function AuthorRoute({ params }) {
  const { slug } = await params;
  const author = await serverApi.getAuthorBySlug(slug);
  if (!author) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${SITE_URL}/author/${slug}`,
    image: author.avatar || undefined,
    jobTitle: author.role || undefined,
    description: author.bio ? stripHtml(author.bio) : undefined,
    sameAs: Object.values(author.socialLinks || {}).filter(Boolean),
  };

  return (
    <SiteChrome>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ label: "Authors", href: "/author" }, { label: author.name }]} />
      <AuthorPageClient />
    </SiteChrome>
  );
}
