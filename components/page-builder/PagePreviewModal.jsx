"use client";

import { useEffect, useState } from "react";
import { X, Monitor, Tablet, Smartphone } from "lucide-react";
import CmsPageView from "./CmsPageView";

const WIDTHS = { desktop: "100%", tablet: "768px", mobile: "390px" };

/** Full-page preview of the page currently being edited, rendered exactly
 *  the way CmsPageView renders it on the live site — but from in-memory
 *  state, so admins can preview before saving. */
export default function PagePreviewModal({ page, onClose }) {
  const [device, setDevice] = useState("desktop");

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-ink-900">Preview — {page.title || "Untitled page"}</span>
          <span className="text-[11px] text-ink-400">(unsaved changes are included)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center rounded-lg border border-border overflow-hidden">
            {[
              { id: "desktop", icon: Monitor },
              { id: "tablet", icon: Tablet },
              { id: "mobile", icon: Smartphone },
            ].map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setDevice(id)}
                className={`h-8 w-9 flex items-center justify-center ${device === id ? "bg-primary text-white" : "text-ink-400 hover:bg-gray-50"}`}
                title={id}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-ink-500 hover:bg-gray-50">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gray-100 py-6">
        <div className="mx-auto bg-white shadow-xl transition-all" style={{ width: WIDTHS[device], maxWidth: "100%" }}>
          <CmsPageView page={page} />
        </div>
      </div>
    </div>
  );
}
