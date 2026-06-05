export type Role = 'super_admin' | 'facility_admin' | 'staff';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type ProtectionStatus = 'active' | 'inactive' | 'pending';
export interface Tenant { id:string; name:string; address:string; adminEmail:string; residentCount:number; createdAt:string; }
export interface Resident { id:string; facilityId:string; name:string; room:string; riskLevel:RiskLevel; protectionStatus:ProtectionStatus; subscriptionTier:'free'|'pro'|'family'; incidentsThisWeek:number; lastIncident:string|null; appInstalled:boolean; familyContacts:FamilyContact[]; }
export interface FamilyContact { id:string; residentId:string; name:string; relation:string; phone:string; email:string; notifyOnAlert:boolean; notifyOnReport:boolean; minRiskLevel:RiskLevel; }
export interface Alert { id:string; facilityId:string; residentId:string; residentName:string; room:string; riskScore:number; riskLevel:RiskLevel; callType:string; transcript:string; actionTaken:string; acknowledged:boolean; acknowledgedBy?:string; createdAt:string; }
export interface DashboardKPIs { residentsProtected:number; incidentsThisWeek:number; callsBlocked:number; unacknowledgedAlerts:number; }
export interface SessionUser { id:string; email:string; name:string; role:Role; facilityId:string|null; facilityName:string|null; }