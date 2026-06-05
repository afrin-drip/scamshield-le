'use client';

import { useState, useMemo } from 'react';

interface CellData {
  day: number;   // 0=Mon … 6=Sun
  hour: number;  // 0–23
  count: number;
}

interface PeakHoursGridProps {
  data: CellData[];
  className?: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHour(h: number) {
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function interpolateColor(t: number): string {
  // 0 → dark blue, 0.5 → orange, 1 → red
  const stops = [
    [15, 23, 42],    // near-black
    [30, 58, 138],   // deep blue
    [234, 88, 12],   // orange
    [239, 68, 68],   // red
    [127, 29, 29],   // dark red
  ];
  const idx = t * (stops.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, stops.length - 1);
  const f = idx - lo;
  const [r, g, b] = stops[lo].map((c, i) => Math.round(c + f * (stops[hi][i] - c)));
  return `rgb(${r},${g},${b})`;
}

export default function PeakHoursGrid({ data, className = '' }: PeakHoursGridProps) {
  const [tooltip, setTooltip] = useState<{ day: number; hour: number; count: number; x: number; y: number } | null>(null);

  const grid = useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of data) map[`${d.day}-${d.hour}`] = (map[`${d.day}-${d.hour}`] || 0) + d.count;
    return map;
  }, [data]);

  const maxCount = useMemo(() => Math.max(1, ...Object.values(grid)), [grid]);

  const totalByHour = useMemo(() => {
    const totals: Record<number, number> = {};
    HOURS.forEach(h => { totals[h] = DAYS.reduce((s, _, d) => s + (grid[`${d}-${h}`] || 0), 0); });
    return totals;
  }, [grid]);

  const peakHour = Object.entries(totalByHour).reduce((a, b) => (b[1] > a[1] ? b : a), ['0', 0]);
  const peakDay = DAYS.reduce((best, _, d) => {
    const dayTotal = HOURS.reduce((s, h) => s + (grid[`${d}-${h}`] || 0), 0);
    const bestTotal = HOURS.reduce((s, h) => s + (grid[`${best}-${h}`] || 0), 0);
    return dayTotal > bestTotal ? d : best;
  }, 0);

  return (
    <div className={`relative ${className}`}>
      {/* Header stats */}
      <div className="flex gap-4 mb-4 text-xs">
        <div className="bg-white/5 rounded-lg px-3 py-2">
          <span className="text-slate-500">Peak Hour</span>
          <span className="ml-2 font-semibold text-orange-400">{formatHour(Number(peakHour[0]))}</span>
        </div>
        <div className="bg-white/5 rounded-lg px-3 py-2">
          <span className="text-slate-500">Peak Day</span>
          <span className="ml-2 font-semibold text-orange-400">{DAYS[Number(peakDay)]}</span>
        </div>
        <div className="bg-white/5 rounded-lg px-3 py-2">
          <span className="text-slate-500">Total Incidents</span>
          <span className="ml-2 font-semibold text-white">{data.reduce((s, d) => s + d.count, 0).toLocaleString()}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="inline-grid" style={{ gridTemplateColumns: `48px repeat(7, 1fr)`, minWidth: '520px' }}>
          {/* Day headers */}
          <div /> {/* spacer */}
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-semibold text-slate-400 pb-1.5 px-0.5">{d}</div>
          ))}

          {/* Hour rows */}
          {HOURS.map(h => (
            <>
              {/* Hour label */}
              <div key={`lbl-${h}`} className="text-right pr-2 text-[10px] text-slate-500 flex items-center justify-end" style={{ height: '22px' }}>
                {h % 3 === 0 ? formatHour(h) : ''}
              </div>
              {/* Day cells */}
              {DAYS.map((_, d) => {
                const count = grid[`${d}-${h}`] || 0;
                const t = count / maxCount;
                const bg = count === 0 ? 'rgba(255,255,255,0.03)' : interpolateColor(t);
                return (
                  <div
                    key={`${d}-${h}`}
                    className="mx-0.5 mb-0.5 rounded cursor-pointer transition-transform hover:scale-110 hover:z-10"
                    style={{ height: '22px', background: bg, opacity: count === 0 ? 0.4 : 1 }}
                    onMouseEnter={(e) => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      setTooltip({ day: d, hour: h, count, x: rect.left + rect.width / 2, y: rect.top - 8 });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Color scale legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
        <span>Less</span>
        <div className="flex gap-0.5">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="w-4 h-3 rounded-sm" style={{ background: interpolateColor(i / 9) }} />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none px-3 py-2 rounded-lg text-xs text-white shadow-xl border border-white/10"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            background: 'rgba(15,15,25,0.97)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="font-semibold">{DAYS[tooltip.day]} · {formatHour(tooltip.hour)}</div>
          <div className="text-orange-400 font-bold">{tooltip.count.toLocaleString()} incidents</div>
        </div>
      )}
    </div>
  );
}
