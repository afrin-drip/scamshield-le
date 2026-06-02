'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getIncidents } from '@/lib/api';
import { Incident } from '@/lib/types';
import RiskBadge from '@/components/RiskBadge';

const chartData = [
  { day: 'Mon', incidents: 2 },
  { day: 'Tue', incidents: 5 },
  { day: 'Wed', incidents: 3 },
  { day: 'Thu', incidents: 8 },
  { day: 'Fri', incidents: 4 },
  { day: 'Sat', incidents: 1 },
  { day: 'Sun', incidents: 6 },
];

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIncidents().then(data => {
      setIncidents(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const critical = incidents.filter(i => i.riskAssessment.level === 'CRITICAL').length;
  const members = new Set(incidents.map(i => i.phoneNumber)).size;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Total Incidents</p>
          <p className="text-4xl font-bold text-white">{incidents.length}</p>
        </div>
        <div className="bg-gray-900 border border-scam-red/40 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Critical Alerts</p>
          <p className="text-4xl font-bold text-scam-red">{critical}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Family Members</p>
          <p className="text-4xl font-bold text-white">{members}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Incidents — Last 7 Days</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }} />
            <Line type="monotone" dataKey="incidents" stroke="#D32F2F" strokeWidth={2} dot={{ fill: '#D32F2F' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Incidents Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Recent Incidents</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading…</div>
        ) : incidents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No incidents found.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                {['Date', 'Phone', 'Risk Level', 'Score', 'Signals', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {incidents.map(inc => (
                <tr key={inc.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-300">{new Date(inc.timestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{inc.phoneNumber}</td>
                  <td className="px-6 py-4"><RiskBadge level={inc.riskAssessment.level} /></td>
                  <td className="px-6 py-4 text-sm text-white font-semibold">{inc.riskAssessment.overallScore}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{inc.riskAssessment.signals.length} signals</td>
                  <td className="px-6 py-4">
                    <a href={"/incidents/" + inc.id} className="text-blue-400 hover:text-blue-300 text-sm">View →</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}