// app/admin/settings/page.jsx
"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/layout/AdminShell";
import { Settings as SettingsIcon, Loader2, Save, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { settingsApi } from "@/apis/adminApis";
import { SOCIAL_PLATFORM_OPTIONS } from "@/lib/socialPlatforms";
import FaviconUploadField from "@/components/admin/FaviconUploadField";
import ImageUploadField from "@/components/page-builder/ImageUploadField";

const EMPTY = {
  siteName: "",
  logo: "",
  favicon: "",
  seoDefaults: { metaTitle: "", metaDescription: "", ogImage: "", twitterImage: "", keywords: [] },
  // A list of { platform, url } entries rather than fixed keys, so the
  // admin can add as many social media accounts as they like. This is the
  // single source of truth for social URLs — the Header Builder and Footer
  // Builder only pick which of these (the ones with a URL) to show as
  // icons.
  socialLinks: [],
  contact: { email: "", phone: "", address: "" },
  analytics: { googleAnalyticsId: "" },
};

/** Only entries with a valid, non-empty platform key are ever sent to the
 *  API. This is what stops an incomplete row (platform missing/blank) from
 *  ever reaching the backend and failing Mongoose's document-wide
 *  validation — the cause of the "Path `platform` is required" 400. */
function sanitizeSocialLinksForSave(list) {
  const validKeys = SOCIAL_PLATFORM_OPTIONS.map((p) => p.key);
  const seen = new Set();
  const cleaned = [];
  for (const entry of list || []) {
    const platform = (entry?.platform || "").trim();
    if (!platform || !validKeys.includes(platform) || seen.has(platform)) continue;
    seen.add(platform);
    cleaned.push({ platform, url: (entry?.url || "").trim() });
  }
  return cleaned;
}

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

/** Dynamic add/remove list of { platform, url } entries. Admin picks a
 *  platform from the supported list and types its URL. This list (filtered
 *  to entries with a non-empty URL) is what the Header Builder and Footer
 *  Builder offer as selectable social icons. */
function SocialLinksEditor({ social, onChange }) {
  const list = social || [];
  const usedKeys = list.map((s) => s.platform);
  const nextAvailable = SOCIAL_PLATFORM_OPTIONS.find((p) => !usedKeys.includes(p.key));

  function update(idx, patch) {
    onChange(list.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }
  function add() {
    // Guard: only ever add a row with a concrete, valid platform key
    // already attached. There is intentionally no "blank" intermediate
    // state for a row's platform, so a half-filled entry can never exist
    // in local state (and therefore can never be sent to the API).
    if (!nextAvailable) return;
    onChange([...list, { platform: nextAvailable.key, url: "" }]);
  }
  function remove(idx) {
    onChange(list.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-col gap-3">
      {list.map((s, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <select
            value={s.platform}
            onChange={(e) => update(idx, { platform: e.target.value })}
            className="w-40 shrink-0 rounded-lg border border-border px-2.5 py-2.5 text-[13px] text-ink-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
          >
            {SOCIAL_PLATFORM_OPTIONS.map((p) => (
              <option key={p.key} value={p.key}>{p.label}</option>
            ))}
          </select>
          <input
            value={s.url || ""}
            onChange={(e) => update(idx, { url: e.target.value })}
            placeholder="https://…"
            className="flex-1 min-w-0 rounded-lg border border-border px-3 py-2.5 text-[13px] text-ink-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
          />
          <button
            type="button"
            onClick={() => remove(idx)}
            title="Remove"
            className="shrink-0 p-2 text-ink-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        disabled={!nextAvailable}
        className="self-start flex items-center gap-1.5 text-[12.5px] font-semibold text-primary hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus size={14} /> Add social media
      </button>

      {list.length === 0 && (
        <p className="text-[12px] text-ink-400">
          No social links yet. Add one above — only platforms with a URL here will be available to pick in the Header Builder and Footer Builder.
        </p>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const settings = await settingsApi.get();
        setData({ ...EMPTY, ...settings, seoDefaults: { ...EMPTY.seoDefaults, ...(settings.seoDefaults || {}) }, socialLinks: Array.isArray(settings.socialLinks) ? settings.socialLinks : [], contact: { ...EMPTY.contact, ...(settings.contact || {}) }, analytics: { ...EMPTY.analytics, ...(settings.analytics || {}) } });
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
    setError("");
    try {
      // Sanitize socialLinks right before sending — this is the fix for
      // the "Path `platform` is required" 400: any row missing/invalid
      // platform is dropped here instead of being sent to the API.
      const payload = { ...data, socialLinks: sanitizeSocialLinksForSave(data.socialLinks) };
      const updated = await settingsApi.save(payload);
      setData((p) => ({ ...p, ...updated, socialLinks: Array.isArray(updated?.socialLinks) ? updated.socialLinks : payload.socialLinks }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save settings. Please try again.");
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
      <div className="p-4 lg:p-6 max-w-[720px] mx-auto flex flex-col gap-6 p-4">

        <section className="bg-white border border-border rounded-card p-5 flex flex-col gap-4">
          <h2 className="text-[14px] font-semibold text-ink-900 flex items-center gap-2"><SettingsIcon size={16} /> General</h2>
          <Field label="Site name" value={data.siteName} onChange={(v) => set({ siteName: v })} placeholder="HighTableNews" />
          <Field label="Logo URL" value={data.logo} onChange={(v) => set({ logo: v })} placeholder="https://…/logo.webp" />
          <FaviconUploadField value={data.favicon} onChange={(v) => set({ favicon: v })} />
        </section>

        <section className="bg-white border border-border rounded-card p-5 flex flex-col gap-4">
          <h2 className="text-[14px] font-semibold text-ink-900">SEO defaults</h2>
          <Field label="Meta title" value={data.seoDefaults.metaTitle} onChange={(v) => setNested("seoDefaults", { metaTitle: v })} />
          <Field label="Meta description" value={data.seoDefaults.metaDescription} onChange={(v) => setNested("seoDefaults", { metaDescription: v })} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <ImageUploadField
                label="Default OpenGraph image"
                hint="Shown on Facebook/LinkedIn/etc. previews for any page (home, category, about, privacy policy…) that doesn't set its own image. Upload from your device — WEBP, any size."
                value={data.seoDefaults.ogImage}
                onChange={(v) => setNested("seoDefaults", { ogImage: v })}
                aspect="aspect-[1.91/1]"
              />
            </div>
            <div>
              <ImageUploadField
                label="Default Twitter/X card image"
                hint="Optional — leave empty to reuse the OpenGraph image above for Twitter/X cards too. Upload from your device — WEBP, any size."
                value={data.seoDefaults.twitterImage}
                onChange={(v) => setNested("seoDefaults", { twitterImage: v })}
                aspect="aspect-[1.91/1]"
              />
            </div>
          </div>
        </section>

        <section className="bg-white border border-border rounded-card p-5 flex flex-col gap-4">
          <h2 className="text-[14px] font-semibold text-ink-900">Social links</h2>
          <p className="text-[12.5px] text-ink-500 -mt-2">
            Add your social media accounts and their URLs here. The Header Builder and Footer Builder let you choose which of these icons to display — the link always comes from here.
          </p>
          <SocialLinksEditor social={data.socialLinks} onChange={(socialLinks) => set({ socialLinks })} />
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

        {error && (
          <p className="text-[12.5px] text-red-600 -mt-2">{error}</p>
        )}

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