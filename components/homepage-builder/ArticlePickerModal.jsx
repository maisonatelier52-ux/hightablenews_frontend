"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Search, X, Check, Newspaper } from "lucide-react";
import { getAllPreviewArticlesSorted } from "@/lib/articlesSource";

/**
 * Modal for choosing one or more articles (sourced live from the Articles
 * page), with search-by-title. Articles are always listed newest first.
 *
 * Props:
 *  - mode: "single" | "multi"
 *  - initialSelectedIds: string[] (pre-checked items, multi mode only)
 *  - onConfirm(ids: string[]) — called with the chosen id(s)
 *  - onClose()
 */
export default function ArticlePickerModal({ mode = "multi", initialSelectedIds = [], excludeIds = [], onConfirm, onClose }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(() => new Set(initialSelectedIds));

  const allArticles = useMemo(() => getAllPreviewArticlesSorted(), []);

  // Articles already shown elsewhere on the page are NOT hidden from the
  // list — an admin must always be able to open the picker and see every
  // article to choose from. Instead they're flagged with an "Already
  // shown" badge so the admin can make an informed choice; picking one
  // here still auto-unpins it from wherever else it was pinned (see
  // pinArticleAtIndex), and the slot it vacates will simply re-fill from
  // the next unused article.
  const excludeSet = useMemo(() => {
    const s = new Set((excludeIds || []).filter(Boolean));
    initialSelectedIds.forEach((id) => s.delete(id));
    return s;
  }, [excludeIds, initialSelectedIds]);

  const selectableArticles = allArticles;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return selectableArticles;
    return selectableArticles.filter((a) => a.title.toLowerCase().includes(q));
  }, [selectableArticles, query]);

  function toggle(id) {
    if (mode === "single") {
      onConfirm([id]);
      return;
    }
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleConfirm() {
    onConfirm(Array.from(selected));
  }

  // Rendered via a portal straight onto <body>. Without this, a modal
  // opened from a card inside the Newspaper Editorial template's sticky
  // left/right sidebars gets stuck inside that sidebar's own stacking
  // context (position: sticky always creates one), so later-painted
  // siblings like the center column can visually render on top of it even
  // though the modal itself has a high z-index. Portaling to <body> makes
  // this a true top-level overlay every time, regardless of where in the
  // tree it was triggered from.
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[60] bg-ink-900/50 flex items-center justify-center p-4" style={{ backdropFilter: "blur(2px)" }}>
      <div className="bg-white w-full max-w-lg rounded-card shadow-2xl border border-border overflow-hidden flex flex-col" style={{ maxHeight: "80vh" }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <p className="text-[13.5px] font-semibold text-ink-900">
              {mode === "single" ? "Choose an article" : "Choose articles"}
            </p>
            <p className="text-[11.5px] text-ink-500">Newest articles appear first.</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-gray-100 hover:text-ink-700 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-border">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles by title…"
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-surface-soft text-[12.5px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <Newspaper size={22} className="text-ink-200 mb-2" />
              <p className="text-[12.5px] font-medium text-ink-500">
                {allArticles.length === 0 ? "No articles yet" : "No articles match your search"}
              </p>
              <p className="text-[11.5px] text-ink-400 mt-1">
                {allArticles.length === 0 ? "Add articles from the Articles page first." : "Try a different title."}
              </p>
            </div>
          ) : (
            filtered.map((a) => {
              const isChecked = selected.has(a.id);
              const alreadyUsed = excludeSet.has(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => toggle(a.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="h-10 w-14 rounded-md bg-gray-100 flex-none overflow-hidden flex items-center justify-center">
                    {a.img ? (
                      <img src={a.img} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Newspaper size={14} className="text-ink-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-medium text-ink-900 line-clamp-1 flex items-center gap-1.5">
                      {a.title}
                      {alreadyUsed && (
                        <span className="shrink-0 text-[9.5px] font-semibold uppercase tracking-wide text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                          Already shown
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-ink-400 mt-0.5">{a.category} · {a.date}</p>
                  </div>
                  {mode === "multi" ? (
                    <span
                      className={`h-5 w-5 rounded-md border flex items-center justify-center flex-none transition-colors ${
                        isChecked ? "bg-primary border-primary text-white" : "border-border text-transparent"
                      }`}
                    >
                      <Check size={12} />
                    </span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>

        {mode === "multi" && (
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-border bg-gray-50/60">
            <p className="text-[11.5px] text-ink-500">{selected.size} selected</p>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-ink-600 hover:bg-gray-100 transition-colors">Cancel</button>
              <button onClick={handleConfirm} className="px-3.5 py-1.5 rounded-lg text-[12px] font-semibold bg-primary text-white hover:bg-primary/90 transition-colors">Apply selection</button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
