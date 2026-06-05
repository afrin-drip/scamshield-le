import { clsx } from 'clsx';

type RiskLevel = 'CRITICAL' | 'LIKELY_SCAM' | 'SUSPICIOUS' | 'SAFE';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

const RISK_CONFIG: Record<RiskLevel, { label: string; className: string; dot: string }> = {
  CRITICAL:    { label: 'CRITICAL',    className: 'bg-red-900/40 text-red-400 border border-red-700',       dot: 'bg-red-500' },
  LIKELY_SCAM: { label: 'LIKELY SCAM', className: 'bg-orange-900/40 text-orange-400 border border-orange-700', dot: 'bg-orange-500' },
  SUSPICIOUS:  { label: 'SUSPICIOUS',  className: 'bg-yellow-900/40 text-yellow-400 border border-yellow-700', dot: 'bg-yellow-500' },
  SAFE:        { label: 'SAFE',        className: 'bg-green-900/40 text-green-400 border border-green-700',  dot: 'bg-green-500' },
};

export function RiskBadge({ level, score, size = 'md' }: RiskBadgeProps) {
  const config = RISK_CONFIG[level] || RISK_CONFIG.SUSPICIOUS;
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 font-mono font-semibold rounded-full',
      config.className,
      size === 'sm' && 'px-2 py-0.5 text-xs',
      size === 'md' && 'px-3 py-1 text-xs',
      size === 'lg' && 'px-4 py-1.5 text-sm',
    )}>
      <span className={clsx('rounded-full', config.dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      {config.label}
      {score !== undefined && <span className="opacity-70">·{score}</span>}
    </span>
  );
}
