"use client";

import { useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Field, Input, Select, ToggleRow, ColorInput } from "@/components/ui/Field";
import { getAllPreviewArticlesSorted } from "@/lib/articlesSource";

/** Breaking News now pulls real articles the admin already created on the
 *  Articles page (instead of free-typed headlines). `articleIds` is the
 *  ordered list of chosen article ids; leaving it empty means "show the
 *  latest 3 published articles automatically", which is also what a brand
 *  new site shows by default. */
export default function BreakingNewsEditor({ breakingNews, onChange }) {
  const allArticles = useMemo(() => getAllPreviewArticlesSorted(), []);
  const latestThreeIds = useMemo(() => allArticles.slice(0, 3).map((a) => a.id), [allArticles]);
  const articleIds = breakingNews.articleIds?.length ? breakingNews.articleIds : [];
  const isAuto = articleIds.length === 0;
  const displayedIds = isAuto ? latestThreeIds : articleIds;

  function set(patch) {
    onChange({ ...breakingNews, ...patch });
  }

  function updateItem(idx, articleId) {
    const next = [...displayedIds];
    next[idx] = articleId;
    set({ articleIds: next });
  }

  function addItem() {
    // Pick the first article not already selected, if any, else leave blank.
    const used = new Set(displayedIds);
    const next = allArticles.find((a) => !used.has(a.id));
    set({ articleIds: [...displayedIds, next?.id || ""] });
  }

  function deleteItem(idx) {
    set({ articleIds: displayedIds.filter((_, i) => i !== idx) });
  }

  function moveItem(idx, dir) {
    const next = [...displayedIds];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    set({ articleIds: next });
  }

  const speed = breakingNews.speed ?? 80;

  return (
    <div className="space-y-4">
      <ToggleRow
        label="Enable Breaking News"
        sub="Show the scrolling ticker below the main header"
        checked={breakingNews.enabled}
        onChange={(v) => set({ enabled: v })}
      />

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Label Text">
          <Input
            value={breakingNews.labelText || "BREAKING"}
            onChange={(e) => set({ labelText: e.target.value })}
            placeholder="BREAKING"
          />
        </Field>
        <Field label="Ticker Style">
          <Select value={breakingNews.style} onChange={(e) => set({ style: e.target.value })}>
            <option value="red">Red Label</option>
            <option value="blue">Blue Label</option>
            <option value="black">Black Ticker</option>
          </Select>
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Label Background" hint="Background of the BREAKING tag">
          <ColorInput value={breakingNews.bg || "#b30000"} onChange={(v) => set({ bg: v })} />
        </Field>
        <Field label="Label Text" hint="Text color inside the BREAKING tag">
          <ColorInput value={breakingNews.labelTextColor || "#ffffff"} onChange={(v) => set({ labelTextColor: v })} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Text Color" hint="Color of the scrolling news text">
          <ColorInput value={breakingNews.textColor || "#ffffff"} onChange={(v) => set({ textColor: v })} />
        </Field>
        <Field label="Background" hint="Background of the scrolling ticker row">
          <ColorInput value={breakingNews.tickerBg ?? "#111111"} onChange={(v) => set({ tickerBg: v })} />
        </Field>
      </div>

      <Field label={`Scroll Speed — ${speed} px/sec`} hint="Higher = faster scrolling ticker">
        <div className="flex items-center gap-3 mt-1">
          <input
            type="range"
            min={20}
            max={200}
            step={5}
            value={speed}
            onChange={(e) => set({ speed: Number(e.target.value) })}
            className="flex-1 h-1.5 rounded-full bg-border accent-primary cursor-pointer"
          />
          <div className="flex items-center gap-1 shrink-0 rounded-md border border-border bg-surface-soft px-2 py-1 text-[12.5px] text-ink-700 min-w-[72px] justify-center">
            {speed} <span className="text-ink-400">px/s</span>
          </div>
        </div>
      </Field>

      <Field label={`News Items (${displayedIds.length})`} hint="Ticker headlines are pulled from articles you've already created on the Articles page.">
        {allArticles.length === 0 ? (
          <p className="text-[12.5px] text-ink-400 rounded-md border border-dashed border-border px-3 py-2.5">
            No published articles yet — add some on the Articles page and they'll be available to pick here.
          </p>
        ) : (
          <div className="space-y-2">
            {isAuto && (
              <p className="text-[11.5px] text-ink-400 mb-1">
                Showing the 3 latest published articles automatically. Add or edit an item below to customize.
              </p>
            )}
            {displayedIds.map((id, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Select
                  value={id || ""}
                  onChange={(e) => updateItem(idx, e.target.value)}
                  className="flex-1 min-w-0"
                >
                  <option value="">— Choose an article —</option>
                  {allArticles.map((a) => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </Select>
                <div className="flex flex-col">
                  <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className="text-ink-400 hover:text-ink-700 disabled:opacity-30 leading-none text-[10px]">▲</button>
                  <button onClick={() => moveItem(idx, 1)} disabled={idx === displayedIds.length - 1} className="text-ink-400 hover:text-ink-700 disabled:opacity-30 leading-none text-[10px]">▼</button>
                </div>
                <button onClick={() => deleteItem(idx)} className="text-ink-400 hover:text-red-500 p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button onClick={addItem} className="flex items-center gap-1 text-[12.5px] font-semibold text-primary hover:text-primary-600">
              <Plus size={13} /> Add news item
            </button>
          </div>
        )}
      </Field>
    </div>
  );
}
