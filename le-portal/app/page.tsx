'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [agencyId, setAgencyId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token } = await login(agencyId, apiKey);
      localStorage.setItem('le_token', token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1923] flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(#1E3A5F 1px, transparent 1px), linear-gradient(90deg, #1E3A5F 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1E3A5F] border-2 border-[#2563EB] rounded-2xl mb-4 text-3xl">
            🏛️
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">ScamShield LE</h1>
          <p className="text-[#2563EB] font-medium text-sm uppercase tracking-widest">Law Enforcement Portal</p>
          <p className="text-gray-500 text-xs mt-2">RESTRICTED ACCESS — AUTHORIZED AGENCIES ONLY</p>
        </div>

        {/* Login card */}
        <div className="bg-[#162232] border border-[#1E3A5F] rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#1E3A5F]">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">Secure Connection</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">
                Agency ID
              </label>
              <input
                type="text"
                value={agencyId}
                onChange={e => setAgencyId(e.target.value)}
                placeholder="e.g. FBI-FIELD-NYC-001"
                className="w-full bg-[#0F1923] border border-[#1E3A5F] text-white rounded-lg px-4 py-3 font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="••••••••••••••••••••••••••••••••"
                className="w-full bg-[#0F1923] border border-[#1E3A5F] text-white rounded-lg px-4 py-3 font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg px-4 py-3 text-red-400 text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>🔐 Access Portal</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#1E3A5F] text-center">
            <p className="text-gray-600 text-xs">
              Unauthorized access is a federal offense under 18 U.S.C. § 1030
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          ScamShield LE v1.0 · Powered by ScamShield API
        </p>
      </div>
    </div>
  );
}
