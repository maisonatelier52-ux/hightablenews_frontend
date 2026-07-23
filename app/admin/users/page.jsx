"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Shield,
  ShieldCheck,
  Mail,
  Lock,
  KeyRound,
  Loader2,
  Link2,
} from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import { useToast } from "@/components/ui/Toast";
import { getStoredAdmin } from "@/lib/adminSession";
import { fetchAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from "@/lib/adminUsersApi";
import { PERMISSION_GROUPS, PERMISSION_KEYS, defaultPermissions, countEnabled } from "@/lib/permissionsConfig";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "admin",
  isActive: true,
  permissions: defaultPermissions(false),
};

function initialsOf(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
}

function RoleBadge({ role }) {
  if (role === "superadmin") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-300 bg-accent-50 px-3 py-1 text-[12px] font-semibold text-accent-700">
        <ShieldCheck size={13} /> Super Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-soft px-3 py-1 text-[12px] font-semibold text-ink-700">
      <Shield size={13} /> Admin
    </span>
  );
}

function StatusDot({ isActive }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12.5px] font-medium ${isActive ? "text-success" : "text-ink-400"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-success" : "bg-ink-300"}`} />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function UserModal({ open, initial, currentAdminId, onClose, onSaved }) {
  const { showToast } = useToast();
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setForm(
      initial
        ? {
            name: initial.name || "",
            email: initial.email || "",
            password: "",
            role: initial.role || "admin",
            isActive: initial.isActive !== false,
            permissions: { ...defaultPermissions(false), ...(initial.permissions || {}) },
          }
        : EMPTY_FORM
    );
  }, [open, initial]);

  if (!open) return null;

  const isSelf = isEdit && String(initial._id) === String(currentAdminId);
  const enabledCount = countEnabled(form.permissions);

  function set(patch) {
    setForm((p) => ({ ...p, ...patch }));
  }

  function toggleKey(key, value) {
    setForm((p) => ({ ...p, permissions: { ...p.permissions, [key]: value } }));
  }

  function setAll(value) {
    setForm((p) => ({ ...p, permissions: defaultPermissions(value) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Full name and email are required.");
      return;
    }
    if (!isEdit && form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password && form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      isActive: form.isActive,
      permissions: form.permissions,
    };
    if (form.password) payload.password = form.password;

    setSaving(true);
    try {
      if (isEdit) {
        await updateAdminUser(initial._id, payload);
        showToast("User updated");
      } else {
        await createAdminUser(payload);
        showToast("User created");
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" style={{ backdropFilter: "blur(2px)" }}>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
              <KeyRound size={16} />
            </div>
            <h3 className="text-[15px] font-bold text-ink-900">{isEdit ? "Edit User" : "Add User"}</h3>
          </div>
          <button type="button" onClick={onClose} className="text-ink-400 hover:text-ink-700 p-1 rounded">
            <X size={17} />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 text-[12.5px]">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-[12px] font-semibold text-ink-500 mb-1.5">Full name</span>
              <input
                value={form.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2.5 text-[13.5px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 focus:bg-white transition-colors"
              />
            </label>
            <label className="block">
              <span className="block text-[12px] font-semibold text-ink-500 mb-1.5">Email</span>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set({ email: e.target.value })}
                  placeholder="admin@newssite.com"
                  className="w-full rounded-lg border border-border bg-surface-soft pl-9 pr-3 py-2.5 text-[13.5px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 focus:bg-white transition-colors"
                />
              </div>
            </label>
          </div>

          <label className="block">
            <span className="block text-[12px] font-semibold text-ink-500 mb-1.5">Password</span>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => set({ password: e.target.value })}
                placeholder={isEdit ? "Leave blank to keep current password" : "••••••••"}
                className="w-full rounded-lg border border-border bg-surface-soft pl-9 pr-3 py-2.5 text-[13.5px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 focus:bg-white transition-colors"
              />
            </div>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="block text-[12px] font-semibold text-ink-500 mb-1.5">Role</span>
              <div className="inline-flex rounded-lg border border-border p-1 bg-surface-soft w-full">
                <button
                  type="button"
                  disabled={isSelf}
                  onClick={() => set({ role: "admin" })}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                    form.role === "admin" ? "bg-primary text-white shadow-soft" : "text-ink-600 hover:text-ink-900"
                  } ${isSelf ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Shield size={13} /> Admin
                </button>
                <button
                  type="button"
                  onClick={() => set({ role: "superadmin" })}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                    form.role === "superadmin" ? "bg-primary text-white shadow-soft" : "text-ink-600 hover:text-ink-900"
                  }`}
                >
                  <ShieldCheck size={13} /> Super Admin
                </button>
              </div>
            </div>
            <div>
              <span className="block text-[12px] font-semibold text-ink-500 mb-1.5">Account status</span>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface-soft px-3 py-2.5 h-[42px]">
                <span className="text-[13px] text-ink-700">{form.isActive ? "Active" : "Inactive"}</span>
                <Toggle
                  checked={form.isActive}
                  onChange={(v) => set({ isActive: v })}
                  disabled={isSelf}
                  label="Account status"
                />
              </div>
            </div>
          </div>

          {form.role === "superadmin" ? (
            <div className="rounded-lg border border-accent-200 bg-accent-50 px-4 py-3 text-[12.5px] text-accent-700 flex items-center gap-2">
              <ShieldCheck size={15} /> Super admins have access to every page — no need to set permissions.
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-700">
                  <Link2 size={13} className="text-ink-400" /> Page access
                </span>
                <div className="flex items-center gap-3 text-[12px] font-semibold">
                  <button type="button" onClick={() => setAll(true)} className="text-primary-600 hover:underline">
                    Enable all
                  </button>
                  <button type="button" onClick={() => setAll(false)} className="text-ink-400 hover:underline">
                    Disable all
                  </button>
                </div>
              </div>
              <p className="text-[11.5px] text-ink-400 mb-3">Access is limited to the pages you enable below.</p>
              <div className="rounded-lg border border-border divide-y divide-border">
                {PERMISSION_GROUPS.map((group) => (
                  <div key={group.label} className="px-4 py-3">
                    <p className="text-[10.5px] font-bold uppercase tracking-wide text-ink-300 mb-2.5">{group.label}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                      {group.keys.map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-[13px] text-ink-700">{label}</span>
                          <Toggle checked={Boolean(form.permissions[key])} onChange={(v) => toggleKey(key, v)} label={label} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-ink-400 mt-2">Dashboard is always visible to every signed-in user and doesn't need a toggle.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border shrink-0">
          <span className="text-[11.5px] text-ink-400">
            {form.role === "superadmin" ? "All pages" : `${enabledCount} of ${PERMISSION_KEYS.length} pages enabled`}
          </span>
          <div className="flex items-center gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {isEdit ? "Save changes" : "Create user"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function UsersPage() {
  const { showToast } = useToast();
  const currentAdmin = getStoredAdmin();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null, name: "" });
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchAdminUsers();
      setUsers(data);
    } catch (err) {
      showToast(err?.response?.data?.message || "Couldn't load users", { type: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(user) {
    setEditing(user);
    setModalOpen(true);
  }

  function askDelete(user) {
    setConfirm({ open: true, id: user._id, name: user.name });
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await deleteAdminUser(confirm.id);
      showToast("User deleted");
      setConfirm({ open: false, id: null, name: "" });
      load();
    } catch (err) {
      showToast(err?.response?.data?.message || "Couldn't delete user", { type: "error" });
    } finally {
      setDeleting(false);
    }
  }

  const total = users.length;

  return (
    <AdminShell title="Users">
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[22px] font-bold text-ink-900 tracking-[-0.01em]">Users</h1>
            <p className="text-[13.5px] text-ink-500 mt-1">Create admin-panel accounts and control which pages each one can access.</p>
          </div>
          <Button icon={Plus} onClick={openCreate}>
            Add User
          </Button>
        </div>

        <div className="rounded-card border border-border bg-white shadow-soft overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-ink-400">
              <Loader2 size={20} className="animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  {["User", "Role", "Access", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-ink-300">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = String(u._id) === String(currentAdmin?._id);
                  const access = u.role === "superadmin" ? "All pages" : `${countEnabled(u.permissions)} of ${PERMISSION_KEYS.length} pages`;
                  return (
                    <tr key={u._id} className="border-b border-border last:border-0 hover:bg-surface-soft/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-accent-400 flex items-center justify-center text-[12px] font-bold uppercase">
                            {initialsOf(u.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13.5px] font-semibold text-ink-900 truncate">
                              {u.name} {isSelf && <span className="text-ink-400 font-normal">(you)</span>}
                            </div>
                            <div className="text-[12px] text-ink-400 truncate">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-ink-700">{access}</td>
                      <td className="px-5 py-3.5">
                        <StatusDot isActive={u.isActive} />
                      </td>
                      <td className="px-5 py-3.5">
                        {isSelf ? (
                          <span className="text-ink-300 text-[12px]">—</span>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button onClick={() => openEdit(u)} className="text-ink-400 hover:text-primary-600 transition-colors" title="Edit">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => askDelete(u)} className="text-ink-400 hover:text-danger transition-colors" title="Delete">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {!loading && (
          <p className="text-center text-[12px] text-ink-400 mt-4">
            {total} user{total === 1 ? "" : "s"} total
          </p>
        )}
      </div>

      <UserModal
        open={modalOpen}
        initial={editing}
        currentAdminId={currentAdmin?._id}
        onClose={() => setModalOpen(false)}
        onSaved={load}
      />

      <ConfirmDialog
        isOpen={confirm.open}
        title="Delete user"
        message={`Remove "${confirm.name}"? They'll immediately lose access to the admin panel. This can't be undone.`}
        confirmText={deleting ? "Deleting…" : "Delete"}
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ open: false, id: null, name: "" })}
      />
    </AdminShell>
  );
}