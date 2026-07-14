"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/layout/AdminShell";
import { Settings as SettingsIcon, Loader2, Save, CheckCircle2 } from "lucide-react";
import { settingsApi } from "@/apis/adminApis";

const EMPTY = {
  siteName: "",
  logo: "",
  favicon: "",
  seoDefaults: { metaTitle: "", metaDescription: "", ogImage: "", keywords: [] },
  socialLinks: { twitter: "", facebook: "", instagram: "", linkedin: "", youtube: "" },
  contact: { email: "", phone: "", address: "" },
  analytics: { googleAnalyticsId: "" },
};

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-medium text-ink-700">{label}</span>
      <input
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border px-3 py-2.5 text-[13px] text-ink-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
      />
    </label>
  );
}

export default function SettingsPage() {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const settings = await settingsApi.get();
        setData({ ...EMPTY, ...settings, seoDefaults: { ...EMPTY.seoDefaults, ...(settings.seoDefaults || {}) }, socialLinks: { ...EMPTY.socialLinks, ...(settings.socialLinks || {}) }, contact: { ...EMPTY.contact, ...(settings.contact || {}) }, analytics: { ...EMPTY.analytics, ...(settings.analytics || {}) } });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function set(patch) { setData((p) => ({ ...p, ...patch })); }
  function setNested(key, patch) { setData((p) => ({ ...p, [key]: { ...p[key], ...patch } })); }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const updated = await settingsApi.save(data);
      setData((p) => ({ ...p, ...updated }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminShell title="Settings">
        <div className="flex items-center justify-center py-16 text-ink-400">
          <Loader2 className="animate-spin mr-2" size={18} /> Loading settings…
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Settings">
      <div className="p-4 lg:p-6 max-w-[720px] mx-auto flex flex-col gap-6">

        <section className="bg-white border border-border rounded-card p-5 flex flex-col gap-4">
          <h2 className="text-[14px] font-semibold text-ink-900 flex items-center gap-2"><SettingsIcon size={16} /> General</h2>
          <Field label="Site name" value={data.siteName} onChange={(v) => set({ siteName: v })} placeholder="HighTableNews" />
          <Field label="Logo URL" value={data.logo} onChange={(v) => set({ logo: v })} placeholder="https://…/logo.webp" />
          <Field label="Favicon URL" value={data.favicon} onChange={(v) => set({ favicon: v })} />
        </section>

        <section className="bg-white border border-border rounded-card p-5 flex flex-col gap-4">
          <h2 className="text-[14px] font-semibold text-ink-900">SEO defaults</h2>
          <Field label="Meta title" value={data.seoDefaults.metaTitle} onChange={(v) => setNested("seoDefaults", { metaTitle: v })} />
          <Field label="Meta description" value={data.seoDefaults.metaDescription} onChange={(v) => setNested("seoDefaults", { metaDescription: v })} />
          <Field label="Default OG image URL" value={data.seoDefaults.ogImage} onChange={(v) => setNested("seoDefaults", { ogImage: v })} />
        </section>

        <section className="bg-white border border-border rounded-card p-5 flex flex-col gap-4">
          <h2 className="text-[14px] font-semibold text-ink-900">Social links</h2>
          {Object.keys(EMPTY.socialLinks).map((k) => (
            <Field key={k} label={k[0].toUpperCase() + k.slice(1)} value={data.socialLinks[k]} onChange={(v) => setNested("socialLinks", { [k]: v })} />
          ))}
        </section>

        <section className="bg-white border border-border rounded-card p-5 flex flex-col gap-4">
          <h2 className="text-[14px] font-semibold text-ink-900">Contact</h2>
          <Field label="Email" value={data.contact.email} onChange={(v) => setNested("contact", { email: v })} />
          <Field label="Phone" value={data.contact.phone} onChange={(v) => setNested("contact", { phone: v })} />
          <Field label="Address" value={data.contact.address} onChange={(v) => setNested("contact", { address: v })} />
        </section>

        <section className="bg-white border border-border rounded-card p-5 flex flex-col gap-4">
          <h2 className="text-[14px] font-semibold text-ink-900">Analytics</h2>
          <Field label="Google Analytics ID" value={data.analytics.googleAnalyticsId} onChange={(v) => setNested("analytics", { googleAnalyticsId: v })} placeholder="G-XXXXXXX" />
        </section>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-5 py-2.5 text-[13px] font-medium hover:opacity-90 disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
            {saving ? "Saving…" : saved ? "Saved" : "Save settings"}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
