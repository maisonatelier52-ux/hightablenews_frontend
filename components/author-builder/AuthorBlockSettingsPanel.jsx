
"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";

export default function AuthorBlockSettingsPanel({ templateId, data, onUpdate }) {
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
        <p className="text-[11.5px] text-ink-500 mt-0.5">Applies to this template across every author profile. Use <code className="text-ink-700">{"{name}"}</code> / <code className="text-ink-700">{"{firstName}"}</code> in titles.</p>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-[calc(100vh-260px)] overflow-y-auto">
        {data.stats && (
          <Accordion label="Stats strip">
            <div className="grid grid-cols-2 gap-2">
              <ToggleField label="Articles Published" value={data.stats.showArticles !== false} onChange={(v) => setPath(["stats", "showArticles"], v)} />
              <ToggleField label="Experience" value={data.stats.showExperience !== false} onChange={(v) => setPath(["stats", "showExperience"], v)} />
              <ToggleField label="Location" value={data.stats.showLocation !== false} onChange={(v) => setPath(["stats", "showLocation"], v)} />
              <ToggleField label="Awards" value={!!data.stats.showAwards} onChange={(v) => setPath(["stats", "showAwards"], v)} />
            </div>
            <ToggleField label="Show stats strip" value={data.stats.enabled !== false} onChange={(v) => setPath(["stats", "enabled"], v)} />
          </Accordion>
        )}

        {data.badges && (
          <Accordion label="Trust badges">
            <BadgeListField badges={data.badges} onChange={(v) => setPath(["badges"], v)} />
          </Accordion>
        )}

        <Accordion label="Latest articles">
          <TextField label="Section title" value={data.latestArticles?.title} onChange={(v) => setPath(["latestArticles", "title"], v)} hint="Supports {name} / {firstName}" />
          <SelectField label="Number of articles" value={data.latestArticles?.count ?? 6} onChange={(v) => setPath(["latestArticles", "count"], Number(v))} options={[3, 4, 6, 8, 9, 12]} />
          <SelectField label="Grid columns (desktop)" value={data.latestArticles?.columns ?? 3} onChange={(v) => setPath(["latestArticles", "columns"], Number(v))} options={[2, 3, 4]} />
          <SelectField label="Image ratio" value={data.latestArticles?.imageRatio || "16/9"} onChange={(v) => setPath(["latestArticles", "imageRatio"], v)} options={["1/1", "16/9", "4/3"]} />
          <div className="grid grid-cols-2 gap-2">
            <ToggleField label="Image" value={data.latestArticles?.showImage !== false} onChange={(v) => setPath(["latestArticles", "showImage"], v)} />
            <ToggleField label="Category" value={data.latestArticles?.showCategory !== false} onChange={(v) => setPath(["latestArticles", "showCategory"], v)} />
            <ToggleField label="Description" value={!!data.latestArticles?.showDescription} onChange={(v) => setPath(["latestArticles", "showDescription"], v)} />
            <ToggleField label="Date" value={data.latestArticles?.showDate !== false} onChange={(v) => setPath(["latestArticles", "showDate"], v)} />
            <ToggleField label="Read time" value={data.latestArticles?.showReadTime !== false} onChange={(v) => setPath(["latestArticles", "showReadTime"], v)} />
          </div>
        </Accordion>

        {data.about && (
          <Accordion label="About author">
            <ToggleField label="Show about section" value={data.about.enabled !== false} onChange={(v) => setPath(["about", "enabled"], v)} />
            <TextField label="Section title" value={data.about.title} onChange={(v) => setPath(["about", "title"], v)} hint="Supports {name} / {firstName}" />
          </Accordion>
        )}

        {data.topics && (
          <Accordion label="Topics covered">
            <ToggleField label="Show topics" value={data.topics.enabled !== false} onChange={(v) => setPath(["topics", "enabled"], v)} />
            <TextField label="Section title" value={data.topics.title} onChange={(v) => setPath(["topics", "title"], v)} />
          </Accordion>
        )}

        {data.moreWriters && (
          <Accordion label="More writers">
            <ToggleField label="Show more writers" value={data.moreWriters.enabled !== false} onChange={(v) => setPath(["moreWriters", "enabled"], v)} />
            <TextField label="Section title" value={data.moreWriters.title} onChange={(v) => setPath(["moreWriters", "title"], v)} />
            <SelectField label="Count" value={data.moreWriters.count ?? 4} onChange={(v) => setPath(["moreWriters", "count"], Number(v))} options={[3, 4, 5, 6]} />
          </Accordion>
        )}

        {data.mostRead && (
          <Accordion label="Most read">
            <ToggleField label="Show most read" value={data.mostRead.enabled !== false} onChange={(v) => setPath(["mostRead", "enabled"], v)} />
            <TextField label="Section title" value={data.mostRead.title} onChange={(v) => setPath(["mostRead", "title"], v)} hint="Supports {name} / {firstName}" />
            <SelectField label="Count" value={data.mostRead.count ?? 5} onChange={(v) => setPath(["mostRead", "count"], Number(v))} options={[3, 4, 5, 6]} />
            <ToggleField label="Show ranking numbers" value={data.mostRead.showNumbers !== false} onChange={(v) => setPath(["mostRead", "showNumbers"], v)} />
          </Accordion>
        )}

        {data.sidebar && (
          <Accordion label="Sticky sidebar widgets">
            <SidebarWidgetToggle label="About box" enabled={data.sidebar.about?.enabled} onToggle={(v) => setPath(["sidebar", "about", "enabled"], v)}>
              <TextField label="Title" value={data.sidebar.about?.title} onChange={(v) => setPath(["sidebar", "about", "title"], v)} hint="Supports {name} / {firstName}" />
            </SidebarWidgetToggle>
            <SidebarWidgetToggle label="Most Read" enabled={data.sidebar.mostRead?.enabled} onToggle={(v) => setPath(["sidebar", "mostRead", "enabled"], v)}>
              <TextField label="Title" value={data.sidebar.mostRead?.title} onChange={(v) => setPath(["sidebar", "mostRead", "title"], v)} />
              <SelectField label="Count" value={data.sidebar.mostRead?.count ?? 5} onChange={(v) => setPath(["sidebar", "mostRead", "count"], Number(v))} options={[3, 4, 5, 6]} />
              <ToggleField label="Show numbers" value={data.sidebar.mostRead?.showNumbers !== false} onChange={(v) => setPath(["sidebar", "mostRead", "showNumbers"], v)} />
            </SidebarWidgetToggle>
            <SidebarWidgetToggle label="Newsletter box" enabled={data.sidebar.newsletter?.enabled} onToggle={(v) => setPath(["sidebar", "newsletter", "enabled"], v)}>
              <TextField label="Heading" value={data.sidebar.newsletter?.heading} onChange={(v) => setPath(["sidebar", "newsletter", "heading"], v)} />
              <TextField label="Subheading" value={data.sidebar.newsletter?.subheading} onChange={(v) => setPath(["sidebar", "newsletter", "subheading"], v)} />
              <div className="grid grid-cols-2 gap-2">
                <TextField label="Email input placeholder" value={data.sidebar.newsletter?.placeholder} onChange={(v) => setPath(["sidebar", "newsletter", "placeholder"], v)} placeholder="Your email address" />
                <TextField label="Button label" value={data.sidebar.newsletter?.ctaLabel} onChange={(v) => setPath(["sidebar", "newsletter", "ctaLabel"], v)} />
              </div>
              <TextField
                label="Success message"
                value={data.sidebar.newsletter?.successMessage}
                onChange={(v) => setPath(["sidebar", "newsletter", "successMessage"], v)}
                placeholder="You're subscribed! Please check your inbox."
              />
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border mt-1">
                <ColorField label="Box background" value={data.sidebar.newsletter?.bgColor || "#111111"} onChange={(v) => setPath(["sidebar", "newsletter", "bgColor"], v)} />
                <ColorField label="Heading color" value={data.sidebar.newsletter?.headingColor || "#FAFAF8"} onChange={(v) => setPath(["sidebar", "newsletter", "headingColor"], v)} />
                <ColorField label="Subheading text color" value={data.sidebar.newsletter?.subheadingColor || "#888888"} onChange={(v) => setPath(["sidebar", "newsletter", "subheadingColor"], v)} />
                <ColorField label="Button color" value={data.sidebar.newsletter?.buttonColor || "#8B1A1A"} onChange={(v) => setPath(["sidebar", "newsletter", "buttonColor"], v)} />
                <ColorField label="Button text color" value={data.sidebar.newsletter?.buttonTextColor || "#ffffff"} onChange={(v) => setPath(["sidebar", "newsletter", "buttonTextColor"], v)} />
              </div>
            </SidebarWidgetToggle>
          </Accordion>
        )}

        <Accordion label="Card settings">
          <SelectField label="Image ratio" value={data.card?.imageRatio || "16/9"} onChange={(v) => setPath(["card", "imageRatio"], v)} options={["1/1", "16/9", "4/3"]} />
          <NumberField label="Card padding (px)" value={data.card?.padding ?? 12} min={0} max={48} onChange={(v) => setPath(["card", "padding"], v)} />
          <ToggleField label="Card border" value={data.card?.borderEnabled !== false} onChange={(v) => setPath(["card", "borderEnabled"], v)} />
        </Accordion>
      </div>
    </div>
  );
}

function BadgeListField({ badges, onChange }) {
  function update(id, patch) {
    onChange(badges.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }
  function remove(id) {
    onChange(badges.filter((b) => b.id !== id));
  }
  function add() {
    onChange([...badges, { id: `b_${Date.now()}`, title: "New Badge", description: "Short description", enabled: true }]);
  }
  return (
    <div className="space-y-3">
      {badges.map((b) => (
        <div key={b.id} className="border border-border rounded-lg p-2.5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <ToggleField label="Enabled" value={b.enabled !== false} onChange={(v) => update(b.id, { enabled: v })} />
            <button type="button" onClick={() => remove(b.id)} className="text-ink-300 hover:text-red-500 shrink-0">
              <Trash2 size={13} />
            </button>
          </div>
          <TextField label="Title" value={b.title} onChange={(v) => update(b.id, { title: v })} />
          <TextField label="Description" value={b.description} onChange={(v) => update(b.id, { description: v })} />
        </div>
      ))}
      <button type="button" onClick={add} className="w-full flex items-center justify-center gap-1.5 text-[12px] font-medium text-primary border border-dashed border-primary/30 rounded-lg py-2 hover:bg-primary-50 transition-colors">
        <Plus size={13} /> Add badge
      </button>
    </div>
  );
}

function SidebarWidgetToggle({ label, enabled, onToggle, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-border rounded-lg overflow-hidden mb-2 last:mb-0">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-900">
          {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />} {label}
        </button>
        <ToggleField value={enabled !== false} onChange={onToggle} />
      </div>
      {open && enabled !== false && <div className="p-3 space-y-3">{children}</div>}
    </div>
  );
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
