// apis/adminAxiosConfig.js
//
// Central axios instance for the Admin Panel section of the app. Every
// admin API call goes through this instance so auth headers, base URL, and
// error handling (e.g. auto-logout on a 401) stay in one place.
//
// This is kept separate from apis/axiosConfig.js (used by the public site)
// because admin calls are authenticated and hit the backend's /admin/*
// routes, while public calls are unauthenticated and hit the public routes.

import axios from "axios";
import { getToken, clearSession } from "@/lib/adminSession";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

// Attach the admin's JWT (stored client-side after login) to every request.
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized error handling: on 401 (expired/invalid token) clear the
// local session and bounce back to the login page.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      clearSession();
      // Guard against reload loops: if we're already on the login page
      // (e.g. a stray authenticated call fires before/without a session),
      // don't re-navigate to the page we're already on.
      if (window.location.pathname !== "/admin/login") {
        const next = window.location.pathname;
        window.location.assign(`/admin/login?next=${encodeURIComponent(next)}`);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;