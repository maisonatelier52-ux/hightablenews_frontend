"use client";

import { Field, Input, ToggleRow } from "@/components/ui/Field";

export default function NewsletterEditor({ newsletter, onChange }) {
  function set(patch) {
    onChange({ ...newsletter, ...patch });
  }
  return (
    <div className="space-y-4">
      <ToggleRow label="Enable Newsletter Block" sub="Show an email signup module in the footer" checked={newsletter.enabled} onChange={(v) => set({ enabled: v })} />
      <Field label="Title">
        <Input value={newsletter.title} onChange={(e) => set({ title: e.target.value })} />
      </Field>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Placeholder Text">
          <Input value={newsletter.placeholder} onChange={(e) => set({ placeholder: e.target.value })} />
        </Field>
        <Field label="Button Text">
          <Input value={newsletter.buttonText} onChange={(e) => set({ buttonText: e.target.value })} />
        </Field>
      </div>
      <Field label="Success Message">
        <Input value={newsletter.successMessage} onChange={(e) => set({ successMessage: e.target.value })} />
      </Field>
    </div>
  );
}
