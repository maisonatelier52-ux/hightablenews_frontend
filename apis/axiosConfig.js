// apis/axiosConfig.js
//
// Central axios instance for the public, user-facing website. Every call
// here is read-only and unauthenticated — the backend's public endpoints
// don't require a token.

import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

export default axiosInstance;
