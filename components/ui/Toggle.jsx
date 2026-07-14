"use client";

export default function Toggle({ checked, onChange, label, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
        checked ? "bg-primary" : "bg-ink-400/30"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      aria-label={label}
    >
      <span
        className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-[22px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}
