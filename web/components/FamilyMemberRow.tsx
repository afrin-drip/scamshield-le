'use client';
import { FamilyMember } from '@/lib/types';

export default function FamilyMemberRow({
  member,
  onToggle,
}: {
  member: FamilyMember;
  onToggle: (id: string, enabled: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold text-sm">
          {member.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-medium">{member.name}</p>
          <p className="text-gray-400 text-sm">{member.phone} · {member.relationship}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-sm">Notifications</span>
        <button
          onClick={() => onToggle(member.id, !member.notificationsEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            member.notificationsEnabled ? 'bg-safe-green' : 'bg-gray-700'
          }`}
          role="switch"
          aria-checked={member.notificationsEnabled}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              member.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}