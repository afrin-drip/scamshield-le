'use client';
import { Alert, RiskLevel } from '../lib/types';
import RiskBadge from './RiskBadge';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
  return `${Math.floor(diff/86400000)}d ago`;
}

const RING_COLOR: Record<RiskLevel, string> = {
  critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e'
};

function RiskRing({ score, level }: { score: number; level: RiskLevel }) {
  const r = 20, circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0">
      <circle cx="28" cy="28" r={r} fill="none" stroke="#374151" strokeWidth="5" />
      <circle cx="28" cy="28" r={r} fill="none" stroke={RING_COLOR[level]} strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={circ - fill}
        strokeLinecap="round" transform="rotate(-90 28 28)" />
      <text x="28" y="33" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">{score}</text>
    </svg>
  );
}

interface Props { alert: Alert; onAcknowledge?: (id: string) => void; canWrite?: boolean; }

export default function AlertCard({ alert, onAcknowledge, canWrite = true }: Props) {
  const excerpt = alert.transcript.length > 120 ? alert.transcript.slice(0, 120) + '…' : alert.transcript;
  return (
    <div className={`bg-gray-900 rounded-xl p-5 border transition-opacity ${alert.acknowledged ? 'border-gray-800 opacity-60' : 'border-red-800/60'}`}>
      <div className="flex items-start gap-4">
        <RiskRing score={alert.riskScore} level={alert.riskLevel} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white">{alert.residentName}</span>
              <span className="text-gray-500 text-xs">Room {alert.room}</span>
              <RiskBadge level={alert.riskLevel} />
            </div>
            <span className="text-xs text-gray-500 shrink-0">{timeAgo(alert.createdAt)}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{alert.callType.replace(/_/g,' ')} · {alert.actionTaken}</p>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">{excerpt}</p>
          {alert.acknowledged ? (
            <p className="text-xs text-gray-600 mt-3">✓ Acknowledged{alert.acknowledgedBy ? ` by ${alert.acknowledgedBy}` : ''}</p>
          ) : canWrite && onAcknowledge ? (
            <button onClick={() => onAcknowledge(alert.id)}
              className="mt-3 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors">
              Acknowledge
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}