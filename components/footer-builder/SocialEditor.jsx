// components/footer-builder/SocialEditor.jsx
"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { settingsApi } from "@/apis/adminApis";
import { socialPlatformLabel, socialPlatformIcon } from "@/lib/socialPlatforms";

// `social` is now just an ordered list of *selected* platform keys (e.g.
// ["twitter", "linkedin"]) — not {platform, url} pairs. The actual account
// URL for each platform lives in one place, the Settings page's "Social
// links" section, so it can never drift out of sync with what's shown in
// the Header Builder.
export default function SocialEditor({ social, onChange }) {
  const [siteSocialLinks, setSiteSocialLinks] = useState(null); // null = loading

  useEffect(() => {
    let cancelled = false;
    settingsApi
      .get()
      .then((s) => {
        if (cancelled) return;
        setSiteSocialLinks((s?.socialLinks || []).filter((x) => x?.platform && x?.url));
      })
      .catch(() => {
        if (!cancelled) setSiteSocialLinks([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = social || [];
  const available = siteSocialLinks || [];

  function toggle(key) {
    onChange(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]);
  }

  function move(idx, dir) {
    const next = [...selected];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  if (siteSocialLinks === null) {
    return <p className="text-[12.5px] text-ink-400">Loading social links…</p>;
  }

  if (available.length === 0) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-border bg-surface-soft/50 p-3 text-[12.5px] text-ink-500">
        <Info size={15} className="shrink-0 mt-0.5" />
        <span>
          No social links have been added yet. Go to <strong>Settings → Social links</strong> to add your social media accounts and URLs — they'll then show up here to pick from.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[12px] text-ink-500 mb-2">Choose which social icons to show in the footer. Links are managed in Settings → Social links.</p>
        <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-border bg-surface-soft/50">
          {available.map(({ platform }) => {
            const Icon = socialPlatformIcon(platform);
            const active = selected.includes(platform);
            return (
              <button
                key={platform}
                onClick={() => toggle(platform)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
                  active ? "border-primary bg-primary text-white" : "border-border text-ink-600 hover:border-primary/40"
                }`}
              >
                <Icon size={12} />
                {socialPlatformLabel(platform)}
              </button>
            );
          })}
        </div>
      </div>

      {selected.length > 0 && (
        <div>
          <p className="text-[12px] text-ink-500 mb-2">Order shown in the footer</p>
          <div className="space-y-1.5">
            {selected.map((key, idx) => {
              const Icon = socialPlatformIcon(key);
              return (
                <div key={key} className="flex items-center gap-2 rounded-md border border-border bg-white px-2.5 py-1.5">
                  <Icon size={14} className="text-ink-400 shrink-0" />
                  <span className="flex-1 text-[12.5px] text-ink-700">{socialPlatformLabel(key)}</span>
                  <div className="flex flex-col">
                    <button onClick={() => move(idx, -1)} disabled={idx === 0} className="text-ink-400 hover:text-ink-700 disabled:opacity-30 leading-none text-[10px]">▲</button>
                    <button onClick={() => move(idx, 1)} disabled={idx === selected.length - 1} className="text-ink-400 hover:text-ink-700 disabled:opacity-30 leading-none text-[10px]">▼</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}