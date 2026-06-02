import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ScamShield LE — Family Dashboard',
  description: 'AI-powered scam detection for families',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <header className="border-b border-gray-800 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚨</span>
                <span className="text-xl font-bold text-white">ScamShield LE</span>
              </div>
              <nav className="flex items-center gap-6">
                <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                  Dashboard
                </a>
                <a href="/family" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                  Family
                </a>
                <a href="/dashboard" className="bg-scam-red hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                  Incidents
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}