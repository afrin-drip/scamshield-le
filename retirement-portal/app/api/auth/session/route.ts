import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
export async function GET(req: NextRequest) {
  const token = req.cookies.get('session')?.value;
  if (!token) return NextResponse.json({ user: null });
  const user = await verifyToken(token);
  return NextResponse.json({ user });
}