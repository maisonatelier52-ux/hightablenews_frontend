"use client";

import { Plus } from "lucide-react";
import { SIDEBAR_WIDGET_DEFINITIONS, SIDEBAR_WIDGET_LIBRARY_ORDER } from "@/lib/pageBlockDefinitions";

export default function SidebarWidgetLibraryPanel({ onAddWidget }) {
  return (
    <div className="rounded-card border border-border bg-white shadow-soft overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-gray-50/50">
        <h3 className="text-[13.5px] font-semibold text-ink-900">Add a sidebar widget</h3>
        <p className="text-[11.5px] text-ink-500 mt-0.5">Only shown when the layout includes a sidebar.</p>
      </div>
      <div className="p-3 grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto">
        {SIDEBAR_WIDGET_LIBRARY_ORDER.map((type) => {
          const def = SIDEBAR_WIDGET_DEFINITIONS[type];
          const Icon = def.icon;
          return (
            <button
              key={type}
              onClick={() => onAddWidget(type)}
              className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-left hover:border-primary/40 hover:bg-primary-50/40 transition-colors group"
            >
              <div className="h-8 w-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-semibold text-ink-900 truncate">{def.label}</p>
                <p className="text-[11px] text-ink-500 truncate">{def.description}</p>
              </div>
              <Plus size={14} className="text-ink-300 group-hover:text-primary shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
