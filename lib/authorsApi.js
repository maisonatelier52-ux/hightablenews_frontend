// lib/authorsApi.js — backend-backed API layer for Authors, shared by the
// public site (read-only) and the Admin Panel (full CRUD). Same shared-cache
// pattern as lib/categoriesArticlesApi.js — see the comment at the top of
// that file for why, and for the public/admin preload split.

import { authorsApi as authorsPublic } from "@/apis/usersideApis";
import { authorsApi as authorsAdmin, uploadImage } from "@/apis/adminApis";

let _authors = [];
let _loaded = false;
let _loadingPromise = null;
const _listeners = new Set();

function notify() {
  _listeners.forEach((fn) => fn());
}

export function onAuthorsChange(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

export function isAuthorsLoaded() {
  return _loaded;
}

/** Public: unauthenticated read, used on the public site. */
export async function preloadAuthors(force = false) {
  if (_loadingPromise && !force) return _loadingPromise;
  _loadingPromise = (async () => {
    const list = await authorsPublic.getAll();
    _authors = (list || []).map((a) => ({ ...a, _id: a._id }));
    _loaded = true;
    notify();
  })();
  return _loadingPromise;
}

/** Admin: authenticated read against /admin/authors, used in the Admin Panel. */
export async function preloadAuthorsAdmin(force = false) {
  if (_loadingPromise && !force) return _loadingPromise;
  _loadingPromise = (async () => {
    const list = await authorsAdmin.getAll();
    _authors = (list || []).map((a) => ({ ...a, _id: a._id }));
    _loaded = true;
    notify();
  })();
  return _loadingPromise;
}

export const SOCIAL_PLATFORMS = [
  { id: "twitter", label: "X (Twitter)" },
  { id: "instagram", label: "Instagram" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "facebook", label: "Facebook" },
  { id: "reddit", label: "Reddit" },
  { id: "substack", label: "Substack" },
  { id: "medium", label: "Medium" },
  { id: "youtube", label: "YouTube" },
  { id: "threads", label: "Threads" },
  { id: "website", label: "Website" },
  { id: "email", label: "Email" },
];

export const EMPTY_AUTHOR = {
  name: "",
  slug: "",
  gender: "Male",
  location: "",
  email: "",
  categoryId: "",
  role: "",
  bio: "",
  aboutText: "",
  experience: "",
  education: "",
  languages: "",
  specialization: "",
  awards: "",
  profileImage: "",
  topics: [],
  social: [],
};

// ─── Authors ─────────────────────────────────────────────────────────────

export function getAuthors() {
  return _authors;
}

export function getAuthorById(id) {
  return getAuthors().find((a) => a._id === id) || null;
}

export function getAuthorBySlug(slug) {
  return getAuthors().find((a) => a.slug === slug) || null;
}

/** The author assigned to a given category (one primary author per beat). */
export function getAuthorByCategory(categoryId) {
  if (!categoryId) return null;
  return getAuthors().find((a) => a.categoryId === categoryId) || null;
}

export async function saveAuthor(data) {
  const saved = data._id ? await authorsAdmin.update(data._id, data) : await authorsAdmin.create(data);
  await preloadAuthorsAdmin(true);
  return saved;
}

export async function deleteAuthor(id) {
  await authorsAdmin.remove(id);
  await preloadAuthorsAdmin(true);
}

// ─── Image helpers (admin-only) ────────────────────────────────────────────

export function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onloadend = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

export { uploadImage };

export function generateSlug(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidSlug(slug) {
  return /^[a-z]+(-[a-z]+)*$/.test(slug || "");
}
