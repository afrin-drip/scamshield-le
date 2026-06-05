'use client';

import { useState } from 'react';
import { FileText, Mail, Clock, Download, Printer, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';

type ReportTemplate = 'executive' | 'technical' | 'area-code' | 'signal-analysis';
type ScheduleFreq = 'weekly' | 'monthly' | 'none';

interface ReportConfig {
  template: ReportTemplate;
  dateRange: { start: string; end: string };
  states: string[];
  minRiskScore: number;
  includeTranscripts: boolean;
  includeMap: boolean;
}

const TEMPLATES: { id: ReportTemplate; label: string; desc: string; icon: string }[] = [
  { id: 'executive', label: 'Executive Summary', desc: 'High-level overview for leadership — key metrics, top signals, geographic heat map', icon: '📊' },
  { id: 'technical', label: 'Technical Deep-Dive', desc: 'Full signal scores, model confidence, transcript excerpts, raw incident data', icon: '🔬' },
  { id: 'area-code', label: 'Area Code Focus', desc: 'Detailed breakdown per area code with trend analysis and caller patterns', icon: '📍' },
  { id: 'signal-analysis', label: 'Signal Analysis', desc: 'Cross-incident signal frequency, co-occurrence matrix, emerging patterns', icon: '📡' },
];

function StatusBadge({ status }: { status: 'idle' | 'generating' | 'done' | 'error' }) {
  if (status === 'idle') return null;
  if (status === 'generating') return (
    <div className="flex items-center gap-2 text-blue-400 text-sm">
      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      Generating…
    </div>
  );
  if (status === 'done') return (
    <div className="flex items-center gap-2 text-green-400 text-sm">
      <CheckCircle className="w-4 h-4" /> Report ready
    </div>
  );
  return (
    <div className="flex items-center gap-2 text-red-400 text-sm">
      <AlertCircle className="w-4 h-4" /> Generation failed
    </div>
  );
}

export default function ReportsPage() {
  const [config, setConfig] = useState<ReportConfig>({
    template: 'executive',
    dateRange: {
      start: new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10),
      end: new Date().toISOString().slice(0, 10),
    },
    states: [],
    minRiskScore: 0,
    includeTranscripts: false,
    includeMap: true,
  });
  const [genStatus, setGenStatus] = useState<'idle' | 'generating' | 'done' | 'error'>('idle');
  const [emailAddr, setEmailAddr] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [schedule, setSchedule] = useState<ScheduleFreq>('none');
  const [scheduleEmail, setScheduleEmail] = useState('');
  const [scheduleSaved, setScheduleSaved] = useState(false);

  const handleGenerate = async () => {
    setGenStatus('generating');
    // Simulate report generation with print dialog
    await new Promise(r => setTimeout(r, 1200));
    setGenStatus('done');
    const tpl = TEMPLATES.find(t => t.id === config.template);
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ScamShield LE — ${tpl?.label} Report</title>
        <style>
          body { font-family: -apple-system, sans-serif; color: #111; max-width: 800px; margin: 0 auto; padding: 40px; }
          h1 { color: #1e40af; } h2 { color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
          .meta { color: #6b7280; font-size: 14px; margin-bottom: 32px; }
          .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 12px; font-weight: 600; }
          .critical { background: #fee2e2; color: #dc2626; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>🛡 ScamShield LE — ${tpl?.label}</h1>
        <div class="meta">
          Period: ${config.dateRange.start} to ${config.dateRange.end} &nbsp;·&nbsp;
          Min Risk Score: ${config.minRiskScore} &nbsp;·&nbsp;
          Generated: ${new Date().toLocaleString()}
        </div>
        <h2>Overview</h2>
        <div class="card">
          <p>This report covers detected scam call incidents within the specified parameters.</p>
          <p>Template: <strong>${tpl?.label}</strong></p>
          <p>Include Transcripts: ${config.includeTranscripts ? 'Yes' : 'No'} &nbsp;·&nbsp; Include Map: ${config.includeMap ? 'Yes' : 'No'}</p>
        </div>
        <h2>Top Signals Detected</h2>
        <div class="card">
          <span class="badge critical">Money Request</span> &nbsp;
          <span class="badge" style="background:#fef3c7;color:#d97706">Urgency</span> &nbsp;
          <span class="badge" style="background:#ede9fe;color:#7c3aed">LE Claim</span>
        </div>
        <p style="color:#9ca3af;font-size:12px;margin-top:40px">
          CONFIDENTIAL — FOR LAW ENFORCEMENT USE ONLY — ScamShield LE Portal
        </p>
      </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(printContent);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 500);
    }
  };

  const handleEmail = async () => {
    if (!emailAddr) return;
    setEmailStatus('sending');
    await new Promise(r => setTimeout(r, 800));
    setEmailStatus('sent');
    setTimeout(() => setEmailStatus('idle'), 3000);
  };

  const handleScheduleSave = () => {
    setScheduleSaved(true);
    setTimeout(() => setScheduleSaved(false), 3000);
  };

  const inputCls = 'w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors';

  return (
    <div className="min-h-screen p-6 text-slate-200" style={{ background: '#0a0a14' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-blue-400" />
            Report Generation
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Generate, export, and schedule law enforcement reports</p>
        </div>

        {/* Template selector */}
        <section className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <h2 className="font-semibold text-slate-100 mb-4">Report Template</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => setConfig(c => ({ ...c, template: t.id }))}
                className={`text-left p-4 rounded-xl border transition-all
                  ${config.template === t.id
                    ? 'border-blue-500/50 bg-blue-500/10'
                    : 'border-white/8 bg-white/3 hover:bg-white/6'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{t.icon}</span>
                  <span className="font-semibold text-sm text-slate-100">{t.label}</span>
                  {config.template === t.id && <ChevronRight className="w-3.5 h-3.5 text-blue-400 ml-auto" />}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Filters */}
        <section className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <h2 className="font-semibold text-slate-100 mb-4">Report Parameters</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Start Date</label>
              <input type="date" className={inputCls} value={config.dateRange.start}
                onChange={e => setConfig(c => ({ ...c, dateRange: { ...c.dateRange, start: e.target.value } }))} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">End Date</label>
              <input type="date" className={inputCls} value={config.dateRange.end}
                onChange={e => setConfig(c => ({ ...c, dateRange: { ...c.dateRange, end: e.target.value } }))} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Min Risk Score: {config.minRiskScore}</label>
              <input type="range" min={0} max={100} value={config.minRiskScore}
                onChange={e => setConfig(c => ({ ...c, minRiskScore: Number(e.target.value) }))}
                className="w-full accent-blue-500" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                <input type="checkbox" checked={config.includeTranscripts}
                  onChange={e => setConfig(c => ({ ...c, includeTranscripts: e.target.checked }))}
                  className="accent-blue-500" />
                Include transcript excerpts
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                <input type="checkbox" checked={config.includeMap}
                  onChange={e => setConfig(c => ({ ...c, includeMap: e.target.checked }))}
                  className="accent-blue-500" />
                Include geographic map
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <button onClick={handleGenerate}
              disabled={genStatus === 'generating'}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium rounded-lg transition-colors text-sm">
              <Printer className="w-4 h-4" />
              Generate & Print
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 font-medium rounded-lg transition-colors text-sm">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <StatusBadge status={genStatus} />
          </div>
        </section>

        {/* Email report */}
        <section className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <h2 className="font-semibold text-slate-100 mb-1 flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" /> Email Report
          </h2>
          <p className="text-xs text-slate-500 mb-4">Send to agency email address</p>
          <div className="flex gap-3">
            <input type="email" placeholder="agency@example.gov" value={emailAddr}
              onChange={e => setEmailAddr(e.target.value)} className={`${inputCls} flex-1`} />
            <button onClick={handleEmail} disabled={!emailAddr || emailStatus === 'sending'}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
              {emailStatus === 'sending' ? 'Sending…' : emailStatus === 'sent' ? '✓ Sent' : 'Send Report'}
            </button>
          </div>
        </section>

        {/* Scheduled reports */}
        <section className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <h2 className="font-semibold text-slate-100 mb-1 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" /> Scheduled Reports
          </h2>
          <p className="text-xs text-slate-500 mb-4">Automatically send reports on a recurring schedule</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {(['none', 'weekly', 'monthly'] as ScheduleFreq[]).map(f => (
              <button key={f} onClick={() => setSchedule(f)}
                className={`py-2.5 rounded-xl border text-sm font-medium transition-all capitalize
                  ${schedule === f ? 'border-blue-500/50 bg-blue-500/10 text-blue-300' : 'border-white/10 text-slate-400 hover:text-slate-200'}`}>
                {f === 'none' ? 'Off' : f === 'weekly' ? '📅 Weekly' : '📆 Monthly'}
              </button>
            ))}
          </div>
          {schedule !== 'none' && (
            <div className="flex gap-3">
              <input type="email" placeholder="recipient@agency.gov" value={scheduleEmail}
                onChange={e => setScheduleEmail(e.target.value)} className={`${inputCls} flex-1`} />
              <button onClick={handleScheduleSave}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition-colors">
                {scheduleSaved ? '✓ Saved' : 'Save Schedule'}
              </button>
            </div>
          )}
          {schedule !== 'none' && (
            <p className="text-xs text-slate-500 mt-2">
              Reports will be sent {schedule === 'weekly' ? 'every Monday at 8:00 AM' : 'on the 1st of each month at 8:00 AM'}.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
