'use client';
import { useState, useEffect, useCallback } from 'react';
import { RiskBadge } from '@/components/RiskBadge';
import { getIncidents, getIncidentById, type Incident, type IncidentFilters } from '@/lib/api';
import { format } from 'date-fns';

const RISK_LEVELS = ['', 'CRITICAL', 'LIKELY_SCAM', 'SUSPICIOUS', 'SAFE'];
const SIGNAL_TYPES = ['', 'IRS_SCAM', 'SSA_SCAM', 'TECH_SUPPORT', 'GRANDPARENT', 'LOTTERY', 'ROMANCE', 'MEDICARE', 'BANK_FRAUD'];

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Incident | null>(null);
  const [filters, setFilters] = useState<IncidentFilters>({ per_page: 50, sort_by: 'created_at', sort_dir: 'desc' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getIncidents({ ...filters, page });
      setIncidents(r.incidents);
      setTotal(r.total);
      setPages(r.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const exportCsv = () => {
    const headers = ['ID','Phone','Area Code','State','Risk Level','Risk Score','Signal','Created'];
    const rows = incidents.map(i => [i.id, i.phone_number, i.area_code, i.state, i.risk_level, i.risk_score, i.signal_type, i.created_at]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `incidents-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const SortButton = ({ field, label }: { field: string; label: string }) => (
    <button onClick={() => setFilters(f => ({
      ...f,
      sort_by: field,
      sort_dir: f.sort_by === field && f.sort_dir === 'desc' ? 'asc' : 'desc'
    }))} className="flex items-center gap-1 hover:text-white transition-colors">
      {label}
      {filters.sort_by === field && <span>{filters.sort_dir === 'desc' ? '↓' : '↑'}</span>}
    </button>
  );

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Incidents</h1>
          <p className="text-gray-500 text-sm mt-1">{total.toLocaleString()} total records</p>
        </div>
        <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] hover:bg-[#2563EB] text-white text-sm rounded-lg transition-colors">
          ⬇️ Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#162232] border border-[#1E3A5F] rounded-xl p-4 flex flex-wrap gap-3">
        <input type="date" onChange={e => setFilters(f => ({ ...f, start_date: e.target.value }))}
          className="bg-[#0F1923] border border-[#1E3A5F] text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
        <input type="date" onChange={e => setFilters(f => ({ ...f, end_date: e.target.value }))}
          className="bg-[#0F1923] border border-[#1E3A5F] text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
        <select onChange={e => setFilters(f => ({ ...f, risk_level: e.target.value || undefined }))}
          className="bg-[#0F1923] border border-[#1E3A5F] text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]">
          {RISK_LEVELS.map(l => <option key={l} value={l}>{l || 'All Risk Levels'}</option>)}
        </select>
        <select onChange={e => setFilters(f => ({ ...f, signal_type: e.target.value || undefined }))}
          className="bg-[#0F1923] border border-[#1E3A5F] text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]">
          {SIGNAL_TYPES.map(s => <option key={s} value={s}>{s || 'All Signal Types'}</option>)}
        </select>
        <input type="text" placeholder="Area code (e.g. 212)" onChange={e => setFilters(f => ({ ...f, area_code: e.target.value || undefined }))}
          className="bg-[#0F1923] border border-[#1E3A5F] text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB] w-40" />
      </div>

      {/* Table */}
      <div className="bg-[#162232] border border-[#1E3A5F] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E3A5F] text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3"><SortButton field="phone_number" label="Phone" /></th>
                <th className="text-left px-4 py-3">Area Code</th>
                <th className="text-left px-4 py-3">State</th>
                <th className="text-left px-4 py-3">Signal</th>
                <th className="text-left px-4 py-3"><SortButton field="risk_score" label="Risk" /></th>
                <th className="text-left px-4 py-3">Reports</th>
                <th className="text-left px-4 py-3"><SortButton field="created_at" label="Time" /></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">Loading incidents...</td></tr>
              ) : incidents.map(inc => (
                <tr key={inc.id} onClick={() => setSelected(inc)}
                  className="border-b border-[#1E3A5F]/50 hover:bg-[#1E3A5F]/20 cursor-pointer transition-colors">
                  <td className="px-4 py-3 font-mono text-gray-300">{inc.phone_number}</td>
                  <td className="px-4 py-3 font-mono text-[#2563EB] font-bold">{inc.area_code}</td>
                  <td className="px-4 py-3 text-gray-300">{inc.state}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{inc.signal_type}</td>
                  <td className="px-4 py-3"><RiskBadge level={inc.risk_level} score={inc.risk_score} size="sm" /></td>
                  <td className="px-4 py-3 text-gray-400 font-mono">{inc.report_count}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">{format(new Date(inc.created_at), 'MM/dd/yy HH:mm')}</td>
                </tr>
              ))}
              {!loading && incidents.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">No incidents match filters</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-[#1E3A5F] flex items-center justify-between text-xs text-gray-500">
          <span>Page {page} of {pages} · {total.toLocaleString()} records</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 bg-[#1E3A5F] rounded disabled:opacity-40 hover:bg-[#2563EB] transition-colors text-white">← Prev</button>
            <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 bg-[#1E3A5F] rounded disabled:opacity-40 hover:bg-[#2563EB] transition-colors text-white">Next →</button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div className="bg-[#162232] border border-[#1E3A5F] rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-500 text-xs font-mono mb-1">INCIDENT {selected.id}</p>
                <h2 className="text-xl font-bold text-white font-mono">{selected.phone_number}</h2>
              </div>
              <div className="flex items-center gap-3">
                <RiskBadge level={selected.risk_level} score={selected.risk_score} size="lg" />
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-2xl">✕</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                ['Area Code', selected.area_code],
                ['State', selected.state],
                ['Signal Type', selected.signal_type],
                ['Report Count', selected.report_count],
                ['Created', format(new Date(selected.created_at), 'PPpp')],
              ].map(([k, v]) => (
                <div key={k as string} className="bg-[#0F1923] rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">{k}</p>
                  <p className="text-white font-mono text-sm">{v}</p>
                </div>
              ))}
            </div>
            {selected.transcript && (
              <div className="bg-[#0F1923] rounded-lg p-4">
                <p className="text-gray-500 text-xs mb-2 uppercase tracking-wider">Call Transcript</p>
                <p className="text-gray-300 text-sm leading-relaxed font-mono whitespace-pre-wrap">{selected.transcript}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
