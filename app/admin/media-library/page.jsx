"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AdminShell from "@/components/layout/AdminShell";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { ImageIcon, UploadCloud, Trash2, Loader2, Copy, Check } from "lucide-react";
import { mediaApi } from "@/apis/adminApis";

function formatBytes(bytes = 0) {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(2)} MB`;
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [copiedId, setCopiedId] = useState("");
  const fileInputRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await mediaApi.getAll({ limit: 60 });
      setItems(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load media library.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      await mediaApi.upload(files);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Upload failed. Only images are accepted.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    const id = confirm.id;
    setConfirm({ open: false, id: null });
    try {
      await mediaApi.remove(id);
      setItems((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete media.");
    }
  }

  function copyUrl(item) {
    navigator.clipboard?.writeText(item.secureUrl || item.url);
    setCopiedId(item._id);
    setTimeout(() => setCopiedId(""), 1500);
  }

  return (
    <AdminShell title="Media Library">
      <div className="p-4 lg:p-6 max-w-[1200px] mx-auto">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-ink-900 tracking-[-0.01em]">Media Library</h1>
          <p className="text-[13px] text-ink-500 mt-0.5">Upload, organize, and reuse images across your site.</p>
        </div>
        <ConfirmDialog
          isOpen={confirm.open}
          title="Delete media"
          message="Delete this file from Cloudinary and the media library? This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirm({ open: false, id: null })}
          confirmText="Delete"
        />

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-surface-soft hover:border-primary transition-colors mb-6"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
          />
          <UploadCloud size={28} className="mx-auto text-ink-400 mb-2" />
          <p className="text-[13px] text-ink-700 font-medium">Drag & drop images here</p>
          <p className="text-[12px] text-ink-400 mt-1">
            Automatically converted to WEBP and compressed under 100KB by the backend.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary text-white px-4 py-2 text-[13px] font-medium hover:opacity-90 disabled:opacity-60"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
            {uploading ? "Uploading…" : "Choose files"}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 text-[12.5px]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16 text-ink-400">
            <Loader2 className="animate-spin mr-2" size={18} /> Loading media…
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            title="Your media lives here"
            description="Upload images once, then reuse their URLs across the Hero, Banner, and Video blocks in the Homepage Builder."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <div key={item._id} className="group relative rounded-xl border border-border overflow-hidden bg-white">
                <img src={item.secureUrl || item.url} alt="" className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <button
                    onClick={() => copyUrl(item)}
                    className="flex items-center gap-1 text-white text-[11px] bg-white/10 hover:bg-white/20 rounded-md px-2 py-1"
                  >
                    {copiedId === item._id ? <Check size={12} /> : <Copy size={12} />}
                    {copiedId === item._id ? "Copied" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => setConfirm({ open: true, id: item._id })}
                    className="flex items-center gap-1 text-white text-[11px] bg-red-600/80 hover:bg-red-600 rounded-md px-2 py-1"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
                <div className="px-2 py-1.5 text-[10.5px] text-ink-400 flex justify-between">
                  <span>{item.format?.toUpperCase()}</span>
                  <span>{formatBytes(item.size)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
