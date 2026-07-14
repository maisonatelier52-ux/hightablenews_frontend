"use client";

import { ExternalLink, Radio, ChevronRight } from "lucide-react";
import { Card, ToggleRow, ColorInput, Field } from "@/components/ui/Field";

export function TopBarQuickCard({ topBar, onChange, onOpenTab }) {
  function set(patch) {
    onChange({ ...topBar, ...patch });
  }

  return (
    <div className="rounded-card border border-border bg-white shadow-soft overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-[13.5px] font-semibold text-ink-900">Top Bar</h3>
        <button onClick={onOpenTab} className="flex items-center gap-1 text-[12px] text-primary font-medium hover:text-primary-600">
          Edit <ChevronRight size={13} />
        </button>
      </div>
      <div className="p-4 space-y-3">
        <ToggleRow label="Enable Top Bar" checked={topBar.enabled} onChange={(v) => set({ enabled: v })} />
        <div className="grid grid-cols-2 gap-2">
          <Field label="Background">
            <ColorInput value={topBar.bg || "#111111"} onChange={(v) => set({ bg: v })} />
          </Field>
          <Field label="Text">
            <ColorInput value={topBar.textColor || "#ffffff"} onChange={(v) => set({ textColor: v })} />
          </Field>
        </div>
      </div>
    </div>
  );
}

export function RightControlsQuickCard({ rightSide, onChange }) {
  function set(patch) {
    onChange({ ...rightSide, ...patch });
  }

  return (
    <div className="rounded-card border border-border bg-white shadow-soft overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-[13.5px] font-semibold text-ink-900">Right Side Controls</h3>
      </div>
      <div className="p-4 space-y-2 divide-y divide-border">
        <ToggleRow label="Search Icon" checked={rightSide.searchEnabled} onChange={(v) => set({ searchEnabled: v })} />
        <div className="pt-2">
          <ToggleRow label="Login Button" checked={rightSide.loginButton} onChange={(v) => set({ loginButton: v })} />
        </div>
        <div className="pt-2">
          <ToggleRow label="Subscribe Button" checked={rightSide.subscribeButton} onChange={(v) => set({ subscribeButton: v })} />
        </div>
        <div className="pt-2">
          <ToggleRow label="Social Icons" checked={rightSide.socialIcons} onChange={(v) => set({ socialIcons: v })} />
        </div>
      </div>
    </div>
  );
}

export function BreakingNewsQuickCard({ breakingNews, onChange, onOpenTab }) {
  function set(patch) {
    onChange({ ...breakingNews, ...patch });
  }

  const speed = breakingNews.speed ?? 80;

  return (
    <div className="rounded-card border border-border bg-white shadow-soft overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Radio size={14} className="text-ink-400" />
          <h3 className="text-[13.5px] font-semibold text-ink-900">Breaking News</h3>
        </div>
        <button onClick={onOpenTab} className="flex items-center gap-1 text-[12px] text-primary font-medium hover:text-primary-600">
          Edit <ChevronRight size={13} />
        </button>
      </div>
      <div className="p-4 space-y-3">
        <ToggleRow label="Enable Breaking News" checked={breakingNews.enabled} onChange={(v) => set({ enabled: v })} />
        {breakingNews.enabled && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Label Background">
                <ColorInput value={breakingNews.bg || "#b30000"} onChange={(v) => set({ bg: v })} />
              </Field>
              <Field label="Label Text">
                <ColorInput value={breakingNews.labelTextColor || "#ffffff"} onChange={(v) => set({ labelTextColor: v })} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Text Color">
                <ColorInput value={breakingNews.textColor || "#ffffff"} onChange={(v) => set({ textColor: v })} />
              </Field>
              <Field label="Background">
                <ColorInput value={breakingNews.tickerBg ?? "#111111"} onChange={(v) => set({ tickerBg: v })} />
              </Field>
            </div>
            <Field label={`Speed (px/sec)`}>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={20}
                  max={200}
                  step={5}
                  value={speed}
                  onChange={(e) => set({ speed: Number(e.target.value) })}
                  className="flex-1 h-1.5 rounded-full bg-border accent-primary cursor-pointer"
                />
                <div className="flex items-center gap-1 shrink-0 rounded-md border border-border bg-surface-soft px-2 py-1 text-[12.5px] text-ink-700 min-w-[56px] justify-center">
                  {speed}
                </div>
              </div>
            </Field>
            <p className="text-[11.5px] text-ink-400">
              {breakingNews.articleIds?.length ? `${breakingNews.articleIds.length} news items` : "Latest 3 articles (auto)"} · {speed}px/sec
            </p>
          </>
        )}
      </div>
    </div>
  );
}
