// components/homepage-builder/HomepageBuilder.jsx
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import { Save, Check, Loader2, Undo2, Redo2, X, LayoutTemplate, Layers, Sparkles } from "lucide-react";

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

  // The homepage only ever holds a single block (one of the four full-page
  // templates below). Adding a block — whether via the library drag/drop or
  // any other entry point — always replaces whatever is currently on the
  // page rather than appending to it, so there's no way to end up with more
  // than one block stacked on the homepage.
  function addBlock(type) {
    const block = createBlock(type);
    commitBlocks([block]);
    setSelectedId(block.id);
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

    // Only one block on the homepage at a time — applying a template always
    // replaces the current block(s) with just this template's single block.
    commitBlocks(blocks.slice(0, 1));
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
      addBlock(type);
      return;
    }

    // With only ever one block present, there's nothing left to reorder.
  }

  if (loading || !homepage) {
    return (
      <div className="p-4 lg:p-6 max-w-[1400px] mx-auto space-y-6">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  const selectedBlock = homepage.blocks.find((b) => b.id === selectedId) || null;
  const activeLibType = activeDragId && String(activeDragId).startsWith("lib-") ? activeDragId.replace("lib-", "") : null;
  const activeBlock = activeDragId ? homepage.blocks.find((b) => b.id === activeDragId) : null;

  // Purely derived (never stored): tells the template strip which card, if
  // any, matches the page's current single mega-block exactly, so the
  // "active" checkmark always reflects reality — including right after a
  // fresh page load — instead of drifting out of sync with a separate
  // piece of local state.
  const activeTemplateId =
    homepage.blocks.length === 1
      ? TEMPLATES.find((t) => t.blocks[0]?.type === homepage.blocks[0].type)?.id ?? null
      : null;

  return (
    <div className="p-4 lg:p-6 max-w-[1400px] mx-auto">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-glow shrink-0">
            <LayoutTemplate size={18} />
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-ink-900 leading-tight">Homepage Builder</h2>
            <p className="text-[12.5px] text-ink-500 mt-0.5">Pick a template to design your homepage layout — no code required.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SaveStatus status={status} />
          <div className="flex items-center rounded-lg border border-border overflow-hidden divide-x divide-border">
            <IconButton icon={Undo2} onClick={undo} disabled={history.length === 0} title="Undo (Ctrl+Z)" bare />
            <IconButton icon={Redo2} onClick={redo} disabled={future.length === 0} title="Redo (Ctrl+Y)" bare />
          </div>
          <button
            onClick={() => setTemplateOpen(true)}
            className="h-9 flex items-center gap-1.5 px-3 rounded-lg border border-border text-ink-600 hover:bg-surface-soft hover:border-ink-200 text-[13px] font-medium transition-colors"
          >
            <LayoutTemplate size={14} />
            Templates
          </button>
          <Button icon={Save} onClick={() => saveNow(homepage)}>
            Save Page
          </Button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* ── Layout templates ──────────────────────────────────────── */}
        <SectionCard
          title="Select Homepage Template"
          subtitle="Choose a starting layout — every section stays fully customizable afterward."
          right={
            <button
              onClick={() => setTemplateOpen(true)}
              className="text-[12px] font-semibold text-primary hover:text-primary-600 hover:underline shrink-0"
            >
              View all
            </button>
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TEMPLATES.map((t) => (
              <TemplateCard key={t.id} template={t} active={activeTemplateId === t.id} onApply={applyTemplate} />
            ))}
          </div>
        </SectionCard>

        {/* ── Page structure / homepage sections ───────────────────── */}
        {/* <SectionCard
          title="Homepage Sections"
          subtitle={
            homepage.blocks.length > 0
              ? homepage.blocks.map((b) => BLOCK_DEFINITIONS[b.type]?.label || b.type).join(" · ")
              : "Apply a template above to start building your homepage."
          }
          right={
            <span className="flex items-center gap-1.5 shrink-0 h-6 px-2.5 rounded-full bg-surface-soft border border-border text-[11px] font-semibold text-ink-500">
              <Layers size={11} />
              {homepage.blocks.length} block{homepage.blocks.length !== 1 ? "s" : ""}
            </span>
          }
          bodyClassName="p-3"
        >
          <PageStructurePanel
            blocks={homepage.blocks}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </SectionCard> */}

        {/* ── Block settings ────────────────────────────────────────── */}
        <div className="mb-6">
          <PanelHeader title="Block settings" />
          <BlockSettingsPanel block={selectedBlock} onUpdate={updateBlockData} fullWidth />
        </div>

        {/* ── Live preview ──────────────────────────────────────────── */}
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
            <SortableBlockItem block={activeBlock} selected onSelect={() => {}} />
          )}
        </DragOverlay>
      </DndContext>

      {/* Template Library Modal */}
      {templateOpen && (
        <TemplateModal templates={TEMPLATES} activeTemplateId={activeTemplateId} onApply={applyTemplate} onClose={() => setTemplateOpen(false)} />
      )}
    </div>
  );
}

// ─── Shared building blocks ──────────────────────────────────────────────────

/** Consistent white "card" wrapper used for every major section of the page
 *  (templates strip, homepage sections list, etc.) so the whole builder
 *  reads as one coherent design system instead of a stack of ad-hoc panels. */
function SectionCard({ title, subtitle, right, children, bodyClassName = "p-5" }) {
  return (
    <section className="mb-6 rounded-2xl border border-border bg-white shadow-soft overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border bg-gray-50/50">
        <div className="min-w-0">
          <h3 className="text-[13.5px] font-bold text-ink-900">{title}</h3>
          {subtitle && <p className="text-[11.5px] text-ink-500 mt-0.5 truncate">{subtitle}</p>}
        </div>
        {right}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

function PanelHeader({ title }) {
  return <h3 className="text-[12.5px] font-semibold text-ink-500 uppercase tracking-wide mb-2.5 px-0.5">{title}</h3>;
}

function IconButton({ icon: Icon, onClick, disabled, title, bare = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`h-9 w-9 flex items-center justify-center text-ink-500 hover:bg-surface-soft hover:text-ink-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors ${
        bare ? "" : "rounded-lg border border-border"
      }`}
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

const THUMB_TINT = {
  amber: { strong: "bg-amber-300", soft: "bg-amber-100" },
  blue: { strong: "bg-primary-200", soft: "bg-primary-100" },
  slate: { strong: "bg-slate-500", soft: "bg-slate-300" },
  rose: { strong: "bg-rose-200", soft: "bg-rose-100" },
};

/** Small, purely-decorative wireframe mockup that hints at each template's
 *  actual structure (columns, hero, grid, masonry) so the picker feels like
 *  a real layout gallery rather than an icon + label list. */
function TemplateThumbnail({ templateId, accent }) {
  const tint = THUMB_TINT[accent] || { strong: "bg-ink-200", soft: "bg-ink-100" };

  if (templateId === "newspaper-editorial") {
    return (
      <div className="h-24 w-full rounded-lg border border-border bg-white p-2 flex flex-col gap-1.5">
        <div className="h-1.5 w-2/5 rounded-full bg-ink-800" />
        <div className="flex-1 flex gap-1.5">
          <div className="w-1/4 flex flex-col justify-between gap-1">
            <div className="h-1.5 rounded-full bg-ink-200" />
            <div className="h-1.5 rounded-full bg-ink-200" />
            <div className="h-1.5 w-2/3 rounded-full bg-ink-200" />
          </div>
          <div className={`w-1/2 rounded-md ${tint.strong} flex items-end p-1`}>
            <div className="h-1.5 w-3/4 rounded-full bg-white/70" />
          </div>
          <div className="w-1/4 flex flex-col justify-between gap-1">
            <div className="h-1.5 rounded-full bg-ink-200" />
            <div className="h-1.5 w-2/3 rounded-full bg-ink-200" />
            <div className="h-1.5 rounded-full bg-ink-200" />
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "modern-magazine") {
    return (
      <div className="h-24 w-full rounded-lg border border-border bg-white p-2 flex flex-col gap-1.5">
        <div className="flex-1 flex gap-1.5">
          <div className={`w-3/5 rounded-md ${tint.strong}`} />
          <div className="w-2/5 flex flex-col gap-1.5">
            <div className={`flex-1 rounded-md ${tint.soft}`} />
            <div className={`flex-1 rounded-md ${tint.soft}`} />
          </div>
        </div>
        <div className="flex gap-1.5 h-6 shrink-0">
          <div className="flex-1 rounded-md bg-ink-100" />
          <div className="flex-1 rounded-md bg-ink-100" />
          <div className="flex-1 rounded-md bg-ink-100" />
        </div>
      </div>
    );
  }

  if (templateId === "dark-news") {
    return (
      <div className="h-24 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 flex flex-col gap-1.5">
        <div className="flex-1 rounded-md bg-slate-700/70 relative overflow-hidden">
          <div className="absolute bottom-1.5 left-1.5 h-1.5 w-1/2 rounded-full bg-slate-300/70" />
        </div>
        <div className="flex gap-1.5 h-6 shrink-0">
          <div className="flex-1 rounded-md bg-slate-800 border border-slate-700" />
          <div className="flex-1 rounded-md bg-slate-800 border border-slate-700" />
          <div className="flex-1 rounded-md bg-slate-800 border border-slate-700" />
        </div>
      </div>
    );
  }

  if (templateId === "masonry-editorial") {
    return (
      <div className="h-24 w-full rounded-lg border border-border bg-white p-2 flex gap-1.5">
        <div className="w-1/3 flex flex-col gap-1.5">
          <div className={`h-10 rounded-md ${tint.strong}`} />
          <div className="flex-1 rounded-md bg-ink-100" />
        </div>
        <div className="w-1/3 flex flex-col gap-1.5">
          <div className="flex-1 rounded-md bg-ink-100" />
          <div className={`h-10 rounded-md ${tint.soft}`} />
        </div>
        <div className="w-1/3 flex flex-col gap-1.5">
          <div className={`h-7 rounded-md ${tint.strong}`} />
          <div className="flex-1 rounded-md bg-ink-100" />
        </div>
      </div>
    );
  }

  return <div className="h-24 w-full rounded-lg border border-border bg-ink-50" />;
}

function TemplateCard({ template, active, onApply, compact = false }) {
  const tag = TEMPLATE_TAGS[template.id];
  return (
    <button
      type="button"
      onClick={() => onApply(template)}
      title={template.description}
      className={`group text-left rounded-xl border-2 p-2.5 bg-white transition-all hover:shadow-md ${
        active ? "border-primary ring-2 ring-primary/15" : "border-border hover:border-primary/40"
      }`}
    >
      <div className="relative mb-2.5">
        <TemplateThumbnail templateId={template.id} accent={tag?.color} />
        {tag && (
          <span className={`absolute top-1.5 left-1.5 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full ${BADGE_COLOR_CLASSES[tag.color]}`}>
            {tag.badge}
          </span>
        )}
        {active && (
          <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center shadow-soft ring-2 ring-white">
            <Check size={11} strokeWidth={3} />
          </span>
        )}
      </div>
      <p className="text-[12.5px] font-bold text-ink-900 group-hover:text-primary transition-colors leading-tight">{template.name}</p>
      {!compact && <p className="text-[11px] text-ink-500 mt-1 leading-snug line-clamp-2">{template.description}</p>}
    </button>
  );
}

function TemplateModal({ templates, activeTemplateId, onApply, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-ink-900/50 flex items-center justify-center p-4" style={{ backdropFilter: "blur(2px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-ink-900">Template Library</h3>
              <p className="text-[12px] text-ink-500 mt-0.5">Choose a preset layout to get started. Your current blocks will be replaced.</p>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-gray-100 transition-colors">
            <X size={17} />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto">
          {templates.map((t) => (
            <TemplateCard key={t.id} template={t} active={activeTemplateId === t.id} onApply={onApply} />
          ))}
        </div>
      </div>
    </div>
  );
}