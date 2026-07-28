
"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Check, Loader2, LayoutTemplate, Sparkles, Newspaper, Eye } from "lucide-react";

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
const THUMB_TINT = {
  slate: { strong: "bg-slate-500", soft: "bg-slate-300" },
  amber: { strong: "bg-amber-300", soft: "bg-amber-100" },
  blue: { strong: "bg-primary-200", soft: "bg-primary-100" },
};

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
      <div className="p-4 lg:p-6 max-w-[1400px] mx-auto space-y-6">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  const activeData = config.blocksByTemplate[config.templateId];
  const previewArticle = articles.find((a) => a.id === previewArticleId) || null;

  return (
    <div className="p-4 lg:p-6 max-w-[1400px] mx-auto">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-glow shrink-0">
            <Newspaper size={18} />
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-ink-900 leading-tight">Article Detail Page Builder</h2>
            <p className="text-[12.5px] text-ink-500 mt-0.5">
              Choose one layout — it's used for every article's detail page on the site.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SaveStatus status={status} />
          <Button icon={Save} onClick={() => saveNow(config)}>
            Save Layout
          </Button>
        </div>
      </div>

      {/* ── Layout templates ───────────────────────────────────────── */}
      <SectionCard
        title="Select Article Page Template"
        subtitle="Choose a layout — it applies to every article's detail page on the site. Each template keeps its own settings."
        right={
          <button
            onClick={() => setTemplateModalOpen(true)}
            className="text-[12px] font-semibold text-primary hover:text-primary-600 hover:underline shrink-0"
          >
            View all
          </button>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {ARTICLE_TEMPLATES.map((t) => (
            <TemplateCard key={t.id} template={t} active={config.templateId === t.id} onApply={(tpl) => selectTemplate(tpl.id)} />
          ))}
        </div>
      </SectionCard>

      {/* ── Block settings ────────────────────────────────────────── */}
      <div className="mb-6">
        <PanelHeader title="Block settings" />
        <ArticleBlockSettingsPanel data={activeData} onUpdate={updateActiveBlockData} />
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
              <PreviewArticlePicker articles={articles} value={previewArticleId} onChange={setPreviewArticleId} />
              <DeviceToggle device={device} onChange={setDevice} />
            </div>
          </div>
          <div className="overflow-auto bg-gray-100" style={{ maxHeight: "70vh" }}>
            <div className="flex justify-center py-6">
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

      {templateModalOpen && (
        <TemplateModal activeId={config.templateId} onApply={selectTemplate} onClose={() => setTemplateModalOpen(false)} />
      )}
    </div>
  );
}

// ─── Shared building blocks (mirrors Homepage/Category Builder's design system) ──

/** Consistent white "card" wrapper used for every major section of the page,
 *  matching the Homepage/Category Builders so all three read as one design system. */
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

/** Small, purely-decorative wireframe mockup that hints at each template's
 *  actual structure, so the picker feels like a real layout gallery rather
 *  than an icon + label list — same treatment as the other builders. */
function TemplateThumbnail({ templateId, accent }) {
  const tint = THUMB_TINT[accent] || { strong: "bg-ink-200", soft: "bg-ink-100" };

  if (templateId === "sticky-sidebar") {
    return (
      <div className="h-24 w-full rounded-lg border border-border bg-white p-2 flex flex-col gap-1.5">
        <div className="h-1.5 w-1/3 rounded-full bg-ink-200" />
        <div className="flex-1 flex gap-1.5">
          <div className="flex-1 flex flex-col gap-1">
            <div className={`h-8 rounded-md ${tint.strong}`} />
            <div className="h-1.5 w-full rounded-full bg-ink-100" />
            <div className="h-1.5 w-4/5 rounded-full bg-ink-100" />
            <div className="h-1.5 w-3/5 rounded-full bg-ink-100" />
          </div>
          <div className="w-1/4 flex flex-col gap-1">
            <div className={`h-5 rounded-md ${tint.soft}`} />
            <div className="h-1.5 rounded-full bg-ink-100" />
            <div className="h-1.5 rounded-full bg-ink-100" />
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "full-hero") {
    return (
      <div className="h-24 w-full rounded-lg border border-border bg-white p-2 flex flex-col gap-1.5">
        <div className={`h-10 rounded-md ${tint.strong} relative overflow-hidden`}>
          <div className="absolute bottom-1.5 left-1.5 h-1.5 w-1/3 rounded-full bg-white/70" />
        </div>
        <div className="flex-1 flex flex-col gap-1 items-center px-3">
          <div className="h-1.5 w-3/5 rounded-full bg-ink-200" />
          <div className="h-1.5 w-full rounded-full bg-ink-100" />
          <div className="h-1.5 w-4/5 rounded-full bg-ink-100" />
        </div>
      </div>
    );
  }

  if (templateId === "split-column") {
    return (
      <div className="h-24 w-full rounded-lg border border-border bg-white p-2 flex gap-1.5">
        <div className="w-1/2 flex flex-col gap-1 justify-center">
          <div className="h-1.5 w-4/5 rounded-full bg-ink-800" />
          <div className="h-1.5 w-full rounded-full bg-ink-100" />
          <div className="h-1.5 w-3/5 rounded-full bg-ink-100" />
        </div>
        <div className="w-1/2 flex flex-col gap-1.5">
          <div className={`flex-1 rounded-md ${tint.strong}`} />
          <div className={`h-5 rounded-md ${tint.soft}`} />
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
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <Sparkles size={22} className="text-ink-200 mb-2" />
      <p className="text-[13px] font-medium text-ink-500">No articles yet — showing sample content</p>
      <p className="text-[12px] text-ink-400 mt-1">Publish an article on the Articles page to preview this layout with real content.</p>
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary flex items-center justify-center">
              <LayoutTemplate size={16} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-ink-900">Article Detail Page Templates</h3>
              <p className="text-[12px] text-ink-500 mt-0.5">This layout applies to every article's detail page. Switching keeps each template's own settings.</p>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-gray-100 transition-colors shrink-0">
            ✕
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto">
          {ARTICLE_TEMPLATES.map((t) => (
            <TemplateCard key={t.id} template={t} active={t.id === activeId} onApply={(tpl) => onApply(tpl.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}