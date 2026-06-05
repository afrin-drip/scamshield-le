'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard } from '@/components/StatCard';
import { RiskBadge } from '@/components/RiskBadge';
import { getStats, getIncidents, type Stats, type Incident } from '@/lib/api';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      const [s, i] = await Promise.all([
        getStats(30),
        getIncidents({ per_page: 10, sort_by: 'created_at', sort_dir: 'desc' }),
      ]);
      setStats(s);
      setIncidents(i.incidents);
      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-[#162232] border border-[#1E3A5F] rounded-lg p-3 text-xs">
          <p className="text-gray-400 mb-1">{label}</p>
          <p className="text-[#2563EB] font-bold">{payload[0].value} incidents</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center"><div className="text-4xl mb-3 animate-pulse">🛡️</div><p className="text-gray-400">Loading...</p></div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Intelligence Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Scam activity overview — Last 30 days</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live · Updated {format(lastUpdated, 'HH:mm:ss')}
          </div>
          <button onClick={fetchData} className="px-3 py-1.5 bg-[#1E3A5F] hover:bg-[#2563EB] text-white text-xs rounded-lg transition-colors">↻ Refresh</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Incidents" value={stats?.total_incidents_30d ?? 0} icon="📋" trend={12} subtitle="Last 30 days" />
        <StatCard title="Critical Alerts" value={stats?.critical_alerts ?? 0} icon="🚨" trend={8} subtitle="Risk score 90+" />
        <StatCard title="Unique Numbers" value={stats?.unique_numbers ?? 0} icon="📞" trend={-3} subtitle="Distinct scam numbers" />
        <StatCard title="States Affected" value={stats?.states_affected ?? 0} icon="🗺️" subtitle="Active origination" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-[#162232] border border-[#1E3A5F] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">📈 Daily Incident Trend <span className="text-xs text-gray-500 font-normal">Last 30 days</span></h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats?.daily_trend ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v: string) => v.slice(5)} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#162232] border border-[#1E3A5F] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">🔝 Top Signals</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats?.top_signals?.slice(0, 5) ?? []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis dataKey="signal" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#2563EB" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#162232] border border-[#1E3A5F] rounded-xl">
        <div className="p-5 border-b border-[#1E3A5F] flex items-center justify-between">
          <h2 className="text-white font-semibold">Recent Incidents</h2>
          <a href="/incidents" className="text-[#2563EB] text-xs hover:underline">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E3A5F]">
                {['Phone Number','Area Code','State','Signal','Risk','Time'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 text-xs uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc.id} className="border-b border-[#1E3A5F]/50 hover:bg-[#1E3A5F]/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-gray-300">{inc.phone_number}</td>
                  <td className="px-4 py-3 font-mono text-[#2563EB]">{inc.area_code}</td>
                  <td className="px-4 py-3 text-gray-300">{inc.state}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{inc.signal_type}</td>
                  <td className="px-4 py-3"><RiskBadge level={inc.risk_level} score={inc.risk_score} size="sm" /></td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">{format(new Date(inc.created_at), 'MM/dd HH:mm')}</td>
                </tr>
              ))}
              {incidents.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No incidents found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
