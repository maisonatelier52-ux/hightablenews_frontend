// apis/adminApis.js
//
// Every network call the Admin Panel makes to the backend lives here,
// grouped by resource. Each function returns the parsed `data` field of
// the backend's standard { success, message, data } response shape.

import axiosInstance from "./adminAxiosConfig";

function unwrap(promise) {
  return promise.then((res) => res.data.data);
}
function unwrapFull(promise) {
  return promise.then((res) => res.data); // { success, message, data, meta? }
}

// ─── Auth ───────────────────────────────────────────────────────────────
export const authApi = {
  login: (email, password) => unwrapFull(axiosInstance.post("/auth/login", { email, password })),
  me: () => unwrap(axiosInstance.get("/auth/me")),
  registerAdmin: (payload) => unwrap(axiosInstance.post("/auth/register", payload)),
  changePassword: (currentPassword, newPassword) =>
    unwrapFull(axiosInstance.put("/auth/change-password", { currentPassword, newPassword })),
  logout: () => unwrapFull(axiosInstance.post("/auth/logout")),
};

// ─── Categories ─────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: () => unwrap(axiosInstance.get("/admin/categories")),
  getById: (id) => unwrap(axiosInstance.get(`/admin/categories/${id}`)),
  create: (payload) => unwrap(axiosInstance.post("/admin/categories", payload)),
  update: (id, payload) => unwrap(axiosInstance.put(`/admin/categories/${id}`, payload)),
  remove: (id) => unwrapFull(axiosInstance.delete(`/admin/categories/${id}`)),
};

// ─── Authors ────────────────────────────────────────────────────────────
export const authorsApi = {
  getAll: () => unwrap(axiosInstance.get("/admin/authors")),
  getById: (id) => unwrap(axiosInstance.get(`/admin/authors/${id}`)),
  create: (payload) => unwrap(axiosInstance.post("/admin/authors", payload)),
  update: (id, payload) => unwrap(axiosInstance.put(`/admin/authors/${id}`, payload)),
  remove: (id) => unwrapFull(axiosInstance.delete(`/admin/authors/${id}`)),
};

// ─── Articles ───────────────────────────────────────────────────────────
export const articlesApi = {
  getAll: (params = {}) => unwrapFull(axiosInstance.get("/admin/articles", { params })),
  getById: (id) => unwrap(axiosInstance.get(`/admin/articles/${id}`)),
  create: (payload) => unwrap(axiosInstance.post("/admin/articles", payload)),
  update: (id, payload) => unwrap(axiosInstance.put(`/admin/articles/${id}`, payload)),
  remove: (id) => unwrapFull(axiosInstance.delete(`/admin/articles/${id}`)),
};

// ─── Media library ──────────────────────────────────────────────────────
export const mediaApi = {
  getAll: (params = {}) => unwrapFull(axiosInstance.get("/admin/media", { params })),
  // Upload one or more raw File objects. Converts to WEBP + compresses
  // under 100KB on the backend, then stores in Cloudinary.
  upload: (files) => {
    const list = Array.isArray(files) ? files : [files];
    const formData = new FormData();
    list.forEach((file) => formData.append("files", file));
    return unwrap(
      axiosInstance.post("/admin/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
  },
  remove: (id) => unwrapFull(axiosInstance.delete(`/admin/media/${id}`)),
};

/** Convenience helper: upload a single image file and return just its URL —
 *  used by the Articles/Authors/Categories forms when an image field needs
 *  a real Cloudinary URL instead of a local base64 preview. */
export async function uploadImage(file) {
  const result = await mediaApi.upload(file);
  const media = Array.isArray(result) ? result[0] : result;
  return media.secureUrl || media.url;
}

// ─── Page builders (Header / Footer / Homepage) ────────────────────────
export const headerApi = {
  get: () => unwrap(axiosInstance.get("/admin/header")),
  save: (data) => unwrap(axiosInstance.put("/admin/header", data)),
};
export const footerApi = {
  get: () => unwrap(axiosInstance.get("/admin/footer")),
  save: (data) => unwrap(axiosInstance.put("/admin/footer", data)),
};
export const homepageApi = {
  get: () => unwrap(axiosInstance.get("/admin/homepage")),
  save: (data) => unwrap(axiosInstance.put("/admin/homepage", data)),
};

// ─── Page builders (Category / Article detail / Author detail) ────────
export const categoryPageApi = {
  get: () => unwrap(axiosInstance.get("/admin/category-page-config")),
  save: (data) => unwrap(axiosInstance.put("/admin/category-page-config", data)),
};
export const articleDetailPageApi = {
  get: () => unwrap(axiosInstance.get("/admin/article-detail-page-config")),
  save: (data) => unwrap(axiosInstance.put("/admin/article-detail-page-config", data)),
};
export const authorPageApi = {
  get: () => unwrap(axiosInstance.get("/admin/author-page-config")),
  save: (data) => unwrap(axiosInstance.put("/admin/author-page-config", data)),
};

// ─── Custom pages ───────────────────────────────────────────────────────
export const pagesApi = {
  getAll: () => unwrap(axiosInstance.get("/admin/pages")),
  getById: (id) => unwrap(axiosInstance.get(`/admin/pages/${id}`)),
  create: (payload) => unwrap(axiosInstance.post("/admin/pages", payload)),
  update: (id, payload) => unwrap(axiosInstance.put(`/admin/pages/${id}`, payload)),
  remove: (id) => unwrapFull(axiosInstance.delete(`/admin/pages/${id}`)),
};

// ─── Settings ───────────────────────────────────────────────────────────
export const settingsApi = {
  get: () => unwrap(axiosInstance.get("/admin/settings")),
  save: (data) => unwrap(axiosInstance.put("/admin/settings", data)),
};

// ─── Newsletter subscribers ──────────────────────────────────────────────
export const subscribersApi = {
  getAll: (params = {}) => unwrapFull(axiosInstance.get("/admin/subscribers", { params })),
  getStats: () => unwrap(axiosInstance.get("/admin/subscribers/stats")),
  remove: (id) => unwrapFull(axiosInstance.delete(`/admin/subscribers/${id}`)),
};

// ─── Dashboard ────────────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: () => unwrap(axiosInstance.get("/admin/dashboard/stats")),
  getActivity: (limit = 12) => unwrap(axiosInstance.get("/admin/dashboard/activity", { params: { limit } })),
};
