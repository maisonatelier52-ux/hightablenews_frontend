// lib/permissionsConfig.js
//
// Frontend mirror of backend/utils/permissions.js — keys MUST stay in sync
// with the backend since they're the object keys stored on AdminUser.permissions.
// Used by: app/admin/users/page.jsx (the toggle grid) and
// components/layout/AdminShell.jsx (hiding nav items the signed-in admin
// doesn't have access to).

export const PERMISSION_GROUPS = [
  {
    label: "Content",
    keys: [
      { key: "articles", label: "Articles" },
      { key: "categories", label: "Categories" },
      { key: "authors", label: "Authors" },
      { key: "pages", label: "Pages" },
      { key: "media", label: "Media Library" },
    ],
  },
  {
    label: "Builders",
    keys: [
      { key: "headerBuilder", label: "Header Builder" },
      { key: "footerBuilder", label: "Footer Builder" },
      { key: "homepageBuilder", label: "Homepage Builder" },
      { key: "categoryPageBuilder", label: "Category Page Builder" },
      { key: "articleDetailBuilder", label: "Article Detail Builder" },
      { key: "authorDetailBuilder", label: "Author Detail Builder" },
    ],
  },
  {
    label: "Admin",
    keys: [
      { key: "subscribers", label: "Subscribers" },
      { key: "sitemap", label: "Sitemap & Robots" },
      { key: "settings", label: "Settings" },
    ],
  },
];

export const PERMISSION_KEYS = PERMISSION_GROUPS.flatMap((g) => g.keys.map((k) => k.key));

export function defaultPermissions(value = false) {
  const obj = {};
  for (const key of PERMISSION_KEYS) obj[key] = value;
  return obj;
}

export function countEnabled(permissions) {
  if (!permissions) return 0;
  return PERMISSION_KEYS.reduce((n, k) => n + (permissions[k] ? 1 : 0), 0);
}