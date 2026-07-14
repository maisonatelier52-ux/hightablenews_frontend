"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/layout/AdminShell";
import EmptyState from "@/components/ui/EmptyState";
import { pagesApi } from "@/apis/adminApis";
import { useToast } from "@/components/ui/Toast";
import { FileText, Plus, Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";

export default function PagesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [pages, setPages] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function load() {
    try {
      const res = await pagesApi.getAll();
      setPages(res?.data || res || []);
    } catch {
      setPages([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this page? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await pagesApi.remove(id);
      showToast("Page deleted", { type: "success" });
      setPages((prev) => prev.filter((p) => p._id !== id));
    } catch {
      showToast("Couldn't delete this page", { type: "error" });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminShell title="Pages">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ink-900 tracking-[-0.01em]">Pages</h1>
      </div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[13px] text-ink-500">
          Build custom pages — About, Privacy Policy, Careers — with the same drag-and-drop block builder used on the homepage.
        </p>
        <button
          onClick={() => router.push("/admin/pages/new")}
          className="flex items-center gap-1.5 rounded-lg bg-primary text-white px-4 py-2.5 text-[13px] font-semibold hover:bg-primary-600 transition-colors shrink-0"
        >
          <Plus size={15} /> New page
        </button>
      </div>

      {pages === null && (
        <div className="flex items-center justify-center py-24 text-ink-400">
          <Loader2 className="animate-spin mr-2" size={18} /> Loading pages…
        </div>
      )}

      {pages && pages.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No custom pages yet"
          description="Create your first page — About, Privacy Policy, Contact — using the block builder."
          action={
            <button
              onClick={() => router.push("/admin/pages/new")}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary text-white px-4 py-2 text-[13px] font-semibold hover:bg-primary-600 transition-colors"
            >
              <Plus size={14} /> New page
            </button>
          }
        />
      )}

      {pages && pages.length > 0 && (
        <div className="rounded-card border border-border bg-white shadow-soft overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-gray-50/60">
                <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-ink-500">Title</th>
                <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-ink-500">URL</th>
                <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-ink-500">Layout</th>
                <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-ink-500">Status</th>
                <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-ink-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p._id} className="border-b border-border last:border-0 hover:bg-gray-50/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/pages/${p._id}`} className="text-[13.5px] font-semibold text-ink-900 hover:text-primary">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[12.5px] text-ink-500">/{p.slug}</td>
                  <td className="px-4 py-3 text-[12.5px] text-ink-500 capitalize">{(p.layout || "boxed").replace("-", " ")}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        p.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-ink-500"
                      }`}
                    >
                      {p.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {p.status === "published" && (
                        <a
                          href={`/page/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 w-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-gray-100 hover:text-ink-700"
                          title="View live"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <Link
                        href={`/admin/pages/${p._id}`}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-gray-100 hover:text-ink-700"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        disabled={deletingId === p._id}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === p._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
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
