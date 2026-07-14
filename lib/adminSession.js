// lib/adminSession.js
//
// Client-side storage for the JWT issued by the backend on login
// (POST /api/auth/login). The token is kept in localStorage so
// apis/axiosConfig.js can attach it as `Authorization: Bearer <token>` on
// every request, and is mirrored into a cookie (see app/api/admin/login)
// purely so middleware.js can gate /admin/** routes at the edge without
// an extra round-trip to the backend on every navigation.

export const TOKEN_KEY = "htn_admin_token";
export const ADMIN_KEY = "htn_admin_user";
export const SESSION_COOKIE = "htn_admin_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredAdmin() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Persists the token/admin locally after a successful login. */
export function setSession(token, admin) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
  if (admin) window.localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_KEY);
}

export function isLoggedIn() {
  return Boolean(getToken());
}
