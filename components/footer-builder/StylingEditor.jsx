"use client";

import { Field, ColorInput, Slider } from "@/components/ui/Field";

export default function StylingEditor({ footer, onChange }) {
  function setTheme(patch) {
    onChange({ ...footer, theme: { ...footer.theme, ...patch } });
  }
  function setDepth(patch) {
    onChange({ ...footer, depth: { ...footer.depth, ...patch } });
  }

  return (
    <div className="space-y-6">
      <div>
        <h5 className="text-[12.5px] font-semibold text-ink-900 mb-3">Colors</h5>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Background Color"><ColorInput value={footer.theme.bg} onChange={(v) => setTheme({ bg: v })} /></Field>
          <Field label="Text Color"><ColorInput value={footer.theme.text} onChange={(v) => setTheme({ text: v })} /></Field>
          <Field label="Link / Secondary Text Color"><ColorInput value={footer.theme.link} onChange={(v) => setTheme({ link: v })} /></Field>
          <Field label="Hover Color"><ColorInput value={footer.theme.hover} onChange={(v) => setTheme({ hover: v })} /></Field>
          <Field label="Divider Line Color"><ColorInput value={footer.theme.border} onChange={(v) => setTheme({ border: v })} /></Field>
          <Field label="Top Accent Line Color"><ColorInput value={footer.theme.accentLine || "#5c1111"} onChange={(v) => setTheme({ accentLine: v })} /></Field>
          <Field label="Tagline Color"><ColorInput value={footer.theme.taglineColor || "#6f665f"} onChange={(v) => setTheme({ taglineColor: v })} /></Field>
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <h5 className="text-[12.5px] font-semibold text-ink-900 mb-3">Layout</h5>
        <div className="space-y-3">
          <Field label="Column Gap"><Slider value={footer.depth.columnGap} min={0} max={80} unit="px" onChange={(v) => setDepth({ columnGap: v })} /></Field>
          <Field label="Padding Top"><Slider value={footer.depth.paddingTop} min={0} max={120} unit="px" onChange={(v) => setDepth({ paddingTop: v })} /></Field>
          <Field label="Padding Bottom"><Slider value={footer.depth.paddingBottom} min={0} max={120} unit="px" onChange={(v) => setDepth({ paddingBottom: v })} /></Field>
        </div>
      </div>
    </div>
  );
}
