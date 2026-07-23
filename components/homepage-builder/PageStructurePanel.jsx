// components/homepage-builder/PageStructurePanel.jsx
"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { LayoutTemplate } from "lucide-react";
import SortableBlockItem from "./SortableBlockItem";

export default function PageStructurePanel({ blocks, selectedId, onSelect }) {
  const { setNodeRef, isOver } = useDroppable({ id: "page-structure-droppable" });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl min-h-[220px] transition-colors ${
        isOver ? "bg-primary-50/40 ring-2 ring-primary/30" : ""
      }`}
    >
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {blocks.map((block) => (
            <SortableBlockItem
              key={block.id}
              block={block}
              selected={block.id === selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      </SortableContext>

      {blocks.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-14 border border-dashed border-border rounded-xl">
          <div className="h-12 w-12 rounded-card bg-primary-50 text-primary flex items-center justify-center mb-3">
            <LayoutTemplate size={20} />
          </div>
          <p className="text-[13.5px] font-semibold text-ink-900">Your homepage is empty</p>
          <p className="text-[12.5px] text-ink-500 mt-1 max-w-xs">
            Pick a template above to get started — every section stays fully editable afterward.
          </p>
        </div>
      )}
    </div>
  );
}