export interface AnonymizedIncident {
  id: string;
  timestamp: Date;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  signals: string[];
  transcriptExcerpt: string;
  areaCode: string;
  state?: string;
}

export interface PatternResult {
  signal: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  examples?: string[];
}

export interface AgencyStats {
  agencyId: string;
  name: string;
  requestCount: number;
  lastAccess: Date;
  jurisdiction: string;
}

export interface LEAgency {
  id: string;
  name: string;
  agencyCode: string;
  jurisdiction: string;
  contactEmail: string;
  createdAt: Date;
  active: boolean;
  role: 'agency' | 'super_admin';
}

export interface JWTPayload {
  agencyId: string;
  agency: string;
  role: 'agency' | 'super_admin';
  iat?: number;
  exp?: number;
}

export interface PaginationOptions {
  limit: number;
  offset: number;
}

export interface IncidentFilters {
  startDate?: Date;
  endDate?: Date;
  minRiskScore?: number;
  riskLevel?: string;
  areaCode?: string;
  signal?: string;
}

export interface SummaryStats {
  totalIncidents: number;
  uniqueAreaCodes: number;
  avgRiskScore: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  dateRange: { start: Date; end: Date };
}

export interface WeeklyTrend {
  week: string;
  count: number;
  avgRiskScore: number;
  criticalCount: number;
}

export interface StateStats {
  state: string;
  stateCode: string;
  incidentCount: number;
  avgRiskScore: number;
  topSignals: string[];
}
