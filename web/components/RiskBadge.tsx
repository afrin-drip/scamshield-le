import { RiskLevel } from '@/lib/types';

const config: Record<RiskLevel, { label: string; classes: string }> = {
  LOW:          { label: 'Low',          classes: 'bg-green-900/50 text-safe-green border-safe-green/30' },
  SUSPICIOUS:   { label: 'Suspicious',   classes: 'bg-yellow-900/50 text-scam-yellow border-scam-yellow/30' },
  LIKELY_SCAM:  { label: 'Likely Scam',  classes: 'bg-orange-900/50 text-scam-orange border-scam-orange/30' },
  CRITICAL:     { label: 'Critical',     classes: 'bg-red-900/50 text-scam-red border-scam-red/30' },
};

export default function RiskBadge({ level, large }: { level: RiskLevel; large?: boolean }) {
  const { label, classes } = config[level] ?? config.LOW;
  return (
    <span className={`inline-flex items-center border font-semibold rounded-full ${large ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'} ${classes}`}>
      {label}
    </span>
  );
}