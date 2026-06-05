import { NextRequest, NextResponse } from 'next/server';
const LE_API = process.env.LE_API_URL ?? 'http://localhost:4000';
function getToken(req: NextRequest) { const a=req.headers.get('Authorization'); if(a?.startsWith('Bearer ')) return a.slice(7); return req.cookies.get('session')?.value??req.cookies.get('token')?.value??null; }
export async function GET(req: NextRequest) {
  const token = getToken(req); if(!token) return NextResponse.json({error:'Unauthorized'},{status:401});
  const r = await fetch(`${LE_API}/feeds/status`,{headers:{Authorization:`Bearer ${token}`},cache:'no-store'}).catch(e=>null);
  if(!r?.ok) return NextResponse.json({error:'Upstream error'},{status:r?.status??500});
  return NextResponse.json(await r.json());
}
export async function POST(req: NextRequest) {
  const token = getToken(req); if(!token) return NextResponse.json({error:'Unauthorized'},{status:401});
  const r = await fetch(`${LE_API}/feeds/sync`,{method:'POST',headers:{Authorization:`Bearer ${token}`},cache:'no-store'}).catch(e=>null);
  if(!r?.ok) return NextResponse.json({error:'Upstream error'},{status:r?.status??500});
  return NextResponse.json(await r.json());
}