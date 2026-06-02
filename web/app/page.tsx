'use client';
import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LandingPage() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="mb-6 text-7xl">🚨</div>
      <h1 className="text-5xl font-bold text-white mb-4">ScamShield LE</h1>
      <p className="text-xl text-gray-400 mb-2">Family Dashboard</p>
      <p className="text-gray-500 mb-10 max-w-md">
        AI-powered real-time scam detection. Protect your family from phone and SMS scams with instant alerts and detailed risk analysis.
      </p>
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="flex items-center gap-3 bg-white text-gray-900 font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50 text-lg mb-12"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {loading ? 'Signing in…' : 'Sign in with Google'}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {[
          { icon: '🛡️', title: 'Real-Time Detection', desc: 'AI analyzes calls and messages as they happen, scoring risk in milliseconds.' },
          { icon: '👨‍👩‍👧', title: 'Family Protection', desc: 'Monitor all family members from one dashboard. Get instant alerts for critical threats.' },
          { icon: '📊', title: 'Detailed Reports', desc: 'Full transcripts, signal breakdowns, and one-click FTC reporting for every incident.' },
        ].map(f => (
          <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-left">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="text-white font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}