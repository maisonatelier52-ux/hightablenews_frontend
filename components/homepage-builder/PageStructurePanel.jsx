"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { LayoutTemplate } from "lucide-react";
import SortableBlockItem from "./SortableBlockItem";

export default function PageStructurePanel({ blocks, selectedId, onSelect, onDuplicate, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: "page-structure-droppable" });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-card border bg-white shadow-soft p-3 min-h-[480px] transition-colors ${
        isOver ? "border-primary bg-primary-50/30" : "border-border"
      }`}
    >
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2.5">
          {blocks.map((block) => (
            <SortableBlockItem
              key={block.id}
              block={block}
              selected={block.id === selectedId}
              onSelect={onSelect}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>

      {blocks.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="h-12 w-12 rounded-card bg-primary-50 text-primary flex items-center justify-center mb-3">
            <LayoutTemplate size={20} />
          </div>
          <p className="text-[13.5px] font-semibold text-ink-900">Your homepage is empty</p>
          <p className="text-[12.5px] text-ink-500 mt-1 max-w-xs">
            Drag a block from the library on the left, or click its + button, to start building.
          </p>
        </div>
      )}
    </div>
  );
}
