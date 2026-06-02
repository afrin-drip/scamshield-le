'use client';
import { useEffect, useState } from 'react';
import { getIncident } from '@/lib/api';
import { Incident } from '@/lib/types';
import RiskBadge from '@/components/RiskBadge';
import SignalChip from '@/components/SignalChip';

export default function IncidentPage({ params }: { params: { id: string } }) {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIncident(params.id).then(data => {
      setIncident(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.id]);

  const handleFTC = () => {
    window.open('https://reportfraud.ftc.gov/', '_blank');
  };

  if (loading) return <div className="text-gray-400 p-8">Loading incident…</div>;
  if (!incident) return <div className="text-gray-400 p-8">Incident not found.</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Incident Details</h1>
          <p className="text-gray-400">{incident.phoneNumber} · {new Date(incident.timestamp).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-4">
          <RiskBadge level={incident.riskAssessment.level} large />
          <button
            onClick={handleFTC}
            className="bg-scam-red hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Report to FTC
          </button>
        </div>
      </div>

      {/* Overall Score */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <p className="text-gray-400 text-sm mb-1">Overall Risk Score</p>
        <p className="text-5xl font-bold text-white">{incident.riskAssessment.overallScore}<span className="text-2xl text-gray-500">/100</span></p>
      </div>

      {/* Signals */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Detected Signals</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {incident.riskAssessment.signals.map(s => (
            <SignalChip key={s.name} signal={s} />
          ))}
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs text-gray-400 uppercase pb-3">Signal</th>
              <th className="text-left text-xs text-gray-400 uppercase pb-3">Score</th>
              <th className="text-left text-xs text-gray-400 uppercase pb-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {incident.riskAssessment.signals.map(s => (
              <tr key={s.name}>
                <td className="py-3 text-sm font-medium text-white">{s.name}</td>
                <td className="py-3 text-sm text-scam-orange font-semibold">+{s.score}</td>
                <td className="py-3 text-sm text-gray-400">{s.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transcript */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Full Transcript</h2>
        <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed bg-gray-950 rounded-lg p-4">
          {incident.transcript || 'No transcript available.'}
        </pre>
      </div>
    </div>
  );
}