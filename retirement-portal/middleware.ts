import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-me');
const PUBLIC_PATHS = ['/login'];
const PUBLIC_PREFIXES = ['/api/auth/'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.includes(pathname) || PUBLIC_PREFIXES.some(p => pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get('session')?.value ?? req.cookies.get('auth_token')?.value;
  if (!token) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, req.url));

  try {
    const { payload } = await jwtVerify(token, secret);
    const res = NextResponse.next();
    res.headers.set('x-user-id', String(payload.id ?? ''));
    res.headers.set('x-user-role', String(payload.role ?? ''));
    res.headers.set('x-user-name', String(payload.name ?? ''));
    res.headers.set('x-facility-id', String(payload.facilityId ?? ''));
    return res;
  } catch {
    const res = NextResponse.redirect(new URL('/login', req.url));
    res.cookies.delete('session');
    res.cookies.delete('auth_token');
    return res;
  }
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };