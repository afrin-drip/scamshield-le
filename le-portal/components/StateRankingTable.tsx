'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronUp, ChevronDown } from 'lucide-react';

export interface StateStats {
  state: string;
  stateName: string;
  incidentCount: number;
  topSignal: string;
  trend: 'up' | 'down' | 'flat';
  trendPct: number;        // e.g. 12 means +12%
  avgRiskScore: number;
  sparkline: number[];     // last 7 data points (incident counts)
}

interface StateRankingTableProps {
  states: StateStats[];
  className?: string;
}

type SortKey = 'incidentCount' | 'avgRiskScore' | 'trendPct' | 'state';

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 64, H = 24, pad = 2;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - 2 * pad);
    const y = H - pad - ((v - min) / range) * (H - 2 * pad);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* End dot */}
      {data.length > 0 && (() => {
        const [x, y] = pts.split(' ').pop()!.split(',').map(Number);
        return <circle cx={x} cy={y} r="2.5" fill={color} />;
      })()}
    </svg>
  );
}

function RiskBadge({ score }: { score: number }) {
  const [label, color] =
    score >= 85 ? ['CRITICAL', 'bg-red-500/20 text-red-400 border-red-500/30'] :
    score >= 60 ? ['HIGH',     'bg-orange-500/20 text-orange-400 border-orange-500/30'] :
    score >= 30 ? ['MEDIUM',   'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'] :
                  ['LOW',      'bg-green-500/20 text-green-400 border-green-500/30'];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${color}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
      {score} · {label}
    </span>
  );
}

export default function StateRankingTable({ states, className = '' }: StateRankingTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('incidentCount');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const sorted = useMemo(() => {
    const filtered = search
      ? states.filter(s => s.state.toLowerCase().includes(search.toLowerCase()) || s.stateName.toLowerCase().includes(search.toLowerCase()))
      : states;
    return [...filtered].sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'state') return mul * a.state.localeCompare(b.state);
      return mul * ((a[sortKey] as number) - (b[sortKey] as number));
    });
  }, [states, sortKey, sortDir, search]);

  const SortIcon = ({ k }: { k: SortKey }) => sortKey !== k ? null :
    sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />;

  const thCls = (k: SortKey) =>
    `px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:text-slate-200 transition-colors ${sortKey === k ? 'text-slate-200' : ''}`;

  return (
    <div className={`w-full ${className}`}>
      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search state…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-8">#</th>
              <th className={thCls('state')} onClick={() => handleSort('state')}>
                <span className="flex items-center gap-1">State <SortIcon k="state" /></span>
              </th>
              <th className={thCls('incidentCount')} onClick={() => handleSort('incidentCount')}>
                <span className="flex items-center gap-1">Incidents <SortIcon k="incidentCount" /></span>
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Signal</th>
              <th className={thCls('trendPct')} onClick={() => handleSort('trendPct')}>
                <span className="flex items-center gap-1">Trend <SortIcon k="trendPct" /></span>
              </th>
              <th className={thCls('avgRiskScore')} onClick={() => handleSort('avgRiskScore')}>
                <span className="flex items-center gap-1">Avg Risk <SortIcon k="avgRiskScore" /></span>
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">7-Day</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => {
              const sparkColor = s.trend === 'up' ? '#ef4444' : s.trend === 'down' ? '#22c55e' : '#64748b';
              return (
                <tr key={s.state}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-default">
                  <td className="px-3 py-2.5 text-slate-500 text-xs tabular-nums">{i + 1}</td>
                  <td className="px-3 py-2.5">
                    <div className="font-bold text-white">{s.state}</div>
                    <div className="text-xs text-slate-500">{s.stateName}</div>
                  </td>
                  <td className="px-3 py-2.5 font-bold tabular-nums text-slate-100">
                    {s.incidentCount.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-slate-300 max-w-[140px] truncate">{s.topSignal}</td>
                  <td className="px-3 py-2.5">
                    <div className={`flex items-center gap-1 text-xs font-semibold
                      ${s.trend === 'up' ? 'text-red-400' : s.trend === 'down' ? 'text-green-400' : 'text-slate-500'}`}>
                      {s.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> :
                       s.trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> :
                       <Minus className="w-3.5 h-3.5" />}
                      {s.trend !== 'flat' && `${s.trendPct > 0 ? '+' : ''}${s.trendPct}%`}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <RiskBadge score={s.avgRiskScore} />
                  </td>
                  <td className="px-3 py-2.5">
                    <Sparkline data={s.sparkline} color={sparkColor} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sorted.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-sm">No states match "{search}"</div>
        )}
      </div>

      <div className="mt-2 text-xs text-slate-600 text-right">
        {sorted.length} of {states.length} states
      </div>
    </div>
  );
}
