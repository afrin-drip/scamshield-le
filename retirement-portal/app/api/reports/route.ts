import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';
export async function POST(req:NextRequest){
  const token=req.cookies.get('session')?.value;
  const user=token?await verifyToken(token):null;
  if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
  const {period}=await req.json();
  return NextResponse.json({ok:true,report:{id:'rpt-'+Date.now(),facilityId:user.facilityId,period,generatedAt:new Date().toISOString(),totalIncidents:42,highRiskIncidents:9,callsBlocked:165}});
}