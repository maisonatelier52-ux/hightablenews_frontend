"use client";

import { Check } from "lucide-react";

const LAYOUTS = [
  { value: "5-column", label: "5 Columns", cols: 5, desc: "Brand plus four link columns, evenly spread." },
  { value: "4-column", label: "4 Columns", cols: 4, desc: "Brand plus three link columns." },
  { value: "3-column", label: "3 Columns", cols: 3, desc: "Compact three-column footer." },
  { value: "2-column", label: "2 Columns", cols: 2, desc: "Two wide columns for fewer links." },
  { value: "minimal", label: "Minimal", cols: 0, desc: "Single row: logo left, links right." },
  { value: "centered", label: "Centered", cols: 0, desc: "Everything stacked and centered." },
];

function MiniPreview({ layout }) {
  if (layout.cols > 0) {
    return (
      <div className="h-12 rounded-md bg-ink-900 flex items-center justify-center gap-2 px-2.5">
        {Array.from({ length: layout.cols }).map((_, i) => (
          <div key={i} className="flex-1 space-y-1">
            <div className="h-1 w-full rounded-full bg-white/50" />
            <div className="h-1 w-3/4 rounded-full bg-white/25" />
            <div className="h-1 w-3/4 rounded-full bg-white/25" />
          </div>
        ))}
      </div>
    );
  }
  if (layout.value === "minimal") {
    return (
      <div className="h-12 rounded-md bg-ink-900 flex items-center justify-between px-3">
        <div className="h-1 w-10 rounded-full bg-white/60" />
        <div className="flex gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
        </div>
      </div>
    );
  }
  return (
    <div className="h-12 rounded-md bg-ink-900 flex flex-col items-center justify-center gap-1">
      <div className="h-1 w-14 rounded-full bg-white/60" />
      <div className="h-1 w-20 rounded-full bg-white/25" />
    </div>
  );
}

export default function FooterLayoutSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {LAYOUTS.map((l) => {
        const active = value === l.value;
        return (
          <button
            key={l.value}
            onClick={() => onChange(l.value)}
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
            <MiniPreview layout={l} />
            <div className="mt-2.5">
              <div className={`text-[12.5px] font-bold leading-tight ${active ? "text-primary-600" : "text-ink-900"}`}>
                {l.label}
              </div>
              <p className="text-[11px] text-ink-400 leading-snug mt-0.5">{l.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
