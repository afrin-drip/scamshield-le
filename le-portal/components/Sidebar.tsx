'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard',   icon: '📊' },
  { href: '/map',       label: 'Scam Heat Map',icon: '🗺️' },
  { href: '/incidents', label: 'Incidents',    icon: '📋' },
  { href: '/patterns',  label: 'Patterns',     icon: '🔍' },
  { href: '/agencies',  label: 'Agencies',     icon: '🏛️' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-[#0F1923] border-r border-[#1E3A5F] flex flex-col min-h-screen">
      <div className="p-4 border-b border-[#1E3A5F]">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <div>
            <p className="text-white font-bold text-sm leading-tight">ScamShield LE</p>
            <p className="text-[#2563EB] text-xs">Law Enforcement Portal</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === item.href || pathname?.startsWith(item.href + '/')
                ? 'bg-[#1E3A5F] text-white border border-[#2563EB]/40'
                : 'text-gray-400 hover:text-white hover:bg-[#1A2A3A]'
            )}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-[#1E3A5F]">
        <button
          onClick={() => { localStorage.removeItem('le_token'); window.location.href = '/'; }}
          className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 text-sm rounded-lg hover:bg-red-900/20 transition-colors"
        >
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
}
