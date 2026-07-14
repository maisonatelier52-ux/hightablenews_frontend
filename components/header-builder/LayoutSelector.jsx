"use client";

import { Check } from "lucide-react";

const TEMPLATES = [
  { value: "magazine-blue", label: "Magazine (Classic)", desc: "Bold masthead bar with a navy rule beneath the nav." },
  { value: "magazine-red", label: "Magazine Red Bar", desc: "High-contrast nav strip in editorial red." },
  { value: "center-logo", label: "Centered Logo", desc: "Logo anchored in the middle, nav split either side." },
  { value: "minimal", label: "Minimal", desc: "Slim single-row header, logo left, links right." },
  { value: "split", label: "Split Layout", desc: "Utility bar on top, nav and actions below." },
  { value: "masthead", label: "Editorial Masthead", desc: "Broadsheet-style header with a gold rule and tagline." },
];

function MiniPreview({ template }) {
  if (template === "magazine-blue") {
    return (
      <div className="h-16 rounded-md bg-white border border-border overflow-hidden flex flex-col">
        <div className="h-2.5 bg-ink-900" />
        <div className="flex flex-1 items-center px-2 justify-between">
          <div className="h-2 w-14 rounded bg-ink-900/70" />
          <div className="h-2 w-8 rounded bg-primary/40" />
        </div>
        <div className="h-2 bg-primary mx-0 mb-0" style={{ height: 3 }} />
        <div className="h-4 flex items-center px-2 gap-1">
          {[18,12,16,12,14].map((w,i) => <div key={i} className="rounded-full bg-ink-900/20" style={{width:w,height:3}} />)}
        </div>
      </div>
    );
  }
  if (template === "magazine-red") {
    return (
      <div className="h-16 rounded-md bg-white border border-border overflow-hidden flex flex-col">
        <div className="h-2" style={{ background: "#111", height: 8 }} />
        <div className="flex flex-1 items-center px-2 justify-center">
          <div className="h-2 w-14 rounded bg-ink-900/70" />
        </div>
        <div className="h-5 flex items-center gap-1 px-2" style={{ background: "#b30000" }}>
          {[14,10,12,8,10].map((w,i) => <div key={i} className="rounded-full bg-white/40" style={{width:w,height:2}} />)}
        </div>
      </div>
    );
  }
  if (template === "center-logo") {
    return (
      <div className="h-16 rounded-md bg-white border border-border overflow-hidden flex flex-col items-center justify-center gap-1.5">
        <div className="h-2.5 w-full" style={{ background: "#111", height: 6 }} />
        <div className="h-2 w-16 rounded bg-ink-900/70" />
        <div className="flex gap-1">
          {[10,8,12,8,10].map((w,i) => <div key={i} className="rounded-full bg-ink-300" style={{width:w,height:2.5}} />)}
        </div>
      </div>
    );
  }
  if (template === "split") {
    return (
      <div className="h-16 rounded-md bg-white border border-border overflow-hidden flex flex-col">
        <div className="h-2" style={{ background: "#111", height: 7 }} />
        <div className="flex flex-1 items-center px-2 gap-1 border-b border-border">
          <div className="h-2 w-10 rounded bg-ink-400/40" />
          <div className="flex-1" />
          <div className="h-2.5 w-14 rounded bg-ink-900/70" />
          <div className="flex-1" />
          <div className="h-2 w-8 rounded bg-primary/40" />
        </div>
        <div className="flex items-center px-2 gap-1 h-4">
          {[14,10,12,8,10,9].map((w,i) => <div key={i} className="rounded-full bg-ink-900/20" style={{width:w,height:2.5}} />)}
        </div>
      </div>
    );
  }
  if (template === "masthead") {
    return (
      <div className="h-16 rounded-md bg-white border border-border overflow-hidden flex flex-col">
        <div className="h-[3px]" style={{ background: "linear-gradient(90deg, #B68A4E, #E4C990, transparent)" }} />
        <div className="flex flex-1 items-center justify-between px-2 gap-1">
          <div className="h-1.5 w-6 rounded bg-ink-300" />
          <div className="h-2.5 w-12 rounded bg-ink-900/70" />
          <div className="h-1.5 w-6 rounded bg-ink-300" />
        </div>
        <div className="h-1 w-16 mx-auto rounded bg-ink-300/70 mb-1.5" />
        <div className="h-3.5 flex items-center justify-center gap-1 border-t border-border">
          {[10, 8, 12, 8, 10].map((w, i) => <div key={i} className="rounded-full bg-ink-900/20" style={{ width: w, height: 2 }} />)}
        </div>
      </div>
    );
  }
  return (
    <div className="h-16 rounded-md bg-white border border-border overflow-hidden flex items-center justify-between px-3">
      <div className="h-2 w-10 rounded bg-ink-900/70" />
      <div className="flex gap-1">
        {[10,8,12].map((w,i) => <div key={i} className="rounded-full bg-ink-300" style={{width:w,height:2}} />)}
      </div>
      <div className="h-2 w-8 rounded bg-primary/30" />
    </div>
  );
}

export default function LayoutSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {TEMPLATES.map((t) => {
        const active = value === t.value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`relative text-left rounded-xl border p-3 transition-all duration-150 ${
              active
                ? "border-primary shadow-[0_0_0_3px_rgba(21,42,74,0.10)] bg-primary-50/50"
                : "border-border hover:border-primary-200 hover:shadow-soft"
            }`}
          >
            {active && (
              <span className="absolute top-2 right-2 h-4.5 w-4.5 rounded-full bg-primary text-white flex items-center justify-center shadow-soft">
                <Check size={11} strokeWidth={3} />
              </span>
            )}
            <MiniPreview template={t.value} />
            <div className="mt-2.5">
              <div className={`text-[12.5px] font-bold leading-tight ${active ? "text-primary-600" : "text-ink-900"}`}>
                {t.label}
              </div>
              <p className="text-[11px] text-ink-400 leading-snug mt-0.5">{t.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export { TEMPLATES };
