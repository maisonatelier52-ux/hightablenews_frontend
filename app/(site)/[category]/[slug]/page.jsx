// import { notFound } from "next/navigation";
// import SiteChrome from "@/components/site/SiteChrome";
// import ArticlePageClient from "../../_client/ArticlePageClient";
// import Breadcrumbs from "@/components/site/Breadcrumbs";
// import JsonLd from "@/components/site/JsonLd";
// import { serverApi } from "@/lib/serverApi";
// import { buildMetadata, SITE_URL, truncate } from "@/lib/seo";

// export async function generateMetadata({ params }) {
//   const { slug } = await params;
//   const article = await serverApi.getArticleBySlug(slug);
//   if (!article) return buildMetadata({ title: "Article not found", description: "This article could not be found.", noIndex: true });

//   return buildMetadata({
//     title: article.metaTitle || article.title,
//     description: article.metaDescription || truncate(article.excerpt, 160),
//     path: `/${article.category?.slug || ""}/${slug}`,
//     image: article.seo?.ogImage || article.mainImage,
//     type: "article",
//   });
// }

// export default async function ArticleRoute({ params }) {
//   const { category: categorySlug, slug } = await params;
//   const article = await serverApi.getArticleBySlug(slug);
//   if (!article) notFound();

//   const url = `${SITE_URL}/${categorySlug}/${slug}`;
//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "NewsArticle",
//     headline: article.title,
//     description: article.excerpt,
//     image: article.mainImage ? [article.mainImage] : undefined,
//     datePublished: article.date,
//     dateModified: article.updatedAt || article.date,
//     author: article.author ? { "@type": "Person", name: article.author.name, url: `${SITE_URL}/author/${article.author.slug}` } : undefined,
//     publisher: { "@type": "Organization", name: "HighTableNews", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
//     mainEntityOfPage: { "@type": "WebPage", "@id": url },
//     articleSection: article.category?.name,
//     keywords: (article.keywords || article.tags || []).join(", ") || undefined,
//   };

//   return (
//     <SiteChrome>
//       <JsonLd data={jsonLd} />
//       <Breadcrumbs
//         items={[
//           ...(article.category ? [{ label: article.category.name, href: `/${article.category.slug}` }] : []),
//           { label: article.title },
//         ]}
//       />
//       <ArticlePageClient />
//     </SiteChrome>
//   );
// }


import { notFound } from "next/navigation";
import SiteChrome from "@/components/site/SiteChrome";
import ArticlePageClient from "../../_client/ArticlePageClient";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import { serverApi } from "@/lib/serverApi";
import { buildMetadata, SITE_URL, truncate } from "@/lib/seo";
import { getInitialDeviceFromRequest } from "@/lib/getInitialDevice";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await serverApi.getArticleBySlug(slug);
  if (!article) return buildMetadata({ title: "Article not found", description: "This article could not be found.", noIndex: true });

  return buildMetadata({
    // 60 chars is the practical cutoff before Google starts truncating (and
    // flagging as "not optimized") titles in the SERP — same limit the
    // category page enforces. The admin's Meta Title field has no hard
    // limit, so enforce it here rather than relying on it being typed short.
    title: truncate(article.metaTitle || article.title, 60),
    // 155-160 chars is the practical cutoff for meta descriptions.
    description: truncate(article.metaDescription || article.excerpt, 155),
    path: `/${article.category?.slug || ""}/${slug}`,
    image: article.seo?.ogImage || article.mainImage,
    type: "article",
  });
}

export default async function ArticleRoute({ params }) {
  const { category: categorySlug, slug } = await params;

  // Everything the article page needs is now fetched here, on the server,
  // in parallel — the article itself, the (single, shared) article-page
  // builder config, and the full published categories/articles/authors
  // lists the template resolves the preview-article shape, related
  // articles, and sidebar modules from. That data is passed straight into
  // ArticlePageClient as props, which renders the real template on its
  // very first pass (server-side) instead of showing a skeleton and
  // fetching client-side. That's what puts a real <h1> (the article
  // title), real <h2>/<h3> headings, and the full article body/word count
  // into the first HTML response — fixing the "missing <h1>", "0% title/H1
  // coherence", and slow FCP/LCP/TTI issues, since crawlers and Lighthouse
  // both only read/measure that first response, not what renders a moment
  // later after hydration.
  const [article, config, categories, articlesRes, authors] = await Promise.all([
    serverApi.getArticleBySlug(slug),
    serverApi.getArticleDetailPageConfig(),
    serverApi.getCategories(),
    serverApi.getPublishedArticles(500),
    serverApi.getAuthors(),
  ]);
  if (!article) notFound();

  const device = getInitialDeviceFromRequest();

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
      <ArticlePageClient
        initialCategories={categories}
        initialArticles={articlesRes}
        initialAuthors={authors}
        initialConfig={config}
        initialDevice={device}
      />
    </SiteChrome>
  );
}
