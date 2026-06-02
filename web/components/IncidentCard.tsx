import { Incident } from '@/lib/types';
import RiskBadge from './RiskBadge';
import SignalChip from './SignalChip';

export default function IncidentCard({ incident }: { incident: Incident }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-white font-medium">{incident.phoneNumber}</p>
          <p className="text-gray-500 text-sm">{new Date(incident.timestamp).toLocaleString()}</p>
        </div>
        <RiskBadge level={incident.riskAssessment.level} />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-gray-400 text-sm">Score:</span>
        <span className="text-white font-bold">{incident.riskAssessment.overallScore}/100</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {incident.riskAssessment.signals.slice(0, 4).map(s => (
          <SignalChip key={s.name} signal={s} />
        ))}
        {incident.riskAssessment.signals.length > 4 && (
          <span className="text-gray-500 text-xs self-center">+{incident.riskAssessment.signals.length - 4} more</span>
        )}
      </div>
      <a href={`/incidents/${incident.id}`} className="mt-4 inline-block text-blue-400 hover:text-blue-300 text-sm">
        View details →
      </a>
    </div>
  );
}