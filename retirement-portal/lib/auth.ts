import { SignJWT, jwtVerify } from 'jose';
import { SessionUser } from './types';
const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-me');
export async function signToken(user: SessionUser): Promise<string> {
  return new SignJWT({...user}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('8h').sign(secret);
}
export async function verifyToken(token: string): Promise<SessionUser|null> {
  try { const {payload} = await jwtVerify(token, secret); return payload as unknown as SessionUser; } catch { return null; }
}
export const mockUsers = [
  {id:'u1',email:'admin@sunrisemanor.com',password:'demo1234',name:'Pat Admin',role:'facility_admin' as const,facilityId:'f1',facilityName:'Sunrise Manor'},
  {id:'u2',email:'staff@sunrisemanor.com',password:'demo1234',name:'Alex Staff',role:'staff' as const,facilityId:'f1',facilityName:'Sunrise Manor'},
  {id:'u3',email:'super@scamshieldle.com',password:'demo1234',name:'Super Admin',role:'super_admin' as const,facilityId:null,facilityName:null},
];