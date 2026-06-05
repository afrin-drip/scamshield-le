'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getPatterns, type Pattern } from '@/lib/api';

const DAYS_OPTS = [7, 30, 90];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function PatternsPage() {
  const [data, setData] = useState<{ patterns: Pattern[]; hourly_heatmap: number[][]; phrase_clusters: { phrase: string; count: number }[] } | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPatterns(days).then(d => { setData(d); setLoading(false); }).catch(console.error);
  }, [days]);

  const maxHeat = data?.hourly_heatmap ? Math.max(...data.hourly_heatmap.flat()) : 1;

  const heatColor = (v: number) => {
    if (!v) return '#0F1923';
    const intensity = v / maxHeat;
    if (intensity < 0.3) return '#1E3A5F';
    if (intensity < 0.6) return '#2563EB';
    if (intensity < 0.8) return '#D97706';
    return '#DC2626';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pattern Analysis</h1>
          <p className="text-gray-500 text-sm mt-1">Trending signals, peak times, and script clusters</p>
        </div>
        <div className="flex gap-1 bg-[#162232] border border-[#1E3A5F] rounded-lg p-1">
          {DAYS_OPTS.map(d => (
            <button key={d} onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${days === d ? 'bg-[#2563EB] text-white' : 'text-gray-400 hover:text-white'}`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Analyzing patterns...</p>
        </div>
      ) : (
        <>
          {/* Trending signals */}
          <div className="bg-[#162232] border border-[#1E3A5F] rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">📈 Signal Trends</h2>
            <div className="grid grid-cols-2 gap-4">
              {data?.patterns?.slice(0, 4).map(p => (
                <div key={p.signal} className="bg-[#0F1923] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">{p.signal}</span>
                    <span className={`text-xs font-medium ${p.trend === 'up' ? 'text-red-400' : p.trend === 'down' ? 'text-green-400' : 'text-gray-400'}`}>
                      {p.trend === 'up' ? '↑' : p.trend === 'down' ? '↓' : '→'} {Math.abs(p.change_pct)}%
                    </span>
                  </div>
                  <p className="text-3xl font-bold font-mono text-white">{p.count.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs mt-1">Peak: {p.peak_hour}:00 · {p.area_codes?.slice(0, 3).join(', ')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Peak hours heatmap */}
          <div className="bg-[#162232] border border-[#1E3A5F] rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">🕐 Peak Activity Heatmap <span className="text-xs text-gray-500 font-normal">(Hour × Day of Week)</span></h2>
            <div className="overflow-x-auto">
              <div className="flex gap-1 mb-1">
                <div className="w-8" />
                {HOURS.map(h => (
                  <div key={h} className="w-8 text-center text-gray-600 text-xs">{h}</div>
                ))}
              </div>
              {DAYS_OF_WEEK.map((day, di) => (
                <div key={day} className="flex gap-1 mb-1 items-center">
                  <div className="w-8 text-gray-500 text-xs text-right pr-1">{day}</div>
                  {HOURS.map(h => {
                    const val = data?.hourly_heatmap?.[di]?.[h] ?? 0;
                    return (
                      <div key={h} title={`${day} ${h}:00 — ${val} incidents`}
                        className="w-8 h-6 rounded-sm cursor-default transition-all hover:scale-110"
                        style={{ background: heatColor(val) }} />
                    );
                  })}
                </div>
              ))}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-gray-500 text-xs">Low</span>
                {['#1E3A5F','#2563EB','#D97706','#DC2626'].map(c => (
                  <div key={c} className="w-5 h-3 rounded-sm" style={{ background: c }} />
                ))}
                <span className="text-gray-500 text-xs">High</span>
              </div>
            </div>
          </div>

          {/* Script clusters + Area code ranking side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#162232] border border-[#1E3A5F] rounded-xl p-5">
              <h2 className="text-white font-semibold mb-4">💬 Common Script Phrases</h2>
              <div className="space-y-3">
                {data?.phrase_clusters?.slice(0, 8).map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs font-mono w-6">{i + 1}.</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300 text-xs font-mono">"{p.phrase}"</span>
                        <span className="text-[#2563EB] text-xs font-mono">{p.count}</span>
                      </div>
                      <div className="h-1.5 bg-[#1E3A5F] rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${(p.count / (data.phrase_clusters[0]?.count || 1)) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#162232] border border-[#1E3A5F] rounded-xl p-5">
              <h2 className="text-white font-semibold mb-4">📞 Top Area Codes</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-[#1E3A5F]">
                    <th className="text-left pb-2">Code</th>
                    <th className="text-left pb-2">Incidents</th>
                    <th className="text-left pb-2">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.patterns?.slice(0, 8).flatMap(p => p.area_codes?.slice(0, 1).map(ac => ({
                    ac, count: p.count, trend: p.trend, change: p.change_pct
                  })) ?? []).map((row, i) => (
                    <tr key={i} className="border-b border-[#1E3A5F]/40">
                      <td className="py-2 font-mono text-[#2563EB] font-bold">{row.ac}</td>
                      <td className="py-2 text-gray-300 font-mono">{row.count.toLocaleString()}</td>
                      <td className="py-2">
                        <span className={`text-xs ${row.trend === 'up' ? 'text-red-400' : row.trend === 'down' ? 'text-green-400' : 'text-gray-400'}`}>
                          {row.trend === 'up' ? '↑' : row.trend === 'down' ? '↓' : '→'} {Math.abs(row.change)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
