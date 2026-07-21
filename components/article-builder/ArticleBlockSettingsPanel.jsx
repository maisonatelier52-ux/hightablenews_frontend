// "use client";

// import { useState } from "react";
// import { ChevronDown, ChevronRight } from "lucide-react";
// import { SHARE_PLATFORMS, DEFAULT_SHARE_PLATFORMS } from "./shared";

// export default function ArticleBlockSettingsPanel({ data, onUpdate }) {
//   const setPath = (path, value) => {
//     const next = { ...data };
//     let cursor = next;
//     for (let i = 0; i < path.length - 1; i++) {
//       cursor[path[i]] = { ...cursor[path[i]] };
//       cursor = cursor[path[i]];
//     }
//     cursor[path[path.length - 1]] = value;
//     onUpdate(next);
//   };

//   return (
//     <div className="rounded-card border border-border bg-white shadow-soft overflow-hidden">
//       <div className="px-4 py-3 border-b border-border bg-gray-50/50">
//         <h3 className="text-[13.5px] font-semibold text-ink-900">Page settings</h3>
//         <p className="text-[11.5px] text-ink-500 mt-0.5">Applies to this template across every article's detail page.</p>
//       </div>

//       <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-[calc(100vh-260px)] overflow-y-auto">
//         {data.typography && (
//           <Accordion label="Typography">
//             <NumberField label="Title size (px)" value={data.typography.titleSize} min={18} max={56} onChange={(v) => setPath(["typography", "titleSize"], v)} />
//             <NumberField label="Subtitle size (px)" value={data.typography.subtitleSize} min={11} max={24} onChange={(v) => setPath(["typography", "subtitleSize"], v)} />
//             <NumberField label="Body size (px)" value={data.typography.bodySize} min={12} max={22} onChange={(v) => setPath(["typography", "bodySize"], v)} />
//             <SelectField label="Line height" value={data.typography.lineHeight} onChange={(v) => setPath(["typography", "lineHeight"], Number(v))} options={[1.4, 1.5, 1.6, 1.7, 1.8, 2]} />
//             <SelectField label="Font weight" value={data.typography.fontWeight} onChange={(v) => setPath(["typography", "fontWeight"], Number(v))} options={[300, 400, 500, 600]} />
//           </Accordion>
//         )}

//         {data.hero && (
//           <Accordion label="Hero image">
//             <ToggleField label="Show hero image" value={data.hero.enabled !== false} onChange={(v) => setPath(["hero", "enabled"], v)} />
//             <SelectField label="Image ratio" value={data.hero.ratio || "16/9"} onChange={(v) => setPath(["hero", "ratio"], v)} options={["16/9", "21/9", "4/3", "4/5", "1/1"]} />
//             {"heightDesktop" in data.hero && (
//               <NumberField label="Hero height — desktop (px)" value={data.hero.heightDesktop} min={240} max={720} onChange={(v) => setPath(["hero", "heightDesktop"], v)} />
//             )}
//             {"overlay" in data.hero && (
//               <ToggleField label="Gradient overlay" value={!!data.hero.overlay} onChange={(v) => setPath(["hero", "overlay"], v)} />
//             )}
//           </Accordion>
//         )}

//         {data.header && (
//           <Accordion label="Header">
//             <div className="grid grid-cols-2 gap-2">
//               <ToggleField label="Breadcrumb" value={data.header.showBreadcrumb !== false} onChange={(v) => setPath(["header", "showBreadcrumb"], v)} />
//               <ToggleField label="Category tags" value={data.header.showCategoryTags !== false} onChange={(v) => setPath(["header", "showCategoryTags"], v)} />
//               <ToggleField label="Share buttons" value={data.header.showShare !== false} onChange={(v) => setPath(["header", "showShare"], v)} />
//               <ToggleField label="Publish date" value={data.header.showDate !== false} onChange={(v) => setPath(["header", "showDate"], v)} />
//               <ToggleField label="Read time" value={data.header.showReadTime !== false} onChange={(v) => setPath(["header", "showReadTime"], v)} />
//             </div>
//             {data.header.showShare !== false && (
//               <SharePlatformField
//                 value={data.header.sharePlatforms || DEFAULT_SHARE_PLATFORMS}
//                 onChange={(v) => setPath(["header", "sharePlatforms"], v)}
//               />
//             )}
//           </Accordion>
//         )}

//         {data.body && (
//           <Accordion label="Article body">
//             <div className="grid grid-cols-2 gap-2">
//               <ToggleField label="Drop cap" value={!!data.body.dropCap} onChange={(v) => setPath(["body", "dropCap"], v)} />
//               <ToggleField label="Pull quotes" value={data.body.showPullquotes !== false} onChange={(v) => setPath(["body", "showPullquotes"], v)} />
//               <ToggleField label="Key points box" value={data.body.showKeyPoints !== false} onChange={(v) => setPath(["body", "showKeyPoints"], v)} />
//             </div>
//             <NumberField label="Content max width (px)" value={data.body.contentWidth} min={480} max={960} step={10} onChange={(v) => setPath(["body", "contentWidth"], v)} />
//           </Accordion>
//         )}

//         {data.authorBox && (
//           <Accordion label="Author box">
//             <ToggleField label="Show author box" value={data.authorBox.enabled !== false} onChange={(v) => setPath(["authorBox", "enabled"], v)} />
//           </Accordion>
//         )}

//         {data.prevNext && (
//           <Accordion label="Previous / Next navigation">
//             <ToggleField label="Show prev / next cards" value={data.prevNext.enabled !== false} onChange={(v) => setPath(["prevNext", "enabled"], v)} />
//             {data.prevNext.enabled !== false && (
//               <>
//                 <ToggleField label="Show thumbnail image" value={data.prevNext.showThumbnail !== false} onChange={(v) => setPath(["prevNext", "showThumbnail"], v)} />

//                 <div className="grid grid-cols-2 gap-2 pt-1">
//                   <TextField label="Previous label text" value={data.prevNext.prevLabel} onChange={(v) => setPath(["prevNext", "prevLabel"], v)} placeholder="Previous Article" />
//                   <TextField label="Next label text" value={data.prevNext.nextLabel} onChange={(v) => setPath(["prevNext", "nextLabel"], v)} placeholder="Next Article" />
//                 </div>

//                 <div className="grid grid-cols-2 gap-2 pt-1">
//                   <NumberField label="Label size (px)" value={data.prevNext.labelSize ?? 10} min={8} max={16} step={0.5} onChange={(v) => setPath(["prevNext", "labelSize"], v)} />
//                   <NumberField label="Article title size (px)" value={data.prevNext.titleSize ?? 12.5} min={10} max={20} step={0.5} onChange={(v) => setPath(["prevNext", "titleSize"], v)} />
//                 </div>

//                 <NumberField label="Corner radius (px)" value={data.prevNext.borderRadius ?? 10} min={0} max={24} onChange={(v) => setPath(["prevNext", "borderRadius"], v)} />

//                 <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border mt-1">
//                   <ColorField label="Label color" value={data.prevNext.labelColor || "#9ca3af"} onChange={(v) => setPath(["prevNext", "labelColor"], v)} />
//                   <ColorField label="Title text color" value={data.prevNext.textColor || "#111827"} onChange={(v) => setPath(["prevNext", "textColor"], v)} />
//                   <ColorField label="Title color on hover" value={data.prevNext.hoverColor || "#dc2626"} onChange={(v) => setPath(["prevNext", "hoverColor"], v)} />
//                   <ColorField label="Card background" value={data.prevNext.bgColor || "#f9fafb"} onChange={(v) => setPath(["prevNext", "bgColor"], v)} />
//                   <ColorField label="Card background on hover" value={data.prevNext.hoverBgColor || "#f3f4f6"} onChange={(v) => setPath(["prevNext", "hoverBgColor"], v)} />
//                   <ColorField label="Card border color" value={data.prevNext.borderColor || "#f1f5f9"} onChange={(v) => setPath(["prevNext", "borderColor"], v)} />
//                 </div>
//               </>
//             )}
//           </Accordion>
//         )}

//         {data.relatedArticles && (
//           <Accordion label="Related articles">
//             <ToggleField label="Show related articles" value={data.relatedArticles.enabled !== false} onChange={(v) => setPath(["relatedArticles", "enabled"], v)} />
//             <TextField label="Section title" value={data.relatedArticles.title} onChange={(v) => setPath(["relatedArticles", "title"], v)} />
//             <SelectField label="Count" value={data.relatedArticles.count ?? 3} onChange={(v) => setPath(["relatedArticles", "count"], Number(v))} options={[3, 4, 6, 8]} />
//             <SelectField label="Grid columns (desktop)" value={data.relatedArticles.columns ?? 3} onChange={(v) => setPath(["relatedArticles", "columns"], Number(v))} options={[2, 3, 4]} />
//           </Accordion>
//         )}

//         {data.sidebar && (
//           <Accordion label="Sticky sidebar">
//             <ToggleField label="Show sidebar" value={data.sidebar.enabled !== false} onChange={(v) => setPath(["sidebar", "enabled"], v)} />
//             <ToggleField label="Sticky (position: sticky, top: 20px)" value={data.sidebar.sticky !== false} onChange={(v) => setPath(["sidebar", "sticky"], v)} />
//             <NumberField label="Sidebar width (px)" value={data.sidebar.width} min={220} max={400} onChange={(v) => setPath(["sidebar", "width"], v)} />
//             <div className="grid grid-cols-2 gap-2 pt-1">
//               <ToggleField label="Most Read" value={data.sidebar.widgets?.mostRead !== false} onChange={(v) => setPath(["sidebar", "widgets", "mostRead"], v)} />
//               <ToggleField label="Most Commented" value={data.sidebar.widgets?.mostCommented !== false} onChange={(v) => setPath(["sidebar", "widgets", "mostCommented"], v)} />
//               <ToggleField label="Advertisement" value={data.sidebar.widgets?.advertisement !== false} onChange={(v) => setPath(["sidebar", "widgets", "advertisement"], v)} />
//             </div>
//             {data.sidebar.widgets?.advertisement !== false && (
//               <div className="pt-2 mt-1 border-t border-border space-y-2">
//                 <ImageUploadField
//                   label="Advertisement image"
//                   value={data.sidebar.ad?.imageUrl}
//                   onChange={(v) => setPath(["sidebar", "ad", "imageUrl"], v)}
//                   hint="Falls back to the default 'In Focus' promo card if left empty."
//                 />
//                 <TextField label="Link URL" value={data.sidebar.ad?.linkUrl} onChange={(v) => setPath(["sidebar", "ad", "linkUrl"], v)} placeholder="https://…" />
//                 <TextField label="Alt text" value={data.sidebar.ad?.altText} onChange={(v) => setPath(["sidebar", "ad", "altText"], v)} />
//                 <div className="grid grid-cols-2 gap-2">
//                   <NumberField label="Width (px, 0 = full)" value={data.sidebar.ad?.width ?? 0} onChange={(v) => setPath(["sidebar", "ad", "width"], v)} min={0} max={600} />
//                   <NumberField label="Height (px)" value={data.sidebar.ad?.height ?? 250} onChange={(v) => setPath(["sidebar", "ad", "height"], v)} min={50} max={600} />
//                 </div>
//               </div>
//             )}
//           </Accordion>
//         )}

//         <Accordion label="Card settings">
//           <SelectField label="Image ratio" value={data.card?.imageRatio || "4/3"} onChange={(v) => setPath(["card", "imageRatio"], v)} options={["1/1", "16/9", "4/3"]} />
//           <ToggleField label="Card border" value={data.card?.borderEnabled !== false} onChange={(v) => setPath(["card", "borderEnabled"], v)} />
//         </Accordion>
//       </div>
//     </div>
//   );
// }

// function TextField({ label, value, onChange, placeholder }) {
//   return (
//     <div>
//       <FieldLabel>{label}</FieldLabel>
//       <input
//         type="text"
//         value={value || ""}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[12.5px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
//       />
//     </div>
//   );
// }

// /** Upload an image from disk (stored inline as a base64 data URL so it
//  *  survives reloads in localStorage-backed persistence, unlike a blob URL).
//  *  Shows a live preview with a remove button once an image is set. */
// function ImageUploadField({ label = "Ad image", value, onChange, hint }) {
//   return (
//     <div>
//       <FieldLabel>{label}</FieldLabel>
//       {hint && <p className="text-[11px] text-ink-400 mb-1.5 -mt-0.5">{hint}</p>}
//       {value ? (
//         <div className="relative rounded-lg border border-border bg-surface-soft p-2">
//           <img src={value} alt="Advertisement preview" className="max-h-28 w-full object-contain rounded" />
//           <div className="flex items-center gap-2 mt-2">
//             <label className="flex-1 text-center rounded-lg border border-border bg-white px-2 py-1.5 text-[11.5px] text-ink-600 cursor-pointer hover:border-primary/40 transition-colors">
//               Replace image
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];
//                   if (!file) return;
//                   const reader = new FileReader();
//                   reader.onload = () => onChange(reader.result);
//                   reader.readAsDataURL(file);
//                 }}
//               />
//             </label>
//             <button
//               type="button"
//               onClick={() => onChange("")}
//               className="rounded-lg border border-border px-2 py-1.5 text-[11.5px] text-red-600 hover:bg-red-50 transition-colors"
//             >
//               Remove
//             </button>
//           </div>
//         </div>
//       ) : (
//         <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface-soft px-3 py-5 text-[12px] text-ink-500 cursor-pointer hover:border-primary/40 transition-colors">
//           Click to upload advertisement image
//           <input
//             type="file"
//             accept="image/*"
//             className="hidden"
//             onChange={(e) => {
//               const file = e.target.files?.[0];
//               if (!file) return;
//               const reader = new FileReader();
//               reader.onload = () => onChange(reader.result);
//               reader.readAsDataURL(file);
//             }}
//           />
//         </label>
//       )}
//     </div>
//   );
// }

// function ColorField({ label, value, onChange }) {
//   return (
//     <div>
//       <FieldLabel>{label}</FieldLabel>
//       <div className="flex items-center gap-2">
//         <input
//           type="color"
//           value={value || "#000000"}
//           onChange={(e) => onChange(e.target.value)}
//           className="h-9 w-9 shrink-0 rounded-md border border-border cursor-pointer p-0.5 bg-white"
//         />
//         <input
//           type="text"
//           value={value || ""}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder="#000000"
//           className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[12.5px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
//         />
//       </div>
//     </div>
//   );
// }

// function NumberField({ label, value, onChange, min = 0, max = 9999, step = 1 }) {
//   return (
//     <div>
//       <FieldLabel>{label}</FieldLabel>
//       <input
//         type="number"
//         value={value ?? 0}
//         min={min}
//         max={max}
//         step={step}
//         onChange={(e) => onChange(Number(e.target.value))}
//         className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[12.5px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
//       />
//     </div>
//   );
// }

// function SelectField({ label, value, onChange, options }) {
//   return (
//     <div>
//       <FieldLabel>{label}</FieldLabel>
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[12.5px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors cursor-pointer"
//       >
//         {options.map((opt) => (
//           <option key={opt} value={opt}>{String(opt)}</option>
//         ))}
//       </select>
//     </div>
//   );
// }

// /** Lets the admin choose exactly which share icons appear on the article
//  *  detail page — Facebook, X, LinkedIn, Medium, Substack, WhatsApp,
//  *  Telegram, Email, Copy Link — mirroring the platform picker already used
//  *  for the header's social icons. */
// function SharePlatformField({ value, onChange }) {
//   const selected = value || DEFAULT_SHARE_PLATFORMS;
//   function toggle(key) {
//     const has = selected.includes(key);
//     const next = has ? selected.filter((k) => k !== key) : [...selected, key];
//     onChange(next);
//   }
//   return (
//     <div className="pt-1">
//       <FieldLabel>Share platforms shown on the article</FieldLabel>
//       <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-border bg-surface-soft/50">
//         {Object.entries(SHARE_PLATFORMS).map(([key, cfg]) => {
//           const Icon = cfg.icon;
//           const active = selected.includes(key);
//           return (
//             <button
//               key={key}
//               type="button"
//               onClick={() => toggle(key)}
//               className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
//                 active ? "border-primary bg-primary text-white" : "border-border text-ink-600 hover:border-primary/40"
//               }`}
//             >
//               <Icon size={12} />
//               {cfg.label}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// function ToggleField({ label, value, onChange }) {
//   return (
//     <label className="flex items-center justify-between gap-3 cursor-pointer">
//       {label && <span className="text-[12.5px] font-medium text-ink-700">{label}</span>}
//       <button
//         type="button"
//         role="switch"
//         aria-checked={!!value}
//         onClick={() => onChange(!value)}
//         className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${value ? "bg-primary" : "bg-border"}`}
//       >
//         <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${value ? "translate-x-4" : "translate-x-0"}`} />
//       </button>
//     </label>
//   );
// }

// function FieldLabel({ children }) {
//   return <span className="block text-[11.5px] font-medium text-ink-500 mb-1">{children}</span>;
// }

// function Accordion({ label, children }) {
//   const [open, setOpen] = useState(true);
//   return (
//     <div className="border border-border rounded-lg overflow-hidden self-start">
//       <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors">
//         <span className="text-[12.5px] font-semibold text-ink-900">{label}</span>
//         {open ? <ChevronDown size={14} className="text-ink-400" /> : <ChevronRight size={14} className="text-ink-400" />}
//       </button>
//       {open && <div className="p-3 space-y-3">{children}</div>}
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SHARE_PLATFORMS, DEFAULT_SHARE_PLATFORMS } from "./shared";

export default function ArticleBlockSettingsPanel({ data, onUpdate }) {
  const setPath = (path, value) => {
    const next = { ...data };
    let cursor = next;
    for (let i = 0; i < path.length - 1; i++) {
      cursor[path[i]] = { ...cursor[path[i]] };
      cursor = cursor[path[i]];
    }
    cursor[path[path.length - 1]] = value;
    onUpdate(next);
  };

  return (
    <div className="rounded-card border border-border bg-white shadow-soft overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-gray-50/50">
        <h3 className="text-[13.5px] font-semibold text-ink-900">Page settings</h3>
        <p className="text-[11.5px] text-ink-500 mt-0.5">Applies to this template across every article's detail page.</p>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-[calc(100vh-260px)] overflow-y-auto">
        {data.typography && (
          <Accordion label="Typography">
            <NumberField label="Title size (px)" value={data.typography.titleSize} min={18} max={56} onChange={(v) => setPath(["typography", "titleSize"], v)} />
            <NumberField label="Subtitle size (px)" value={data.typography.subtitleSize} min={11} max={24} onChange={(v) => setPath(["typography", "subtitleSize"], v)} />
            <NumberField label="Body size (px)" value={data.typography.bodySize} min={12} max={22} onChange={(v) => setPath(["typography", "bodySize"], v)} />
            <SelectField label="Line height" value={data.typography.lineHeight} onChange={(v) => setPath(["typography", "lineHeight"], Number(v))} options={[1.4, 1.5, 1.6, 1.7, 1.8, 2]} />
            <SelectField label="Font weight" value={data.typography.fontWeight} onChange={(v) => setPath(["typography", "fontWeight"], Number(v))} options={[300, 400, 500, 600]} />
          </Accordion>
        )}

        {data.hero && (
          <Accordion label="Hero image">
            <ToggleField label="Show hero image" value={data.hero.enabled !== false} onChange={(v) => setPath(["hero", "enabled"], v)} />
            <SelectField label="Image ratio" value={data.hero.ratio || "16/9"} onChange={(v) => setPath(["hero", "ratio"], v)} options={["16/9", "21/9", "4/3", "4/5", "1/1"]} />
            {"heightDesktop" in data.hero && (
              <NumberField label="Hero height — desktop (px)" value={data.hero.heightDesktop} min={240} max={720} onChange={(v) => setPath(["hero", "heightDesktop"], v)} />
            )}
            {"overlay" in data.hero && (
              <ToggleField label="Gradient overlay" value={!!data.hero.overlay} onChange={(v) => setPath(["hero", "overlay"], v)} />
            )}
          </Accordion>
        )}

        {data.header && (
          <Accordion label="Header">
            <div className="grid grid-cols-2 gap-2">
              <ToggleField label="Breadcrumb" value={data.header.showBreadcrumb !== false} onChange={(v) => setPath(["header", "showBreadcrumb"], v)} />
              <ToggleField label="Category tags" value={data.header.showCategoryTags !== false} onChange={(v) => setPath(["header", "showCategoryTags"], v)} />
              <ToggleField label="Share buttons" value={data.header.showShare !== false} onChange={(v) => setPath(["header", "showShare"], v)} />
              <ToggleField label="Publish date" value={data.header.showDate !== false} onChange={(v) => setPath(["header", "showDate"], v)} />
              <ToggleField label="Read time" value={data.header.showReadTime !== false} onChange={(v) => setPath(["header", "showReadTime"], v)} />
            </div>
            {data.header.showShare !== false && (
              <SharePlatformField
                value={data.header.sharePlatforms || DEFAULT_SHARE_PLATFORMS}
                onChange={(v) => setPath(["header", "sharePlatforms"], v)}
              />
            )}
          </Accordion>
        )}

        {data.body && (
          <Accordion label="Article body">
            <div className="grid grid-cols-2 gap-2">
              <ToggleField label="Drop cap" value={!!data.body.dropCap} onChange={(v) => setPath(["body", "dropCap"], v)} />
              <ToggleField label="Pull quotes" value={data.body.showPullquotes !== false} onChange={(v) => setPath(["body", "showPullquotes"], v)} />
              <ToggleField label="Key points box" value={data.body.showKeyPoints !== false} onChange={(v) => setPath(["body", "showKeyPoints"], v)} />
            </div>
            <NumberField label="Content max width (px)" value={data.body.contentWidth} min={480} max={960} step={10} onChange={(v) => setPath(["body", "contentWidth"], v)} />
          </Accordion>
        )}

        {data.authorBox && (
          <Accordion label="Author box">
            <ToggleField label="Show author box" value={data.authorBox.enabled !== false} onChange={(v) => setPath(["authorBox", "enabled"], v)} />
          </Accordion>
        )}

        {data.prevNext && (
          <Accordion label="Previous / Next navigation">
            <ToggleField label="Show prev / next cards" value={data.prevNext.enabled !== false} onChange={(v) => setPath(["prevNext", "enabled"], v)} />
            {data.prevNext.enabled !== false && (
              <>
                <ToggleField label="Show thumbnail image" value={data.prevNext.showThumbnail !== false} onChange={(v) => setPath(["prevNext", "showThumbnail"], v)} />

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <TextField label="Previous label text" value={data.prevNext.prevLabel} onChange={(v) => setPath(["prevNext", "prevLabel"], v)} placeholder="Previous Article" />
                  <TextField label="Next label text" value={data.prevNext.nextLabel} onChange={(v) => setPath(["prevNext", "nextLabel"], v)} placeholder="Next Article" />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <NumberField label="Label size (px)" value={data.prevNext.labelSize ?? 10} min={8} max={16} step={0.5} onChange={(v) => setPath(["prevNext", "labelSize"], v)} />
                  <NumberField label="Article title size (px)" value={data.prevNext.titleSize ?? 12.5} min={10} max={20} step={0.5} onChange={(v) => setPath(["prevNext", "titleSize"], v)} />
                </div>

                <NumberField label="Corner radius (px)" value={data.prevNext.borderRadius ?? 10} min={0} max={24} onChange={(v) => setPath(["prevNext", "borderRadius"], v)} />

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border mt-1">
                  <ColorField label="Label color" value={data.prevNext.labelColor || "#9ca3af"} onChange={(v) => setPath(["prevNext", "labelColor"], v)} />
                  <ColorField label="Title text color" value={data.prevNext.textColor || "#111827"} onChange={(v) => setPath(["prevNext", "textColor"], v)} />
                  <ColorField label="Title color on hover" value={data.prevNext.hoverColor || "#dc2626"} onChange={(v) => setPath(["prevNext", "hoverColor"], v)} />
                  <ColorField label="Card background" value={data.prevNext.bgColor || "#f9fafb"} onChange={(v) => setPath(["prevNext", "bgColor"], v)} />
                  <ColorField label="Card background on hover" value={data.prevNext.hoverBgColor || "#f3f4f6"} onChange={(v) => setPath(["prevNext", "hoverBgColor"], v)} />
                  <ColorField label="Card border color" value={data.prevNext.borderColor || "#f1f5f9"} onChange={(v) => setPath(["prevNext", "borderColor"], v)} />
                </div>
              </>
            )}
          </Accordion>
        )}

        {data.relatedArticles && (
          <Accordion label="Related articles">
            <ToggleField label="Show related articles" value={data.relatedArticles.enabled !== false} onChange={(v) => setPath(["relatedArticles", "enabled"], v)} />
            <TextField label="Section title" value={data.relatedArticles.title} onChange={(v) => setPath(["relatedArticles", "title"], v)} />
            <SelectField label="Count" value={data.relatedArticles.count ?? 3} onChange={(v) => setPath(["relatedArticles", "count"], Number(v))} options={[3, 4, 6, 8]} />
            <SelectField label="Grid columns (desktop)" value={data.relatedArticles.columns ?? 3} onChange={(v) => setPath(["relatedArticles", "columns"], Number(v))} options={[2, 3, 4]} />
          </Accordion>
        )}

        {data.sidebar && (
          <Accordion label="Sticky sidebar">
            <ToggleField label="Show sidebar" value={data.sidebar.enabled !== false} onChange={(v) => setPath(["sidebar", "enabled"], v)} />
            <ToggleField label="Sticky (position: sticky, top: 20px)" value={data.sidebar.sticky !== false} onChange={(v) => setPath(["sidebar", "sticky"], v)} />
            <NumberField label="Sidebar width (px)" value={data.sidebar.width} min={220} max={400} onChange={(v) => setPath(["sidebar", "width"], v)} />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <ToggleField label="Most Read" value={data.sidebar.widgets?.mostRead !== false} onChange={(v) => setPath(["sidebar", "widgets", "mostRead"], v)} />
              <ToggleField label="Most Commented" value={data.sidebar.widgets?.mostCommented !== false} onChange={(v) => setPath(["sidebar", "widgets", "mostCommented"], v)} />
              <ToggleField label="Advertisement" value={data.sidebar.widgets?.advertisement !== false} onChange={(v) => setPath(["sidebar", "widgets", "advertisement"], v)} />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {data.sidebar.widgets?.mostRead !== false && (
                <NumberField
                  label="Most Read — items to show"
                  value={data.sidebar.mostReadCount ?? 5}
                  min={1}
                  max={10}
                  onChange={(v) => setPath(["sidebar", "mostReadCount"], v)}
                />
              )}
              {data.sidebar.widgets?.mostCommented !== false && (
                <NumberField
                  label="Most Commented — items to show"
                  value={data.sidebar.mostCommentedCount ?? 4}
                  min={1}
                  max={10}
                  onChange={(v) => setPath(["sidebar", "mostCommentedCount"], v)}
                />
              )}
            </div>

            <div className="pt-2 mt-1 border-t border-border space-y-2">
              <ToggleField
                label="Show subscription (newsletter) box"
                value={data.sidebar.newsletter?.enabled !== false}
                onChange={(v) => setPath(["sidebar", "newsletter", "enabled"], v)}
              />
              {data.sidebar.newsletter?.enabled !== false && (
                <>
                  <TextField label="Title" value={data.sidebar.newsletter?.title} onChange={(v) => setPath(["sidebar", "newsletter", "title"], v)} placeholder="Stay Informed" />
                  <TextAreaField
                    label="Description"
                    value={data.sidebar.newsletter?.description}
                    onChange={(v) => setPath(["sidebar", "newsletter", "description"], v)}
                    placeholder="Get our top stories delivered to your inbox…"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <TextField label="Email input placeholder" value={data.sidebar.newsletter?.placeholder} onChange={(v) => setPath(["sidebar", "newsletter", "placeholder"], v)} placeholder="Your email address" />
                    <TextField label="Button text" value={data.sidebar.newsletter?.buttonText} onChange={(v) => setPath(["sidebar", "newsletter", "buttonText"], v)} placeholder="Subscribe Free →" />
                  </div>
                  <TextField
                    label="Success message"
                    value={data.sidebar.newsletter?.successMessage}
                    onChange={(v) => setPath(["sidebar", "newsletter", "successMessage"], v)}
                    placeholder="You're subscribed! Please check your inbox."
                  />
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border mt-1">
                    <ColorField label="Box background" value={data.sidebar.newsletter?.bgColor || "#111111"} onChange={(v) => setPath(["sidebar", "newsletter", "bgColor"], v)} />
                    <ColorField label="Title color" value={data.sidebar.newsletter?.titleColor || "#FAFAF8"} onChange={(v) => setPath(["sidebar", "newsletter", "titleColor"], v)} />
                    <ColorField label="Description text color" value={data.sidebar.newsletter?.textColor || "#888888"} onChange={(v) => setPath(["sidebar", "newsletter", "textColor"], v)} />
                    <ColorField label="Button color" value={data.sidebar.newsletter?.buttonColor || "#8B1A1A"} onChange={(v) => setPath(["sidebar", "newsletter", "buttonColor"], v)} />
                    <ColorField label="Button text color" value={data.sidebar.newsletter?.buttonTextColor || "#ffffff"} onChange={(v) => setPath(["sidebar", "newsletter", "buttonTextColor"], v)} />
                  </div>
                </>
              )}
            </div>
            {data.sidebar.widgets?.advertisement !== false && (
              <div className="pt-2 mt-1 border-t border-border space-y-2">
                <ImageUploadField
                  label="Advertisement image"
                  value={data.sidebar.ad?.imageUrl}
                  onChange={(v) => setPath(["sidebar", "ad", "imageUrl"], v)}
                  hint="Falls back to the default 'In Focus' promo card if left empty."
                />
                <TextField label="Link URL" value={data.sidebar.ad?.linkUrl} onChange={(v) => setPath(["sidebar", "ad", "linkUrl"], v)} placeholder="https://…" />
                <TextField label="Alt text" value={data.sidebar.ad?.altText} onChange={(v) => setPath(["sidebar", "ad", "altText"], v)} />
                <div className="grid grid-cols-2 gap-2">
                  <NumberField label="Width (px, 0 = full)" value={data.sidebar.ad?.width ?? 0} onChange={(v) => setPath(["sidebar", "ad", "width"], v)} min={0} max={600} />
                  <NumberField label="Height (px)" value={data.sidebar.ad?.height ?? 250} onChange={(v) => setPath(["sidebar", "ad", "height"], v)} min={50} max={600} />
                </div>
              </div>
            )}
          </Accordion>
        )}

        <Accordion label="Card settings">
          <SelectField label="Image ratio" value={data.card?.imageRatio || "4/3"} onChange={(v) => setPath(["card", "imageRatio"], v)} options={["1/1", "16/9", "4/3"]} />
          <ToggleField label="Card border" value={data.card?.borderEnabled !== false} onChange={(v) => setPath(["card", "borderEnabled"], v)} />
        </Accordion>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[12.5px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[12.5px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-y"
      />
    </div>
  );
}

/** Upload an image from disk (stored inline as a base64 data URL so it
 *  survives reloads in localStorage-backed persistence, unlike a blob URL).
 *  Shows a live preview with a remove button once an image is set. */
function ImageUploadField({ label = "Ad image", value, onChange, hint }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {hint && <p className="text-[11px] text-ink-400 mb-1.5 -mt-0.5">{hint}</p>}
      {value ? (
        <div className="relative rounded-lg border border-border bg-surface-soft p-2">
          <img src={value} alt="Advertisement preview" className="max-h-28 w-full object-contain rounded" />
          <div className="flex items-center gap-2 mt-2">
            <label className="flex-1 text-center rounded-lg border border-border bg-white px-2 py-1.5 text-[11.5px] text-ink-600 cursor-pointer hover:border-primary/40 transition-colors">
              Replace image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => onChange(reader.result);
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-lg border border-border px-2 py-1.5 text-[11.5px] text-red-600 hover:bg-red-50 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface-soft px-3 py-5 text-[12px] text-ink-500 cursor-pointer hover:border-primary/40 transition-colors">
          Click to upload advertisement image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => onChange(reader.result);
              reader.readAsDataURL(file);
            }}
          />
        </label>
      )}
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 shrink-0 rounded-md border border-border cursor-pointer p-0.5 bg-white"
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[12.5px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        />
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, min = 0, max = 9999, step = 1 }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type="number"
        value={value ?? 0}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[12.5px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[12.5px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{String(opt)}</option>
        ))}
      </select>
    </div>
  );
}

/** Lets the admin choose exactly which share icons appear on the article
 *  detail page — Facebook, X, LinkedIn, Medium, Substack, WhatsApp,
 *  Telegram, Email, Copy Link — mirroring the platform picker already used
 *  for the header's social icons. */
function SharePlatformField({ value, onChange }) {
  const selected = value || DEFAULT_SHARE_PLATFORMS;
  function toggle(key) {
    const has = selected.includes(key);
    const next = has ? selected.filter((k) => k !== key) : [...selected, key];
    onChange(next);
  }
  return (
    <div className="pt-1">
      <FieldLabel>Share platforms shown on the article</FieldLabel>
      <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-border bg-surface-soft/50">
        {Object.entries(SHARE_PLATFORMS).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const active = selected.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
                active ? "border-primary bg-primary text-white" : "border-border text-ink-600 hover:border-primary/40"
              }`}
            >
              <Icon size={12} />
              {cfg.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ToggleField({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      {label && <span className="text-[12.5px] font-medium text-ink-700">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={!!value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${value ? "bg-primary" : "bg-border"}`}
      >
        <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${value ? "translate-x-4" : "translate-x-0"}`} />
      </button>
    </label>
  );
}

function FieldLabel({ children }) {
  return <span className="block text-[11.5px] font-medium text-ink-500 mb-1">{children}</span>;
}

function Accordion({ label, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-border rounded-lg overflow-hidden self-start">
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors">
        <span className="text-[12.5px] font-semibold text-ink-900">{label}</span>
        {open ? <ChevronDown size={14} className="text-ink-400" /> : <ChevronRight size={14} className="text-ink-400" />}
      </button>
      {open && <div className="p-3 space-y-3">{children}</div>}
    </div>
  );
}
