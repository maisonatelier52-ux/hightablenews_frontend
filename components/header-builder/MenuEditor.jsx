"use client";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Field, Select, ColorInput } from "@/components/ui/Field";
import { makeId } from "@/lib/api";
import MenuItemRow from "./MenuItemRow";

const HOVER_EFFECTS = [
  { value: "red-underline", label: "Red Underline", desc: "Bold red underline on hover" },
  { value: "blue-underline", label: "Blue Underline", desc: "Primary blue underline" },
  { value: "background", label: "Background Highlight", desc: "Background color on hover" },
  { value: "bold", label: "Bold Text", desc: "Text becomes bold on hover" },
];

export default function MenuEditor({ menu, menuStyle = {}, onChange, onStyleChange }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = menu.map((m) => m.id);
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    onChange(arrayMove(menu, oldIndex, newIndex));
  }

  function updateItem(id, next) {
    onChange(menu.map((m) => (m.id === id ? next : m)));
  }

  function deleteItem(id) {
    onChange(menu.filter((m) => m.id !== id));
  }

  function addItem() {
    onChange([...menu, { id: makeId("menu"), label: "New Item", url: "/", type: "link", children: [] }]);
  }

  function setStyle(patch) {
    onStyleChange?.({ ...menuStyle, ...patch });
  }

  return (
    <div className="space-y-5">
      {/* Hover Style System */}
      <div className="rounded-xl border border-border bg-surface-soft/40 p-4 space-y-4">
        <h5 className="text-[12.5px] font-semibold text-ink-700 uppercase tracking-wide">Menu Hover Style</h5>
        
        <div className="grid grid-cols-2 gap-2">
          {HOVER_EFFECTS.map((effect) => (
            <button
              key={effect.value}
              onClick={() => setStyle({ hoverEffect: effect.value })}
              className={`text-left rounded-lg border px-3 py-2.5 transition-colors ${
                menuStyle.hoverEffect === effect.value
                  ? "border-primary bg-primary-50/60"
                  : "border-border bg-white hover:border-primary/40"
              }`}
            >
              <div className="text-[12px] font-semibold text-ink-900">{effect.label}</div>
              <div className="text-[11px] text-ink-400 mt-0.5">{effect.desc}</div>
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Hover Color">
            <ColorInput value={menuStyle.hoverColor || "#b30000"} onChange={(v) => setStyle({ hoverColor: v })} />
          </Field>
          <Field label="Font Size">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={10}
                max={16}
                step={1}
                value={menuStyle.fontSize || 12}
                onChange={(e) => setStyle({ fontSize: Number(e.target.value) })}
                className="flex-1 h-1.5 rounded-full bg-border accent-primary cursor-pointer"
              />
              <span className="text-[12.5px] text-ink-700 min-w-[36px]">{menuStyle.fontSize || 12}px</span>
            </div>
          </Field>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-[12.5px] text-ink-700 cursor-pointer">
            <input
              type="checkbox"
              checked={menuStyle.uppercase !== false}
              onChange={(e) => setStyle({ uppercase: e.target.checked })}
              className="h-4 w-4 rounded border-border text-primary"
            />
            UPPERCASE labels
          </label>
        </div>
      </div>

      {/* Menu Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12.5px] text-ink-500">Drag to reorder. Click the arrow to add submenus.</p>
          <button
            onClick={addItem}
            className="flex items-center gap-1 text-[12.5px] font-semibold text-primary hover:text-primary-600 shrink-0"
          >
            <Plus size={14} /> Add Menu Item
          </button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={menu.map((m) => m.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {menu.map((item) => (
                <MenuItemRow key={item.id} item={item} onChange={(next) => updateItem(item.id, next)} onDelete={deleteItem} />
              ))}
              {menu.length === 0 && (
                <p className="text-[13px] text-ink-400 py-6 text-center">No menu items yet. Add one above.</p>
              )}
            </div>
          </SortableContext>
        </DndContext>
        <p className="text-[11.5px] text-ink-400 mt-2">{menu.length} items</p>
      </div>
    </div>
  );
}
