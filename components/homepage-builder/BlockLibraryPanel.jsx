"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Plus, GripVertical, Search } from "lucide-react";
import { BLOCK_DEFINITIONS, BLOCK_LIBRARY_ORDER } from "@/lib/blockDefinitions";

const GROUP_ORDER = [
  {
    label: "Layout",
    types: ["threeColumnLayout"],
  },
  {
    label: "Content",
    types: ["heroStory", "newsFeed", "topStoriesGrid", "categorySection", "featuredStoriesRow", "opinion", "authorSpotlight", "video"],
  },
  {
    label: "Utilities",
    types: ["breakingNews", "newsletter", "advertisement", "fullWidthBanner", "stickyNotice", "customHtml"],
  },
];

export default function BlockLibraryPanel({ onAdd }) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? BLOCK_LIBRARY_ORDER.filter((type) => {
        const def = BLOCK_DEFINITIONS[type];
        if (!def) return false;
        const q = search.toLowerCase();
        return def.label.toLowerCase().includes(q) || def.description.toLowerCase().includes(q);
      })
    : null;

  return (
    <div className="rounded-card border border-border bg-white shadow-soft overflow-hidden">
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blocks…"
            className="w-full pl-7 pr-3 py-2 rounded-lg border border-border bg-surface-soft text-[12px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="p-3 max-h-[calc(100vh-320px)] overflow-y-auto space-y-4">
        {filtered ? (
          <div className="space-y-1.5">
            {filtered.length === 0 && (
              <p className="text-[12px] text-ink-400 text-center py-4">No blocks match "{search}"</p>
            )}
            {filtered.map((type) => <LibraryItem key={type} type={type} onAdd={onAdd} />)}
          </div>
        ) : (
          GROUP_ORDER.map((group) => (
            <div key={group.label}>
              <p className="text-[10.5px] font-bold uppercase tracking-widest text-ink-400 mb-1.5 px-0.5">{group.label}</p>
              <div className="space-y-1">
                {group.types.map((type) => BLOCK_DEFINITIONS[type] ? <LibraryItem key={type} type={type} onAdd={onAdd} /> : null)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-3 py-2.5 border-t border-border bg-gray-50/50">
        <p className="text-[11px] text-ink-400 text-center">Drag onto page or click + to add</p>
      </div>
    </div>
  );
}

function LibraryItem({ type, onAdd }) {
  const def = BLOCK_DEFINITIONS[type];
  const Icon = def.icon;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `lib-${type}`,
    data: { kind: "library", type },
  });

  return (
    <div
      ref={setNodeRef}
      className={`group flex items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 transition-all ${
        isDragging ? "opacity-40 scale-95" : "hover:border-primary/40 hover:bg-primary-50/30 hover:shadow-sm"
      }`}
    >
      <button
        className="text-ink-300 group-hover:text-ink-500 cursor-grab touch-none shrink-0"
        {...attributes}
        {...listeners}
        aria-label={`Drag to add ${def.label}`}
      >
        <GripVertical size={13} />
      </button>
      <div className="h-7 w-7 rounded-md bg-primary-50 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon size={13} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-ink-900 truncate">{def.label}</p>
        <p className="text-[10.5px] text-ink-400 truncate leading-snug">{def.description}</p>
      </div>
      <button
        onClick={() => onAdd(type)}
        className="shrink-0 h-6 w-6 rounded-md flex items-center justify-center text-ink-400 hover:bg-primary hover:text-white transition-colors"
        aria-label={`Add ${def.label}`}
      >
        <Plus size={13} />
      </button>
    </div>
  );
}
