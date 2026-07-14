"use client";

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex items-center gap-5 border-b border-border px-1 overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`relative flex items-center gap-1.5 whitespace-nowrap py-3 text-[13px] font-semibold transition-colors ${
              isActive ? "text-primary-600" : "text-ink-500 font-medium hover:text-ink-900"
            }`}
          >
            {Icon && <Icon size={14} />}
            {tab.label}
            {isActive && <span className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full bg-accent-500" />}
          </button>
        );
      })}
    </div>
  );
}
