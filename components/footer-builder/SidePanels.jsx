"use client";

import { Plus, Trash2 } from "lucide-react";
import { Card, Field, Input, Slider, ToggleRow } from "@/components/ui/Field";
import { makeId } from "@/lib/api";

export function BottomBarQuickCard({ bottomBar, onChange }) {
  function set(patch) {
    onChange({ ...bottomBar, ...patch });
  }
  function updateLink(id, patch) {
    set({ links: bottomBar.links.map((l) => (l.id === id ? { ...l, ...patch } : l)) });
  }
  function addLink() {
    set({ links: [...bottomBar.links, { id: makeId("blink"), label: "New Link", url: "/" }] });
  }
  function removeLink(id) {
    set({ links: bottomBar.links.filter((l) => l.id !== id) });
  }

  return (
    <Card title="Bottom Bar Settings">
      <div className="space-y-3">
        <Field label="Copyright Text">
          <Input value={bottomBar.copyright} onChange={(e) => set({ copyright: e.target.value })} />
        </Field>
        <ToggleRow label="Show Copyright" checked={bottomBar.showCopyright !== false} onChange={(v) => set({ showCopyright: v })} />
        <ToggleRow label="Show Footer Menu" checked={bottomBar.showMenu !== false} onChange={(v) => set({ showMenu: v })} />

        <Field label="Footer Menu Links">
          <div className="space-y-2">
            {bottomBar.links.map((link) => (
              <div key={link.id} className="flex items-center gap-2">
                <input
                  value={link.label}
                  onChange={(e) => updateLink(link.id, { label: e.target.value })}
                  className="w-28 rounded-md border border-border bg-surface-soft px-2.5 py-1.5 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  value={link.url}
                  onChange={(e) => updateLink(link.id, { url: e.target.value })}
                  className="flex-1 min-w-0 rounded-md border border-border bg-surface-soft px-2.5 py-1.5 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button onClick={() => removeLink(link.id)} className="text-ink-400 hover:text-red-500 p-1">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            <button onClick={addLink} className="flex items-center gap-1 text-[12px] font-semibold text-primary hover:text-primary-600">
              <Plus size={13} /> Add Link
            </button>
          </div>
        </Field>
      </div>
    </Card>
  );
}

export function FooterDepthQuickCard({ depth, onChange }) {
  function set(patch) {
    onChange({ ...depth, ...patch });
  }
  return (
    <Card title="Footer Depth Settings">
      <div className="space-y-4">
        <Field label="Padding Top">
          <Slider value={depth.paddingTop} min={0} max={120} unit="px" onChange={(v) => set({ paddingTop: v })} />
        </Field>
        <Field label="Padding Bottom">
          <Slider value={depth.paddingBottom} min={0} max={120} unit="px" onChange={(v) => set({ paddingBottom: v })} />
        </Field>
        <Field label="Column Gap">
          <Slider value={depth.columnGap} min={0} max={80} unit="px" onChange={(v) => set({ columnGap: v })} />
        </Field>
      </div>
    </Card>
  );
}
