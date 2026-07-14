"use client";

import { useEffect, useState, useCallback } from "react";
import {
  DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Save, Check, Loader2, Undo2, Redo2, X, LayoutTemplate, Layers } from "lucide-react";

import { getHomepageAdmin as getHomepage, saveHomepage } from "@/lib/api";
import { createBlock, BLOCK_DEFINITIONS, CENTER_SECTION_COLOR_PALETTE, makeCenterSectionForCategory } from "@/lib/blockDefinitions";
import { useAutoSave } from "@/lib/useAutoSave";
import { preloadCategoriesAndArticlesAdmin, onDataChange, getCategories } from "@/lib/categoriesArticlesApi";
import { preloadAuthorsAdmin, onAuthorsChange } from "@/lib/authorsApi";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import PageStructurePanel from "./PageStructurePanel";
import BlockSettingsPanel from "./BlockSettingsPanel";
import SortableBlockItem from "./SortableBlockItem";
import BlockPreview from "./BlockPreview";
import LivePreviewPanel from "./LivePreviewPanel";

const HISTORY_LIMIT = 50;

// ─── Preset template layouts ─────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: "newspaper-editorial",
    name: "Newspaper Editorial",
    description: "Exact HighTableNews layout: top stories + sticky left sidebar + editorial center + right sidebar",
    // NOTE: the "Newspaper Editorial Layout" block already renders its own
    // Top Stories strip internally (data.showTopStories) — it used to be
    // paired with a second, separate "topStoriesGrid" block here, which
    // duplicated that same strip and (worse) pulled from the real-articles
    // pool independently of the rest of the template's de-dupe tracker, so
    // the same story could show twice and other sections would run out of
    // unique articles sooner. Just the one block is the full template.
    blocks: [
      { type: "newspaperEditorial" },
    ],
  },
  {
    id: "modern-magazine",
    name: "Modern Magazine",
    description: "Clean, modern layout with large hero, top stories grid, latest news, editor's picks, category sections & sidebar widgets",
    blocks: [
      { type: "modernMagazineLayout" },
    ],
  },
  {
    id: "dark-news",
    name: "Dark News",
    description: "Bold premium dark theme with hero, featured stories, most read, editor's choice, category blocks & long scrolling sections",
    blocks: [
      { type: "darkNewsLayout" },
    ],
  },
  {
    id: "masonry-editorial",
    name: "Masonry Editorial Layout",
    description: "Hero masonry + editor's picks + latest news with sidebar + masonry grid + category grid + trending + authors + ads",
    blocks: [
      { type: "masonryEditorialLayout" },
    ],
  },
];

export default function HomepageBuilder() {
  const [homepage, setHomepage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [activeDragId, setActiveDragId] = useState(null);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  const { status, trigger, saveNow } = useAutoSave(saveHomepage, { toastMessage: "Homepage saved successfully" });
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  // The Live Preview below reads articles/categories/authors synchronously
  // from a shared in-memory cache (lib/categoriesArticlesApi.js, lib/authorsApi.js)
  // that's populated by a background fetch kicked off elsewhere (DataProvider).
  // That fetch is async and this component's first render almost always
  // happens before it resolves, so without this subscription the preview
  // would permanently show sample/placeholder content — it has no other way
  // to find out the real data has since arrived. `dataTick` forces exactly
  // that: a local re-render (re-reading the now-populated cache) the moment
  // either cache updates, no matter when this page was opened.
  const [, setDataTick] = useState(0);
  useEffect(() => {
    // Defensive: make sure the fetch is actually in flight even if this is
    // the very first admin page loaded this session (preload is idempotent —
    // safe to call again even if DataProvider already started it).
    preloadCategoriesAndArticlesAdmin().catch(() => {});
    preloadAuthorsAdmin().catch(() => {});
    const unsubData = onDataChange(() => setDataTick((n) => n + 1));
    const unsubAuthors = onAuthorsChange(() => setDataTick((n) => n + 1));
    return () => {
      unsubData();
      unsubAuthors();
    };
  }, []);

  useEffect(() => {
    getHomepage().then((data) => {
      setHomepage(data);
      setSelectedId(data.blocks[0]?.id ?? null);
      setLoading(false);
    });
  }, []);

  const updateBlockData = useCallback(
    (id, patch) => {
      setHomepage((prev) => {
        const next = { ...prev, blocks: prev.blocks.map((b) => (b.id === id ? { ...b, data: { ...b.data, ...patch } } : b)) };
        trigger(next);
        return next;
      });
    },
    [trigger]
  );

  const commitBlocks = useCallback(
    (nextBlocks) => {
      setHomepage((prev) => {
        setHistory((h) => [...h.slice(-(HISTORY_LIMIT - 1)), prev.blocks]);
        setFuture([]);
        const next = { ...prev, blocks: nextBlocks };
        trigger(next);
        return next;
      });
    },
    [trigger]
  );

  function undo() {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prevBlocks = h[h.length - 1];
      setHomepage((current) => {
        setFuture((f) => [current.blocks, ...f]);
        const next = { ...current, blocks: prevBlocks };
        trigger(next);
        return next;
      });
      return h.slice(0, -1);
    });
  }

  function redo() {
    setFuture((f) => {
      if (f.length === 0) return f;
      const nextBlocks = f[0];
      setHomepage((current) => {
        setHistory((h) => [...h, current.blocks]);
        const next = { ...current, blocks: nextBlocks };
        trigger(next);
        return next;
      });
      return f.slice(1);
    });
  }

  function addBlock(type, atIndex = null) {
    const block = createBlock(type);
    const blocks = [...homepage.blocks];
    if (atIndex === null || atIndex >= blocks.length) blocks.push(block);
    else blocks.splice(atIndex, 0, block);
    commitBlocks(blocks);
    setSelectedId(block.id);
  }

  function deleteBlock(id) {
    commitBlocks(homepage.blocks.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function duplicateBlock(id) {
    const index = homepage.blocks.findIndex((b) => b.id === id);
    if (index === -1) return;
    const original = homepage.blocks[index];
    const copy = { ...createBlock(original.type), data: { ...original.data } };
    const blocks = [...homepage.blocks];
    blocks.splice(index + 1, 0, copy);
    commitBlocks(blocks);
    setSelectedId(copy.id);
  }

  function applyTemplate(template) {
    const blocks = template.blocks.map((b) => createBlock(b.type));

    // The Newspaper Editorial template's center-column category sections
    // ship with 3 placeholder labels (Economy/Culture/Business) since the
    // block definition has no way to know the site's real categories ahead
    // of time. The moment the admin actually picks this template, real
    // categories are (almost always) already loaded — swap the placeholders
    // for the site's first few real categories automatically, so the
    // section immediately shows real per-category toggles/articles instead
    // of labels that may not match anything the admin has actually created.
    const realCategories = getCategories();
    if (realCategories.length > 0) {
      blocks.forEach((block) => {
        if (block.type === "newspaperEditorial") {
          block.data.centerSections = realCategories
            .slice(0, 3)
            .map((cat, i) => makeCenterSectionForCategory(cat, i));
        }
      });
    }

    commitBlocks(blocks);
    setSelectedId(blocks[0]?.id ?? null);
    setTemplateOpen(false);
  }

  function handleDragStart(event) { setActiveDragId(event.active.id); }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveDragId(null);
    if (!over) return;

    const isLibraryItem = String(active.id).startsWith("lib-");
    if (isLibraryItem) {
      const type = active.data.current?.type;
      if (!type) return;
      const overId = over.id;
      if (overId === "page-structure-droppable") addBlock(type);
      else {
        const overIndex = homepage.blocks.findIndex((b) => b.id === overId);
        addBlock(type, overIndex === -1 ? null : overIndex);
      }
      return;
    }

    if (active.id === over.id) return;
    const ids = homepage.blocks.map((b) => b.id);
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    commitBlocks(arrayMove(homepage.blocks, oldIndex, newIndex));
  }

  if (loading || !homepage) {
    return (
      <div className="p-6 space-y-5">
        <Skeleton className="h-14 w-full" />
        <div className="grid grid-cols-3 gap-5">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const selectedBlock = homepage.blocks.find((b) => b.id === selectedId) || null;
  const activeLibType = activeDragId && String(activeDragId).startsWith("lib-") ? activeDragId.replace("lib-", "") : null;
  const activeBlock = activeDragId ? homepage.blocks.find((b) => b.id === activeDragId) : null;

  return (
    <div className="p-4 lg:p-6 max-w-[1500px] mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-ink-900">Homepage Builder</h2>
          <p className="text-[13px] text-ink-500 mt-0.5">Pick a template to design your homepage layout — no code required.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SaveStatus status={status} />
          <IconButton icon={Undo2} onClick={undo} disabled={history.length === 0} title="Undo (Ctrl+Z)" />
          <IconButton icon={Redo2} onClick={redo} disabled={future.length === 0} title="Redo (Ctrl+Y)" />
          <button
            onClick={() => setTemplateOpen(true)}
            className="h-9 flex items-center gap-1.5 px-3 rounded-lg border border-border text-ink-600 hover:bg-surface-soft text-[13px] font-medium transition-colors"
          >
            <LayoutTemplate size={14} />
            Templates
          </button>
          <Button icon={Save} onClick={() => saveNow(homepage)}>
            Save Page
          </Button>
        </div>
      </div>

      {/* Block count summary */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <Layers size={13} className="text-ink-400" />
        <span className="text-[12px] text-ink-400">
          {homepage.blocks.length} block{homepage.blocks.length !== 1 ? "s" : ""} on this page
        </span>
        {homepage.blocks.length > 0 && (
          <>
            <span className="text-ink-200">·</span>
            <span className="text-[12px] text-ink-400">
              {homepage.blocks.map((b) => BLOCK_DEFINITIONS[b.type]?.label || b.type).join(", ")}
            </span>
          </>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* ── Row 1: Templates + Page Structure side by side ── */}
        <div className="grid lg:grid-cols-[260px_1fr] gap-5 items-start mb-6">
          {/* Templates */}
          <div className="lg:sticky lg:top-[88px]">
            <PanelHeader title="Templates" />
            <TemplateSidebarPanel templates={TEMPLATES} onApply={applyTemplate} />
          </div>

          {/* Page Structure */}
          <div>
            <PanelHeader title="Page structure" />
            <PageStructurePanel
              blocks={homepage.blocks}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onDuplicate={duplicateBlock}
              onDelete={deleteBlock}
            />
          </div>
        </div>

        {/* ── Row 2: Block Settings, full width, no inner scroll ── */}
        <div className="mb-6">
          <PanelHeader title="Block settings" />
          <BlockSettingsPanel block={selectedBlock} onUpdate={updateBlockData} fullWidth />
        </div>

        {/* ── Row 3: Live Preview (always visible, full width) ── */}
        <div>
          <PanelHeader title="Preview" />
          <div className="rounded-xl border border-border bg-white shadow-soft overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-gray-50/60">
              <span className="text-[12px] font-semibold text-ink-500 uppercase tracking-wide">Live Preview</span>
              <span className="text-[11.5px] text-ink-400">Updates automatically as you edit</span>
            </div>
            <div className="overflow-auto" style={{ maxHeight: "70vh" }}>
              <LivePreviewPanel blocks={homepage.blocks} inline onUpdateBlock={updateBlockData} />
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeLibType && (
            <div className="rounded-lg border border-primary bg-white px-3 py-2.5 shadow-lift text-[12.5px] font-semibold text-ink-900 flex items-center gap-2">
              {BLOCK_DEFINITIONS[activeLibType]?.label}
            </div>
          )}
          {activeBlock && (
            <SortableBlockItem block={activeBlock} selected onSelect={() => {}} onDuplicate={() => {}} onDelete={() => {}} />
          )}
        </DragOverlay>
      </DndContext>

      {/* Template Library Modal */}
      {templateOpen && (
        <TemplateModal templates={TEMPLATES} onApply={applyTemplate} onClose={() => setTemplateOpen(false)} />
      )}
    </div>
  );
}

function PanelHeader({ title }) {
  return <h3 className="text-[12.5px] font-semibold text-ink-500 uppercase tracking-wide mb-2.5 px-0.5">{title}</h3>;
}

function IconButton({ icon: Icon, onClick, disabled, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="h-9 w-9 flex items-center justify-center rounded-lg border border-border text-ink-500 hover:bg-surface-soft hover:text-ink-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
    >
      <Icon size={16} />
    </button>
  );
}

function SaveStatus({ status }) {
  if (status === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-[12.5px] text-ink-400 mr-1">
        <Loader2 size={13} className="animate-spin" /> Saving…
      </span>
    );
  }
  if (status === "saved") {
    return (
      <span className="flex items-center gap-1.5 text-[12.5px] text-emerald-600 mr-1">
        <Check size={13} /> All changes saved
      </span>
    );
  }
  return null;
}

const TEMPLATE_TAGS = {
  "newspaper-editorial": { badge: "Template 1", color: "amber" },
  "modern-magazine": { badge: "Template 2", color: "blue" },
  "dark-news": { badge: "Template 3", color: "slate" },
  "masonry-editorial": { badge: "Template 4", color: "rose" },
};

const BADGE_COLOR_CLASSES = {
  amber: "bg-amber-500",
  blue: "bg-primary",
  slate: "bg-slate-700",
  rose: "bg-rose-600",
};

const CARD_BORDER_CLASSES = {
  amber: "border-amber-300 bg-amber-50/40",
  blue: "border-primary-200 bg-primary-50/30",
  slate: "border-slate-300 bg-slate-50/50",
  rose: "border-rose-200 bg-rose-50/30",
};

function TemplateSidebarPanel({ templates, onApply }) {
  return (
    <div className="space-y-2.5">
      {templates.map((t) => {
        const tag = TEMPLATE_TAGS[t.id];
        const def = BLOCK_DEFINITIONS[t.blocks[0]?.type];
        const Icon = def?.icon;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onApply(t)}
            title={t.description}
            className={`w-full text-left border rounded-xl p-3 hover:border-primary hover:bg-primary-50/30 transition-colors group relative ${tag ? CARD_BORDER_CLASSES[tag.color] : "border-border"}`}
          >
            {tag && (
              <span className={`absolute top-2.5 right-2.5 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full ${BADGE_COLOR_CLASSES[tag.color]}`}>{tag.badge}</span>
            )}
            <div className="flex items-center gap-2 mb-1.5 pr-14">
              {Icon && (
                <div className="h-6 w-6 rounded-md bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <Icon size={12} />
                </div>
              )}
              <p className="text-[12.5px] font-bold text-ink-900 group-hover:text-primary transition-colors leading-tight">{t.name}</p>
            </div>
            <p className="text-[11px] text-ink-500 leading-snug line-clamp-2">{t.description}</p>
          </button>
        );
      })}
    </div>
  );
}

function TemplateModal({ templates, onApply, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-ink-900/50 flex items-center justify-center p-4" style={{ backdropFilter: "blur(2px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h3 className="text-[15px] font-bold text-ink-900">Template Library</h3>
            <p className="text-[12px] text-ink-500 mt-0.5">Choose a preset layout to get started. Your current blocks will be replaced.</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-gray-100 transition-colors">
            <X size={17} />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 gap-4 overflow-y-auto">
          {templates.map((t) => {
            const tag = TEMPLATE_TAGS[t.id];
            return (
              <div
                key={t.id}
                className={`border rounded-xl p-4 hover:border-primary hover:bg-primary-50/30 transition-colors group cursor-pointer relative ${tag ? CARD_BORDER_CLASSES[tag.color] : "border-border"}`}
                onClick={() => onApply(t)}
              >
                {tag && (
                  <span className={`absolute top-3 right-3 text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${BADGE_COLOR_CLASSES[tag.color]}`}>{tag.badge}</span>
                )}
                <div className="flex items-center gap-2 mb-2 pr-20">
                  {t.blocks.map((b, i) => {
                    const def = BLOCK_DEFINITIONS[b.type];
                    if (!def) return null;
                    const Icon = def.icon;
                    return (
                      <div key={i} className="h-7 w-7 rounded-md bg-primary-50 text-primary flex items-center justify-center shrink-0">
                        <Icon size={13} />
                      </div>
                    );
                  })}
                </div>
                <p className="text-[13.5px] font-bold text-ink-900 group-hover:text-primary transition-colors">{t.name}</p>
                <p className="text-[12px] text-ink-500 mt-0.5 leading-snug">{t.description}</p>
                <button className="mt-3 px-4 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Use Template
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
