"use client";

import { Settings2, Plus, Trash2, GripVertical } from "lucide-react";
import { PAGE_BLOCK_DEFINITIONS, SIDEBAR_ONLY_DEFINITIONS, ICON_CHOICES, FONT_CHOICES } from "@/lib/pageBlockDefinitions";
import ImageUploadField from "./ImageUploadField";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[11.5px] font-medium text-ink-600 mb-1 block">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-border px-3 py-2 text-[13px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

function TextField({ label, value, onChange, placeholder }) {
  return (
    <Field label={label}>
      <input className={inputCls} value={value || ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

function TextareaField({ label, value, onChange, rows = 3 }) {
  return (
    <Field label={label}>
      <textarea className={inputCls} rows={rows} value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

function NumberField({ label, value, onChange, min, max }) {
  return (
    <Field label={label}>
      <input type="number" min={min} max={max} className={inputCls} value={value ?? ""} onChange={(e) => onChange(Number(e.target.value))} />
    </Field>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} className="h-9 w-9 rounded-md border border-border cursor-pointer" />
        <input className={inputCls} value={value || ""} onChange={(e) => onChange(e.target.value)} />
      </div>
    </Field>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}

function FontField({ label = "Font family", value, onChange }) {
  return <SelectField label={label} value={value || ""} onChange={onChange} options={FONT_CHOICES} />;
}

function IconPickerField({ label = "Icon", value, onChange }) {
  return (
    <Field label={label}>
      <select className={inputCls} value={value || ICON_CHOICES[0]} onChange={(e) => onChange(e.target.value)}>
        {ICON_CHOICES.map((k) => (
          <option key={k} value={k}>{k.replace(/-/g, " ")}</option>
        ))}
      </select>
    </Field>
  );
}

/** Generic repeating-item editor used by statsGrid / featureGrid / numberedList / relatedLinks.
 *  `renderItem` gets (item, updateItem) and returns the fields for one row. */
function RepeaterField({ label, items, onChange, makeItem, renderItem, addLabel = "Add item" }) {
  const list = items || [];
  function updateItem(i, patch) {
    const next = [...list];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  function removeItem(i) {
    onChange(list.filter((_, idx) => idx !== i));
  }
  return (
    <div>
      {label && <span className="text-[11.5px] font-medium text-ink-600 mb-1.5 block">{label}</span>}
      <div className="space-y-3">
        {list.map((item, i) => (
          <div key={item.id || i} className="rounded-lg border border-border p-2.5 space-y-1.5 bg-gray-50/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-ink-500 flex items-center gap-1"><GripVertical size={11} className="text-ink-300" /> Item {i + 1}</span>
              <button onClick={() => removeItem(i)} className="text-ink-400 hover:text-red-600">
                <Trash2 size={13} />
              </button>
            </div>
            {renderItem(item, (patch) => updateItem(i, patch))}
          </div>
        ))}
        <button
          onClick={() => onChange([...list, makeItem()])}
          className="flex items-center gap-1.5 text-[12px] font-medium text-primary hover:underline"
        >
          <Plus size={13} /> {addLabel}
        </button>
      </div>
    </div>
  );
}

export default function PageBlockSettingsPanel({ block, onUpdate }) {
  if (!block) {
    return (
      <div className="rounded-card border border-border bg-white shadow-soft p-8 text-center">
        <div className="h-11 w-11 rounded-card bg-primary-50 text-primary flex items-center justify-center mx-auto mb-3">
          <Settings2 size={20} />
        </div>
        <p className="text-[13.5px] font-semibold text-ink-900">No block selected</p>
        <p className="text-[12.5px] text-ink-500 mt-1">Click a block in the page structure to edit its settings.</p>
      </div>
    );
  }

  const def = PAGE_BLOCK_DEFINITIONS[block.type] || SIDEBAR_ONLY_DEFINITIONS[block.type];
  const data = block.data;
  const set = (patch) => onUpdate(block.id, { ...data, ...patch });

  return (
    <div className="rounded-card border border-border bg-white shadow-soft overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-gray-50/50">
        <h3 className="text-[13.5px] font-semibold text-ink-900">{def?.label} settings</h3>
        <p className="text-[11.5px] text-ink-500 mt-0.5">{def?.description}</p>
      </div>
      <div className="p-4 space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto">
        {block.type === "hero" && (
          <>
            <TextField label="Title" value={data.title} onChange={(v) => set({ title: v })} />
            <TextareaField label="Subtitle" value={data.subtitle} onChange={(v) => set({ subtitle: v })} />
            <ImageUploadField label="Background image" value={data.bgImage} onChange={(v) => set({ bgImage: v })} />
            <NumberField label="Overlay opacity (%)" value={data.overlayOpacity} min={0} max={100} onChange={(v) => set({ overlayOpacity: v })} />
            <NumberField label="Height (px)" value={data.height} min={160} max={640} onChange={(v) => set({ height: v })} />
            <ColorField label="Text color" value={data.textColor} onChange={(v) => set({ textColor: v })} />
            <FontField value={data.fontFamily} onChange={(v) => set({ fontFamily: v })} />
          </>
        )}

        {block.type === "heading" && (
          <>
            <TextField label="Text" value={data.text} onChange={(v) => set({ text: v })} />
            <SelectField
              label="Level"
              value={data.level}
              onChange={(v) => set({ level: v })}
              options={["h1", "h2", "h3", "h4"].map((l) => ({ value: l, label: l.toUpperCase() }))}
            />
            <SelectField
              label="Alignment"
              value={data.align}
              onChange={(v) => set({ align: v })}
              options={["left", "center", "right"].map((a) => ({ value: a, label: a }))}
            />
            <ColorField label="Color" value={data.color} onChange={(v) => set({ color: v })} />
            <FontField value={data.fontFamily} onChange={(v) => set({ fontFamily: v })} />
            <NumberField label="Custom font size (px, optional)" value={data.fontSize} min={12} max={72} onChange={(v) => set({ fontSize: v || null })} />
          </>
        )}

        {block.type === "richText" && (
          <>
            <TextareaField label="HTML content" value={data.html} rows={8} onChange={(v) => set({ html: v })} />
            <SelectField
              label="Max width"
              value={data.maxWidth}
              onChange={(v) => set({ maxWidth: v })}
              options={[{ value: "prose", label: "Readable column" }, { value: "wide", label: "Wide" }, { value: "full", label: "Full width" }]}
            />
            <SelectField
              label="Alignment"
              value={data.align || "left"}
              onChange={(v) => set({ align: v })}
              options={["left", "center", "right"].map((a) => ({ value: a, label: a }))}
            />
            <ColorField label="Text color" value={data.color} onChange={(v) => set({ color: v })} />
            <FontField value={data.fontFamily} onChange={(v) => set({ fontFamily: v })} />
            <NumberField label="Custom font size (px, optional)" value={data.fontSize} min={10} max={32} onChange={(v) => set({ fontSize: v || null })} />
          </>
        )}

        {block.type === "image" && (
          <>
            <ImageUploadField label="Image" value={data.url} onChange={(v) => set({ url: v })} />
            <TextField label="Alt text" value={data.alt} onChange={(v) => set({ alt: v })} />
            <TextField label="Caption" value={data.caption} onChange={(v) => set({ caption: v })} />
          </>
        )}

        {block.type === "imageText" && (
          <>
            <ImageUploadField label="Image" value={data.imageUrl} onChange={(v) => set({ imageUrl: v })} aspect="aspect-[4/3]" />
            <TextField label="Image alt text" value={data.imageAlt} onChange={(v) => set({ imageAlt: v })} />
            <TextField label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} />
            <TextareaField label="Body" value={data.body} onChange={(v) => set({ body: v })} />
            <SelectField
              label="Image position"
              value={data.imagePosition}
              onChange={(v) => set({ imagePosition: v })}
              options={[{ value: "left", label: "Left" }, { value: "right", label: "Right" }]}
            />
          </>
        )}

        {block.type === "gallery" && (
          <>
            <NumberField label="Columns" value={data.columns} min={2} max={5} onChange={(v) => set({ columns: v })} />
            <RepeaterField
              label="Images"
              items={data.images}
              onChange={(images) => set({ images })}
              makeItem={() => ({ id: `img_${Date.now()}`, url: "" })}
              addLabel="Add image"
              renderItem={(img, update) => (
                <ImageUploadField value={img.url} onChange={(v) => update({ url: v })} aspect="aspect-square" />
              )}
            />
          </>
        )}

        {block.type === "quote" && (
          <>
            <TextareaField label="Quote text" value={data.text} onChange={(v) => set({ text: v })} />
            <TextField label="Attribution" value={data.attribution} onChange={(v) => set({ attribution: v })} />
          </>
        )}

        {block.type === "cta" && (
          <>
            <TextField label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} />
            <TextareaField label="Body" value={data.body} onChange={(v) => set({ body: v })} />
            <TextField label="Button label" value={data.buttonLabel} onChange={(v) => set({ buttonLabel: v })} />
            <TextField label="Button URL" value={data.buttonUrl} onChange={(v) => set({ buttonUrl: v })} placeholder="/contact" />
            <ColorField label="Background" value={data.bg} onChange={(v) => set({ bg: v })} />
            <ColorField label="Text color" value={data.textColor} onChange={(v) => set({ textColor: v })} />
          </>
        )}

        {block.type === "faq" && (
          <>
            <TextField label="Title" value={data.title} onChange={(v) => set({ title: v })} />
            <RepeaterField
              items={data.items}
              onChange={(items) => set({ items })}
              makeItem={() => ({ id: `q_${Date.now()}`, question: "", answer: "" })}
              addLabel="Add question"
              renderItem={(item, update) => (
                <>
                  <input className={inputCls} value={item.question || ""} placeholder="Question" onChange={(e) => update({ question: e.target.value })} />
                  <textarea className={inputCls} rows={2} value={item.answer || ""} placeholder="Answer" onChange={(e) => update({ answer: e.target.value })} />
                </>
              )}
            />
          </>
        )}

        {block.type === "team" && (
          <>
            <TextField label="Title" value={data.title} onChange={(v) => set({ title: v })} />
            <RepeaterField
              items={data.members}
              onChange={(members) => set({ members })}
              makeItem={() => ({ id: `m_${Date.now()}`, name: "", role: "", photo: "" })}
              addLabel="Add member"
              renderItem={(m, update) => (
                <>
                  <input className={inputCls} value={m.name || ""} placeholder="Name" onChange={(e) => update({ name: e.target.value })} />
                  <input className={inputCls} value={m.role || ""} placeholder="Role" onChange={(e) => update({ role: e.target.value })} />
                  <ImageUploadField value={m.photo} onChange={(v) => update({ photo: v })} aspect="aspect-square" />
                </>
              )}
            />
          </>
        )}

        {block.type === "newsletter" && (
          <>
            <TextField label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} />
            <TextareaField label="Subheading" value={data.subheading} onChange={(v) => set({ subheading: v })} />
            <ColorField label="Background" value={data.bg} onChange={(v) => set({ bg: v })} />
            <p className="text-[11.5px] text-ink-400">This form posts to the real subscriber list — no extra setup needed.</p>
          </>
        )}

        {block.type === "video" && (
          <>
            <TextField label="Video URL (YouTube)" value={data.url} onChange={(v) => set({ url: v })} placeholder="https://youtube.com/watch?v=..." />
            <TextField label="Caption" value={data.caption} onChange={(v) => set({ caption: v })} />
          </>
        )}

        {block.type === "map" && (
          <>
            <TextField label="Address" value={data.address} onChange={(v) => set({ address: v })} />
            <TextField label="Map embed URL" value={data.mapEmbedUrl} onChange={(v) => set({ mapEmbedUrl: v })} placeholder="Google Maps embed URL" />
          </>
        )}

        {block.type === "divider" && (
          <>
            <SelectField
              label="Style"
              value={data.style}
              onChange={(v) => set({ style: v })}
              options={[{ value: "line", label: "Line" }, { value: "space", label: "Blank space" }]}
            />
            <NumberField label="Spacing (px)" value={data.spacing} min={8} max={120} onChange={(v) => set({ spacing: v })} />
          </>
        )}

        {block.type === "embedHtml" && <TextareaField label="HTML / embed code" value={data.html} rows={8} onChange={(v) => set({ html: v })} />}

        {block.type === "statsGrid" && (
          <>
            <ColorField label="Background" value={data.bg} onChange={(v) => set({ bg: v })} />
            <ColorField label="Number color" value={data.numberColor} onChange={(v) => set({ numberColor: v })} />
            <RepeaterField
              label="Stats"
              items={data.items}
              onChange={(items) => set({ items })}
              makeItem={() => ({ id: `s_${Date.now()}`, number: "10+", label: "Description" })}
              addLabel="Add stat"
              renderItem={(item, update) => (
                <>
                  <input className={inputCls} value={item.number || ""} placeholder="Number (e.g. 25+)" onChange={(e) => update({ number: e.target.value })} />
                  <input className={inputCls} value={item.label || ""} placeholder="Label" onChange={(e) => update({ label: e.target.value })} />
                </>
              )}
            />
          </>
        )}

        {block.type === "featureGrid" && (
          <>
            <TextField label="Section title (optional)" value={data.title} onChange={(v) => set({ title: v })} />
            <NumberField label="Columns" value={data.columns} min={1} max={4} onChange={(v) => set({ columns: v })} />
            <ColorField label="Icon color" value={data.iconColor} onChange={(v) => set({ iconColor: v })} />
            <RepeaterField
              label="Items"
              items={data.items}
              onChange={(items) => set({ items })}
              makeItem={() => ({ id: `f_${Date.now()}`, icon: "star", title: "Title", body: "Description" })}
              addLabel="Add item"
              renderItem={(item, update) => (
                <>
                  <IconPickerField value={item.icon} onChange={(v) => update({ icon: v })} />
                  <input className={inputCls} value={item.title || ""} placeholder="Title" onChange={(e) => update({ title: e.target.value })} />
                  <textarea className={inputCls} rows={2} value={item.body || ""} placeholder="Description" onChange={(e) => update({ body: e.target.value })} />
                </>
              )}
            />
          </>
        )}

        {block.type === "numberedList" && (
          <>
            <ColorField label="Icon / number color" value={data.iconColor} onChange={(v) => set({ iconColor: v })} />
            <RepeaterField
              label="Sections"
              items={data.items}
              onChange={(items) => set({ items })}
              makeItem={() => ({ id: `n_${Date.now()}`, icon: "file-text", number: String((data.items?.length || 0) + 1), title: "Section title", body: "Section body" })}
              addLabel="Add section"
              renderItem={(item, update) => (
                <>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input className={inputCls} value={item.number || ""} placeholder="No. (e.g. 1)" onChange={(e) => update({ number: e.target.value })} />
                    <IconPickerField value={item.icon} onChange={(v) => update({ icon: v })} />
                  </div>
                  <input className={inputCls} value={item.title || ""} placeholder="Section title" onChange={(e) => update({ title: e.target.value })} />
                  <textarea className={inputCls} rows={3} value={item.body || ""} placeholder="Section body" onChange={(e) => update({ body: e.target.value })} />
                </>
              )}
            />
          </>
        )}

        {block.type === "editorNote" && (
          <>
            <TextField label="Eyebrow label" value={data.eyebrow} onChange={(v) => set({ eyebrow: v })} />
            <TextField label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} />
            <TextareaField label="Body" value={data.body} onChange={(v) => set({ body: v })} />
            <TextField label="Signature" value={data.signature} onChange={(v) => set({ signature: v })} />
            <ImageUploadField label="Image" value={data.image} onChange={(v) => set({ image: v })} aspect="aspect-[4/3]" />
            <ColorField label="Background" value={data.bg} onChange={(v) => set({ bg: v })} />
          </>
        )}

        {/* ── Sidebar-only widgets ─────────────────────────────────────── */}
        {block.type === "aboutBox" && (
          <>
            <TextField label="Title" value={data.title} onChange={(v) => set({ title: v })} />
            <ImageUploadField label="Image" value={data.image} onChange={(v) => set({ image: v })} aspect="aspect-video" />
            <TextareaField label="Body" value={data.body} onChange={(v) => set({ body: v })} />
            <TextField label="Link label" value={data.linkLabel} onChange={(v) => set({ linkLabel: v })} />
            <TextField label="Link URL" value={data.linkUrl} onChange={(v) => set({ linkUrl: v })} placeholder="/page/about" />
          </>
        )}

        {block.type === "relatedLinks" && (
          <>
            <TextField label="Title" value={data.title} onChange={(v) => set({ title: v })} />
            <RepeaterField
              label="Links"
              items={data.links}
              onChange={(links) => set({ links })}
              makeItem={() => ({ id: `l_${Date.now()}`, label: "Page title", url: "/page/slug" })}
              addLabel="Add link"
              renderItem={(item, update) => (
                <>
                  <input className={inputCls} value={item.label || ""} placeholder="Link label" onChange={(e) => update({ label: e.target.value })} />
                  <input className={inputCls} value={item.url || ""} placeholder="/page/slug" onChange={(e) => update({ url: e.target.value })} />
                </>
              )}
            />
          </>
        )}

        {block.type === "contactInfo" && (
          <>
            <TextField label="Title" value={data.title} onChange={(v) => set({ title: v })} />
            <TextField label="Email" value={data.email} onChange={(v) => set({ email: v })} />
            <TextareaField label="Address" value={data.address} onChange={(v) => set({ address: v })} />
          </>
        )}
      </div>
    </div>
  );
}
