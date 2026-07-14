"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/layout/AdminShell";
import EmptyState from "@/components/ui/EmptyState";
import { subscribersApi } from "@/apis/adminApis";
import { useToast } from "@/components/ui/Toast";
import { Mail, Trash2, Loader2, Search } from "lucide-react";

export default function SubscribersPage() {
  const { showToast } = useToast();
  const [subscribers, setSubscribers] = useState(null);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function load(q = "") {
    try {
      const res = await subscribersApi.getAll({ search: q || undefined });
      setSubscribers(res?.data || []);
      setTotal(res?.meta?.total ?? (res?.data || []).length);
    } catch {
      setSubscribers([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(search), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleDelete(id) {
    if (!confirm("Remove this subscriber?")) return;
    setDeletingId(id);
    try {
      await subscribersApi.remove(id);
      showToast("Subscriber removed", { type: "success" });
      setSubscribers((prev) => prev.filter((s) => s._id !== id));
      setTotal((t) => t - 1);
    } catch {
      showToast("Couldn't remove subscriber", { type: "error" });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminShell title="Subscribers">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ink-900 tracking-[-0.01em]">Subscribers</h1>
        <p className="text-[13px] text-ink-500 mt-0.5">Everyone who has signed up via your site's subscribe forms.</p>
      </div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <p className="text-[13px] text-ink-500">
          {total} {total === 1 ? "person has" : "people have"} subscribed via the header, sidebar, footer, or CMS pages.
        </p>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email…"
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-border text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {subscribers === null && (
        <div className="flex items-center justify-center py-24 text-ink-400">
          <Loader2 className="animate-spin mr-2" size={18} /> Loading subscribers…
        </div>
      )}

      {subscribers && subscribers.length === 0 && (
        <EmptyState icon={Mail} title="No subscribers yet" description="Once readers subscribe from the header, sidebar, or footer, they'll show up here." />
      )}

      {subscribers && subscribers.length > 0 && (
        <div className="rounded-card border border-border bg-white shadow-soft overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-gray-50/60">
                <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-ink-500">Email</th>
                <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-ink-500">Source</th>
                <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-ink-500">Status</th>
                <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-ink-500">Subscribed</th>
                <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-ink-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s._id} className="border-b border-border last:border-0 hover:bg-gray-50/40">
                  <td className="px-4 py-3 text-[13px] font-medium text-ink-900">{s.email}</td>
                  <td className="px-4 py-3 text-[12.5px] text-ink-500 capitalize">{s.source}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${s.status === "subscribed" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-ink-500"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12.5px] text-ink-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(s._id)}
                      disabled={deletingId === s._id}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                    >
                      {deletingId === s._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
