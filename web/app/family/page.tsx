'use client';
import { useEffect, useState } from 'react';
import { getFamilyMembers } from '@/lib/api';
import { FamilyMember } from '@/lib/types';
import FamilyMemberRow from '@/components/FamilyMemberRow';

export default function FamilyPage() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', phone: '', relationship: '' });

  useEffect(() => {
    getFamilyMembers().then(data => {
      setMembers(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: form.name,
      phone: form.phone,
      relationship: form.relationship,
      notificationsEnabled: true,
      createdAt: new Date().toISOString(),
    };
    setMembers(prev => [...prev, newMember]);
    setForm({ name: '', phone: '', relationship: '' });
  };

  const handleToggle = (id: string, enabled: boolean) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, notificationsEnabled: enabled } : m));
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white">Family Members</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Protected Members</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading…</div>
        ) : members.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No family members added yet.</div>
        ) : (
          <div className="divide-y divide-gray-800">
            {members.map(member => (
              <FamilyMemberRow key={member.id} member={member} onToggle={handleToggle} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Add Family Member</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Relationship (e.g. Mom)"
            value={form.relationship}
            onChange={e => setForm(p => ({ ...p, relationship: e.target.value }))}
            className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
          />
          <div className="md:col-span-3">
            <button
              type="submit"
              className="bg-safe-green hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}