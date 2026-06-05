interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: number;
  subtitle?: string;
  accentColor?: string;
}

export function StatCard({ title, value, icon, trend, subtitle, accentColor = '#2563EB' }: StatCardProps) {
  const isPositiveTrend = trend !== undefined && trend > 0;
  const isNegativeTrend = trend !== undefined && trend < 0;
  return (
    <div className="bg-[#162232] border border-[#1E3A5F] rounded-xl p-5 flex flex-col gap-3 hover:border-[#2563EB] transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-white font-mono">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {trend !== undefined && (
          <span className={
            isPositiveTrend ? 'text-red-400 text-sm mb-1 font-medium' :
            isNegativeTrend ? 'text-green-400 text-sm mb-1 font-medium' :
            'text-gray-400 text-sm mb-1'
          }>
            {isPositiveTrend ? '↑' : isNegativeTrend ? '↓' : '→'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
    </div>
  );
}
