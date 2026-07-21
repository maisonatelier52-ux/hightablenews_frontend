// // lib/serverApi.js
// //
// // Thin server-side fetch helpers used only for `generateMetadata` and
// // structured-data (JSON-LD) generation in Server Components. These run on
// // the server for every request, so failures are swallowed and return `null`
// // — a broken/slow backend should never crash page rendering; the page
// // simply falls back to generic metadata.

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// async function safeGet(path, { revalidate = 60 } = {}) {
//   try {
//     const res = await fetch(`${API_BASE_URL}${path}`, { next: { revalidate } });
//     if (!res.ok) return null;
//     const json = await res.json();
//     return json?.data ?? null;
//   } catch {
//     return null;
//   }
// }

// export const serverApi = {
//   getSiteSettings: () => safeGet("/settings", { revalidate: 300 }),
//   getCategoryBySlug: (slug) => safeGet(`/categories/${slug}`),
//   getCategories: () => safeGet("/categories", { revalidate: 300 }),
//   getArticleBySlug: (slug) => safeGet(`/articles/${slug}`),
//   getAuthorBySlug: (slug) => safeGet(`/authors/${slug}`),
//   getArticlesByAuthor: async (slug) => {
//     const author = await safeGet(`/authors/${slug}`);
//     if (!author?._id) return [];
//     return (await safeGet(`/articles?author=${author._id}&limit=40`)) || [];
//   },
//   getPageBySlug: (slug) => safeGet(`/pages/${slug}`),
//   getSitemapData: () => safeGet("/sitemap-data", { revalidate: 600 }),
// };



// chnaged for seo

// lib/serverApi.js
//
// Thin server-side fetch helpers used only for `generateMetadata` and
// structured-data (JSON-LD) generation in Server Components. These run on
// the server for every request, so failures are swallowed and return `null`
// — a broken/slow backend should never crash page rendering; the page
// simply falls back to generic metadata.

import { mergeHeader, mergeFooter, mergeHomepage } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function safeGet(path, { revalidate = 60 } = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export const serverApi = {
  getSiteSettings: () => safeGet("/settings", { revalidate: 300 }),
  getCategoryBySlug: (slug) => safeGet(`/categories/${slug}`),
  getCategories: () => safeGet("/categories", { revalidate: 300 }),
  getArticleBySlug: (slug) => safeGet(`/articles/${slug}`),
  getAuthorBySlug: (slug) => safeGet(`/authors/${slug}`),
  getArticlesByAuthor: async (slug) => {
    const author = await safeGet(`/authors/${slug}`);
    if (!author?._id) return [];
    return (await safeGet(`/articles?author=${author._id}&limit=40`)) || [];
  },
  getPageBySlug: (slug) => safeGet(`/pages/${slug}`),
  getSitemapData: () => safeGet("/sitemap-data", { revalidate: 600 }),

  // Below: used to server-render the header, footer, and homepage blocks so
  // the very first HTML response already contains the real page (headings,
  // article titles, copy) instead of a client-only skeleton. That's what
  // fixes the "no <h1>/<h2>", "low word count", and slow FCP/LCP/CLS SEO
  // issues — crawlers and Lighthouse both read the first response, and
  // previously it had no text in it at all.
  getHeader: async () => mergeHeader(await safeGet("/header", { revalidate: 10 })),
  getFooter: async () => mergeFooter(await safeGet("/footer", { revalidate: 10 })),
  getHomepage: async () => mergeHomepage(await safeGet("/homepage", { revalidate: 10 })),
  getPublishedArticles: (limit = 60) => safeGet(`/articles?limit=${limit}`, { revalidate: 10 }),
};
