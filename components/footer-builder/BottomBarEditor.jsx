"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Field, Input, Select, ToggleRow } from "@/components/ui/Field";
import { makeId } from "@/lib/api";

const LOGO_MARK_SOURCES = [
  { value: "initial", label: "Auto Initial", hint: "First letter of your site title" },
  { value: "branding", label: "Site Logo", hint: "Reuse the logo set in the Layout tab" },
  { value: "custom", label: "Custom Upload", hint: "Upload a separate small badge image" },
];

export default function BottomBarEditor({ bottomBar, onChange }) {
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

  const logoMarkSource = bottomBar.logoMarkSource || "initial";

  return (
    <div className="space-y-4">
      <Field label="Copyright Text">
        <Input value={bottomBar.copyright} onChange={(e) => set({ copyright: e.target.value })} />
      </Field>

      <div className="divide-y divide-border">
        <div className="pb-3"><ToggleRow label="Auto Year" sub="Automatically insert the current year" checked={bottomBar.autoYear} onChange={(v) => set({ autoYear: v })} /></div>
        <div className="py-3"><ToggleRow label="Show Privacy Policy Link" checked={bottomBar.showPrivacy} onChange={(v) => set({ showPrivacy: v })} /></div>
        <div className="py-3"><ToggleRow label="Show Terms Link" checked={bottomBar.showTerms} onChange={(v) => set({ showTerms: v })} /></div>
        <div className="py-3"><ToggleRow label="Show Cookie Policy Link" checked={bottomBar.showCookie} onChange={(v) => set({ showCookie: v })} /></div>
        <div className="py-3"><ToggleRow label="Show Accessibility Link" checked={bottomBar.showAccessibility} onChange={(v) => set({ showAccessibility: v })} /></div>
        <div className="pt-3"><ToggleRow label="Show Circular Logo Mark" sub="Small badge shown next to the copyright text" checked={bottomBar.showLogoMark !== false} onChange={(v) => set({ showLogoMark: v })} /></div>
      </div>

      {bottomBar.showLogoMark !== false && (
        <div className="rounded-lg border border-border bg-surface-soft p-3 space-y-3">
          <Field label="Logo Mark Source">
            <Select value={logoMarkSource} onChange={(e) => set({ logoMarkSource: e.target.value })}>
              {LOGO_MARK_SOURCES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Select>
            <span className="block text-[11px] text-ink-400 mt-1">
              {LOGO_MARK_SOURCES.find((s) => s.value === logoMarkSource)?.hint}
            </span>
          </Field>

          {logoMarkSource === "custom" && (
            <Field label="Badge Image">
              <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-white px-3 py-5 text-[12.5px] text-ink-500 cursor-pointer hover:border-primary/40">
                Click to upload badge image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    set({ logoMarkImage: url });
                  }}
                />
              </label>
              {bottomBar.logoMarkImage && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={bottomBar.logoMarkImage}
                    alt="Badge preview"
                    className="h-8 w-8 object-cover rounded-full border border-border bg-ink-900"
                  />
                  <button
                    type="button"
                    onClick={() => set({ logoMarkImage: null })}
                    className="text-[12px] font-medium text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}
            </Field>
          )}
        </div>
      )}

      <Field label="Footer Menu Links">
        <div className="space-y-2">
          {bottomBar.links.map((link) => (
            <div key={link.id} className="flex items-center gap-2">
              <GripVertical size={14} className="text-ink-400 shrink-0" />
              <input
                value={link.label}
                onChange={(e) => updateLink(link.id, { label: e.target.value })}
                className="w-32 rounded-md border border-border bg-surface-soft px-2.5 py-1.5 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                value={link.url}
                onChange={(e) => updateLink(link.id, { url: e.target.value })}
                className="flex-1 min-w-0 rounded-md border border-border bg-surface-soft px-2.5 py-1.5 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button onClick={() => removeLink(link.id)} className="text-ink-400 hover:text-red-500 p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button onClick={addLink} className="flex items-center gap-1 text-[12.5px] font-semibold text-primary hover:text-primary-600">
            <Plus size={13} /> Add Link
          </button>
        </div>
      </Field>
    </div>
  );
}
