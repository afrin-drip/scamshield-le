import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';
export async function PATCH(req:NextRequest){
  const token=req.cookies.get('session')?.value;
  const user=token?await verifyToken(token):null;
  if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
  const {id}=await req.json();
  return NextResponse.json({ok:true,acknowledged:id,by:user.name});
}