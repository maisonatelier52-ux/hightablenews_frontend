"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { makeId } from "@/lib/api";
import { Select } from "@/components/ui/Field";

const PLATFORMS = ["twitter", "linkedin", "instagram", "youtube", "tiktok", "facebook", "medium", "substack", "reddit", "pinterest"];

export default function SocialEditor({ social, onChange }) {
  function update(id, patch) {
    onChange(social.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }
  function add() {
    onChange([...social, { id: makeId("social"), platform: "twitter", url: "#" }]);
  }
  function remove(id) {
    onChange(social.filter((s) => s.id !== id));
  }
  function move(idx, dir) {
    const next = [...social];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  return (
    <div className="space-y-2">
      {social.map((s, idx) => (
        <div key={s.id} className="flex items-center gap-2">
          <GripVertical size={14} className="text-ink-400 shrink-0" />
          <Select value={s.platform} onChange={(e) => update(s.id, { platform: e.target.value })} className="!w-36">
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>
            ))}
          </Select>
          <input
            value={s.url}
            onChange={(e) => update(s.id, { url: e.target.value })}
            placeholder="https://"
            className="flex-1 min-w-0 rounded-md border border-border bg-surface-soft px-2.5 py-1.5 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="flex flex-col">
            <button onClick={() => move(idx, -1)} disabled={idx === 0} className="text-ink-400 hover:text-ink-700 disabled:opacity-30 leading-none text-[10px]">▲</button>
            <button onClick={() => move(idx, 1)} disabled={idx === social.length - 1} className="text-ink-400 hover:text-ink-700 disabled:opacity-30 leading-none text-[10px]">▼</button>
          </div>
          <button onClick={() => remove(s.id)} className="text-ink-400 hover:text-red-500 p-1">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1 text-[12.5px] font-semibold text-primary hover:text-primary-600">
        <Plus size={13} /> Add Social Icon
      </button>
    </div>
  );
}
