"use client";

import { Field, Slider, ToggleRow } from "@/components/ui/Field";

export default function FooterMobileEditor({ mobile, onChange }) {
  function set(patch) {
    onChange({ ...mobile, ...patch });
  }
  return (
    <div className="space-y-4">
      <Field label="Mobile Layout">
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "accordion", label: "Accordion Footer", sub: "Recommended" },
            { value: "stacked", label: "Stacked Footer" },
          ].map((l) => {
            const active = mobile.layout === l.value;
            return (
              <button
                key={l.value}
                onClick={() => set({ layout: l.value })}
                className={`rounded-lg border-2 p-3 text-left transition-colors ${active ? "border-primary bg-primary-50/40" : "border-border hover:border-primary/40"}`}
              >
                <span className="text-[12.5px] font-medium text-ink-700">{l.label}</span>
                {l.sub && <span className="block text-[11px] text-ink-400">{l.sub}</span>}
              </button>
            );
          })}
        </div>
      </Field>

      <div className="divide-y divide-border">
        <div className="pb-3"><ToggleRow label="Default Expanded Section" checked={mobile.defaultExpanded} onChange={(v) => set({ defaultExpanded: v })} /></div>
        <div className="py-3"><ToggleRow label="Show Borders" checked={mobile.showBorders} onChange={(v) => set({ showBorders: v })} /></div>
        <div className="pt-3"><ToggleRow label="Collapse Animation" checked={mobile.collapseAnimation} onChange={(v) => set({ collapseAnimation: v })} /></div>
      </div>

      <Field label="Mobile Font Size">
        <Slider value={mobile.fontSize} min={10} max={18} unit="px" onChange={(v) => set({ fontSize: v })} />
      </Field>
    </div>
  );
}
