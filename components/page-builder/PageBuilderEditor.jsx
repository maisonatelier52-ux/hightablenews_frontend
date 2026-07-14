"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { ArrowLeft, Save, Eye, ChevronDown, Loader2, CheckCircle2, Palette } from "lucide-react";
import { pagesApi } from "@/apis/adminApis";
import { useToast } from "@/components/ui/Toast";
import { PAGE_LAYOUTS, FONT_CHOICES, createPageBlock } from "@/lib/pageBlockDefinitions";
import PageBlockLibraryPanel from "./PageBlockLibraryPanel";
import SidebarWidgetLibraryPanel from "./SidebarWidgetLibraryPanel";
import SortablePageBlockItem from "./SortablePageBlockItem";
import PageBlockSettingsPanel from "./PageBlockSettingsPanel";
import PagePreviewModal from "./PagePreviewModal";
import ImageUploadField from "./ImageUploadField";

const EMPTY_PAGE = {
  title: "",
  slug: "",
  status: "draft",
  layout: "boxed",
  blocks: [],
  sidebarBlocks: [],
  design: { headingFontFamily: "", bodyFontFamily: "", primaryColor: "", backgroundColor: "" },
  seo: { metaTitle: "", metaDescription: "", ogImage: "", noIndex: false },
};

export default function PageBuilderEditor({ pageId }) {
  const router = useRouter();
  const isNew = pageId === "new";
  const { showToast } = useToast();

  const [page, setPage] = useState(EMPTY_PAGE);
  const [id, setId] = useState(isNew ? null : pageId);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saved
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [showSeo, setShowSeo] = useState(false);
  const [showDesign, setShowDesign] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const res = await pagesApi.getById(pageId);
        const data = res?.data || res;
        setPage({ ...EMPTY_PAGE, ...data, seo: { ...EMPTY_PAGE.seo, ...(data.seo || {}) }, design: { ...EMPTY_PAGE.design, ...(data.design || {}) } });
        setId(data._id);
      } finally {
        setLoading(false);
      }
    })();
  }, [pageId, isNew]);

  // NOTE: this builder intentionally has NO autosave — changes only persist
  // to MongoDB when the admin clicks "Save".
  function update(patch) {
    setPage((prev) => ({ ...prev, ...patch }));
    setSaveStatus("idle");
  }

  async function handleSave() {
    if (!page.title.trim()) {
      showToast("Please enter a page title before saving", { type: "error" });
      return;
    }
    setSaving(true);
    try {
      if (!id) {
        const created = await pagesApi.create(page);
        const newId = created?.data?._id || created?._id;
        setId(newId);
        router.replace(`/admin/pages/${newId}`);
      } else {
        await pagesApi.update(id, page);
      }
      setSaveStatus("saved");
      showToast("Page saved", { type: "success" });
    } catch (err) {
      showToast("Couldn't save this page", { type: "error" });
    } finally {
      setSaving(false);
    }
  }

  // ── Main content blocks ────────────────────────────────────────────────
  function addBlock(type) {
    const block = createPageBlock(type);
    update({ blocks: [...page.blocks, block] });
    setSelectedBlockId(block.id);
  }

  function updateBlock(blockId, data) {
    if (page.blocks.some((b) => b.id === blockId)) {
      update({ blocks: page.blocks.map((b) => (b.id === blockId ? { ...b, data } : b)) });
    } else {
      update({ sidebarBlocks: page.sidebarBlocks.map((b) => (b.id === blockId ? { ...b, data } : b)) });
    }
  }

  function duplicateBlock(blockId) {
    const idx = page.blocks.findIndex((b) => b.id === blockId);
    if (idx === -1) return duplicateSidebarBlock(blockId);
    const copy = { ...page.blocks[idx], id: `${page.blocks[idx].type}_${Date.now().toString(36)}` };
    const next = [...page.blocks];
    next.splice(idx + 1, 0, copy);
    update({ blocks: next });
  }

  function deleteBlock(blockId) {
    if (page.blocks.some((b) => b.id === blockId)) {
      update({ blocks: page.blocks.filter((b) => b.id !== blockId) });
    } else {
      update({ sidebarBlocks: page.sidebarBlocks.filter((b) => b.id !== blockId) });
    }
    if (selectedBlockId === blockId) setSelectedBlockId(null);
  }

  // ── Sidebar widgets ────────────────────────────────────────────────────
  function addSidebarBlock(type) {
    const block = createPageBlock(type);
    update({ sidebarBlocks: [...(page.sidebarBlocks || []), block] });
    setSelectedBlockId(block.id);
  }

  function duplicateSidebarBlock(blockId) {
    const idx = page.sidebarBlocks.findIndex((b) => b.id === blockId);
    if (idx === -1) return;
    const copy = { ...page.sidebarBlocks[idx], id: `${page.sidebarBlocks[idx].type}_${Date.now().toString(36)}` };
    const next = [...page.sidebarBlocks];
    next.splice(idx + 1, 0, copy);
    update({ sidebarBlocks: next });
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    if (page.blocks.some((b) => b.id === active.id)) {
      const oldIndex = page.blocks.findIndex((b) => b.id === active.id);
      const newIndex = page.blocks.findIndex((b) => b.id === over.id);
      if (newIndex === -1) return;
      update({ blocks: arrayMove(page.blocks, oldIndex, newIndex) });
    } else {
      const oldIndex = page.sidebarBlocks.findIndex((b) => b.id === active.id);
      const newIndex = page.sidebarBlocks.findIndex((b) => b.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      update({ sidebarBlocks: arrayMove(page.sidebarBlocks, oldIndex, newIndex) });
    }
  }

  const hasSidebar = page.layout === "sidebar-left" || page.layout === "sidebar-right";
  const selectedBlock =
    page.blocks.find((b) => b.id === selectedBlockId) ||
    (page.sidebarBlocks || []).find((b) => b.id === selectedBlockId) ||
    null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-ink-400">
        <Loader2 className="animate-spin mr-2" size={18} /> Loading page…
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => router.push("/admin/pages")}
          className="h-9 w-9 flex items-center justify-center rounded-lg border border-border text-ink-500 hover:bg-gray-50 shrink-0"
        >
          <ArrowLeft size={16} />
        </button>
        <label className="flex-1 min-w-[200px]">
          <span className="block text-[10.5px] font-semibold uppercase tracking-wide text-ink-400 mb-0.5">
            Page title <span className="text-red-500">*</span>
          </span>
          <input
            value={page.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Untitled page"
            required
            className="w-full text-[20px] font-bold text-ink-900 focus:outline-none border-b-2 border-transparent focus:border-primary/40 py-1 bg-transparent"
          />
        </label>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11.5px] text-ink-400 hidden sm:flex items-center gap-1">
            {saveStatus === "saved" && !saving && (<><CheckCircle2 size={12} className="text-emerald-500" /> Saved</>)}
            {saveStatus === "idle" && !saving && page.title && (<span className="text-amber-600">Unsaved changes</span>)}
          </span>
          <select
            value={page.status}
            onChange={(e) => update({ status: e.target.value })}
            className="text-[12.5px] font-medium rounded-lg border border-border px-2.5 py-2 focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 h-9 rounded-lg border border-border px-3 text-[12.5px] font-semibold text-ink-600 hover:bg-gray-50"
            title="Preview this page"
          >
            <Eye size={14} /> Preview
          </button>
          {page.status === "published" && page.slug && (
            <a
              href={`/page/${page.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-border text-ink-500 hover:bg-gray-50"
              title="View live page"
            >
              <Eye size={15} />
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-primary text-white px-4 py-2 text-[13px] font-semibold hover:bg-primary-600 transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
          </button>
        </div>
      </div>

      {/* Page settings: slug, layout, design, SEO */}
      <div className="rounded-card border border-border bg-white shadow-soft p-4 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[11.5px] font-medium text-ink-600 mb-1 block">URL slug</span>
            <div className="flex items-center rounded-lg border border-border overflow-hidden">
              <span className="px-2.5 text-[12.5px] text-ink-400 bg-gray-50 border-r border-border py-2">/page/</span>
              <input
                value={page.slug}
                onChange={(e) => update({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                placeholder="auto-generated-from-title"
                className="flex-1 px-2.5 py-2 text-[13px] focus:outline-none"
              />
            </div>
          </label>
          <label className="block">
            <span className="text-[11.5px] font-medium text-ink-600 mb-1 block">Layout</span>
            <select
              value={page.layout}
              onChange={(e) => update({ layout: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 text-[13px] focus:outline-none"
            >
              {PAGE_LAYOUTS.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowDesign((v) => !v)}
            className="flex items-center gap-1.5 text-[12.5px] font-semibold text-primary"
          >
            <Palette size={13} /> Design (fonts &amp; colors) <ChevronDown size={14} className={`transition-transform ${showDesign ? "rotate-180" : ""}`} />
          </button>
          <button
            onClick={() => setShowSeo((v) => !v)}
            className="flex items-center gap-1.5 text-[12.5px] font-semibold text-primary"
          >
            SEO settings <ChevronDown size={14} className={`transition-transform ${showSeo ? "rotate-180" : ""}`} />
          </button>
        </div>

        {showDesign && (
          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            <label className="block">
              <span className="text-[11.5px] font-medium text-ink-600 mb-1 block">Heading font</span>
              <select
                value={page.design?.headingFontFamily || ""}
                onChange={(e) => update({ design: { ...page.design, headingFontFamily: e.target.value } })}
                className="w-full rounded-lg border border-border px-3 py-2 text-[13px] focus:outline-none"
              >
                {FONT_CHOICES.map((f) => (<option key={f.value} value={f.value}>{f.label}</option>))}
              </select>
            </label>
            <label className="block">
              <span className="text-[11.5px] font-medium text-ink-600 mb-1 block">Body font</span>
              <select
                value={page.design?.bodyFontFamily || ""}
                onChange={(e) => update({ design: { ...page.design, bodyFontFamily: e.target.value } })}
                className="w-full rounded-lg border border-border px-3 py-2 text-[13px] focus:outline-none"
              >
                {FONT_CHOICES.map((f) => (<option key={f.value} value={f.value}>{f.label}</option>))}
              </select>
            </label>
            <label className="block">
              <span className="text-[11.5px] font-medium text-ink-600 mb-1 block">Primary / accent color</span>
              <div className="flex items-center gap-2">
                <input type="color" value={page.design?.primaryColor || "#8a1c22"} onChange={(e) => update({ design: { ...page.design, primaryColor: e.target.value } })} className="h-9 w-9 rounded-md border border-border cursor-pointer" />
                <input value={page.design?.primaryColor || ""} onChange={(e) => update({ design: { ...page.design, primaryColor: e.target.value } })} placeholder="Used as fallback icon/number color" className="flex-1 rounded-lg border border-border px-3 py-2 text-[13px] focus:outline-none" />
              </div>
            </label>
            <label className="block">
              <span className="text-[11.5px] font-medium text-ink-600 mb-1 block">Page background color</span>
              <div className="flex items-center gap-2">
                <input type="color" value={page.design?.backgroundColor || "#ffffff"} onChange={(e) => update({ design: { ...page.design, backgroundColor: e.target.value } })} className="h-9 w-9 rounded-md border border-border cursor-pointer" />
                <input value={page.design?.backgroundColor || ""} onChange={(e) => update({ design: { ...page.design, backgroundColor: e.target.value } })} placeholder="Leave blank for white" className="flex-1 rounded-lg border border-border px-3 py-2 text-[13px] focus:outline-none" />
              </div>
            </label>
            <p className="sm:col-span-2 text-[11.5px] text-ink-400">These are page-wide defaults. Any block with its own font/color setting will override them.</p>
          </div>
        )}

        {showSeo && (
          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            <label className="block">
              <span className="text-[11.5px] font-medium text-ink-600 mb-1 block">Meta title</span>
              <input
                value={page.seo.metaTitle}
                onChange={(e) => update({ seo: { ...page.seo, metaTitle: e.target.value } })}
                className="w-full rounded-lg border border-border px-3 py-2 text-[13px] focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[11.5px] font-medium text-ink-600 mb-1 block">Meta description</span>
              <input
                value={page.seo.metaDescription}
                onChange={(e) => update({ seo: { ...page.seo, metaDescription: e.target.value } })}
                className="w-full rounded-lg border border-border px-3 py-2 text-[13px] focus:outline-none"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[11.5px] font-medium text-ink-600 mb-1 block">Social share image</span>
              <div className="max-w-xs">
                <ImageUploadField value={page.seo.ogImage} onChange={(v) => update({ seo: { ...page.seo, ogImage: v } })} aspect="aspect-video" />
              </div>
            </label>
            <label className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                checked={page.seo.noIndex}
                onChange={(e) => update({ seo: { ...page.seo, noIndex: e.target.checked } })}
              />
              <span className="text-[12.5px] text-ink-600">Hide from search engines (noindex) &amp; sitemap</span>
            </label>
          </div>
        )}
      </div>

      {/* Builder: library | blocks | settings */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid lg:grid-cols-[280px_1fr_320px] gap-4 items-start">
          <div className="lg:sticky lg:top-4 space-y-4">
            <PageBlockLibraryPanel onAddBlock={addBlock} />
            {hasSidebar && <SidebarWidgetLibraryPanel onAddWidget={addSidebarBlock} />}
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Main content</p>
            {page.blocks.length === 0 && (
              <div className="rounded-card border border-dashed border-border bg-white p-10 text-center text-ink-400 text-[13px]">
                No blocks yet — add one from the library on the left to start building this page.
              </div>
            )}
            <SortableContext items={page.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              {page.blocks.map((block) => (
                <SortablePageBlockItem
                  key={block.id}
                  block={block}
                  selected={selectedBlockId === block.id}
                  onSelect={setSelectedBlockId}
                  onDuplicate={duplicateBlock}
                  onDelete={deleteBlock}
                />
              ))}
            </SortableContext>

            {hasSidebar && (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400 pt-4">Sidebar widgets</p>
                {(page.sidebarBlocks || []).length === 0 && (
                  <div className="rounded-card border border-dashed border-border bg-white p-6 text-center text-ink-400 text-[12.5px]">
                    No sidebar widgets yet — add one from the library on the left.
                  </div>
                )}
                <SortableContext items={(page.sidebarBlocks || []).map((b) => b.id)} strategy={verticalListSortingStrategy}>
                  {(page.sidebarBlocks || []).map((block) => (
                    <SortablePageBlockItem
                      key={block.id}
                      block={block}
                      selected={selectedBlockId === block.id}
                      onSelect={setSelectedBlockId}
                      onDuplicate={duplicateBlock}
                      onDelete={deleteBlock}
                    />
                  ))}
                </SortableContext>
              </>
            )}
          </div>

          <div className="lg:sticky lg:top-4">
            <PageBlockSettingsPanel block={selectedBlock} onUpdate={updateBlock} />
          </div>
        </div>
      </DndContext>

      {showPreview && <PagePreviewModal page={page} onClose={() => setShowPreview(false)} />}
    </div>
  );
}
