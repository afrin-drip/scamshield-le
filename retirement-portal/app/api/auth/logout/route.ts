import { NextResponse } from 'next/server';
export async function POST() {
  const res = NextResponse.redirect('/login');
  res.cookies.delete('session');
  return res;
}