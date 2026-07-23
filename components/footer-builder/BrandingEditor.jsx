"use client";

import { Field, Input, Select, Slider, ColorInput } from "@/components/ui/Field";

const FONTS = [
  { value: "blackletter", label: "Blackletter (Gothic)" },
  { value: "playfair", label: "Playfair Display" },
  { value: "inter", label: "Inter" },
  { value: "serif", label: "Serif Editorial" },
];

const TAGLINE_FONTS = [
  { value: "cormorant", label: "Cormorant Garamond Italic" },
  { value: "playfair", label: "Playfair Display Italic" },
  { value: "serif", label: "Libre Baskerville Italic" },
];

export default function BrandingEditor({ branding, onChange }) {
  function set(patch) {
    onChange({ ...branding, ...patch });
  }

  return (
    <div className="space-y-4">
      <Field label="Logo Type">
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "text", label: "Text Logo", sub: "Type the site name in a chosen font" },
            { value: "image", label: "Image Logo", sub: "Upload your own logo file" },
          ].map((opt) => {
            const active = (branding.type || "text") === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => set({ type: opt.value })}
                className={`rounded-lg border-2 p-3 text-left transition-colors ${
                  active ? "border-primary bg-primary-50/40" : "border-border hover:border-primary/40"
                }`}
              >
                <span className="text-[12.5px] font-medium text-ink-700">{opt.label}</span>
                <span className="block text-[11px] text-ink-400">{opt.sub}</span>
              </button>
            );
          })}
        </div>
      </Field>

      {(branding.type || "text") === "text" ? (
        <Field label="Site Logo / Title">
          <Input value={branding.text} onChange={(e) => set({ text: e.target.value })} placeholder="HighTableNews" />
        </Field>
      ) : (
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
          {branding.image && (
            <div className="mt-2 flex items-center gap-3">
              <img src={branding.image} alt="Logo preview" className="h-12 object-contain rounded border border-border bg-ink-900 p-1.5" />
              <button
                type="button"
                onClick={() => set({ image: null })}
                className="text-[12px] font-medium text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          )}
        </Field>
      )}

      <Field label="Tagline">
        <Input value={branding.tagline} onChange={(e) => set({ tagline: e.target.value })} />
      </Field>

      <Field label="Meta Line" hint="Shown under the tagline on the Masthead templates, e.g. established date and office locations.">
        <Input
          value={branding.meta || ""}
          onChange={(e) => set({ meta: e.target.value })}
          placeholder="Est. 1998 · London · New York · Singapore"
        />
      </Field>

      {(branding.type || "text") === "text" ? (
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Logo Font Family">
            <Select value={branding.font} onChange={(e) => set({ font: e.target.value })}>
              {FONTS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </Select>
          </Field>
          <Field label="Logo Font Size">
            <Slider value={branding.size} min={28} max={72} unit="px" onChange={(v) => set({ size: v })} />
          </Field>
        </div>
      ) : (
        <Field label="Logo Image Height">
          <Slider value={branding.size} min={28} max={120} unit="px" onChange={(v) => set({ size: v })} />
        </Field>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Tagline Font Family">
          <Select value={branding.taglineFont || "cormorant"} onChange={(e) => set({ taglineFont: e.target.value })}>
            {TAGLINE_FONTS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </Select>
        </Field>
        {(branding.type || "text") === "text" && (
          <Field label="Logo Color">
            <ColorInput value={branding.color || "#ffffff"} onChange={(v) => set({ color: v })} />
          </Field>
        )}
      </div>
    </div>
  );
}