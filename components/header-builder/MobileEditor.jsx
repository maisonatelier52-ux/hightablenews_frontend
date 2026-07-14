"use client";

import { Menu, Maximize2, PanelBottom } from "lucide-react";
import { Field, ToggleRow } from "@/components/ui/Field";

const LAYOUTS = [
  { value: "drawer", label: "Hamburger Drawer", icon: Menu, sub: "Default" },
  { value: "fullscreen", label: "Full Screen Menu", icon: Maximize2 },
  { value: "bottomSheet", label: "Bottom Sheet Menu", icon: PanelBottom },
];

export default function MobileEditor({ mobile, onChange }) {
  function set(patch) {
    onChange({ ...mobile, ...patch });
  }

  return (
    <div className="space-y-4">
      <Field label="Mobile Layout">
        <div className="grid sm:grid-cols-3 gap-3">
          {LAYOUTS.map((l) => {
            const active = mobile.layout === l.value;
            return (
              <button
                key={l.value}
                onClick={() => set({ layout: l.value })}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 text-center transition-colors ${
                  active ? "border-primary bg-primary-50/40" : "border-border hover:border-primary/40"
                }`}
              >
                <l.icon size={18} className={active ? "text-primary" : "text-ink-400"} />
                <span className="text-[12.5px] font-medium text-ink-700">{l.label}</span>
                {l.sub && <span className="text-[11px] text-ink-400">{l.sub}</span>}
              </button>
            );
          })}
        </div>
      </Field>

      <div className="divide-y divide-border">
        <div className="pb-3">
          <ToggleRow label="Show Search Icon" checked={mobile.showSearch} onChange={(v) => set({ showSearch: v })} />
        </div>
        <div className="py-3">
          <ToggleRow label="Show Login" checked={mobile.showLogin} onChange={(v) => set({ showLogin: v })} />
        </div>
        <div className="pt-3">
          <ToggleRow label="Show Subscribe Button" checked={mobile.showSubscribe} onChange={(v) => set({ showSubscribe: v })} />
        </div>
      </div>
    </div>
  );
}
