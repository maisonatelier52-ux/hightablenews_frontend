"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, ChevronDown, Plus, CornerDownRight } from "lucide-react";
import { makeId } from "@/lib/api";

export default function MenuItemRow({ item, onChange, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const [expanded, setExpanded] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const children = item.children || [];

  function updateChild(childId, patch) {
    onChange({
      ...item,
      children: children.map((c) => (c.id === childId ? { ...c, ...patch } : c)),
    });
  }

  function addChild() {
    onChange({
      ...item,
      url: children.length === 0 ? "" : item.url,
      children: [...children, { id: makeId("sub"), label: "New item", url: "/" }],
    });
    setExpanded(true);
  }

  function deleteChild(childId) {
    onChange({ ...item, children: children.filter((c) => c.id !== childId) });
  }

  function moveChild(index, dir) {
    const next = [...children];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange({ ...item, children: next });
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border border-border bg-white ${isDragging ? "shadow-lift dnd-dragging" : "shadow-soft"}`}
    >
      <div className="flex items-center gap-2 p-2.5">
        <button
          className="text-ink-400 hover:text-ink-600 cursor-grab touch-none px-0.5"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>

        <input
          value={item.label}
          onChange={(e) => onChange({ ...item, label: e.target.value })}
          placeholder="Label"
          className="w-28 sm:w-32 rounded-md border border-border bg-surface-soft px-2 py-1.5 text-[13px] font-medium text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {children.length > 0 ? (
          <span
            className="flex-1 min-w-0 rounded-md border border-dashed border-border bg-surface-soft/60 px-2 py-1.5 text-[12.5px] italic text-ink-400"
            title="This item opens a dropdown, so it doesn't need its own link. Set links on the submenu items below instead."
          >
            Dropdown only — no link needed
          </span>
        ) : (
          <input
            value={item.url}
            onChange={(e) => onChange({ ...item, url: e.target.value })}
            placeholder="/url-path"
            className="flex-1 min-w-0 rounded-md border border-border bg-surface-soft px-2 py-1.5 text-[13px] text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        )}

        <button
          onClick={() => setExpanded((v) => !v)}
          className={`flex items-center gap-1 rounded-md px-2 py-1.5 text-[12px] font-medium transition-colors ${
            children.length > 0 ? "text-primary bg-primary-50" : "text-ink-400 hover:bg-surface-soft"
          }`}
          title="Toggle dropdown submenu"
        >
          <ChevronDown size={13} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
          {children.length > 0 ? children.length : ""}
        </button>

        <button onClick={() => onDelete(item.id)} className="text-ink-400 hover:text-red-500 p-1">
          <Trash2 size={15} />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-border bg-surface-soft/60 px-3 py-2.5 space-y-2">
          {children.map((child, idx) => (
            <div key={child.id} className="flex items-center gap-2 pl-5">
              <CornerDownRight size={13} className="text-ink-400 shrink-0" />
              <input
                value={child.label}
                onChange={(e) => updateChild(child.id, { label: e.target.value })}
                className="w-28 rounded-md border border-border bg-white px-2 py-1.5 text-[12.5px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                value={child.url}
                onChange={(e) => updateChild(child.id, { url: e.target.value })}
                className="flex-1 min-w-0 rounded-md border border-border bg-white px-2 py-1.5 text-[12.5px] text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <div className="flex flex-col">
                <button
                  onClick={() => moveChild(idx, -1)}
                  disabled={idx === 0}
                  className="text-ink-400 hover:text-ink-700 disabled:opacity-30 leading-none text-[10px]"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveChild(idx, 1)}
                  disabled={idx === children.length - 1}
                  className="text-ink-400 hover:text-ink-700 disabled:opacity-30 leading-none text-[10px]"
                >
                  ▼
                </button>
              </div>
              <button onClick={() => deleteChild(child.id)} className="text-ink-400 hover:text-red-500 p-1">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button
            onClick={addChild}
            className="flex items-center gap-1 pl-5 text-[12px] font-medium text-primary hover:text-primary-600"
          >
            <Plus size={13} /> Add submenu item
          </button>
        </div>
      )}
    </div>
  );
}
