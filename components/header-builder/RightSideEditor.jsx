"use client";

import { Search, LogIn, MessageSquare, Share2, Newspaper, Instagram, Twitter, Facebook, Linkedin, Youtube, BookOpen, Rss, MessageCircle, Pin } from "lucide-react";
import { ToggleRow, Field, ColorInput } from "@/components/ui/Field";

const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "twitter", label: "X (Twitter)", icon: Twitter },
  { key: "facebook", label: "Facebook", icon: Facebook },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin },
  { key: "youtube", label: "YouTube", icon: Youtube },
  { key: "medium", label: "Medium", icon: BookOpen },
  { key: "substack", label: "Substack", icon: Rss },
  { key: "reddit", label: "Reddit", icon: MessageCircle },
  { key: "pinterest", label: "Pinterest", icon: Pin },
];

export default function RightSideEditor({ rightSide, onChange }) {
  function set(patch) {
    onChange({ ...rightSide, ...patch });
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
          <ToggleRow icon={LogIn} label="Login Button" sub="Allow readers to sign in" checked={rightSide.loginButton} onChange={(v) => set({ loginButton: v })} />
        </div>
        <div className="py-3">
          <ToggleRow icon={MessageSquare} label="Subscribe Button" sub="Highlighted CTA button" checked={rightSide.subscribeButton} onChange={(v) => set({ subscribeButton: v })} />
        </div>
        <div className="pt-3">
          <ToggleRow icon={Share2} label="Social Icons" sub="Show social links in the header" checked={rightSide.socialIcons} onChange={(v) => set({ socialIcons: v })} />
        </div>
      </div>

      {rightSide.socialIcons && (
        <Field label="Select Social Platforms">
          <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-border bg-surface-soft/50">
            {SOCIAL_PLATFORMS.map(({ key, label, icon: Icon }) => {
              const platforms = rightSide.socialPlatforms || ["instagram", "twitter", "facebook"];
              const active = platforms.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => {
                    const has = platforms.includes(key);
                    set({ socialPlatforms: has ? platforms.filter((k) => k !== key) : [...platforms, key] });
                  }}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
                    active ? "border-primary bg-primary text-white" : "border-border text-ink-600 hover:border-primary/40"
                  }`}
                >
                  <Icon size={12} />
                  {label}
                </button>
              );
            })}
          </div>
        </Field>
      )}

      {rightSide.socialIcons && (rightSide.socialPlatforms || ["instagram", "twitter", "facebook"]).length > 0 && (
        <Field label="Social Link URLs" hint="Each icon opens its link in a new tab. Leave blank to hide that icon until a link is added.">
          <div className="space-y-2 rounded-lg border border-border p-3">
            {SOCIAL_PLATFORMS.filter(({ key }) => (rightSide.socialPlatforms || ["instagram", "twitter", "facebook"]).includes(key)).map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 w-28 shrink-0 text-[12px] text-ink-600">
                  <Icon size={13} className="text-ink-400 shrink-0" />
                  <span className="truncate">{label}</span>
                </div>
                <input
                  value={rightSide.socialLinks?.[key] || ""}
                  onChange={(e) => set({ socialLinks: { ...(rightSide.socialLinks || {}), [key]: e.target.value } })}
                  placeholder="https://…"
                  className="flex-1 min-w-0 rounded-md border border-border bg-surface-soft px-2.5 py-1.5 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            ))}
          </div>
        </Field>
      )}
    </div>
  );
}
