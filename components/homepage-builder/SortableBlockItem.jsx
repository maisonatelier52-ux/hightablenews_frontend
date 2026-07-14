"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronDown, Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { BLOCK_DEFINITIONS } from "@/lib/blockDefinitions";
import BlockPreview from "./BlockPreview";

export default function SortableBlockItem({ block, selected, onSelect, onDuplicate, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const [expanded, setExpanded] = useState(true);

  const def = BLOCK_DEFINITIONS[block.type];
  const Icon = def?.icon;
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
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-ink-300 hover:text-ink-500 cursor-grab touch-none shrink-0 p-0.5"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder block"
        >
          <GripVertical size={15} />
        </button>

        <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${selected ? "bg-primary text-white" : "bg-primary-50 text-primary"}`}>
          {Icon && <Icon size={13} />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-ink-900 truncate">{def?.label || block.type}</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="h-6 w-6 flex items-center justify-center rounded-md text-ink-400 hover:bg-gray-100 hover:text-ink-700 transition-colors"
            aria-label="Toggle preview"
            title={expanded ? "Collapse" : "Expand"}
          >
            <ChevronDown size={13} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
          <button
            onClick={() => onDuplicate(block.id)}
            className="h-6 w-6 flex items-center justify-center rounded-md text-ink-400 hover:bg-gray-100 hover:text-ink-700 transition-colors"
            aria-label="Duplicate block"
            title="Duplicate"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={() => onDelete(block.id)}
            className="h-6 w-6 flex items-center justify-center rounded-md text-ink-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            aria-label="Delete block"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Preview area */}
      {expanded && (
        <div className={`mx-3 mb-3 rounded-lg overflow-hidden border ${selected ? "border-primary/20" : "border-border"} bg-gray-50/60`}>
          <div className="p-2.5">
            <BlockPreview type={block.type} data={block.data} />
          </div>
        </div>
      )}

      {/* Selected indicator */}
      {selected && (
        <div className="mx-3 mb-2 flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10.5px] font-semibold text-primary">Selected — edit settings on the right →</span>
        </div>
      )}
    </div>
  );
}
