'use client';
import { useEffect, useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getIncidents } from '@/lib/api';
import { Incident, RiskLevel } from '@/lib/types';

const SCAM_TYPE_LABELS: Record<string, string> = {
  CRITICAL: 'Critical Scam',
  LIKELY_SCAM: 'Likely Scam',
  SUSPICIOUS: 'Suspicious',
  LOW: 'Low Risk',
};

const RISK_COLORS: Record<string, string> = {
  CRITICAL: '#D32F2F',
  LIKELY_SCAM: '#F57C00',
  SUSPICIOUS: '#FBC02D',
  LOW: '#388E3C',
};

function getLast30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  return days;
}

export default function AnalyticsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (!user) {
        window.location.href = '/';
        return;
      }
      setAuthed(true);
      getIncidents().then(data => {
        setIncidents(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    });
    return unsub;
  }, []);
  const thirtyDaysAgo = useMemo(() => { const d = new Date(); d.setDate(d.getDate() - 30); return d; }, []);
  const recent = useMemo(() => incidents.filter(i => new Date(i.timestamp) >= thirtyDaysAgo), [incidents, thirtyDaysAgo]);
  const dailyData = useMemo(() => { const days = getLast30Days(); const counts: Record<string, number> = {}; days.forEach(d => (counts[d] = 0)); recent.forEach(i => { const label = new Date(i.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); if (label in counts) counts[label]++; }); return days.map(day => ({ day, blocked: counts[day] })); }, [recent]);
  const byRiskLevel = useMemo(() => { const counts: Record<string, number> = { CRITICAL: 0, LIKELY_SCAM: 0, SUSPICIOUS: 0, LOW: 0 }; recent.forEach(i => { if (i.riskAssessment.level in counts) counts[i.riskAssessment.level]++; }); return Object.entries(counts).map(([level, count]) => ({ level, count, label: SCAM_TYPE_LABELS[level] })).sort((a, b) => b.count - a.count); }, [recent]);
  const topType = byRiskLevel[0]; const activeDays = dailyData.filter(d => d.blocked > 0).length;
  if (!authed || loading) return (<div className="flex items-center justify-center min-h-[60vh]"><div className="text-gray-500 text-lg">Loading analytics…</div></div> );
  return (<div className="space-y-8"><h1 className="text-3xl font-bold text-white">Analytics</h1><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="bg-gray-900 border border-gray-800 rounded-xl p-6"><p className="text-gray-400 text-sm mb-1">Calls Blocked</p><p className="text-4xl font-bold text-white">{recent.length}</p></div><div className="bg-gray-900 border border-gray-800 rounded-xl p-6"><h className="text-2xl font-bold text-white">{topType?.count > 0 ? topType.label : '—'}</h><p>{topType?.count > 0 ? `${topType.count} detections` : 'None'}</p></div><div className="bg-gray-900 border border-gray-800 rounded-xl p-6"><p className="text-gray-400 text-sm mb-1">Active Days</p><p className="text-4xl font-bold text-white">{activeDays}</p></div></div><div className="bg-gray-900 border border-gray-800 rounded-xl p-6"><h2 className="text-lg font-semibold text-white mb-4">Daily Detections — Last 30 Days</h2><ResponsiveContainer width="100%" height={240}><LineChart data={dailyData}><CartesianGrid strokeDasharray="3 3" stroke="#374151" /><XAxis dataKey="day" stroke="#9CA3AF" tick={{ fontSize: 11 }} interval={4} /><YAxis stroke="#9CA3AF" allowDecimals={false} /><Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }} /><Line type="monotone" dataKey="blocked" stroke="#D32F2F" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#D32F2F' }} /></LineChart></ResponsiveContainer></div></div>);
}
