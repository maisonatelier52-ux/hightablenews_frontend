"use client";

import { Monitor, Tablet, Smartphone } from "lucide-react";

export const DEVICES = {
  desktop: { width: "100%", icon: Monitor },
  tablet: { width: "420px", icon: Tablet },
  mobile: { width: "300px", icon: Smartphone },
};

export default function DeviceToggle({ device, onChange }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-soft p-1">
      {Object.entries(DEVICES).map(([key, d]) => {
        const Icon = d.icon;
        const active = device === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            title={key}
            className={`flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[12.5px] font-medium capitalize transition-colors ${
              active ? "bg-white text-ink-900 shadow-soft" : "text-ink-400 hover:text-ink-700"
            }`}
          >
            <Icon size={14} />
            {key}
          </button>
        );
      })}
    </div>
  );
}
