"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Check, Loader2, LayoutTemplate, Sparkles, Eye } from "lucide-react";

import { getCategoryPageConfigAdmin as getCategoryPageConfig, saveCategoryPageConfig } from "@/lib/categoryPageApi";
import { getCategories, preloadCategoriesAndArticlesAdmin, onDataChange } from "@/lib/categoriesArticlesApi";
import { preloadAuthorsAdmin, onAuthorsChange } from "@/lib/authorsApi";
import { CATEGORY_TEMPLATES } from "@/lib/blockDefinitions";
import { useAutoSave } from "@/lib/useAutoSave";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import DeviceToggle from "@/components/ui/DeviceToggle";
import CategoryBlockSettingsPanel from "./CategoryBlockSettingsPanel";
import CategoryLivePreview from "./CategoryLivePreview";

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

export default function CategoryPageBuilder() {
  const [config, setConfig] = useState(null);
  const [categories, setCategories] = useState([]);
  const [previewCategoryId, setPreviewCategoryId] = useState("");
  const [device, setDevice] = useState("desktop");
  const [loading, setLoading] = useState(true);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  const { status, trigger, saveNow } = useAutoSave(saveCategoryPageConfig, { toastMessage: "Category page layout saved" });

  useEffect(() => {
    getCategoryPageConfig().then((data) => {
      setConfig(data);
      setLoading(false);
    });
    const cats = getCategories();
    setCategories(cats);
    setPreviewCategoryId((prev) => prev || cats[0]?._id || "");

    // The live preview reads articles/categories synchronously from a
    // shared cache populated by a background fetch elsewhere. That fetch
    // may still be in flight when this component first mounts, so without
    // this subscription the preview (and this category dropdown) could get
    // stuck showing nothing/stale data. Re-sync the moment it arrives.
    preloadCategoriesAndArticlesAdmin().catch(() => {});
    preloadAuthorsAdmin().catch(() => {});
    const unsubData = onDataChange(() => {
      const fresh = getCategories();
      setCategories(fresh);
      setPreviewCategoryId((prev) => prev || fresh[0]?._id || "");
    });
    const unsubAuthors = onAuthorsChange(() => setCategories((c) => [...c]));
    return () => {
      unsubData();
      unsubAuthors();
    };
  }, []);

  const updateActiveBlockData = useCallback(
    (next) => {
      setConfig((prev) => {
        const updated = {
          ...prev,
          blocksByTemplate: { ...prev.blocksByTemplate, [prev.templateId]: next },
        };
        trigger(updated);
        return updated;
      });
    },
    [trigger]
  );

  function selectTemplate(templateId) {
    setConfig((prev) => {
      const updated = { ...prev, templateId };
      trigger(updated);
      return updated;
    });
    setTemplateModalOpen(false);
  }

  if (loading || !config) {
    return (
      <div className="p-6 space-y-5">
        <Skeleton className="h-14 w-full" />
        <div className="grid lg:grid-cols-[340px_1fr] gap-5">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const activeData = config.blocksByTemplate[config.templateId];
  const previewCategory = categories.find((c) => c._id === previewCategoryId) || null;

  return (
    <div className="p-4 lg:p-6 max-w-[1400px] mx-auto">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-glow shrink-0">
            <LayoutTemplate size={18} />
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-ink-900 leading-tight">Category Page Builder</h2>
            <p className="text-[12.5px] text-ink-500 mt-0.5">
              Choose one layout — it's used for every category on the site (Business, Power, Technology, etc.).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SaveStatus status={status} />
          {/* <button
            onClick={() => setTemplateModalOpen(true)}
            className="h-9 flex items-center gap-1.5 px-3 rounded-lg border border-border text-ink-600 hover:bg-surface-soft hover:border-ink-200 text-[13px] font-medium transition-colors"
          >
            <LayoutTemplate size={14} />
            Templates
          </button> */}
          <Button icon={Save} onClick={() => saveNow(config)}>
            Save Layout
          </Button>
        </div>
      </div>

      {/* ── Layout templates ───────────────────────────────────────── */}
      <SectionCard
        title="Select Category Page Template"
        subtitle="Choose a layout — it applies to every category on the site. Each template keeps its own settings."
        right={
          <button
            onClick={() => setTemplateModalOpen(true)}
            className="text-[12px] font-semibold text-primary hover:text-primary-600 hover:underline shrink-0"
          >
            View all
          </button>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORY_TEMPLATES.map((t) => (
            <TemplateCard key={t.id} template={t} active={config.templateId === t.id} onApply={(tpl) => selectTemplate(tpl.id)} />
          ))}
        </div>
      </SectionCard>

      {/* ── Block settings ────────────────────────────────────────── */}
      <div className="mb-6">
        <PanelHeader title="Block settings" />
        <CategoryBlockSettingsPanel
          templateId={config.templateId}
          data={activeData}
          onUpdate={updateActiveBlockData}
        />
      </div>

      {/* ── Live preview ──────────────────────────────────────────── */}
      <div>
        <PanelHeader title="Preview" />
        <div className="rounded-xl border border-border bg-white shadow-soft overflow-hidden">
          <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border bg-gray-50/60 flex-wrap">
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-500 uppercase tracking-wide">
              <Eye size={12} />
              Live Preview
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <PreviewCategoryPicker
                categories={categories}
                value={previewCategoryId}
                onChange={setPreviewCategoryId}
              />
              <DeviceToggle device={device} onChange={setDevice} />
            </div>
          </div>
          <div className="overflow-auto bg-gray-100" style={{ maxHeight: "70vh" }}>
            <div className="flex justify-center py-6">
              <div
                className="bg-white shadow-md transition-all"
                style={{ width: device === "desktop" ? "100%" : device === "tablet" ? 420 : 300, maxWidth: "100%" }}
              >
                {categories.length === 0 ? (
                  <NoCategoriesNotice />
                ) : (
                  <CategoryLivePreview
                    templateId={config.templateId}
                    data={activeData}
                    category={previewCategory}
                    device={device}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {templateModalOpen && (
        <TemplateModal activeId={config.templateId} onApply={selectTemplate} onClose={() => setTemplateModalOpen(false)} />
      )}
    </div>
  );
}

// ─── Shared building blocks (mirrors Homepage Builder's design system) ──────

/** Consistent white "card" wrapper used for every major section of the page,
 *  matching the Homepage Builder so both builders read as one design system. */
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

const THUMB_TINT = {
  amber: { strong: "bg-amber-300", soft: "bg-amber-100" },
  blue: { strong: "bg-primary-200", soft: "bg-primary-100" },
  slate: { strong: "bg-slate-500", soft: "bg-slate-300" },
  rose: { strong: "bg-rose-200", soft: "bg-rose-100" },
};

/** Small, purely-decorative wireframe mockup that hints at each template's
 *  actual structure, so the picker feels like a real layout gallery rather
 *  than an icon + label list — same treatment as the Homepage Builder. */
function TemplateThumbnail({ templateId, accent }) {
  const tint = THUMB_TINT[accent] || { strong: "bg-ink-200", soft: "bg-ink-100" };

  if (templateId === "sticky-editorial") {
    return (
      <div className="h-24 w-full rounded-lg border border-border bg-white p-2 flex flex-col gap-1.5">
        <div className={`h-8 rounded-md ${tint.strong}`} />
        <div className="flex-1 flex gap-1.5">
          <div className="flex-1 flex flex-col gap-1">
            <div className="h-1.5 w-3/4 rounded-full bg-ink-200" />
            <div className="h-1.5 w-2/3 rounded-full bg-ink-200" />
            <div className="h-1.5 w-1/2 rounded-full bg-ink-200" />
          </div>
          <div className="w-1/4 flex flex-col gap-1">
            <div className={`flex-1 rounded-md ${tint.soft}`} />
            <div className="h-1.5 rounded-full bg-ink-100" />
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "grid-2col") {
    return (
      <div className="h-24 w-full rounded-lg border border-border bg-white p-2 grid grid-cols-2 gap-1.5">
        <div className={`rounded-md ${tint.strong}`} />
        <div className={`rounded-md ${tint.soft}`} />
        <div className={`rounded-md ${tint.soft}`} />
        <div className={`rounded-md ${tint.strong}`} />
      </div>
    );
  }

  if (templateId === "grid-3col") {
    return (
      <div className="h-24 w-full rounded-lg border border-border bg-white p-2 grid grid-cols-3 gap-1.5">
        <div className={`rounded-md ${tint.strong}`} />
        <div className={`rounded-md ${tint.soft}`} />
        <div className={`rounded-md ${tint.soft}`} />
        <div className={`rounded-md ${tint.soft}`} />
        <div className={`rounded-md ${tint.strong}`} />
        <div className={`rounded-md ${tint.soft}`} />
      </div>
    );
  }

  if (templateId === "carousel-magazine") {
    return (
      <div className="h-24 w-full rounded-lg border border-border bg-white p-2 flex flex-col gap-1.5">
        <div className={`flex-1 rounded-md ${tint.strong} relative overflow-hidden`}>
          <div className="absolute bottom-1.5 left-1.5 h-1.5 w-1/2 rounded-full bg-white/70" />
        </div>
        <div className="flex gap-1.5 h-6 shrink-0">
          <div className={`flex-1 rounded-md ${tint.soft}`} />
          <div className={`flex-1 rounded-md ${tint.soft}`} />
          <div className={`flex-1 rounded-md ${tint.soft}`} />
        </div>
      </div>
    );
  }

  return <div className="h-24 w-full rounded-lg border border-border bg-ink-50" />;
}

function TemplateCard({ template, active, onApply }) {
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
        <TemplateThumbnail templateId={template.id} accent={template.color} />
        <span className={`absolute top-1.5 left-1.5 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full ${BADGE_COLOR_CLASSES[template.color]}`}>
          {template.badge}
        </span>
        {active && (
          <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center shadow-soft ring-2 ring-white">
            <Check size={11} strokeWidth={3} />
          </span>
        )}
      </div>
      <p className="text-[12.5px] font-bold text-ink-900 group-hover:text-primary transition-colors leading-tight">{template.name}</p>
      <p className="text-[11px] text-ink-500 mt-1 leading-snug line-clamp-2">{template.description}</p>
    </button>
  );
}

function PreviewCategoryPicker({ categories, value, onChange }) {
  if (categories.length === 0) return null;
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-lg border border-border bg-white px-2.5 text-[12.5px] text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
    >
      {categories.map((c) => (
        <option key={c._id} value={c._id}>Preview: {c.name}</option>
      ))}
    </select>
  );
}

function NoCategoriesNotice() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <Sparkles size={22} className="text-ink-200 mb-2" />
      <p className="text-[13px] font-medium text-ink-500">No categories yet</p>
      <p className="text-[12px] text-ink-400 mt-1">Create a category on the Categories page to preview this layout with real content.</p>
    </div>
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

function TemplateModal({ activeId, onApply, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-ink-900/50 flex items-center justify-center p-4" style={{ backdropFilter: "blur(2px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h3 className="text-[15px] font-bold text-ink-900">Category Page Templates</h3>
            <p className="text-[12px] text-ink-500 mt-0.5">This layout applies to every category on the site. Switching keeps each template's own settings.</p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 gap-4 overflow-y-auto">
          {CATEGORY_TEMPLATES.map((t) => {
            const isActive = t.id === activeId;
            return (
              <div
                key={t.id}
                className={`border rounded-xl p-4 hover:border-primary hover:bg-primary-50/30 transition-colors group cursor-pointer relative ${CARD_BORDER_CLASSES[t.color]} ${isActive ? "ring-2 ring-primary" : ""}`}
                onClick={() => onApply(t.id)}
              >
                <span className={`absolute top-3 right-3 text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${BADGE_COLOR_CLASSES[t.color]}`}>{t.badge}</span>
                <p className="text-[13.5px] font-bold text-ink-900 group-hover:text-primary transition-colors pr-20">{t.name}</p>
                <p className="text-[12px] text-ink-500 mt-0.5 leading-snug">{t.description}</p>
                <button className="mt-3 px-4 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  {isActive ? "Currently active" : "Use Template"}
                </button>
              </div>
            );
          })}
        </div>
        <div className="px-6 py-3 border-t border-border shrink-0 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[12.5px] font-medium text-ink-600 hover:bg-gray-100 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}