"use client";

import { ToggleRow } from "@/components/ui/Field";

export default function StyleEditor({ behavior, onChange }) {
  function set(patch) {
    onChange({ ...behavior, ...patch });
  }

  return (
    <div className="space-y-1 divide-y divide-border">
      <div className="pb-3">
        <ToggleRow label="Sticky Header" sub="Keep header fixed at the top while scrolling" checked={behavior.sticky} onChange={(v) => set({ sticky: v })} />
      </div>
      <div className="py-3">
        <ToggleRow label="Shadow on Scroll" sub="Add a soft shadow once the page scrolls" checked={behavior.shadowOnScroll} onChange={(v) => set({ shadowOnScroll: v })} />
      </div>
      <div className="py-3">
        <ToggleRow label="Hide on Scroll Down" sub="Header hides when scrolling down, reappears on scroll up" checked={behavior.hideOnScrollDown} onChange={(v) => set({ hideOnScrollDown: v })} />
      </div>
      <div className="py-3">
        <ToggleRow label="Transparent Header" sub="For hero/landing pages — becomes solid on scroll" checked={behavior.transparent} onChange={(v) => set({ transparent: v })} />
      </div>
      <div className="py-3">
        <ToggleRow label="Enable Mega Menu" sub="Show rich dropdown panels for submenus" checked={behavior.megaMenu} onChange={(v) => set({ megaMenu: v })} />
      </div>
      <div className="pt-3">
        <ToggleRow label="Show Divider Below Header" checked={behavior.dividerBelow} onChange={(v) => set({ dividerBelow: v })} />
      </div>
    </div>
  );
}
