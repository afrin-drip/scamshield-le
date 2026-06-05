import { NextRequest, NextResponse } from 'next/server';
import { signToken, mockUsers } from '../../../../lib/auth';
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const { password: _, ...sessionUser } = user;
  const token = await signToken(sessionUser);
  const res = NextResponse.json({ ok: true, user: sessionUser });
  res.cookies.set('session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 28800 });
  return res;
}