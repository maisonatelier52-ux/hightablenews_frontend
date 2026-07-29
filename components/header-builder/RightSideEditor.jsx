// components/header-builder/RightSideEditor.jsx
"use client";

import { useEffect, useState } from "react";
import { Search, MessageSquare, Share2, Newspaper, Info } from "lucide-react";
import { ToggleRow, Field, ColorInput } from "@/components/ui/Field";
import { settingsApi } from "@/apis/adminApis";
import { socialPlatformLabel, socialPlatformIcon } from "@/lib/socialPlatforms";

export default function RightSideEditor({ rightSide, onChange }) {
  // The list of social platforms that actually have a URL configured on
  // the Settings page — that's the single source of truth for social
  // account links now. The admin here only picks *which* of those to show
  // as icons in the header; there's no per-icon URL to type anymore.
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

  function set(patch) {
    onChange({ ...rightSide, ...patch });
  }

  const availablePlatforms = siteSocialLinks || [];
  const selectedPlatforms = rightSide.socialPlatforms || ["instagram", "twitter", "facebook"];

  function toggleSocialPlatform(key) {
    const has = selectedPlatforms.includes(key);
    set({ socialPlatforms: has ? selectedPlatforms.filter((k) => k !== key) : [...selectedPlatforms, key] });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1 divide-y divide-border">
        <div className="pb-3">
          <ToggleRow icon={Search} label="Search Icon" sub="Show the search icon in the header" checked={rightSide.searchEnabled} onChange={(v) => set({ searchEnabled: v })} />
        </div>
        <div className="py-3">
          <ToggleRow icon={Newspaper} label="E-Edition Link" sub="Link to digital edition" checked={rightSide.eEditionLink} onChange={(v) => set({ eEditionLink: v })} />
          {rightSide.eEditionLink && (
            <div className="mt-2">
              <Field label="E-Edition Link URL" hint="Where readers land when they click E-Edition">
                <input
                  value={rightSide.eEditionUrl || ""}
                  onChange={(e) => set({ eEditionUrl: e.target.value })}
                  placeholder="https://… or /e-edition"
                  className="w-full rounded-md border border-border bg-surface-soft px-2.5 py-1.5 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </Field>
            </div>
          )}
        </div>
        <div className="py-3">
          <ToggleRow icon={MessageSquare} label="Subscribe Button" sub="Highlighted CTA button" checked={rightSide.subscribeButton} onChange={(v) => set({ subscribeButton: v })} />
        </div>
        <div className="pt-3">
          <ToggleRow icon={Share2} label="Social Icons" sub="Show social links in the header" checked={rightSide.socialIcons} onChange={(v) => set({ socialIcons: v })} />
        </div>
      </div>

      {rightSide.socialIcons && (
        <Field label="Select Social Platforms" hint="Links are managed on the Settings page — pick which of your added platforms to show here.">
          {siteSocialLinks === null ? (
            <p className="text-[12.5px] text-ink-400 p-3">Loading social links…</p>
          ) : availablePlatforms.length === 0 ? (
            <div className="flex items-start gap-2 rounded-lg border border-border bg-surface-soft/50 p-3 text-[12.5px] text-ink-500">
              <Info size={15} className="shrink-0 mt-0.5" />
              <span>
                No social links have been added yet. Go to <strong>Settings → Social links</strong> to add your social media accounts and URLs — they'll then show up here to pick from.
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-border bg-surface-soft/50">
              {availablePlatforms.map(({ platform }) => {
                const Icon = socialPlatformIcon(platform);
                const active = selectedPlatforms.includes(platform);
                return (
                  <button
                    key={platform}
                    onClick={() => toggleSocialPlatform(platform)}
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
          )}
        </Field>
      )}
    </div>
  );
}