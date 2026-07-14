"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/apis/adminApis";
import { useToast } from "@/components/ui/Toast";

/**
 * Upload-from-device image field used throughout the Pages builder.
 * Never accepts a raw URL — the admin picks a file from their computer,
 * it's uploaded to the real media library (Cloudinary via the backend),
 * and the resulting hosted URL is stored on the block.
 */
export default function ImageUploadField({ label, value, onChange, hint, aspect = "aspect-video" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      showToast("Image upload failed — try a different file", { type: "error" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {label && <span className="text-[11.5px] font-medium text-ink-600 mb-1 block">{label}</span>}
      {hint && <p className="text-[11px] text-ink-400 mb-1.5 -mt-0.5">{hint}</p>}

      {value ? (
        <div className="relative rounded-lg border border-border overflow-hidden group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className={`w-full ${aspect} object-cover`} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-ink-900 hover:bg-gray-100"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-white text-red-600 hover:bg-red-50"
            >
              <X size={14} />
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Loader2 size={18} className="animate-spin text-primary" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-6 text-[12px] text-ink-500 hover:border-primary/40 hover:bg-primary-50/30 transition-colors disabled:opacity-60"
        >
          {uploading ? <Loader2 size={18} className="animate-spin text-primary" /> : <UploadCloud size={18} className="text-ink-400" />}
          {uploading ? "Uploading…" : "Click to upload an image from your device"}
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}
