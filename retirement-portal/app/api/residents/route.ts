import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';
const MOCK=[{id:'r1',facilityId:'f1',name:'Dorothy Banks',room:'204A',riskLevel:'high',protectionStatus:'active',subscriptionTier:'pro',incidentsThisWeek:3,lastIncident:new Date().toISOString(),appInstalled:true,familyContacts:[]},{id:'r2',facilityId:'f1',name:'Harold Chen',room:'112B',riskLevel:'low',protectionStatus:'active',subscriptionTier:'free',incidentsThisWeek:0,lastIncident:null,appInstalled:true,familyContacts:[]}];
export async function GET(req:NextRequest){
  const token=req.cookies.get('session')?.value;
  const user=token?await verifyToken(token):null;
  if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
  const residents=user.role==='super_admin'?MOCK:MOCK.filter(r=>r.facilityId===user.facilityId);
  return NextResponse.json({residents});
}