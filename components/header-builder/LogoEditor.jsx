"use client";

import { Field, Input, Select, Slider, ColorInput } from "@/components/ui/Field";

export const FONTS = [
  { value: "blackletter", label: "Old English (Blackletter)", preview: "HighTableNews", cls: "font-preview-blackletter" },
  { value: "inter", label: "Inter", preview: "HighTableNews", cls: "font-preview-inter" },
  { value: "playfair", label: "Playfair Display", preview: "HighTableNews", cls: "font-preview-playfair" },
  { value: "georgia", label: "Georgia Serif", preview: "HighTableNews", cls: "font-preview-georgia" },
  { value: "times", label: "Times New Roman", preview: "HighTableNews", cls: "font-preview-times" },
];

export const FONT_STACKS = {
  inter: "Inter, system-ui, sans-serif",
  playfair: "'Playfair Display', Georgia, serif",
  blackletter: "'UnifrakturMaguntia', Georgia, serif",
  georgia: "Georgia, 'Times New Roman', serif",
  times: "'Times New Roman', Times, serif",
};

export const FONT_WEIGHTS = [
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "Extra Bold" },
];

export default function LogoEditor({ logo, onChange }) {
  function set(patch) {
    onChange({ ...logo, ...patch });
  }

  const currentFont = FONTS.find((f) => f.value === logo.font) || FONTS[0];

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Logo Type">
          <Select value={logo.type} onChange={(e) => set({ type: e.target.value })}>
            <option value="text">Text Logo</option>
            <option value="image">Image Logo</option>
          </Select>
        </Field>
        <Field label="Site Title">
          <Input value={logo.text} onChange={(e) => set({ text: e.target.value })} placeholder="HighTableNews" />
        </Field>
      </div>

      {logo.type === "image" && (
        <Field label="Logo Image" hint="Upload a PNG or SVG, ideally on a transparent background.">
          <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface-soft px-3 py-6 text-[12.5px] text-ink-500 cursor-pointer hover:border-primary/40">
            Click to upload logo image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = URL.createObjectURL(file);
                set({ image: url });
              }}
            />
          </label>
          {logo.image && <img src={logo.image} alt="Logo preview" className="mt-2 h-10 object-contain" />}
        </Field>
      )}

      {/* Font Family with live preview tiles */}
      <Field label="Font Family">
        <div className="grid grid-cols-1 gap-2">
          {FONTS.map((f) => (
            <button
              key={f.value}
              onClick={() => set({ font: f.value })}
              className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-colors ${
                logo.font === f.value
                  ? "border-primary bg-primary-50/60"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <span className="text-[12px] text-ink-500 min-w-[100px]">{f.label}</span>
              <span
                className={`text-[15px] text-ink-900 ${f.cls}`}
                style={{ fontFamily: FONT_STACKS[f.value] }}
              >
                {f.preview}
              </span>
            </button>
          ))}
        </div>
      </Field>

      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="Logo Size">
          <Slider value={logo.size} min={20} max={80} unit="px" onChange={(v) => set({ size: v })} />
        </Field>
        <Field label="Font Weight">
          <Select value={logo.fontWeight || "700"} onChange={(e) => set({ fontWeight: e.target.value })}>
            {FONT_WEIGHTS.map((w) => (
              <option key={w.value} value={w.value}>{w.label}</option>
            ))}
          </Select>
        </Field>
        <Field label="Logo Color">
          <ColorInput value={logo.color} onChange={(v) => set({ color: v })} />
        </Field>
      </div>

      <Field label="Letter Spacing">
        <Slider value={logo.letterSpacing ?? 0} min={-2} max={10} step={0.5} unit="px" onChange={(v) => set({ letterSpacing: v })} />
      </Field>

      {/* Live mini-preview */}
      <div className="rounded-lg border border-border bg-surface-soft p-4 flex items-center justify-center min-h-[64px]">
        {logo.type === "image" && logo.image ? (
          <img src={logo.image} alt={logo.text} style={{ height: logo.size * 0.7 }} className="object-contain" />
        ) : (
          <span
            style={{
              fontFamily: FONT_STACKS[logo.font],
              fontSize: logo.size * 0.7,
              color: logo.color,
              fontWeight: logo.fontWeight || "700",
              letterSpacing: (logo.letterSpacing ?? 0) + "px",
              lineHeight: 1,
            }}
          >
            {logo.text || "HighTableNews"}
          </span>
        )}
      </div>
    </div>
  );
}
