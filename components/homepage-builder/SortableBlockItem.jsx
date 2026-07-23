// components/homepage-builder/sortableBlockItem.jsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { BLOCK_DEFINITIONS } from "@/lib/blockDefinitions";

// Deterministic, purely-decorative icon color per block type — mirrors the
// "each row gets its own accent color" pattern from the reference design
// without needing new fields on the block data itself. Same type always
// resolves to the same color, so the list stays visually consistent across
// reloads and re-renders.
const ICON_PALETTE = [
  { bg: "bg-blue-50", text: "text-blue-600" },
  { bg: "bg-amber-50", text: "text-amber-600" },
  { bg: "bg-emerald-50", text: "text-emerald-600" },
  { bg: "bg-violet-50", text: "text-violet-600" },
  { bg: "bg-rose-50", text: "text-rose-600" },
  { bg: "bg-cyan-50", text: "text-cyan-600" },
];

function paletteFor(type) {
  let hash = 0;
  for (let i = 0; i < type.length; i++) hash = (hash * 31 + type.charCodeAt(i)) >>> 0;
  return ICON_PALETTE[hash % ICON_PALETTE.length];
}

export default function SortableBlockItem({ block, selected, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const def = BLOCK_DEFINITIONS[block.type];
  const Icon = def?.icon;
  const palette = paletteFor(block.type);
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(block.id)}
      className={`rounded-xl border bg-white transition-all cursor-pointer ${
        isDragging ? "shadow-2xl opacity-90 scale-[1.01] z-10" : "shadow-soft hover:shadow-md"
      } ${selected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/30"}`}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-ink-300 hover:text-ink-500 cursor-grab touch-none shrink-0 p-0.5"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder block"
        >
          <GripVertical size={15} />
        </button>

        <div
          className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
            selected ? "bg-primary text-white" : `${palette.bg} ${palette.text}`
          }`}
        >
          {Icon && <Icon size={15} />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-ink-900 truncate">{def?.label || block.type}</p>
          {def?.description && (
            <p className="text-[11.5px] text-ink-400 truncate leading-snug">{def.description}</p>
          )}
        </div>
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="mx-3 mb-2 flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10.5px] font-semibold text-primary">Selected — edit settings below ↓</span>
        </div>
      )}
    </div>
  );
}