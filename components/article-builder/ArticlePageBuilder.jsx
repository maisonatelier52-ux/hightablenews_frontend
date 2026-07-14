"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Check, Loader2, LayoutTemplate, Sparkles, Newspaper } from "lucide-react";

import { getArticleDetailPageConfigAdmin as getArticleDetailPageConfig, saveArticleDetailPageConfig } from "@/lib/articleDetailPageApi";
import { getAllPreviewArticlesSorted } from "@/lib/articlesSource";
import { preloadCategoriesAndArticlesAdmin, onDataChange } from "@/lib/categoriesArticlesApi";
import { ARTICLE_TEMPLATES } from "@/lib/blockDefinitions";
import { useAutoSave } from "@/lib/useAutoSave";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import DeviceToggle from "@/components/ui/DeviceToggle";
import ArticleBlockSettingsPanel from "./ArticleBlockSettingsPanel";
import ArticleLivePreview from "./ArticleLivePreview";
import { SAMPLE_ARTICLE } from "./shared";

const BADGE_COLOR_CLASSES = { slate: "bg-slate-700", amber: "bg-amber-500", blue: "bg-primary" };
const CARD_BORDER_CLASSES = { slate: "border-slate-300 bg-slate-50/50", amber: "border-amber-300 bg-amber-50/40", blue: "border-primary-200 bg-primary-50/30" };

export default function ArticlePageBuilder() {
  const [config, setConfig] = useState(null);
  const [articles, setArticles] = useState([]);
  const [previewArticleId, setPreviewArticleId] = useState("");
  const [device, setDevice] = useState("desktop");
  const [loading, setLoading] = useState(true);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  const { status, trigger, saveNow } = useAutoSave(saveArticleDetailPageConfig, { toastMessage: "Article page layout saved" });

  const loadArticles = useCallback(() => {
    const list = getAllPreviewArticlesSorted();
    setArticles(list);
    setPreviewArticleId((prev) => (list.some((a) => a.id === prev) ? prev : list[0]?.id || ""));
  }, []);

  useEffect(() => {
    getArticleDetailPageConfig().then((data) => {
      setConfig(data);
      setLoading(false);
    });
    loadArticles();

    // Same fetch-race issue as the other builders: the shared article cache
    // is populated by a background fetch that may not have resolved yet
    // when this page first mounts. Re-sync as soon as it does.
    preloadCategoriesAndArticlesAdmin().catch(() => {});
    const unsubData = onDataChange(loadArticles);
    return () => unsubData();
  }, [loadArticles]);

  const updateActiveBlockData = useCallback(
    (next) => {
      setConfig((prev) => {
        const updated = { ...prev, blocksByTemplate: { ...prev.blocksByTemplate, [prev.templateId]: next } };
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
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const activeData = config.blocksByTemplate[config.templateId];
  const activeTemplate = ARTICLE_TEMPLATES.find((t) => t.id === config.templateId);
  const previewArticle = articles.find((a) => a.id === previewArticleId) || null;

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-ink-900">Article Detail Page Builder</h2>
          <p className="text-[13px] text-ink-500 mt-0.5">
            Choose one layout — it's used for every article's detail page on the site.
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

      {activeTemplate && (
        <div className={`flex items-center gap-3 mb-5 px-4 py-2.5 rounded-lg border ${CARD_BORDER_CLASSES[activeTemplate.color]}`}>
          <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full shrink-0 ${BADGE_COLOR_CLASSES[activeTemplate.color]}`}>{activeTemplate.badge}</span>
          <p className="text-[13px] font-semibold text-ink-900">{activeTemplate.name}</p>
          <p className="text-[12px] text-ink-500 hidden sm:block">— {activeTemplate.description}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Settings — full width */}
        <ArticleBlockSettingsPanel data={activeData} onUpdate={updateActiveBlockData} />

        {/* Live preview — full width, at the bottom */}
        <div>
          <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
            <h3 className="text-[12.5px] font-semibold text-ink-500 uppercase tracking-wide px-0.5">Live Preview</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <PreviewArticlePicker articles={articles} value={previewArticleId} onChange={setPreviewArticleId} />
              <DeviceToggle device={device} onChange={setDevice} />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-white shadow-soft overflow-hidden w-full">
            <div className="overflow-auto bg-gray-100 w-full" style={{ maxHeight: "82vh" }}>
              <div className="flex justify-center py-6 w-full">
                <div
                  className="bg-white shadow-md transition-all"
                  style={{ width: device === "desktop" ? "100%" : device === "tablet" ? 420 : 300, maxWidth: "100%" }}
                >
                  {articles.length === 0 ? (
                    <>
                      <NoArticlesNotice />
                      <ArticleLivePreview templateId={config.templateId} data={activeData} article={SAMPLE_ARTICLE} device={device} />
                    </>
                  ) : (
                    <ArticleLivePreview templateId={config.templateId} data={activeData} article={previewArticle} device={device} />
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

function PreviewArticlePicker({ articles, value, onChange }) {
  if (articles.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5 h-9 rounded-lg border border-border bg-white px-2.5 max-w-[280px]">
      <Newspaper size={13} className="text-ink-400 shrink-0" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-[12.5px] text-ink-700 focus:outline-none cursor-pointer bg-transparent truncate"
      >
        {articles.map((a) => (
          <option key={a.id} value={a.id}>Preview: {a.title}</option>
        ))}
      </select>
    </div>
  );
}

function NoArticlesNotice() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center px-6 border-b border-gray-100 bg-amber-50/60">
      <Sparkles size={20} className="text-amber-400 mb-2" />
      <p className="text-[13px] font-medium text-ink-700">No articles yet — showing sample content</p>
      <p className="text-[12px] text-ink-400 mt-1">Publish an article to preview this layout with real content.</p>
    </div>
  );
}

function SaveStatus({ status }) {
  if (status === "saving") {
    return <span className="flex items-center gap-1.5 text-[12.5px] text-ink-400 mr-1"><Loader2 size={13} className="animate-spin" /> Saving…</span>;
  }
  if (status === "saved") {
    return <span className="flex items-center gap-1.5 text-[12.5px] text-emerald-600 mr-1"><Check size={13} /> All changes saved</span>;
  }
  return null;
}

function TemplateModal({ activeId, onApply, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-ink-900/50 flex items-center justify-center p-4" style={{ backdropFilter: "blur(2px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h3 className="text-[15px] font-bold text-ink-900">Article Detail Page Templates</h3>
            <p className="text-[12px] text-ink-500 mt-0.5">This layout applies to every article's detail page. Switching keeps each template's own settings.</p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 gap-4 overflow-y-auto">
          {ARTICLE_TEMPLATES.map((t) => {
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
