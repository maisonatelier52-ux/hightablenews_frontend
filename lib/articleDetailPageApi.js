// // lib/articleDetailPageApi.js — Data layer for the Article Detail Page
// // Builder. Exactly ONE configuration exists at a time: the admin picks one
// // of the 3 templates and edits its settings; that layout then renders every
// // article's detail page on the site — only the article's own content
// // changes per page, never the structure. Mirrors lib/authorPageApi.js.

// import { ARTICLE_TEMPLATE_DEFAULTS, createArticleBlock } from "./blockDefinitions";

// import { articleDetailPageApi as articleDetailPagePublic } from "@/apis/usersideApis";
// import { articleDetailPageApi as articleDetailPageAdmin } from "@/apis/adminApis";

// export const DEFAULT_ARTICLE_DETAIL_PAGE = {
//   templateId: "sticky-sidebar",
//   blocksByTemplate: {},
// };

// function deepMergeDefaults(defaults, saved) {
//   if (Array.isArray(defaults)) return Array.isArray(saved) ? saved : defaults;
//   if (defaults && typeof defaults === "object") {
//     const out = { ...defaults };
//     for (const key of Object.keys(saved || {})) {
//       out[key] = deepMergeDefaults(defaults[key], saved[key]);
//     }
//     return out;
//   }
//   return saved !== undefined ? saved : defaults;
// }

// function hydrate(config) {
//   const templateId = config?.templateId && ARTICLE_TEMPLATE_DEFAULTS[config.templateId]
//     ? config.templateId
//     : DEFAULT_ARTICLE_DETAIL_PAGE.templateId;

//   const blocksByTemplate = {};
//   for (const id of Object.keys(ARTICLE_TEMPLATE_DEFAULTS)) {
//     const saved = config?.blocksByTemplate?.[id];
//     blocksByTemplate[id] = saved ? deepMergeDefaults(createArticleBlock(id), saved) : createArticleBlock(id);
//   }
//   return { templateId, blocksByTemplate };
// }

// /** Public: unauthenticated read, used to render the live article pages. */
// export async function getArticleDetailPageConfig() {
//   const saved = await articleDetailPagePublic.get();
//   return hydrate(saved);
// }

// /** Admin: authenticated read, used inside the Article Detail Page Builder. */
// export async function getArticleDetailPageConfigAdmin() {
//   const saved = await articleDetailPageAdmin.get();
//   return hydrate(saved);
// }

// export async function saveArticleDetailPageConfig(data) {
//   await articleDetailPageAdmin.save(data);
//   return { ok: true, data };
// }

// lib/articleDetailPageApi.js — Data layer for the Article Detail Page
// Builder. Exactly ONE configuration exists at a time: the admin picks one
// of the 3 templates and edits its settings; that layout then renders every
// article's detail page on the site — only the article's own content
// changes per page, never the structure. Mirrors lib/authorPageApi.js.

import { ARTICLE_TEMPLATE_DEFAULTS, createArticleBlock } from "./blockDefinitions";

import { articleDetailPageApi as articleDetailPagePublic } from "@/apis/usersideApis";
import { articleDetailPageApi as articleDetailPageAdmin } from "@/apis/adminApis";

export const DEFAULT_ARTICLE_DETAIL_PAGE = {
  templateId: "sticky-sidebar",
  blocksByTemplate: {},
};

function deepMergeDefaults(defaults, saved) {
  if (Array.isArray(defaults)) return Array.isArray(saved) ? saved : defaults;
  if (defaults && typeof defaults === "object") {
    const out = { ...defaults };
    for (const key of Object.keys(saved || {})) {
      out[key] = deepMergeDefaults(defaults[key], saved[key]);
    }
    return out;
  }
  return saved !== undefined ? saved : defaults;
}

// Exported so lib/serverApi.js can hydrate a raw config fetched with its own
// (cache/revalidate-controlled) fetch() call on the server, the same way
// lib/categoryPageApi.js exports hydrateCategoryPage() for the category page.
export function hydrateArticleDetailPage(config) {
  return hydrate(config);
}

function hydrate(config) {
  const templateId = config?.templateId && ARTICLE_TEMPLATE_DEFAULTS[config.templateId]
    ? config.templateId
    : DEFAULT_ARTICLE_DETAIL_PAGE.templateId;

  const blocksByTemplate = {};
  for (const id of Object.keys(ARTICLE_TEMPLATE_DEFAULTS)) {
    const saved = config?.blocksByTemplate?.[id];
    blocksByTemplate[id] = saved ? deepMergeDefaults(createArticleBlock(id), saved) : createArticleBlock(id);
  }
  return { templateId, blocksByTemplate };
}

/** Public: unauthenticated read, used to render the live article pages. */
export async function getArticleDetailPageConfig() {
  const saved = await articleDetailPagePublic.get();
  return hydrate(saved);
}

/** Admin: authenticated read, used inside the Article Detail Page Builder. */
export async function getArticleDetailPageConfigAdmin() {
  const saved = await articleDetailPageAdmin.get();
  return hydrate(saved);
}

export async function saveArticleDetailPageConfig(data) {
  await articleDetailPageAdmin.save(data);
  return { ok: true, data };
}

