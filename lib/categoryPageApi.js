// // lib/categoryPageApi.js — Data layer for the Category Page Builder.
// //
// // IMPORTANT: there is exactly ONE category-page configuration. The admin
// // picks one of the 4 templates and edits its block settings, and that same
// // layout is then used to render every category page on the public site
// // (Business, Power, Technology, etc.) — only the *content* (articles,
// // banner title/description) changes per category, not the structure.

// import { CATEGORY_TEMPLATE_DEFAULTS, createCategoryBlock } from "./blockDefinitions";

// import { categoryPageApi as categoryPagePublic } from "@/apis/usersideApis";
// import { categoryPageApi as categoryPageAdmin } from "@/apis/adminApis";

// // ─── Default config ─────────────────────────────────────────────────────────

// export const DEFAULT_CATEGORY_PAGE = {
//   templateId: "sticky-editorial",
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

// /** Shallow-merges saved settings on top of a fresh default so new fields
//  *  introduced later always have a sane value, and fills in any template
//  *  that has never been opened/edited yet. */
// function hydrate(config) {
//   const templateId = config?.templateId && CATEGORY_TEMPLATE_DEFAULTS[config.templateId]
//     ? config.templateId
//     : DEFAULT_CATEGORY_PAGE.templateId;

//   const blocksByTemplate = {};
//   for (const id of Object.keys(CATEGORY_TEMPLATE_DEFAULTS)) {
//     const saved = config?.blocksByTemplate?.[id];
//     blocksByTemplate[id] = saved ? deepMergeDefaults(createCategoryBlock(id), saved) : createCategoryBlock(id);
//   }
//   return { templateId, blocksByTemplate };
// }

// /** Public: unauthenticated read, used to render live category pages. */
// export async function getCategoryPageConfig() {
//   const saved = await categoryPagePublic.get();
//   return hydrate(saved);
// }

// /** Admin: authenticated read, used inside the Category Page Builder. */
// export async function getCategoryPageConfigAdmin() {
//   const saved = await categoryPageAdmin.get();
//   return hydrate(saved);
// }

// export async function saveCategoryPageConfig(data) {
//   await categoryPageAdmin.save(data);
//   return { ok: true, data };
// }

// lib/categoryPageApi.js — Data layer for the Category Page Builder.
//
// IMPORTANT: there is exactly ONE category-page configuration. The admin
// picks one of the 4 templates and edits its block settings, and that same
// layout is then used to render every category page on the public site
// (Business, Power, Technology, etc.) — only the *content* (articles,
// banner title/description) changes per category, not the structure.

import { CATEGORY_TEMPLATE_DEFAULTS, createCategoryBlock } from "./blockDefinitions";

import { categoryPageApi as categoryPagePublic } from "@/apis/usersideApis";
import { categoryPageApi as categoryPageAdmin } from "@/apis/adminApis";

// ─── Default config ─────────────────────────────────────────────────────────

export const DEFAULT_CATEGORY_PAGE = {
  templateId: "sticky-editorial",
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

/** Shallow-merges saved settings on top of a fresh default so new fields
 *  introduced later always have a sane value, and fills in any template
 *  that has never been opened/edited yet. Exported (as hydrateCategoryPage)
 *  so lib/serverApi.js can reuse this exact logic when resolving the
 *  category page config on the server for SSR. */
export function hydrateCategoryPage(config) {
  const templateId = config?.templateId && CATEGORY_TEMPLATE_DEFAULTS[config.templateId]
    ? config.templateId
    : DEFAULT_CATEGORY_PAGE.templateId;

  const blocksByTemplate = {};
  for (const id of Object.keys(CATEGORY_TEMPLATE_DEFAULTS)) {
    const saved = config?.blocksByTemplate?.[id];
    blocksByTemplate[id] = saved ? deepMergeDefaults(createCategoryBlock(id), saved) : createCategoryBlock(id);
  }
  return { templateId, blocksByTemplate };
}

/** Public: unauthenticated read, used to render live category pages. */
export async function getCategoryPageConfig() {
  const saved = await categoryPagePublic.get();
  return hydrateCategoryPage(saved);
}

/** Admin: authenticated read, used inside the Category Page Builder. */
export async function getCategoryPageConfigAdmin() {
  const saved = await categoryPageAdmin.get();
  return hydrateCategoryPage(saved);
}

export async function saveCategoryPageConfig(data) {
  await categoryPageAdmin.save(data);
  return { ok: true, data };
}
