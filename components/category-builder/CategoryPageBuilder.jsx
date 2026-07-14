"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Check, Loader2, LayoutTemplate, Sparkles } from "lucide-react";

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
  const activeTemplate = CATEGORY_TEMPLATES.find((t) => t.id === config.templateId);
  const previewCategory = categories.find((c) => c._id === previewCategoryId) || null;

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-ink-900">Category Page Builder</h2>
          <p className="text-[13px] text-ink-500 mt-0.5">
            Choose one layout — it's used for every category on the site (Business, Power, Technology, etc.).
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SaveStatus status={status} />
          <button
            onClick={() => setTemplateModalOpen(true)}
            className="h-9 flex items-center gap-1.5 px-3 rounded-lg border border-border text-ink-600 hover:bg-surface-soft text-[13px] font-medium transition-colors"
          >
            <LayoutTemplate size={14} />
            Change template
          </button>
          <Button icon={Save} onClick={() => saveNow(config)}>
            Save Layout
          </Button>
        </div>
      </div>

      {/* Active template banner */}
      {activeTemplate && (
        <div className={`flex items-center gap-3 mb-5 px-4 py-2.5 rounded-lg border ${CARD_BORDER_CLASSES[activeTemplate.color]}`}>
          <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full shrink-0 ${BADGE_COLOR_CLASSES[activeTemplate.color]}`}>{activeTemplate.badge}</span>
          <p className="text-[13px] font-semibold text-ink-900">{activeTemplate.name}</p>
          <p className="text-[12px] text-ink-500 hidden sm:block">— {activeTemplate.description}</p>
        </div>
      )}

      <div className="space-y-5">
        {/* Settings */}
        <div className="space-y-4">
          <CategoryBlockSettingsPanel
            templateId={config.templateId}
            data={activeData}
            onUpdate={updateActiveBlockData}
          />
        </div>

        {/* Preview */}
        <div>
          <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
            <h3 className="text-[12.5px] font-semibold text-ink-500 uppercase tracking-wide px-0.5">Live Preview</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <PreviewCategoryPicker
                categories={categories}
                value={previewCategoryId}
                onChange={setPreviewCategoryId}
              />
              <DeviceToggle device={device} onChange={setDevice} />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-white shadow-soft overflow-hidden">
            <div className="overflow-auto bg-gray-100" style={{ maxHeight: "78vh" }}>
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
      </div>

      {templateModalOpen && (
        <TemplateModal activeId={config.templateId} onApply={selectTemplate} onClose={() => setTemplateModalOpen(false)} />
      )}
    </div>
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
