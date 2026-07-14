// apis/usersideApis.js
//
// Every network call the public website makes to the backend lives here.
// All of these hit the backend's public, no-auth-required routes.

import axiosInstance from "./axiosConfig";

function unwrap(promise) {
  return promise.then((res) => res.data.data);
}
function unwrapFull(promise) {
  return promise.then((res) => res.data); // { success, message, data, meta? }
}

// ─── Articles ───────────────────────────────────────────────────────────
export const articlesApi = {
  getPublished: (params = {}) => unwrapFull(axiosInstance.get("/articles", { params })),
  getBySlug: (slug) => unwrap(axiosInstance.get(`/articles/${slug}`)),
};

// ─── Categories ─────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: () => unwrap(axiosInstance.get("/categories")),
  getBySlug: (slug) => unwrap(axiosInstance.get(`/categories/${slug}`)),
  getArticles: (slug) => unwrap(axiosInstance.get(`/categories/${slug}/articles`)),
};

// ─── Authors ────────────────────────────────────────────────────────────
export const authorsApi = {
  getAll: () => unwrap(axiosInstance.get("/authors")),
  getBySlug: (slug) => unwrap(axiosInstance.get(`/authors/${slug}`)),
};

// ─── Page builders (read-only on the public site) ───────────────────────
export const headerApi = { get: () => unwrap(axiosInstance.get("/header")) };
export const footerApi = { get: () => unwrap(axiosInstance.get("/footer")) };
export const homepageApi = { get: () => unwrap(axiosInstance.get("/homepage")) };
export const categoryPageApi = { get: () => unwrap(axiosInstance.get("/category-page-config")) };
export const articleDetailPageApi = { get: () => unwrap(axiosInstance.get("/article-detail-page-config")) };
export const authorPageApi = { get: () => unwrap(axiosInstance.get("/author-page-config")) };

// ─── Custom pages & settings ──────────────────────────────────────────────
export const pagesApi = { getBySlug: (slug) => unwrap(axiosInstance.get(`/pages/${slug}`)) };
export const settingsApi = { get: () => unwrap(axiosInstance.get("/settings")) };

// ─── Newsletter subscription ───────────────────────────────────────────────
export const subscribersApi = {
  subscribe: (email, source = "other") => unwrapFull(axiosInstance.post("/subscribers", { email, source })),
};

// ─── SEO: sitemap.xml / robots.txt data ────────────────────────────────────
export const sitemapDataApi = { get: () => unwrap(axiosInstance.get("/sitemap-data")) };

// ─── Optional reader auth ────────────────────────────────────────────────
export const userAuthApi = {
  register: (payload) => unwrapFull(axiosInstance.post("/users/register", payload)),
  login: (email, password) => unwrapFull(axiosInstance.post("/users/login", { email, password })),
};
