// lib/categoriesArticlesApi.js — backend-backed API layer for Categories and
// Articles, shared by the public site and the Admin Panel.
//
// Many existing components (articlesSource.js, builder live-previews, etc.)
// call getCategories()/getArticles() SYNCHRONOUSLY during render. Rather than
// rewrite every one of those call sites to be async, we keep a single
// in-memory cache and expose synchronous getters that read from it — exactly
// like the old localStorage-backed getters did.
//
// The cache can be populated from two different sources depending on where
// we are in the app:
//   - preloadCategoriesAndArticles() — public, unauthenticated reads against
//     the backend's public routes (/categories, /articles). Triggered by
//     components/site/DataProvider.jsx for every visitor.
//   - preloadCategoriesAndArticlesAdmin() — authenticated reads against the
//     backend's /admin/* routes, returning full (including draft) data.
//     Triggered by components/admin/DataProvider.jsx for signed-in admins.
//
// Both populate the SAME module-level cache, so getCategories()/getArticles()
// work no matter which context (public page or admin screen) loaded them.
//
// Mutations (saveCategory/saveArticle/deleteCategory/deleteArticle) are
// admin-only, real async network calls: they hit the backend, then update
// the local cache so every already-mounted admin screen reflects the change
// immediately.

import { categoriesApi as categoriesPublic, articlesApi as articlesPublic } from "@/apis/usersideApis";
import { categoriesApi as categoriesAdmin, articlesApi as articlesAdmin, uploadImage } from "@/apis/adminApis";

let _categories = [];
let _articles = [];
let _loaded = false;
let _loadingPromise = null;
const _listeners = new Set();

function notify() {
  _listeners.forEach((fn) => fn());
}

/** Subscribe to cache updates (used by a top-level provider to trigger a re-render). */
export function onDataChange(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

export function isDataLoaded() {
  return _loaded;
}

// The backend returns Mongo `_id`/`category`/`author` (populated objects);
// the frontend components expect `_id` + flat `categoryId`/`authorId`
// strings plus a few legacy field names. Normalize here, once, so every
// consumer keeps working unmodified.
function normalizeCategories(list) {
  return (list || []).map((c) => ({ ...c, _id: c._id, name: c.name, slug: c.slug }));
}

function normalizeArticles(list) {
  return (list || []).map((a) => ({
    ...a,
    _id: a._id,
    categoryId: a.category?._id || a.category || "",
    categoryName: a.category?.name || "",
    categorySlug: a.category?.slug || "",
    authorId: a.author?._id || a.author || "",
    author: a.author?.name || "",
    isPublished: a.status === "published",
  }));
}

/** Public: fetches published categories + articles from the backend's
 *  unauthenticated routes and populates the cache. Used on the public site. */
export async function preloadCategoriesAndArticles(force = false) {
  if (_loadingPromise && !force) return _loadingPromise;
  _loadingPromise = (async () => {
    const [cats, artsRes] = await Promise.all([
      categoriesPublic.getAll(),
      articlesPublic.getPublished({ limit: 500 }),
    ]);
    _categories = normalizeCategories(cats);
    _articles = normalizeArticles(artsRes.data);
    _loaded = true;
    notify();
  })();
  return _loadingPromise;
}

/** Admin: fetches ALL categories + articles (including drafts) from the
 *  backend's authenticated /admin/* routes and populates the same cache.
 *  Used inside the Admin Panel. */
export async function preloadCategoriesAndArticlesAdmin(force = false) {
  if (_loadingPromise && !force) return _loadingPromise;
  _loadingPromise = (async () => {
    const [cats, artsRes] = await Promise.all([
      categoriesAdmin.getAll(),
      articlesAdmin.getAll({ limit: 500 }),
    ]);
    _categories = normalizeCategories(cats);
    _articles = normalizeArticles(artsRes.data);
    _loaded = true;
    notify();
  })();
  return _loadingPromise;
}

// ─── Categories ──────────────────────────────────────────────────────────

export function getCategories() {
  return _categories;
}

export function getCategoryBySlug(slug) {
  return _categories.find((c) => c.slug === slug) || null;
}

export async function saveCategory(data) {
  const saved = data._id ? await categoriesAdmin.update(data._id, data) : await categoriesAdmin.create(data);
  await preloadCategoriesAndArticlesAdmin(true);
  return saved;
}

export async function deleteCategory(id) {
  await categoriesAdmin.remove(id);
  await preloadCategoriesAndArticlesAdmin(true);
}

// ─── Articles ────────────────────────────────────────────────────────────

export function getArticles(categoryId = "") {
  return categoryId ? _articles.filter((a) => a.categoryId === categoryId) : _articles;
}

export function getArticleBySlug(slug) {
  return _articles.find((a) => a.slug === slug) || null;
}

export async function saveArticle(data) {
  const payload = {
    ...data,
    category: data.categoryId || data.category,
    author: data.authorId || data.author || undefined,
    status: data.isPublished === false ? "draft" : "published",
  };
  const saved = data._id ? await articlesAdmin.update(data._id, payload) : await articlesAdmin.create(payload);
  await preloadCategoriesAndArticlesAdmin(true);
  return saved;
}

export async function deleteArticle(id) {
  await articlesAdmin.remove(id);
  await preloadCategoriesAndArticlesAdmin(true);
}

// ─── Image helpers (admin-only) ────────────────────────────────────────────

/** Local base64 preview only (instant UI feedback) — does NOT upload anywhere. */
export function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onloadend = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

/** Uploads a real image file to the backend (Cloudinary, converted to WEBP
 *  and compressed under 100KB there) and returns the hosted URL. */
export { uploadImage };
