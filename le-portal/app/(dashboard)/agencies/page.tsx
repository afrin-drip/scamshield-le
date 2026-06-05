'use client';
import { useState, useEffect } from 'react';
import { getAgencies, registerAgency, rotateApiKey, type Agency } from '@/lib/api';
import { format } from 'date-fns';

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', state: '', contact_email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [newApiKey, setNewApiKey] = useState<{ id: string; key: string } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAgencies().then(a => { setAgencies(a); setLoading(false); }).catch(console.error);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const agency = await registerAgency(form);
      setAgencies(a => [agency, ...a]);
      setShowForm(false);
      setForm({ name: '', state: '', contact_email: '' });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally { setSubmitting(false); }
  };

  const handleRotate = async (id: string) => {
    if (!confirm('Rotate API key? The old key will stop working immediately.')) return;
    try {
      const { api_key } = await rotateApiKey(id);
      setNewApiKey({ id, key: api_key });
    } catch (e: any) { alert(e.message); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agency Management</h1>
          <p className="text-gray-500 text-sm mt-1">Super-admin · {agencies.length} registered agencies</p>
        </div>
        <button onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm rounded-lg transition-colors">
          ➕ Register Agency
        </button>
      </div>

      {/* New API key display */}
      {newApiKey && (
        <div className="bg-green-900/20 border border-green-700 rounded-xl p-4 flex items-start gap-3">
          <span className="text-2xl">🔑</span>
          <div className="flex-1">
            <p className="text-green-400 font-semibold text-sm mb-1">New API Key Generated</p>
            <p className="text-green-300 font-mono text-sm bg-green-900/30 px-3 py-2 rounded">{newApiKey.key}</p>
            <p className="text-gray-500 text-xs mt-2">Save this now — it won't be shown again.</p>
          </div>
          <button onClick={() => setNewApiKey(null)} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Register form */}
      {showForm && (
        <div className="bg-[#162232] border border-[#2563EB]/50 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Register New Agency</h2>
          <form onSubmit={handleRegister} className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 text-xs mb-1 uppercase tracking-wider">Agency Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="FBI Field Office NYC"
                className="w-full bg-[#0F1923] border border-[#1E3A5F] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1 uppercase tracking-wider">State</label>
              <input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} required placeholder="NY" maxLength={2}
                className="w-full bg-[#0F1923] border border-[#1E3A5F] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1 uppercase tracking-wider">Contact Email</label>
              <input type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} required placeholder="agent@fbi.gov"
                className="w-full bg-[#0F1923] border border-[#1E3A5F] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
            </div>
            {error && <p className="col-span-3 text-red-400 text-sm">{error}</p>}
            <div className="col-span-3 flex gap-3">
              <button type="submit" disabled={submitting}
                className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-sm rounded-lg transition-colors">
                {submitting ? 'Registering...' : 'Register Agency'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 bg-[#1E3A5F] text-gray-300 text-sm rounded-lg hover:bg-[#1A2A3A] transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Agencies table */}
      <div className="bg-[#162232] border border-[#1E3A5F] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1E3A5F] text-gray-500 text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3">Agency</th>
              <th className="text-left px-4 py-3">State</th>
              <th className="text-left px-4 py-3">API Key</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Last Active</th>
              <th className="text-left px-4 py-3">Registered</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">Loading agencies...</td></tr>
            ) : agencies.map(a => (
              <tr key={a.id} className="border-b border-[#1E3A5F]/50 hover:bg-[#1E3A5F]/20 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-white font-medium">{a.name}</p>
                  <p className="text-gray-500 text-xs font-mono">{a.id}</p>
                </td>
                <td className="px-4 py-3 text-gray-300">{a.state}</td>
                <td className="px-4 py-3 font-mono text-gray-400 text-xs">{a.api_key_preview}••••••••</td>
                <td className="px-4 py-3">
                  {a.is_super_admin
                    ? <span className="px-2 py-1 bg-[#2563EB]/20 text-[#2563EB] border border-[#2563EB]/40 rounded text-xs font-medium">Super Admin</span>
                    : <span className="px-2 py-1 bg-[#1E3A5F] text-gray-400 rounded text-xs">Agent</span>}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs font-mono">{format(new Date(a.last_active), 'MM/dd/yy HH:mm')}</td>
                <td className="px-4 py-3 text-gray-500 text-xs font-mono">{format(new Date(a.created_at), 'MM/dd/yy')}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleRotate(a.id)}
                    className="text-xs text-[#2563EB] hover:text-white hover:bg-[#2563EB] px-2 py-1 rounded transition-colors">
                    🔄 Rotate Key
                  </button>
                </td>
              </tr>
            ))}
            {!loading && agencies.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">No agencies registered</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
