// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { Save, Check, Loader2, LayoutTemplate, Sparkles, UserRound } from "lucide-react";

// import { getAuthorPageConfigAdmin as getAuthorPageConfig, saveAuthorPageConfig } from "@/lib/authorPageApi";
// import { getAuthors, preloadAuthorsAdmin, onAuthorsChange } from "@/lib/authorsApi";
// import { AUTHOR_TEMPLATES } from "@/lib/blockDefinitions";
// import { useAutoSave } from "@/lib/useAutoSave";
// import Button from "@/components/ui/Button";
// import Skeleton from "@/components/ui/Skeleton";
// import DeviceToggle from "@/components/ui/DeviceToggle";
// import AuthorBlockSettingsPanel from "./AuthorBlockSettingsPanel";
// import AuthorLivePreview from "./AuthorLivePreview";
// import { SAMPLE_AUTHOR } from "./shared";

// const BADGE_COLOR_CLASSES = { amber: "bg-amber-500", blue: "bg-primary", slate: "bg-slate-700" };
// const CARD_BORDER_CLASSES = { amber: "border-amber-300 bg-amber-50/40", blue: "border-primary-200 bg-primary-50/30", slate: "border-slate-300 bg-slate-50/50" };

// export default function AuthorPageBuilder() {
//   const [config, setConfig] = useState(null);
//   const [authors, setAuthors] = useState([]);
//   const [previewAuthorId, setPreviewAuthorId] = useState("");
//   const [device, setDevice] = useState("desktop");
//   const [loading, setLoading] = useState(true);
//   const [templateModalOpen, setTemplateModalOpen] = useState(false);

//   const { status, trigger, saveNow } = useAutoSave(saveAuthorPageConfig, { toastMessage: "Author page layout saved" });

//   const loadAuthors = useCallback(() => {
//     const list = getAuthors();
//     setAuthors(list);
//     setPreviewAuthorId((prev) => (list.some((a) => a._id === prev) ? prev : list[0]?._id || ""));
//   }, []);

//   useEffect(() => {
//     getAuthorPageConfig().then((data) => {
//       setConfig(data);
//       setLoading(false);
//     });
//     loadAuthors();

//     // Same fetch-race issue as the other builders: the shared authors cache
//     // is populated by a background fetch that may not have resolved yet
//     // when this page first mounts. Re-sync as soon as it does.
//     preloadAuthorsAdmin().catch(() => {});
//     const unsubAuthors = onAuthorsChange(loadAuthors);
//     return () => unsubAuthors();
//   }, [loadAuthors]);

//   const updateActiveBlockData = useCallback(
//     (next) => {
//       setConfig((prev) => {
//         const updated = { ...prev, blocksByTemplate: { ...prev.blocksByTemplate, [prev.templateId]: next } };
//         trigger(updated);
//         return updated;
//       });
//     },
//     [trigger]
//   );

//   function selectTemplate(templateId) {
//     setConfig((prev) => {
//       const updated = { ...prev, templateId };
//       trigger(updated);
//       return updated;
//     });
//     setTemplateModalOpen(false);
//   }

//   if (loading || !config) {
//     return (
//       <div className="p-6 space-y-5">
//         <Skeleton className="h-14 w-full" />
//         <Skeleton className="h-96 w-full" />
//         <Skeleton className="h-96 w-full" />
//       </div>
//     );
//   }

//   const activeData = config.blocksByTemplate[config.templateId];
//   const activeTemplate = AUTHOR_TEMPLATES.find((t) => t.id === config.templateId);
//   const previewAuthor = authors.find((a) => a._id === previewAuthorId) || null;

//   return (
//     <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
//       {/* Top bar */}
//       <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
//         <div>
//           <h2 className="text-lg font-bold text-ink-900">Author Detail Page Builder</h2>
//           <p className="text-[13px] text-ink-500 mt-0.5">
//             Choose one layout — it's used for every author profile on the site.
//           </p>
//         </div>
//         <div className="flex items-center gap-2 flex-wrap">
//           <SaveStatus status={status} />
//           <button
//             onClick={() => setTemplateModalOpen(true)}
//             className="h-9 flex items-center gap-1.5 px-3 rounded-lg border border-border text-ink-600 hover:bg-surface-soft text-[13px] font-medium transition-colors"
//           >
//             <LayoutTemplate size={14} />
//             Change template
//           </button>
//           <Button icon={Save} onClick={() => saveNow(config)}>
//             Save Layout
//           </Button>
//         </div>
//       </div>

//       {activeTemplate && (
//         <div className={`flex items-center gap-3 mb-5 px-4 py-2.5 rounded-lg border ${CARD_BORDER_CLASSES[activeTemplate.color]}`}>
//           <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full shrink-0 ${BADGE_COLOR_CLASSES[activeTemplate.color]}`}>{activeTemplate.badge}</span>
//           <p className="text-[13px] font-semibold text-ink-900">{activeTemplate.name}</p>
//           <p className="text-[12px] text-ink-500 hidden sm:block">— {activeTemplate.description}</p>
//         </div>
//       )}

//       <div className="space-y-6">
//         {/* Settings — full width */}
//         <AuthorBlockSettingsPanel templateId={config.templateId} data={activeData} onUpdate={updateActiveBlockData} />

//         {/* Live preview — full width, at the bottom */}
//         <div>
//           <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
//             <h3 className="text-[12.5px] font-semibold text-ink-500 uppercase tracking-wide px-0.5">Live Preview</h3>
//             <div className="flex items-center gap-2 flex-wrap">
//               <PreviewAuthorPicker authors={authors} value={previewAuthorId} onChange={setPreviewAuthorId} />
//               <DeviceToggle device={device} onChange={setDevice} />
//             </div>
//           </div>
//           <div className="rounded-xl border border-border bg-white shadow-soft overflow-hidden w-full">
//             <div className="overflow-auto bg-gray-100 w-full" style={{ maxHeight: "82vh" }}>
//               <div className="flex justify-center py-6 w-full">
//                 <div
//                   className="bg-white shadow-md transition-all"
//                   style={{ width: device === "desktop" ? "100%" : device === "tablet" ? 420 : 300, maxWidth: "100%" }}
//                 >
//                   {authors.length === 0 ? (
//                     <>
//                       <NoAuthorsNotice />
//                       <AuthorLivePreview templateId={config.templateId} data={activeData} author={SAMPLE_AUTHOR} device={device} />
//                     </>
//                   ) : (
//                     <AuthorLivePreview templateId={config.templateId} data={activeData} author={previewAuthor} device={device} />
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {templateModalOpen && (
//         <TemplateModal activeId={config.templateId} onApply={selectTemplate} onClose={() => setTemplateModalOpen(false)} />
//       )}
//     </div>
//   );
// }

// function PreviewAuthorPicker({ authors, value, onChange }) {
//   if (authors.length === 0) return null;
//   return (
//     <div className="flex items-center gap-1.5 h-9 rounded-lg border border-border bg-white px-2.5">
//       <UserRound size={13} className="text-ink-400" />
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="text-[12.5px] text-ink-700 focus:outline-none cursor-pointer bg-transparent"
//       >
//         {authors.map((a) => (
//           <option key={a._id} value={a._id}>Preview: {a.name}</option>
//         ))}
//       </select>
//     </div>
//   );
// }

// function NoAuthorsNotice() {
//   return (
//     <div className="flex flex-col items-center justify-center py-10 text-center px-6 border-b border-gray-100 bg-amber-50/60">
//       <Sparkles size={20} className="text-amber-400 mb-2" />
//       <p className="text-[13px] font-medium text-ink-700">No authors yet — showing sample content</p>
//       <p className="text-[12px] text-ink-400 mt-1">Create an author on the Authors page to preview this layout with real content.</p>
//     </div>
//   );
// }

// function SaveStatus({ status }) {
//   if (status === "saving") {
//     return <span className="flex items-center gap-1.5 text-[12.5px] text-ink-400 mr-1"><Loader2 size={13} className="animate-spin" /> Saving…</span>;
//   }
//   if (status === "saved") {
//     return <span className="flex items-center gap-1.5 text-[12.5px] text-emerald-600 mr-1"><Check size={13} /> All changes saved</span>;
//   }
//   return null;
// }

// function TemplateModal({ activeId, onApply, onClose }) {
//   return (
//     <div className="fixed inset-0 z-50 bg-ink-900/50 flex items-center justify-center p-4" style={{ backdropFilter: "blur(2px)" }}>
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col">
//         <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
//           <div>
//             <h3 className="text-[15px] font-bold text-ink-900">Author Page Templates</h3>
//             <p className="text-[12px] text-ink-500 mt-0.5">This layout applies to every author's profile page. Switching keeps each template's own settings.</p>
//           </div>
//         </div>
//         <div className="p-6 grid grid-cols-1 gap-4 overflow-y-auto">
//           {AUTHOR_TEMPLATES.map((t) => {
//             const isActive = t.id === activeId;
//             return (
//               <div
//                 key={t.id}
//                 className={`border rounded-xl p-4 hover:border-primary hover:bg-primary-50/30 transition-colors group cursor-pointer relative ${CARD_BORDER_CLASSES[t.color]} ${isActive ? "ring-2 ring-primary" : ""}`}
//                 onClick={() => onApply(t.id)}
//               >
//                 <span className={`absolute top-3 right-3 text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${BADGE_COLOR_CLASSES[t.color]}`}>{t.badge}</span>
//                 <p className="text-[13.5px] font-bold text-ink-900 group-hover:text-primary transition-colors pr-20">{t.name}</p>
//                 <p className="text-[12px] text-ink-500 mt-0.5 leading-snug">{t.description}</p>
//                 <button className="mt-3 px-4 py-1.5 rounded-lg bg-primary text-white text-[12px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
//                   {isActive ? "Currently active" : "Use Template"}
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//         <div className="px-6 py-3 border-t border-border shrink-0 flex justify-end">
//           <button onClick={onClose} className="px-4 py-2 rounded-lg text-[12.5px] font-medium text-ink-600 hover:bg-gray-100 transition-colors">Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Check, Loader2, LayoutTemplate, Sparkles, UserRound } from "lucide-react";

import { getAuthorPageConfigAdmin as getAuthorPageConfig, saveAuthorPageConfig } from "@/lib/authorPageApi";
import { getAuthors, preloadAuthorsAdmin, onAuthorsChange } from "@/lib/authorsApi";
import { preloadCategoriesAndArticlesAdmin, onDataChange } from "@/lib/categoriesArticlesApi";
import { AUTHOR_TEMPLATES } from "@/lib/blockDefinitions";
import { useAutoSave } from "@/lib/useAutoSave";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import DeviceToggle from "@/components/ui/DeviceToggle";
import AuthorBlockSettingsPanel from "./AuthorBlockSettingsPanel";
import AuthorLivePreview from "./AuthorLivePreview";
import { SAMPLE_AUTHOR } from "./shared";

const BADGE_COLOR_CLASSES = { amber: "bg-amber-500", blue: "bg-primary", slate: "bg-slate-700" };
const CARD_BORDER_CLASSES = { amber: "border-amber-300 bg-amber-50/40", blue: "border-primary-200 bg-primary-50/30", slate: "border-slate-300 bg-slate-50/50" };

export default function AuthorPageBuilder() {
  const [config, setConfig] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [previewAuthorId, setPreviewAuthorId] = useState("");
  const [device, setDevice] = useState("desktop");
  const [loading, setLoading] = useState(true);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  const { status, trigger, saveNow } = useAutoSave(saveAuthorPageConfig, { toastMessage: "Author page layout saved" });

  const loadAuthors = useCallback(() => {
    const list = getAuthors();
    setAuthors(list);
    setPreviewAuthorId((prev) => (list.some((a) => a._id === prev) ? prev : list[0]?._id || ""));
  }, []);

  // The live preview's "articles by this author" list comes from the shared
  // categories/articles cache (lib/categoriesArticlesApi.js), which is
  // populated by a background fetch. That fetch is often still in flight
  // when this page first mounts, and — unlike the authors cache above —
  // nothing was re-triggering a render here once it resolved, so the
  // preview would silently keep showing "no articles" until some unrelated
  // state change (e.g. opening DevTools, which forces React to reconcile)
  // happened to re-render it. `dataTick` fixes that: it forces a local
  // re-render (re-reading the now-populated cache) the instant the cache
  // updates, no matter when this page was opened.
  const [, setDataTick] = useState(0);

  useEffect(() => {
    getAuthorPageConfig().then((data) => {
      setConfig(data);
      setLoading(false);
    });
    loadAuthors();

    // Same fetch-race issue as the other builders: the shared authors cache
    // is populated by a background fetch that may not have resolved yet
    // when this page first mounts. Re-sync as soon as it does.
    preloadAuthorsAdmin().catch(() => {});
    preloadCategoriesAndArticlesAdmin().catch(() => {});
    const unsubAuthors = onAuthorsChange(loadAuthors);
    const unsubData = onDataChange(() => setDataTick((n) => n + 1));
    return () => {
      unsubAuthors();
      unsubData();
    };
  }, [loadAuthors]);

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
  const activeTemplate = AUTHOR_TEMPLATES.find((t) => t.id === config.templateId);
  const previewAuthor = authors.find((a) => a._id === previewAuthorId) || null;

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-ink-900">Author Detail Page Builder</h2>
          <p className="text-[13px] text-ink-500 mt-0.5">
            Choose one layout — it's used for every author profile on the site.
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
        <AuthorBlockSettingsPanel templateId={config.templateId} data={activeData} onUpdate={updateActiveBlockData} />

        {/* Live preview — full width, at the bottom */}
        <div>
          <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
            <h3 className="text-[12.5px] font-semibold text-ink-500 uppercase tracking-wide px-0.5">Live Preview</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <PreviewAuthorPicker authors={authors} value={previewAuthorId} onChange={setPreviewAuthorId} />
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
                  {authors.length === 0 ? (
                    <>
                      <NoAuthorsNotice />
                      <AuthorLivePreview templateId={config.templateId} data={activeData} author={SAMPLE_AUTHOR} device={device} />
                    </>
                  ) : (
                    <AuthorLivePreview templateId={config.templateId} data={activeData} author={previewAuthor} device={device} />
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

function PreviewAuthorPicker({ authors, value, onChange }) {
  if (authors.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5 h-9 rounded-lg border border-border bg-white px-2.5">
      <UserRound size={13} className="text-ink-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-[12.5px] text-ink-700 focus:outline-none cursor-pointer bg-transparent"
      >
        {authors.map((a) => (
          <option key={a._id} value={a._id}>Preview: {a.name}</option>
        ))}
      </select>
    </div>
  );
}

function NoAuthorsNotice() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center px-6 border-b border-gray-100 bg-amber-50/60">
      <Sparkles size={20} className="text-amber-400 mb-2" />
      <p className="text-[13px] font-medium text-ink-700">No authors yet — showing sample content</p>
      <p className="text-[12px] text-ink-400 mt-1">Create an author on the Authors page to preview this layout with real content.</p>
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
            <h3 className="text-[15px] font-bold text-ink-900">Author Page Templates</h3>
            <p className="text-[12px] text-ink-500 mt-0.5">This layout applies to every author's profile page. Switching keeps each template's own settings.</p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 gap-4 overflow-y-auto">
          {AUTHOR_TEMPLATES.map((t) => {
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