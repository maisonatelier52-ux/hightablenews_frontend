// import { notFound } from "next/navigation";
// import SiteChrome from "@/components/site/SiteChrome";
// import AuthorPageClient from "../../_client/AuthorPageClient";
// import Breadcrumbs from "@/components/site/Breadcrumbs";
// import JsonLd from "@/components/site/JsonLd";
// import { serverApi } from "@/lib/serverApi";
// import { buildMetadata, SITE_URL, truncate, stripHtml } from "@/lib/seo";

// export async function generateMetadata({ params }) {
//   const { slug } = await params;
//   const author = await serverApi.getAuthorBySlug(slug);
//   if (!author) return buildMetadata({ title: "Author not found", description: "This author profile could not be found.", noIndex: true });

//   return buildMetadata({
//     title: `${author.name} — Articles & Profile`,
//     description: truncate(stripHtml(author.bio || `Read the latest articles by ${author.name} on HighTableNews.`), 160),
//     path: `/author/${slug}`,
//     image: author.avatar,
//     type: "profile",
//   });
// }

// export default async function AuthorRoute({ params }) {
//   const { slug } = await params;
//   const author = await serverApi.getAuthorBySlug(slug);
//   if (!author) notFound();

//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "Person",
//     name: author.name,
//     url: `${SITE_URL}/author/${slug}`,
//     image: author.avatar || undefined,
//     jobTitle: author.role || undefined,
//     description: author.bio ? stripHtml(author.bio) : undefined,
//     sameAs: Object.values(author.socialLinks || {}).filter(Boolean),
//   };

//   return (
//     <SiteChrome>
//       <JsonLd data={jsonLd} />
//       <Breadcrumbs items={[{ label: "Authors", href: "/author" }, { label: author.name }]} />
//       <AuthorPageClient />
//     </SiteChrome>
//   );
// }

import { notFound } from "next/navigation";
import SiteChrome from "@/components/site/SiteChrome";
import AuthorPageClient from "../../_client/AuthorPageClient";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import { serverApi } from "@/lib/serverApi";
import { buildMetadata, SITE_URL, truncate, stripHtml } from "@/lib/seo";
import { getInitialDeviceFromRequest } from "@/lib/getInitialDevice";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const author = await serverApi.getAuthorBySlug(slug);
  if (!author) return buildMetadata({ title: "Author not found", description: "This author profile could not be found.", noIndex: true });

  return buildMetadata({
    title: `${author.name} — Articles & Profile`,
    description: truncate(stripHtml(author.bio || `Read the latest articles by ${author.name} on HighTableNews.`), 160),
    path: `/author/${slug}`,
    image: author.profileImage || author.avatar,
    type: "profile",
  });
}

export default async function AuthorRoute({ params }) {
  const { slug } = await params;
  const [author, config, categories, articlesRes, authors] = await Promise.all([
    serverApi.getAuthorBySlug(slug),
    serverApi.getAuthorPageConfig(),
    serverApi.getCategories(),
    serverApi.getPublishedArticles(100),
    serverApi.getAuthors(),
  ]);
  if (!author) notFound();

  // Cards on this page only ever show title/excerpt/image, never a full
  // article body — strip the heavy content/contentHtml fields the backend
  // still sends per article (same Text/HTML-ratio fix as the other pages).
  const articlesForClient = (articlesRes || []).map(({ content, contentHtml, ...rest }) => rest);
  const publicConfig = config
    ? { templateId: config.templateId, blocksByTemplate: { [config.templateId]: config.blocksByTemplate[config.templateId] } }
    : config;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${SITE_URL}/author/${slug}`,
    image: author.profileImage || author.avatar || undefined,
    jobTitle: author.role || undefined,
    description: author.bio ? stripHtml(author.bio) : undefined,
    sameAs: Object.values(author.socialLinks || {}).filter(Boolean),
  };

  const device = getInitialDeviceFromRequest();

  return (
    <SiteChrome>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ label: "Authors", href: "/author" }, { label: author.name }]} />
      <AuthorPageClient
        initialAuthor={author}
        initialCategories={categories}
        initialArticles={articlesForClient}
        initialAuthors={authors}
        initialConfig={publicConfig}
        initialDevice={device}
      />
    </SiteChrome>
  );
}
