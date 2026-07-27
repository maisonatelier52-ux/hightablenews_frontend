"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { uploadFavicon } from "@/apis/adminApis";
import { useToast } from "@/components/ui/Toast";

/**
 * Upload-from-device favicon field for the Settings page. Only accepts
 * .ico files, and — unlike ImageUploadField — never converts the file to
 * WEBP: it's streamed to Cloudinary exactly as uploaded, since browsers /
 * OS tab bars specifically expect an .ico favicon. Any file size is fine.
 */
export default function FaviconUploadField({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const looksLikeIco = /\.ico$/i.test(file.name || "");
    const mimeOk = ["image/x-icon", "image/vnd.microsoft.icon", "application/octet-stream"].includes(file.type);
    if (!looksLikeIco && !mimeOk) {
      showToast("Favicon must be a .ico file", { type: "error" });
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      const url = await uploadFavicon(file);
      onChange(url);
    } catch (err) {
      showToast(err?.response?.data?.message || "Favicon upload failed — try a different file", { type: "error" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-medium text-ink-700">Favicon</span>
      <p className="text-[11px] text-ink-400 -mt-0.5">Upload from your device · .ico format · any size</p>

      {value ? (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 rounded-lg border border-border bg-surface-soft flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Favicon" className="h-8 w-8 object-contain" />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-ink-700 hover:bg-surface-soft disabled:opacity-60"
            >
              {uploading ? <Loader2 size={13} className="animate-spin" /> : "Replace"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-6 text-[12px] text-ink-500 hover:border-primary/40 hover:bg-primary-50/30 transition-colors disabled:opacity-60"
        >
          {uploading ? <Loader2 size={18} className="animate-spin text-primary" /> : <UploadCloud size={18} className="text-ink-400" />}
          {uploading ? "Uploading…" : "Click to upload a .ico favicon from your device"}
        </button>
      )}

      <input ref={inputRef} type="file" accept=".ico,image/x-icon,image/vnd.microsoft.icon" className="hidden" onChange={handleFile} />
    </div>
  );
}