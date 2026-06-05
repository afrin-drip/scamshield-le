'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { AlertTriangle, Bell, BellOff, FolderOpen, RefreshCw, X, CheckCircle, Circle } from 'lucide-react';

type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

interface Alert {
  id: string;
  severity: Severity;
  areaCode: string;
  city: string;
  state: string;
  signal: string;
  riskScore: number;
  callerNumber: string;
  timestamp: string;
  read: boolean;
  assignedCase?: string;
}

// Severity config
const SEV: Record<Severity, { color: string; bg: string; border: string; dot: string }> = {
  CRITICAL: { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    dot: '#ef4444' },
  HIGH:     { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', dot: '#f97316' },
  MEDIUM:   { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: '#eab308' },
  LOW:      { color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30',  dot: '#22c55e' },
};

// Simulated Firestore-like live feed
function generateAlert(overrides?: Partial<Alert>): Alert {
  const severities: Severity[] = ['CRITICAL', 'CRITICAL', 'HIGH', 'HIGH', 'MEDIUM', 'LOW'];
  const signals = ['Money Request', 'LE Impersonation', 'Urgency Pressure', 'Gift Card Request', 'Threat / Scare', 'Personal Info Request'];
  const areaCodes = ['212', '310', '713', '404', '312', '617', '202', '415', '512', '305'];
  const cities = ['New York', 'Los Angeles', 'Houston', 'Atlanta', 'Chicago', 'Boston', 'Washington', 'San Francisco', 'Austin', 'Miami'];
  const states = ['NY', 'CA', 'TX', 'GA', 'IL', 'MA', 'DC', 'CA', 'TX', 'FL'];
  const idx = Math.floor(Math.random() * areaCodes.length);
  const sev = severities[Math.floor(Math.random() * severities.length)];
  const score = sev === 'CRITICAL' ? 85 + Math.floor(Math.random() * 15) :
                sev === 'HIGH' ? 60 + Math.floor(Math.random() * 25) :
                sev === 'MEDIUM' ? 30 + Math.floor(Math.random() * 30) :
                Math.floor(Math.random() * 30);
  return {
    id: Math.random().toString(36).slice(2, 10).toUpperCase(),
    severity: sev,
    areaCode: areaCodes[idx],
    city: cities[idx],
    state: states[idx],
    signal: signals[Math.floor(Math.random() * signals.length)],
    riskScore: score,
    callerNumber: `+1 (${areaCodes[idx]}) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    timestamp: new Date().toISOString(),
    read: false,
    ...overrides,
  };
}

function useAlertSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const play = useCallback((severity: Severity) => {
    if (!enabled) return;
    try {
      if (!ctxRef.current) ctxRef.current = new AudioContext();
      const ctx = ctxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = severity === 'CRITICAL' ? 880 : severity === 'HIGH' ? 660 : 440;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch { /* ignore */ }
  }, [enabled]);
  return play;
}

function AlertCard({ alert, onDismiss, onAssign, onMarkRead }: {
  alert: Alert;
  onDismiss: (id: string) => void;
  onAssign: (id: string) => void;
  onMarkRead: (id: string) => void;
}) {
  const s = SEV[alert.severity];
  const ts = new Date(alert.timestamp);
  const [assigning, setAssigning] = useState(false);
  const [caseNote, setCaseNote] = useState(alert.assignedCase || '');

  const handleAssign = () => {
    if (!assigning) { setAssigning(true); return; }
    onAssign(alert.id);
    setAssigning(false);
  };

  return (
    <div className={`relative rounded-xl border p-4 transition-all ${s.bg} ${s.border} ${!alert.read ? 'shadow-lg' : 'opacity-75'}`}>
      {/* Unread indicator */}
      {!alert.read && (
        <span className="absolute top-3 right-10 w-2 h-2 rounded-full animate-pulse" style={{ background: s.dot }} />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Severity badge */}
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${s.color} ${s.border} ${s.bg}`}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
            {alert.severity}
          </span>
          <span className="text-sm font-bold text-white">{alert.callerNumber}</span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-400">+1 ({alert.areaCode}) · {alert.city}, {alert.state}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onMarkRead(alert.id)} title={alert.read ? 'Mark unread' : 'Mark read'}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-colors">
            {alert.read ? <Circle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          </button>
          <button onClick={() => onDismiss(alert.id)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-4 flex-wrap">
        <div>
          <span className="text-xs text-slate-500">Signal</span>
          <div className="text-sm font-semibold text-slate-200">{alert.signal}</div>
        </div>
        <div>
          <span className="text-xs text-slate-500">Risk Score</span>
          <div className="text-sm font-bold" style={{ color: s.dot }}>{alert.riskScore}</div>
        </div>
        <div className="ml-auto text-xs text-slate-500">
          {ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      {/* Case assignment */}
      <div className="mt-3 flex items-center gap-2">
        {assigning ? (
          <>
            <input
              autoFocus
              type="text"
              placeholder="Case # or note…"
              value={caseNote}
              onChange={e => setCaseNote(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAssign(); if (e.key === 'Escape') setAssigning(false); }}
              className="flex-1 px-2.5 py-1.5 text-xs bg-white/10 border border-white/20 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
            <button onClick={handleAssign} className="px-2.5 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-500">Save</button>
            <button onClick={() => setAssigning(false)} className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200">Cancel</button>
          </>
        ) : (
          <button onClick={() => setAssigning(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10">
            <FolderOpen className="w-3.5 h-3.5" />
            {alert.assignedCase ? `Case: ${alert.assignedCase}` : 'Assign to case'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(() => [
    generateAlert({ severity: 'CRITICAL', timestamp: new Date(Date.now() - 12000).toISOString() }),
    generateAlert({ severity: 'HIGH',     timestamp: new Date(Date.now() - 35000).toISOString() }),
    generateAlert({ severity: 'CRITICAL', timestamp: new Date(Date.now() - 68000).toISOString() }),
    generateAlert({ severity: 'MEDIUM',   timestamp: new Date(Date.now() - 120000).toISOString(), read: true }),
    generateAlert({ severity: 'HIGH',     timestamp: new Date(Date.now() - 240000).toISOString(), read: true }),
  ]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [filter, setFilter] = useState<Severity | 'ALL'>('ALL');
  const [paused, setPaused] = useState(false);
  const playSound = useAlertSound(soundEnabled);

  // Simulate Firestore live listener
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      const newAlert = generateAlert();
      setAlerts(prev => [newAlert, ...prev.slice(0, 49)]);
      playSound(newAlert.severity);
    }, 8000 + Math.random() * 7000);
    return () => clearInterval(interval);
  }, [paused, playSound]);

  const dismiss = (id: string) => setAlerts(a => a.filter(x => x.id !== id));
  const markRead = (id: string) => setAlerts(a => a.map(x => x.id === id ? { ...x, read: !x.read } : x));
  const assign = (id: string) => setAlerts(a => a.map(x => x.id === id ? { ...x, assignedCase: 'CASE-' + Math.random().toString(36).slice(2, 6).toUpperCase() } : x));
  const dismissAll = () => setAlerts(a => a.filter(x => x.read));
  const markAllRead = () => setAlerts(a => a.map(x => ({ ...x, read: true })));

  const filtered = filter === 'ALL' ? alerts : alerts.filter(a => a.severity === filter);
  const unreadCount = alerts.filter(a => !a.read).length;
  const critCount = alerts.filter(a => a.severity === 'CRITICAL' && !a.read).length;

  return (
    <div className="min-h-screen p-6 text-slate-200" style={{ background: '#0a0a14' }}>
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <AlertTriangle className="w-7 h-7 text-red-400" />
              Real-Time Alerts
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-sm bg-red-500 text-white rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Live feed · {paused ? 'Paused' : 'Listening for new incidents…'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSoundEnabled(v => !v)}
              title={soundEnabled ? 'Mute alerts' : 'Enable alert sounds'}
              className={`p-2.5 rounded-xl border transition-all
                ${soundEnabled ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'}`}>
              {soundEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </button>
            <button onClick={() => setPaused(v => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all
                ${paused ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'}`}>
              <RefreshCw className={`w-4 h-4 ${!paused ? 'animate-spin' : ''}`} style={!paused ? { animationDuration: '3s' } : {}} />
              {paused ? 'Resume' : 'Live'}
            </button>
          </div>
        </div>

        {/* Stats row */}
        {critCount > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />
            <span className="text-red-300 text-sm font-medium">
              {critCount} CRITICAL incident{critCount !== 1 ? 's' : ''} require immediate attention
            </span>
          </div>
        )}

        {/* Filter + bulk actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors
                  ${filter === f ? (f === 'ALL' ? 'bg-blue-600 text-white' : `text-white`) : 'text-slate-400 hover:text-slate-200'}`}
                style={filter === f && f !== 'ALL' ? { background: SEV[f as Severity]?.dot } : {}}>
                {f}
                {f !== 'ALL' && (
                  <span className="ml-1 opacity-70">
                    {alerts.filter(a => a.severity === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={markAllRead} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Mark all read</button>
            <span className="text-slate-700">·</span>
            <button onClick={dismissAll} className="text-xs text-slate-500 hover:text-red-400 transition-colors">Dismiss read</button>
          </div>
        </div>

        {/* Alert list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No {filter !== 'ALL' ? filter.toLowerCase() + ' ' : ''}alerts</p>
            </div>
          ) : (
            filtered.map(a => (
              <AlertCard key={a.id} alert={a} onDismiss={dismiss} onAssign={assign} onMarkRead={markRead} />
            ))
          )}
        </div>

        {filtered.length > 0 && (
          <p className="text-xs text-center text-slate-600">
            Showing {filtered.length} alert{filtered.length !== 1 ? 's' : ''} · Auto-refreshing every 8–15s
          </p>
        )}
      </div>
    </div>
  );
}
