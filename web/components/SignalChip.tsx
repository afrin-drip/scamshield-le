import { ScamSignal } from '@/lib/types';

export default function SignalChip({ signal }: { signal: ScamSignal }) {
  return (
    <span className="inline-flex items-center gap-1 bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
      {signal.name}
      <span className="text-scam-orange font-bold">+{signal.score}</span>
    </span>
  );
}