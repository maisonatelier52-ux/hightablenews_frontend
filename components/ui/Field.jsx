"use client";

import Toggle from "./Toggle";

export function Card({ title, action, children, noPad, className = "" }) {
  return (
    <div className={`rounded-card border border-border bg-white shadow-soft overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
          <h3 className="text-[13.5px] font-bold text-ink-900 tracking-[-0.01em]">{title}</h3>
          {action}
        </div>
      )}
      <div className={noPad ? "" : "p-4"}>{children}</div>
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      {label && <span className="block text-[12px] font-semibold text-ink-500 mb-1.5">{label}</span>}
      {children}
      {hint && <span className="block text-[11px] text-ink-400 mt-1">{hint}</span>}
    </label>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 focus:bg-white transition-colors ${className}`}
      {...props}
    />
  );
}

export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[13px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 focus:bg-white transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Slider({ value, min = 0, max = 100, step = 1, unit = "px", onChange }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 rounded-full bg-border accent-primary cursor-pointer"
      />
      <div className="flex items-center gap-1 shrink-0 rounded-md border border-border bg-surface-soft px-2 py-1 text-[12.5px] text-ink-700 min-w-[56px] justify-center">
        {value} <span className="text-ink-400">{unit}</span>
      </div>
    </div>
  );
}

export function ToggleRow({ icon: Icon, label, sub, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2 text-[13px] text-ink-700">
        {Icon && <Icon size={15} className="text-ink-400" />}
        <div>
          <div>{label}</div>
          {sub && <div className="text-[11.5px] text-ink-400">{sub}</div>}
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

export function ColorInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-soft px-2 py-1.5">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-6 w-6 rounded cursor-pointer border border-border shrink-0"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-w-0 bg-transparent text-[12.5px] text-ink-700 focus:outline-none"
      />
    </div>
  );
}
