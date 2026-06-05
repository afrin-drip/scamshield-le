'use client';
import { useEffect, useState } from 'react';
interface FeedInfo { lastSync: string|null; recordCount: number; lastError: string|null; }
interface FeedStatus { ftc: FeedInfo; cisa: FeedInfo; overall: { healthy: boolean; totalRecords: number }; }
function timeAgo(iso: string|null): string {
  if (!iso) return 'Never';
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff/60000)+'m ago';
  if (diff < 86400000) return Math.floor(diff/3600000)+'h ago';
  return Math.floor(diff/86400000)+'d ago';
}
function SourceCard({ label, info }: { label: string; info: FeedInfo }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-200">{label}</span>
        <span className={`w-2.5 h-2.5 rounded-full ${info.lastError ? 'bg-red-500' : info.lastSync ? 'bg-green-500' : 'bg-gray-500'}`} />
      </div>
      <div className="text-2xl font-bold text-white">{info.recordCount.toLocaleString()}</div>
      <div className="text-xs text-gray-400 mt-1">records • synced {timeAgo(info.lastSync)}</div>
      {info.lastError && <div className="text-xs text-red-400 mt-2 truncate" title={info.lastError}>⚠ {info.lastError}</div>}
    </div>
  );
}
export default function LiveFeedStatusCard() {
  const [status, setStatus] = useState<FeedStatus|null>(null);
  const [syncing, setSyncing] = useState(false);
  const load = async () => { const r = await fetch('/api/feeds/status'); if(r.ok) setStatus(await r.json()); };
  useEffect(() => { load(); const t = setInterval(load, 300000); return ()=>clearInterval(t); }, []);
  const syncNow = async () => { setSyncing(true); await fetch('/api/feeds/status',{method:'POST'}); await load(); setSyncing(false); };
  if (!status) return <div className="bg-gray-900 rounded-xl p-5 animate-pulse h-32" />;
  return (
    <div className="bg-gray-900 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Live Intelligence Feeds</h3>
        <button onClick={syncNow} disabled={syncing} className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50">
          {syncing ? 'Syncing…' : 'Sync Now'}
        </button>
      </div>
      <div className="flex gap-3">
        <SourceCard label="FTC DNC Feed" info={status.ftc} />
        <SourceCard label="CISA Advisories" info={status.cisa} />
      </div>
      <div className="mt-3 text-xs text-gray-500">{status.overall.totalRecords.toLocaleString()} total records • {status.overall.healthy ? '✓ All feeds healthy' : '⚠ Feed errors detected'}</div>
    </div>
  );
}