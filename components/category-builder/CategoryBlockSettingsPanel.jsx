"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, X } from "lucide-react";

export default function CategoryBlockSettingsPanel({ templateId, data, onUpdate }) {
  const set = (patch) => onUpdate(patch);
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
        <p className="text-[11.5px] text-ink-500 mt-0.5">Applies to this template across every category.</p>
      </div>

      <div className="p-4 space-y-3 max-h-[calc(100vh-260px)] overflow-y-auto">
        <Accordion label="Category banner">
          <TextField label="Default title" value={data.banner?.title} onChange={(v) => setPath(["banner", "title"], v)} hint="Overridden automatically by the active category's name" />
          <TextAreaField label="Default description" value={data.banner?.description} onChange={(v) => setPath(["banner", "description"], v)} />
          <TextField label="Background image URL" value={data.banner?.bgImage} onChange={(v) => setPath(["banner", "bgImage"], v)} placeholder="https://…" />
          <RangeField label="Overlay opacity" value={data.banner?.overlayOpacity ?? 70} min={0} max={100} unit="%" onChange={(v) => setPath(["banner", "overlayOpacity"], v)} />
          <ToggleField label="Show globe graphic" value={data.banner?.showGlobeGraphic !== false} onChange={(v) => setPath(["banner", "showGlobeGraphic"], v)} />
        </Accordion>

        <Accordion label="Hero / lead story">
          <p className="text-[11px] text-ink-400 -mt-1 mb-1">Articles tagged <strong>Client News</strong> always take this slot first, newest first. Falls back to the newest article in the category.</p>
          {templateId === "sticky-editorial" && (
            <ToggleField label="Show 'Live Coverage' badge" value={data.hero?.showLiveBadge !== false} onChange={(v) => setPath(["hero", "showLiveBadge"], v)} />
          )}
          {templateId === "carousel-magazine" && (
            <>
              <NumberField label="Hero slides" value={data.hero?.slideCount ?? 5} min={1} max={8} onChange={(v) => setPath(["hero", "slideCount"], v)} />
              <TextField label="CTA button label" value={data.hero?.ctaLabel} onChange={(v) => setPath(["hero", "ctaLabel"], v)} />
            </>
          )}
          {(templateId === "sticky-editorial" || templateId === "grid-2col" || templateId === "grid-3col") && (
            <ToggleField label="Show description" value={!!data.hero?.showDescription} onChange={(v) => setPath(["hero", "showDescription"], v)} />
          )}
          <div className="grid grid-cols-3 gap-2">
            <ToggleField label="Author" value={data.hero?.showAuthor !== false} onChange={(v) => setPath(["hero", "showAuthor"], v)} />
            <ToggleField label="Date" value={data.hero?.showDate !== false} onChange={(v) => setPath(["hero", "showDate"], v)} />
            <ToggleField label="Read time" value={data.hero?.showReadTime !== false} onChange={(v) => setPath(["hero", "showReadTime"], v)} />
          </div>
        </Accordion>

        {templateId === "sticky-editorial" && (
          <StickyEditorialSettings data={data} setPath={setPath} />
        )}
        {(templateId === "grid-2col" || templateId === "grid-3col") && (
          <GridSettings data={data} setPath={setPath} fixedColumns={templateId === "grid-2col" ? 2 : 3} />
        )}
        {templateId === "carousel-magazine" && (
          <CarouselSettings data={data} setPath={setPath} />
        )}

        <Accordion label="Card settings">
          <SelectField label="Image ratio" value={data.card?.imageRatio || "16/9"} onChange={(v) => setPath(["card", "imageRatio"], v)} options={["1/1", "16/9", "4/3"]} />
          <NumberField label="Card padding (px)" value={data.card?.padding ?? 0} min={0} max={48} onChange={(v) => setPath(["card", "padding"], v)} />
          <ToggleField label="Card border" value={!!data.card?.borderEnabled} onChange={(v) => setPath(["card", "borderEnabled"], v)} />
        </Accordion>
      </div>
    </div>
  );
}

// ─── Template 1: Sticky Sidebar Editorial ──────────────────────────────────

function StickyEditorialSettings({ data, setPath }) {
  return (
    <>
      <Accordion label="Top stories grid">
        <TextField label="Section title" value={data.topStories?.title} onChange={(v) => setPath(["topStories", "title"], v)} />
        <SelectField label="Number of stories" value={data.topStories?.count ?? 3} onChange={(v) => setPath(["topStories", "count"], Number(v))} options={[2, 3, 4, 6]} />
        <SelectField label="Image ratio" value={data.topStories?.imageRatio || "16/9"} onChange={(v) => setPath(["topStories", "imageRatio"], v)} options={["1/1", "16/9", "4/3"]} />
        <div className="grid grid-cols-2 gap-2">
          <ToggleField label="Image" value={data.topStories?.showImage !== false} onChange={(v) => setPath(["topStories", "showImage"], v)} />
          <ToggleField label="Description" value={data.topStories?.showDescription !== false} onChange={(v) => setPath(["topStories", "showDescription"], v)} />
          <ToggleField label="Author" value={data.topStories?.showAuthor !== false} onChange={(v) => setPath(["topStories", "showAuthor"], v)} />
          <ToggleField label="Date" value={data.topStories?.showDate !== false} onChange={(v) => setPath(["topStories", "showDate"], v)} />
        </div>
      </Accordion>

      <Accordion label="Opinion strip">
        <ToggleField label="Show opinion strip" value={data.opinion?.enabled !== false} onChange={(v) => setPath(["opinion", "enabled"], v)} />
        {data.opinion?.enabled !== false && (
          <>
            <TextField label="Section title" value={data.opinion?.title} onChange={(v) => setPath(["opinion", "title"], v)} />
            <SelectField label="Number of cards" value={data.opinion?.count ?? 2} onChange={(v) => setPath(["opinion", "count"], Number(v))} options={[2, 3, 4]} />
          </>
        )}
      </Accordion>

      <Accordion label="Article list">
        <TextField label="Section title" value={data.articleList?.title} onChange={(v) => setPath(["articleList", "title"], v)} />
        <SelectField label="Number of articles" value={data.articleList?.count ?? 12} onChange={(v) => setPath(["articleList", "count"], Number(v))} options={[6, 8, 12, 16, 20]} />
        <div className="grid grid-cols-2 gap-2">
          <ToggleField label="Image" value={data.articleList?.showImage !== false} onChange={(v) => setPath(["articleList", "showImage"], v)} />
          <ToggleField label="Description" value={data.articleList?.showDescription !== false} onChange={(v) => setPath(["articleList", "showDescription"], v)} />
          <ToggleField label="Author" value={data.articleList?.showAuthor !== false} onChange={(v) => setPath(["articleList", "showAuthor"], v)} />
          <ToggleField label="Date" value={data.articleList?.showDate !== false} onChange={(v) => setPath(["articleList", "showDate"], v)} />
          <ToggleField label="Read time" value={data.articleList?.showReadTime !== false} onChange={(v) => setPath(["articleList", "showReadTime"], v)} />
        </div>
      </Accordion>

      <Accordion label="Sticky sidebar widgets">
        <SidebarWidgetToggle label="Most Read" enabled={data.sidebar?.mostRead?.enabled} onToggle={(v) => setPath(["sidebar", "mostRead", "enabled"], v)}>
          <TextField label="Title" value={data.sidebar?.mostRead?.title} onChange={(v) => setPath(["sidebar", "mostRead", "title"], v)} />
          <SelectField label="Count" value={data.sidebar?.mostRead?.count ?? 3} onChange={(v) => setPath(["sidebar", "mostRead", "count"], Number(v))} options={[3, 4, 5]} />
          <ToggleField label="Show numbers" value={data.sidebar?.mostRead?.showNumbers !== false} onChange={(v) => setPath(["sidebar", "mostRead", "showNumbers"], v)} />
        </SidebarWidgetToggle>
        <SidebarWidgetToggle label="Latest Updates" enabled={data.sidebar?.latest?.enabled} onToggle={(v) => setPath(["sidebar", "latest", "enabled"], v)}>
          <TextField label="Title" value={data.sidebar?.latest?.title} onChange={(v) => setPath(["sidebar", "latest", "title"], v)} />
          <SelectField label="Count" value={data.sidebar?.latest?.count ?? 4} onChange={(v) => setPath(["sidebar", "latest", "count"], Number(v))} options={[3, 4, 5, 6]} />
        </SidebarWidgetToggle>
        <SidebarWidgetToggle label="Newsletter box" enabled={data.sidebar?.newsletter?.enabled} onToggle={(v) => setPath(["sidebar", "newsletter", "enabled"], v)}>
          <TextField label="Heading" value={data.sidebar?.newsletter?.heading} onChange={(v) => setPath(["sidebar", "newsletter", "heading"], v)} />
          <TextField label="Subheading" value={data.sidebar?.newsletter?.subheading} onChange={(v) => setPath(["sidebar", "newsletter", "subheading"], v)} />
          <div className="grid grid-cols-2 gap-2">
            <TextField label="Email input placeholder" value={data.sidebar?.newsletter?.placeholder} onChange={(v) => setPath(["sidebar", "newsletter", "placeholder"], v)} placeholder="Your email address" />
            <TextField label="Button label" value={data.sidebar?.newsletter?.ctaLabel} onChange={(v) => setPath(["sidebar", "newsletter", "ctaLabel"], v)} />
          </div>
          <TextField
            label="Success message"
            value={data.sidebar?.newsletter?.successMessage}
            onChange={(v) => setPath(["sidebar", "newsletter", "successMessage"], v)}
            placeholder="You're subscribed! Please check your inbox."
          />
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border mt-1">
            <ColorField label="Box background" value={data.sidebar?.newsletter?.bgColor || "#111111"} onChange={(v) => setPath(["sidebar", "newsletter", "bgColor"], v)} />
            <ColorField label="Heading color" value={data.sidebar?.newsletter?.headingColor || "#FAFAF8"} onChange={(v) => setPath(["sidebar", "newsletter", "headingColor"], v)} />
            <ColorField label="Subheading text color" value={data.sidebar?.newsletter?.subheadingColor || "#888888"} onChange={(v) => setPath(["sidebar", "newsletter", "subheadingColor"], v)} />
            <ColorField label="Button color" value={data.sidebar?.newsletter?.buttonColor || "#8B1A1A"} onChange={(v) => setPath(["sidebar", "newsletter", "buttonColor"], v)} />
            <ColorField label="Button text color" value={data.sidebar?.newsletter?.buttonTextColor || "#ffffff"} onChange={(v) => setPath(["sidebar", "newsletter", "buttonTextColor"], v)} />
          </div>
        </SidebarWidgetToggle>
        <SidebarWidgetToggle label="Topic tags" enabled={data.sidebar?.topics?.enabled} onToggle={(v) => setPath(["sidebar", "topics", "enabled"], v)}>
          <TextField label="Title" value={data.sidebar?.topics?.title} onChange={(v) => setPath(["sidebar", "topics", "title"], v)} />
          <TagListField tags={data.sidebar?.topics?.tags || []} onChange={(tags) => setPath(["sidebar", "topics", "tags"], tags)} />
        </SidebarWidgetToggle>
        <SidebarWidgetToggle label="Author list" enabled={data.sidebar?.authors?.enabled} onToggle={(v) => setPath(["sidebar", "authors", "enabled"], v)}>
          <TextField label="Title" value={data.sidebar?.authors?.title} onChange={(v) => setPath(["sidebar", "authors", "title"], v)} />
          <SelectField label="Count" value={data.sidebar?.authors?.count ?? 4} onChange={(v) => setPath(["sidebar", "authors", "count"], Number(v))} options={[3, 4, 5]} />
        </SidebarWidgetToggle>
      </Accordion>
    </>
  );
}

// ─── Template 2 & 3: Grid layouts ──────────────────────────────────────────

function GridSettings({ data, setPath, fixedColumns }) {
  return (
    <>
      <Accordion label="Article grid">
        <p className="text-[11px] text-ink-400 -mt-1">Columns: {fixedColumns} (fixed by this template's design)</p>
        <SelectField label="Number of articles" value={data.grid?.count ?? 12} onChange={(v) => setPath(["grid", "count"], Number(v))} options={[6, 9, 12, 16, 20]} />
        <SelectField label="Image ratio" value={data.grid?.imageRatio || "16/9"} onChange={(v) => setPath(["grid", "imageRatio"], v)} options={["1/1", "16/9", "4/3"]} />
        <div className="grid grid-cols-2 gap-2">
          <ToggleField label="Image" value={data.grid?.showImage !== false} onChange={(v) => setPath(["grid", "showImage"], v)} />
          <ToggleField label="Description" value={!!data.grid?.showDescription} onChange={(v) => setPath(["grid", "showDescription"], v)} />
          <ToggleField label="Author" value={data.grid?.showAuthor !== false} onChange={(v) => setPath(["grid", "showAuthor"], v)} />
          <ToggleField label="Date" value={data.grid?.showDate !== false} onChange={(v) => setPath(["grid", "showDate"], v)} />
          <ToggleField label="Read time" value={data.grid?.showReadTime !== false} onChange={(v) => setPath(["grid", "showReadTime"], v)} />
        </div>
      </Accordion>
      <Accordion label="Load more">
        <ToggleField label="Enable Load More button" value={data.loadMore?.enabled !== false} onChange={(v) => setPath(["loadMore", "enabled"], v)} />
        {data.loadMore?.enabled !== false && (
          <>
            <TextField label="Button label" value={data.loadMore?.label} onChange={(v) => setPath(["loadMore", "label"], v)} />
            <NumberField label="Articles per click" value={data.loadMore?.batchSize ?? 6} min={1} max={24} onChange={(v) => setPath(["loadMore", "batchSize"], v)} />
          </>
        )}
      </Accordion>
    </>
  );
}

// ─── Template 4: Carousel Magazine ─────────────────────────────────────────

function CarouselSettings({ data, setPath }) {
  return (
    <>
      <Accordion label="Top Stories carousel">
        <TextField label="Section title" value={data.topStories?.title} onChange={(v) => setPath(["topStories", "title"], v)} />
        <SelectField label="Visible at once (desktop)" value={data.topStories?.visibleCount ?? 5} onChange={(v) => setPath(["topStories", "visibleCount"], Number(v))} options={[3, 4, 5]} />
        <NumberField label="Total slides" value={data.topStories?.totalSlides ?? 9} min={visibleMin(data)} max={16} onChange={(v) => setPath(["topStories", "totalSlides"], v)} />
      </Accordion>
      <Accordion label="Latest updates">
        <TextField label="Section title" value={data.latestUpdates?.title} onChange={(v) => setPath(["latestUpdates", "title"], v)} />
        <SelectField label="Number of articles" value={data.latestUpdates?.count ?? 6} onChange={(v) => setPath(["latestUpdates", "count"], Number(v))} options={[4, 6, 8]} />
        <SelectField label="Columns" value={data.latestUpdates?.columns ?? 3} onChange={(v) => setPath(["latestUpdates", "columns"], Number(v))} options={[2, 3]} />
      </Accordion>
      <Accordion label="More from category">
        <TextField label="Section title" value={data.moreFromCategory?.title} onChange={(v) => setPath(["moreFromCategory", "title"], v)} />
        <SelectField label="Number of articles" value={data.moreFromCategory?.count ?? 6} onChange={(v) => setPath(["moreFromCategory", "count"], Number(v))} options={[3, 6, 9]} />
      </Accordion>
    </>
  );
}
function visibleMin(data) { return data?.topStories?.visibleCount ?? 5; }

// ─── Shared small widgets ──────────────────────────────────────────────────

function SidebarWidgetToggle({ label, enabled, onToggle, children }) {
  const isOn = enabled !== false;
  return (
    <div className="border border-border rounded-lg p-2.5 space-y-2.5">
      <ToggleField label={label} value={isOn} onChange={onToggle} />
      {isOn && <div className="space-y-2.5 pt-1 border-t border-border">{children}</div>}
    </div>
  );
}

function TagListField({ tags, onChange }) {
  const [draft, setDraft] = useState("");
  function add() {
    const v = draft.trim();
    if (!v) return;
    onChange([...tags, v]);
    setDraft("");
  }
  return (
    <div>
      <FieldLabel>Tags</FieldLabel>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((t, i) => (
          <span key={`${t}-${i}`} className="flex items-center gap-1 text-[11px] bg-surface-soft border border-border rounded-full pl-2.5 pr-1 py-1">
            {t}
            <button onClick={() => onChange(tags.filter((_, idx) => idx !== i))} className="text-ink-400 hover:text-red-500">
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Add a topic…"
          className="flex-1 rounded-lg border border-border bg-surface-soft px-3 py-1.5 text-[12px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button onClick={add} className="px-2.5 rounded-lg border border-border text-ink-500 hover:bg-surface-soft">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Field primitives (mirrors Homepage Builder's settings-panel style) ───

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function FieldLabel({ children }) {
  return <label className="block text-[12px] font-medium text-ink-700 mb-1">{children}</label>;
}

function TextField({ label, value, onChange, placeholder, hint }) {
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
      {hint && <p className="text-[10.5px] text-ink-400 mt-1">{hint}</p>}
    </div>
  );
}

function TextAreaField({ label, value, onChange }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[12.5px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
      />
    </div>
  );
}

function NumberField({ label, value, onChange, min = 0, max = 9999 }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type="number"
        value={value || 0}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[12.5px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
      />
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

function RangeField({ label, value, onChange, min, max, unit = "" }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <FieldLabel>{label}</FieldLabel>
        <span className="text-[12px] text-ink-500 font-mono">{value}{unit}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}

function ToggleField({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="text-[12.5px] font-medium text-ink-700">{label}</span>
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

function Accordion({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors">
        <span className="text-[12.5px] font-semibold text-ink-900">{label}</span>
        {open ? <ChevronDown size={14} className="text-ink-400" /> : <ChevronRight size={14} className="text-ink-400" />}
      </button>
      {open && <div className="p-3 space-y-3">{children}</div>}
    </div>
  );
}