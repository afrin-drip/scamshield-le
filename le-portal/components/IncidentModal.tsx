'use client';

import { useEffect, useRef } from 'react';
import { X, ExternalLink, Download, Shield, AlertTriangle, Clock, MapPin } from 'lucide-react';

export interface IncidentDetail {
  id: string;
  dateTime: string;
  areaCode: string;
  city: string;
  state: string;
  riskScore: number;
  signals: { name: string; score: number; description: string }[];
  transcriptExcerpt: string;
  callerNumber: string;
  duration: number; // seconds
  ftcReportUrl?: string;
}

interface IncidentModalProps {
  incident: IncidentDetail | null;
  onClose: () => void;
}

function RiskGauge({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score));
  const angle = (pct / 100) * 180 - 90; // -90 to 90 deg
  const color = pct >= 85 ? '#ef4444' : pct >= 60 ? '#f97316' : pct >= 30 ? '#eab308' : '#22c55e';
  const label = pct >= 85 ? 'CRITICAL' : pct >= 60 ? 'HIGH' : pct >= 30 ? 'MEDIUM' : 'LOW';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-[72px] overflow-hidden">
        <svg viewBox="0 0 144 80" className="w-full">
          {/* Track */}
          <path d="M 8 72 A 64 64 0 0 1 136 72" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" strokeLinecap="round" />
          {/* Fill */}
          <path
            d="M 8 72 A 64 64 0 0 1 136 72"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${pct * 2.01} 201`}
          />
          {/* Needle */}
          <g transform={`translate(72,72) rotate(${angle})`}>
            <line x1="0" y1="0" x2="0" y2="-52" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="0" cy="0" r="5" fill={color} />
          </g>
        </svg>
      </div>
      <div className="mt-1 text-3xl font-bold" style={{ color }}>{score}</div>
      <div className="text-xs font-semibold tracking-widest mt-0.5" style={{ color }}>{label}</div>
    </div>
  );
}

function SignalBar({ name, score, description }: { name: string; score: number; description: string }) {
  const color = score >= 85 ? '#ef4444' : score >= 60 ? '#f97316' : score >= 30 ? '#eab308' : '#22c55e';
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-slate-200 font-medium">{name}</span>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>{score}</span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, background: color }} />
      </div>
      <div className="text-xs text-slate-500 mt-0.5">{description}</div>
    </div>
  );
}

export default function IncidentModal({ incident, onClose }: IncidentModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!incident) return null;

  const dt = new Date(incident.dateTime);
  const mins = Math.floor(incident.duration / 60);
  const secs = incident.duration % 60;

  const handleExport = () => {
    const data = JSON.stringify(incident, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-${incident.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10"
        style={{
          background: 'rgba(15,15,25,0.95)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/10"
          style={{ background: 'rgba(15,15,25,0.98)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Incident #{incident.id.slice(-8).toUpperCase()}</h2>
              <p className="text-xs text-slate-400">{incident.callerNumber}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Meta row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-xl p-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-500">Date & Time</div>
                <div className="text-sm font-medium text-slate-200">
                  {dt.toLocaleDateString()} {dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-500">Origin</div>
                <div className="text-sm font-medium text-slate-200">+1 ({incident.areaCode}) · {incident.city}, {incident.state}</div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-500">Duration</div>
                <div className="text-sm font-medium text-slate-200">{mins}m {secs}s</div>
              </div>
            </div>
          </div>

          {/* Risk gauge */}
          <div className="bg-white/5 rounded-xl p-5 flex flex-col items-center">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Composite Risk Score</div>
            <RiskGauge score={incident.riskScore} />
          </div>

          {/* Signals */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Detected Signals</h3>
            <div className="bg-white/5 rounded-xl p-4">
              {incident.signals.map(s => (
                <SignalBar key={s.name} name={s.name} score={s.score} description={s.description} />
              ))}
            </div>
          </div>

          {/* Transcript */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Transcript Excerpt</h3>
            <div className="bg-white/5 rounded-xl p-4 border-l-2 border-red-500/50">
              <p className="text-sm text-slate-300 leading-relaxed italic">"{incident.transcriptExcerpt}"</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {incident.ftcReportUrl && (
              <a
                href={incident.ftcReportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Report to FTC
              </a>
            )}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-200 text-sm font-medium rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
            <button
              onClick={onClose}
              className="ml-auto px-4 py-2 text-slate-400 hover:text-slate-200 text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
