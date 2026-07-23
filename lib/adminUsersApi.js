// lib/adminUsersApi.js
//
// Talks to the backend's /admin/users endpoints (super admin only — see
// middleware/requireSuperAdmin.js on the backend). Used by app/admin/users/page.jsx.

import api from "@/apis/adminAxiosConfig";

export async function fetchAdminUsers() {
  const res = await api.get("/admin/users");
  return res.data.data;
}

export async function createAdminUser(payload) {
  const res = await api.post("/admin/users", payload);
  return res.data.data;
}

export async function updateAdminUser(id, payload) {
  const res = await api.put(`/admin/users/${id}`, payload);
  return res.data.data;
}

export async function deleteAdminUser(id) {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data.data;
}