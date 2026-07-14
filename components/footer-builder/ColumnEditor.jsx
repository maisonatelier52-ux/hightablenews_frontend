"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Plus, Link as LinkIcon, ChevronDown } from "lucide-react";
import { makeId } from "@/lib/api";
import { Field, Select, Slider } from "@/components/ui/Field";

const COLUMN_TYPES = [
  { value: "links", label: "Links" },
  { value: "text", label: "Text Block" },
  { value: "newsletter", label: "Newsletter" },
  { value: "social", label: "Social Icons" },
  { value: "logo", label: "Logo Block" },
];

export default function ColumnEditor({ column, onChange, onDelete, defaultOpen = false }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: column.id });
  const [open, setOpen] = useState(defaultOpen);

  const style = { transform: CSS.Transform.toString(transform), transition };
  const links = column.links || [];

  function updateLink(linkId, patch) {
    onChange({ ...column, links: links.map((l) => (l.id === linkId ? { ...l, ...patch } : l)) });
  }

  function addLink() {
    onChange({ ...column, links: [...links, { id: makeId("link"), label: "New link", url: "/" }] });
  }

  function deleteLink(linkId) {
    onChange({ ...column, links: links.filter((l) => l.id !== linkId) });
  }

  function moveLink(index, dir) {
    const next = [...links];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange({ ...column, links: next });
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border border-border bg-white ${isDragging ? "shadow-lift dnd-dragging" : "shadow-soft"}`}
    >
      <div className="flex items-center gap-2 p-2.5">
        <button className="text-ink-400 hover:text-ink-600 cursor-grab touch-none" {...attributes} {...listeners} aria-label="Drag to reorder column">
          <GripVertical size={16} />
        </button>
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-1.5 flex-1 min-w-0 text-left">
          <ChevronDown size={14} className={`text-ink-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
          <input
            value={column.title}
            onChange={(e) => onChange({ ...column, title: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            placeholder="Column title"
            className="flex-1 min-w-0 rounded-md border border-border bg-surface-soft px-2 py-1.5 text-[13px] font-semibold text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </button>
        <button onClick={() => onDelete(column.id)} className="text-ink-400 hover:text-red-500 p-1">
          <Trash2 size={15} />
        </button>
      </div>

      {open && (
        <div className="border-t border-border p-3 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Column Title">
              <input
                value={column.title}
                onChange={(e) => onChange({ ...column, title: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </Field>
            <Field label="Column Type">
              <Select value={column.type} onChange={(e) => onChange({ ...column, type: e.target.value })}>
                {COLUMN_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Column Width">
            <Slider value={column.width} min={0} max={100} unit="%" onChange={(v) => onChange({ ...column, width: v })} />
          </Field>

          {column.type === "links" && (
            <div className="space-y-2">
              {links.map((link, idx) => (
                <div key={link.id} className="flex items-center gap-1.5">
                  <LinkIcon size={12} className="text-ink-400 shrink-0" />
                  <input
                    value={link.label}
                    onChange={(e) => updateLink(link.id, { label: e.target.value })}
                    className="w-24 rounded-md border border-border bg-surface-soft px-2 py-1.5 text-[12.5px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    value={link.url}
                    onChange={(e) => updateLink(link.id, { url: e.target.value })}
                    className="flex-1 min-w-0 rounded-md border border-border bg-surface-soft px-2 py-1.5 text-[12.5px] text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <div className="flex flex-col">
                    <button onClick={() => moveLink(idx, -1)} disabled={idx === 0} className="text-ink-400 hover:text-ink-700 disabled:opacity-30 leading-none text-[10px]">▲</button>
                    <button onClick={() => moveLink(idx, 1)} disabled={idx === links.length - 1} className="text-ink-400 hover:text-ink-700 disabled:opacity-30 leading-none text-[10px]">▼</button>
                  </div>
                  <button onClick={() => deleteLink(link.id)} className="text-ink-400 hover:text-red-500 p-1">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              <button onClick={addLink} className="flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary-600 pt-1">
                <Plus size={13} /> Add Link
              </button>
            </div>
          )}

          {column.type === "text" && (
            <Field label="Text Content">
              <textarea
                value={column.text || ""}
                onChange={(e) => onChange({ ...column, text: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </Field>
          )}

          {(column.type === "newsletter" || column.type === "social" || column.type === "logo") && (
            <p className="text-[12px] text-ink-400">
              This column renders the {COLUMN_TYPES.find((t) => t.value === column.type)?.label} module — configure it in the matching tab.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
