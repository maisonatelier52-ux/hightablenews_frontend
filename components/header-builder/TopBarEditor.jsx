
// components/header-builder/TopBarEditor.jsx
"use client";

import { useEffect, useState } from "react";
import { Newspaper, MessageSquare, Twitter, Info } from "lucide-react";
import { Field, Input, Select, ToggleRow, ColorInput } from "@/components/ui/Field";
import { settingsApi } from "@/apis/adminApis";
import { socialPlatformLabel, socialPlatformIcon } from "@/lib/socialPlatforms";

const RIGHT_ITEMS = [
  { key: "socialIcons", label: "Social Icons", icon: Twitter },
  { key: "eEdition", label: "E-Edition", icon: Newspaper },
  { key: "subscribe", label: "Subscribe Button", icon: MessageSquare },
];

export default function TopBarEditor({ topBar, onChange }) {
  // The list of social platforms that actually have a URL configured on
  // the Settings page — that's the single source of truth for social
  // account links now. The admin here only picks *which* of those to show
  // as icons in the top bar; there's no per-icon URL to type anymore.
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
    onChange({ ...topBar, ...patch });
  }

  function toggleRightItem(key) {
    const has = topBar.rightItems.includes(key);
    set({ rightItems: has ? topBar.rightItems.filter((k) => k !== key) : [...topBar.rightItems, key] });
  }

  function toggleSocialPlatform(key) {
    const platforms = topBar.socialPlatforms || [];
    const has = platforms.includes(key);
    set({ socialPlatforms: has ? platforms.filter((k) => k !== key) : [...platforms, key] });
  }

  const availablePlatforms = siteSocialLinks || [];

  return (
    <div className="space-y-4">
      <ToggleRow
        label="Enable Top Bar"
        sub="Show the thin strip above the main header"
        checked={topBar.enabled}
        onChange={(v) => set({ enabled: v })}
      />

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Background Color">
          <ColorInput value={topBar.bg || "#111111"} onChange={(v) => set({ bg: v })} />
        </Field>
        <Field label="Text Color">
          <ColorInput value={topBar.textColor || "#ffffff"} onChange={(v) => set({ textColor: v })} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Left Text (optional)" hint="Leave blank to always show today's live date">
          <Input value={topBar.leftText} onChange={(e) => set({ leftText: e.target.value })} placeholder="Leave blank to use the live date" />
        </Field>
        <Field label="Date Format" hint="Controls how today's date is displayed — it updates automatically every day">
          <Select value={topBar.dateFormat} onChange={(e) => set({ dateFormat: e.target.value })}>
            <option value="full">Full — Weekday, Month Day, Year</option>
            <option value="short">Short — Day Month Year</option>
            <option value="numeric">Numeric — MM/DD/YYYY</option>
            <option value="none">Hide Date</option>
          </Select>
        </Field>
      </div>

      <Field label="Right Side Items">
        <div className="space-y-2 rounded-lg border border-border p-3">
          {RIGHT_ITEMS.map((item) => (
            <label key={item.key} className="flex items-center gap-2 text-[13px] text-ink-700 cursor-pointer">
              <input
                type="checkbox"
                checked={topBar.rightItems.includes(item.key)}
                onChange={() => toggleRightItem(item.key)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
              />
              <item.icon size={14} className="text-ink-400" />
              {item.label}
            </label>
          ))}
        </div>
      </Field>

      {topBar.rightItems.includes("eEdition") && (
        <Field label="E-Edition Link URL" hint="Where readers land when they click E-Edition in the top bar">
          <Input value={topBar.eEditionUrl || ""} onChange={(e) => set({ eEditionUrl: e.target.value })} placeholder="https://… or /e-edition" />
        </Field>
      )}

      {topBar.rightItems.includes("socialIcons") && (
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
                const active = (topBar.socialPlatforms || []).includes(platform);
                return (
                  <button
                    key={platform}
                    onClick={() => toggleSocialPlatform(platform)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary text-white"
                        : "border-border text-ink-600 hover:border-primary/40"
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

      <div className="border-t border-border pt-4">
        <h5 className="text-[12.5px] font-semibold text-ink-800 mb-1">Icon &amp; Link Hover Colors</h5>
        <p className="text-[11.5px] text-ink-400 mb-3">Applies to Social Icons and E-Edition in the top bar.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Default Color">
            <ColorInput value={topBar.rightItemColor || "#9ca3af"} onChange={(v) => set({ rightItemColor: v })} />
          </Field>
          <Field label="Hover Color">
            <ColorInput value={topBar.rightItemHoverColor || "#ffffff"} onChange={(v) => set({ rightItemHoverColor: v })} />
          </Field>
        </div>
      </div>

      {topBar.rightItems.includes("subscribe") && (
        <div className="border-t border-border pt-4">
          <h5 className="text-[12.5px] font-semibold text-ink-800 mb-1">Subscribe Button</h5>
          <p className="text-[11.5px] text-ink-400 mb-3">Background, text color, corner roundness and hover color of the top bar Subscribe button.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Background">
              <ColorInput value={topBar.subscribeBg || "#7f1d1d"} onChange={(v) => set({ subscribeBg: v })} />
            </Field>
            <Field label="Hover Background">
              <ColorInput value={topBar.subscribeHoverBg || "#c0392b"} onChange={(v) => set({ subscribeHoverBg: v })} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <Field label="Text Color">
              <ColorInput value={topBar.subscribeTextColor || "#ffffff"} onChange={(v) => set({ subscribeTextColor: v })} />
            </Field>
            <Field label={`Corner Radius — ${topBar.subscribeRadius ?? 6}px`}>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={1}
                  value={topBar.subscribeRadius ?? 6}
                  onChange={(e) => set({ subscribeRadius: Number(e.target.value) })}
                  className="flex-1 h-1.5 rounded-full bg-border accent-primary cursor-pointer"
                />
                <div className="flex items-center gap-1 shrink-0 rounded-md border border-border bg-surface-soft px-2 py-1 text-[12.5px] text-ink-700 min-w-[48px] justify-center">
                  {topBar.subscribeRadius ?? 6}px
                </div>
              </div>
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}