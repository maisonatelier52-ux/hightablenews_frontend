"use client";

// components/dashboard/CategoryDonut.jsx
//
// Dependency-free SVG donut chart for the Dashboard's "Top Categories" card.
// `segments` is an array of { label, value, color } already sorted largest
// first; percentages are derived here from the values so callers never have
// to keep two numbers in sync.

const SIZE = 168;
const STROKE = 26;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

export default function CategoryDonut({ segments }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  let offset = 0;
  const arcs = segments.map((s) => {
    const pct = s.value / total;
    const dash = pct * C;
    const arc = { ...s, pct, dashArray: `${dash} ${C - dash}`, dashOffset: -offset };
    offset += dash;
    return arc;
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="shrink-0">
        <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="#eef1f6" strokeWidth={STROKE} />
          {arcs.map((a, i) => (
            <circle
              key={i}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke={a.color}
              strokeWidth={STROKE}
              strokeDasharray={a.dashArray}
              strokeDashoffset={a.dashOffset}
              strokeLinecap="butt"
            >
              <title>{`${a.label}: ${Math.round(a.pct * 100)}%`}</title>
            </circle>
          ))}
        </g>
        <text x={SIZE / 2} y={SIZE / 2 - 4} textAnchor="middle" fontSize="20" fontWeight="700" fill="#111827">
          {total}
        </text>
        <text x={SIZE / 2} y={SIZE / 2 + 14} textAnchor="middle" fontSize="10.5" fill="#9aa4b2">
          Total Articles
        </text>
      </svg>

      <div className="flex-1 space-y-2.5 min-w-0">
        {arcs.map((a) => (
          <div key={a.label} className="flex items-center justify-between gap-3 text-[13px]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: a.color }} />
              <span className="text-ink-700 truncate">{a.label}</span>
            </div>
            <span className="text-ink-900 font-semibold shrink-0">{Math.round(a.pct * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
