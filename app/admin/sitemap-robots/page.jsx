"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/layout/AdminShell";
import { settingsApi } from "@/apis/adminApis";
import { useToast } from "@/components/ui/Toast";
import { FileSearch, Loader2, Save, Plus, Trash2, ExternalLink } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

const EMPTY = {
  robotsMode: "auto",
  robotsCustomContent: "",
  robotsDisallow: ["/admin"],
  sitemapExcludedPaths: [],
  sitemapExtraUrls: [],
};

const inputCls =
  "w-full rounded-lg border border-border px-3 py-2 text-[13px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

export default function SitemapRobotsPage() {
  const { showToast } = useToast();
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const settings = await settingsApi.get();
        setData({ ...EMPTY, ...settings });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await settingsApi.save(data);
      setData((p) => ({ ...p, ...updated }));
      showToast("Sitemap & robots settings saved", { type: "success" });
    } catch {
      showToast("Couldn't save settings", { type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminShell title="Sitemap & Robots">
        <div className="flex items-center justify-center py-16 text-ink-400">
          <Loader2 className="animate-spin mr-2" size={18} /> Loading…
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Sitemap & Robots">
      <div className="max-w-[760px] mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-[13px] text-ink-500">
            Published articles, categories, authors, and pages are added to <code>/sitemap.xml</code> automatically. Use this page for exclusions, extra URLs, and robots rules.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12.5px] font-medium text-primary hover:underline">
              View sitemap.xml <ExternalLink size={12} />
            </a>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12.5px] font-medium text-primary hover:underline">
              View robots.txt <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Robots.txt */}
        <section className="bg-white border border-border rounded-card p-5 flex flex-col gap-4">
          <h2 className="text-[14px] font-semibold text-ink-900 flex items-center gap-2">
            <FileSearch size={16} /> robots.txt
          </h2>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" checked={data.robotsMode === "auto"} onChange={() => setData((p) => ({ ...p, robotsMode: "auto" }))} />
              Auto-generated
            </label>
            <label className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" checked={data.robotsMode === "custom"} onChange={() => setData((p) => ({ ...p, robotsMode: "custom" }))} />
              Fully custom
            </label>
          </div>

          {data.robotsMode === "auto" ? (
            <div>
              <span className="text-[11.5px] font-medium text-ink-600 mb-1.5 block">Disallowed paths</span>
              <ListEditor
                items={data.robotsDisallow}
                onChange={(items) => setData((p) => ({ ...p, robotsDisallow: items }))}
                placeholder="/admin"
              />
            </div>
          ) : (
            <label className="block">
              <span className="text-[11.5px] font-medium text-ink-600 mb-1.5 block">Custom robots.txt content</span>
              <textarea
                rows={8}
                className={`${inputCls} font-mono text-[12.5px]`}
                value={data.robotsCustomContent}
                onChange={(e) => setData((p) => ({ ...p, robotsCustomContent: e.target.value }))}
                placeholder={"User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://yoursite.com/sitemap.xml"}
              />
            </label>
          )}
        </section>

        {/* Sitemap exclusions */}
        <section className="bg-white border border-border rounded-card p-5 flex flex-col gap-4">
          <h2 className="text-[14px] font-semibold text-ink-900">Excluded from sitemap</h2>
          <p className="text-[12px] text-ink-500 -mt-2">Hide specific URLs (by path) from the generated sitemap.</p>
          <ListEditor
            items={data.sitemapExcludedPaths}
            onChange={(items) => setData((p) => ({ ...p, sitemapExcludedPaths: items }))}
            placeholder="/old-page"
          />
        </section>

        {/* Extra sitemap URLs */}
        <section className="bg-white border border-border rounded-card p-5 flex flex-col gap-4">
          <h2 className="text-[14px] font-semibold text-ink-900">Extra sitemap URLs</h2>
          <p className="text-[12px] text-ink-500 -mt-2">Add URLs the generator wouldn't otherwise know about.</p>
          <div className="space-y-2">
            {data.sitemapExtraUrls.map((u, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <input
                  className={inputCls}
                  value={u.loc}
                  placeholder="/careers"
                  onChange={(e) => {
                    const next = [...data.sitemapExtraUrls];
                    next[i] = { ...u, loc: e.target.value };
                    setData((p) => ({ ...p, sitemapExtraUrls: next }));
                  }}
                />
                <select
                  className={`${inputCls} w-40 shrink-0`}
                  value={u.changefreq}
                  onChange={(e) => {
                    const next = [...data.sitemapExtraUrls];
                    next[i] = { ...u, changefreq: e.target.value };
                    setData((p) => ({ ...p, sitemapExtraUrls: next }));
                  }}
                >
                  {["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                  className={`${inputCls} w-20 shrink-0`}
                  value={u.priority}
                  onChange={(e) => {
                    const next = [...data.sitemapExtraUrls];
                    next[i] = { ...u, priority: Number(e.target.value) };
                    setData((p) => ({ ...p, sitemapExtraUrls: next }));
                  }}
                />
                <button
                  onClick={() => setData((p) => ({ ...p, sitemapExtraUrls: p.sitemapExtraUrls.filter((_, idx) => idx !== i) }))}
                  className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg border border-border text-ink-400 hover:text-red-600 hover:border-red-200"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={() => setData((p) => ({ ...p, sitemapExtraUrls: [...p.sitemapExtraUrls, { loc: "", changefreq: "monthly", priority: 0.5 }] }))}
              className="flex items-center gap-1.5 text-[12px] font-medium text-primary hover:underline"
            >
              <Plus size={13} /> Add URL
            </button>
          </div>
        </section>

        <div className="flex justify-end pb-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-5 py-2.5 text-[13px] font-medium hover:opacity-90 disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}

function ListEditor({ items, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <input
            className={inputCls}
            value={item}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg border border-border text-ink-400 hover:text-red-600 hover:border-red-200"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ""])} className="flex items-center gap-1.5 text-[12px] font-medium text-primary hover:underline">
        <Plus size={13} /> Add
      </button>
    </div>
  );
}
