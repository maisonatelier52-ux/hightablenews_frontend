// lib/authorPageApi.js — Data layer for the Author Detail Page Builder.
//
// Exactly ONE author-page configuration exists at a time. The admin picks
// one of the 3 templates and edits its block settings; that same layout is
// then used to render every author's profile page on the public site — only
// the *content* (name, bio, stats, articles) changes per author, never the
// structure. Mirrors lib/categoryPageApi.js.

import { AUTHOR_TEMPLATE_DEFAULTS, createAuthorBlock } from "./blockDefinitions";

import { authorPageApi as authorPagePublic } from "@/apis/usersideApis";
import { authorPageApi as authorPageAdmin } from "@/apis/adminApis";

export const DEFAULT_AUTHOR_PAGE = {
  templateId: "sidebar-right",
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

function hydrate(config) {
  const templateId = config?.templateId && AUTHOR_TEMPLATE_DEFAULTS[config.templateId]
    ? config.templateId
    : DEFAULT_AUTHOR_PAGE.templateId;

  const blocksByTemplate = {};
  for (const id of Object.keys(AUTHOR_TEMPLATE_DEFAULTS)) {
    const saved = config?.blocksByTemplate?.[id];
    blocksByTemplate[id] = saved ? deepMergeDefaults(createAuthorBlock(id), saved) : createAuthorBlock(id);
  }
  return { templateId, blocksByTemplate };
}

/** Public: unauthenticated read, used to render live author pages. */
export async function getAuthorPageConfig() {
  const saved = await authorPagePublic.get();
  return hydrate(saved);
}

/** Admin: authenticated read, used inside the Author Detail Page Builder. */
export async function getAuthorPageConfigAdmin() {
  const saved = await authorPageAdmin.get();
  return hydrate(saved);
}

export async function saveAuthorPageConfig(data) {
  await authorPageAdmin.save(data);
  return { ok: true, data };
}
