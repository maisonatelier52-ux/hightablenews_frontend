"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { searchArticlesByTitle, articleHref } from "@/lib/articlesSource";

/** Site-wide search modal opened from the header's search icon. Matches
 *  published article titles against whatever the user types (case
 *  insensitive, substring match) and lists live results as real links. */
export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setResults([]);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    setResults(searchArticlesByTitle(q).slice(0, 12));
  }, [query, open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] bg-black/50 flex items-start justify-center p-4 pt-[10vh]"
      style={{ backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search articles"
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles by title…"
            className="flex-1 text-[15px] outline-none placeholder:text-gray-400"
          />
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === "" ? (
            <p className="text-[13px] text-gray-400 text-center py-10 px-4">Start typing to search articles by title.</p>
          ) : results.length === 0 ? (
            <p className="text-[13px] text-gray-400 text-center py-10 px-4">No articles match "{query}".</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {results.map((a) => {
                const href = articleHref(a);
                const content = (
                  <div className="flex gap-3 px-4 py-3 group cursor-pointer">
                    <div
                      className="shrink-0 rounded-md overflow-hidden bg-gray-100"
                      style={{ width: 56, height: 42, background: a.img ? `url(${a.img}) center/cover no-repeat` : undefined }}
                    />
                    <div className="min-w-0">
                      {a.category && (
                        <span className="text-[9px] font-bold uppercase tracking-wide block mb-0.5" style={{ color: a.categoryColor || "#dc2626" }}>{a.category}</span>
                      )}
                      <p className="text-[13.5px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{a.title}</p>
                      {a.date && <p className="text-[11px] text-gray-400 mt-0.5">{a.date}</p>}
                    </div>
                  </div>
                );
                return href ? (
                  <Link key={a.id} href={href} onClick={onClose} className="block">{content}</Link>
                ) : (
                  <div key={a.id}>{content}</div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
