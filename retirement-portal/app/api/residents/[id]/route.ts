import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';

const MOCK_RESIDENTS = [
  { id: 'r1', facilityId: 'f1', name: 'Dorothy Banks', room: '204A', riskLevel: 'high', protectionStatus: 'active', subscriptionTier: 'pro', incidentsThisWeek: 3, lastIncident: new Date().toISOString(), appInstalled: true, familyContacts: [{ id: 'fc1', residentId: 'r1', name: 'James Banks', relation: 'Son', phone: '(602) 555-0101', email: 'james@example.com', notifyOnAlert: true, notifyOnReport: false, minRiskLevel: 'medium' }] },
  { id: 'r2', facilityId: 'f1', name: 'Harold Chen', room: '112B', riskLevel: 'low', protectionStatus: 'active', subscriptionTier: 'free', incidentsThisWeek: 0, lastIncident: null, appInstalled: true, familyContacts: [] },
  { id: 'r3', facilityId: 'f1', name: 'Margaret Ellis', room: '305C', riskLevel: 'critical', protectionStatus: 'inactive', subscriptionTier: 'pro', incidentsThisWeek: 7, lastIncident: new Date().toISOString(), appInstalled: false, familyContacts: [] },
];

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get('session')?.value;
  const user = token ? await verifyToken(token) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resident = MOCK_RESIDENTS.find(r => r.id === params.id);
  if (!resident) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  // Scope to facility — return 404 not 403 to avoid leaking existence
  if (user.role !== 'super_admin' && resident.facilityId !== user.facilityId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ resident });
}