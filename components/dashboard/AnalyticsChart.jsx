"use client";

// components/dashboard/AnalyticsChart.jsx
//
// Lightweight, dependency-free multi-series line chart used by the admin
// Dashboard's "Site Analytics" card. Renders raw SVG so it doesn't need
// recharts/chart.js — keeps the bundle small and matches the rest of the
// admin panel's hand-rolled-SVG conventions (icons aside).

const W = 640;
const H = 220;
const PAD_L = 34;
const PAD_R = 8;
const PAD_T = 12;
const PAD_B = 26;

function buildPoints(values, max) {
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const n = values.length;
  return values.map((v, i) => {
    const x = PAD_L + (n === 1 ? 0 : (i / (n - 1)) * innerW);
    const y = PAD_T + innerH - (max === 0 ? 0 : (v / max) * innerH);
    return [x, y];
  });
}

function pathFromPoints(points) {
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

export default function AnalyticsChart({ labels, series }) {
  const max = Math.max(1, ...series.flatMap((s) => s.data));
  // Round the axis ceiling up to a "nice" step so gridline labels read cleanly.
  const step = Math.pow(10, Math.max(0, String(Math.round(max)).length - 1));
  const ceiling = Math.ceil(max / step) * step;
  const gridValues = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(ceiling * f));

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[220px]" preserveAspectRatio="none">
        {/* gridlines */}
        {gridValues.map((gv, i) => {
          const innerH = H - PAD_T - PAD_B;
          const y = PAD_T + innerH - (gv / ceiling) * innerH;
          return (
            <g key={i}>
              <line x1={PAD_L} x2={W - PAD_R} y1={y} y2={y} stroke="#eef1f6" strokeWidth="1" />
              <text x={0} y={y + 3} fontSize="9" fill="#9aa4b2">
                {gv >= 1000 ? `${(gv / 1000).toFixed(gv % 1000 === 0 ? 0 : 1)}K` : gv}
              </text>
            </g>
          );
        })}

        {/* series lines */}
        {series.map((s) => {
          const points = buildPoints(s.data, ceiling);
          return (
            <g key={s.key}>
              <path d={pathFromPoints(points)} fill="none" stroke={s.color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
              {points.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="3" fill="#fff" stroke={s.color} strokeWidth="2">
                  <title>{`${s.label} · ${labels[i]}: ${s.data[i].toLocaleString()}`}</title>
                </circle>
              ))}
            </g>
          );
        })}

        {/* x axis labels */}
        {labels.map((l, i) => {
          const innerW = W - PAD_L - PAD_R;
          const n = labels.length;
          const x = PAD_L + (n === 1 ? 0 : (i / (n - 1)) * innerW);
          return (
            <text key={i} x={x} y={H - 6} fontSize="9.5" fill="#9aa4b2" textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}>
              {l}
            </text>
          );
        })}
      </svg>

      <div className="flex items-center gap-5 mt-1 flex-wrap">
        {series.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            <span className="text-[12px] text-ink-500">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
