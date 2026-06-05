'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

export interface SignalDataPoint {
  date: string; // ISO date string
  moneyRequest: number;
  urgency: number;
  lawEnforcementClaim: number;
  threatScare: number;
  personalInfoRequest: number;
  giftCardRequest: number;
}

interface SignalTrendChartProps {
  data: SignalDataPoint[];
  className?: string;
}

const SIGNALS = [
  { key: 'moneyRequest',         label: 'Money Request',         color: '#ef4444' },
  { key: 'urgency',              label: 'Urgency / Pressure',    color: '#f97316' },
  { key: 'lawEnforcementClaim',  label: 'LE Impersonation',      color: '#eab308' },
  { key: 'threatScare',          label: 'Threat / Scare',        color: '#a855f7' },
  { key: 'personalInfoRequest',  label: 'Personal Info Request', color: '#06b6d4' },
  { key: 'giftCardRequest',      label: 'Gift Card Request',     color: '#22c55e' },
] as const;

type TimeRange = '7d' | '30d' | '90d';

function filterData(data: SignalDataPoint[], range: TimeRange): SignalDataPoint[] {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return data.filter(d => new Date(d.date) >= cutoff);
}

function formatDate(dateStr: string, range: TimeRange): string {
  const d = new Date(dateStr);
  if (range === '7d') return d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
  if (range === '30d') return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 px-4 py-3 text-sm"
      style={{ background: 'rgba(15,15,25,0.97)', backdropFilter: 'blur(12px)', minWidth: '200px' }}>
      <div className="font-semibold text-slate-200 mb-2">{label}</div>
      {payload.map((p: { color: string; name: string; value: number }) => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400 text-xs">{p.name}</span>
          </div>
          <span className="font-bold tabular-nums" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function SignalTrendChart({ data, className = '' }: SignalTrendChartProps) {
  const [range, setRange] = useState<TimeRange>('30d');
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => filterData(data, range), [data, range]);
  const displayData = useMemo(() =>
    filtered.map(d => ({ ...d, date: formatDate(d.date, range) })),
  [filtered, range]);

  const toggleSignal = (key: string) => {
    setHidden(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const totals = useMemo(() =>
    SIGNALS.reduce((acc, s) => ({
      ...acc,
      [s.key]: filtered.reduce((sum, d) => sum + (d[s.key] || 0), 0),
    }), {} as Record<string, number>),
  [filtered]);

  return (
    <div className={`w-full ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {(['7d', '30d', '90d'] as TimeRange[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors
                ${range === r ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500">
          {filtered.length} data points
        </div>
      </div>

      {/* Signal pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SIGNALS.map(s => {
          const isHidden = hidden.has(s.key);
          return (
            <button
              key={s.key}
              onClick={() => toggleSignal(s.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all
                ${isHidden ? 'border-white/10 text-slate-500 bg-transparent' : 'border-transparent text-slate-900'}`}
              style={isHidden ? {} : { background: s.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: isHidden ? s.color : 'rgba(0,0,0,0.4)' }} />
              {s.label}
              <span className={`font-bold ${isHidden ? 'text-slate-500' : 'text-slate-900/70'}`}>
                {totals[s.key]?.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={displayData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <defs>
            {SIGNALS.map(s => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={range === '7d' ? 0 : range === '30d' ? 4 : 13}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} />
          {SIGNALS.map(s => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={hidden.has(s.key) ? undefined : s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#grad-${s.key})`}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
