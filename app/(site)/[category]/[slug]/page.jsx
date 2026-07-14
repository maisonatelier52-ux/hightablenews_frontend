import { notFound } from "next/navigation";
import SiteChrome from "@/components/site/SiteChrome";
import ArticlePageClient from "../../_client/ArticlePageClient";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import { serverApi } from "@/lib/serverApi";
import { buildMetadata, SITE_URL, truncate } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await serverApi.getArticleBySlug(slug);
  if (!article) return buildMetadata({ title: "Article not found", description: "This article could not be found.", noIndex: true });

  return buildMetadata({
    title: article.metaTitle || article.title,
    description: article.metaDescription || truncate(article.excerpt, 160),
    path: `/${article.category?.slug || ""}/${slug}`,
    image: article.seo?.ogImage || article.mainImage,
    type: "article",
  });
}

export default async function ArticleRoute({ params }) {
  const { category: categorySlug, slug } = await params;
  const article = await serverApi.getArticleBySlug(slug);
  if (!article) notFound();

  const url = `${SITE_URL}/${categorySlug}/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.mainImage ? [article.mainImage] : undefined,
    datePublished: article.date,
    dateModified: article.updatedAt || article.date,
    author: article.author ? { "@type": "Person", name: article.author.name, url: `${SITE_URL}/author/${article.author.slug}` } : undefined,
    publisher: { "@type": "Organization", name: "HighTableNews", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: article.category?.name,
    keywords: (article.keywords || article.tags || []).join(", ") || undefined,
  };

  return (
    <SiteChrome>
      <JsonLd data={jsonLd} />
      <Breadcrumbs
        items={[
          ...(article.category ? [{ label: article.category.name, href: `/${article.category.slug}` }] : []),
          { label: article.title },
        ]}
      />
      <ArticlePageClient />
    </SiteChrome>
  );
}
