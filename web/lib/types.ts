export enum RiskLevel {
  LOW = 'LOW',
  SUSPICIOUS = 'SUSPICIOUS',
  LIKELY_SCAM = 'LIKELY_SCAM',
  CRITICAL = 'CRITICAL',
}

export interface ScamSignal {
  name: string;
  score: number;
  description: string;
}

export interface RiskAssessment {
  level: RiskLevel;
  overallScore: number;
  signals: ScamSignal[];
  summary: string;
}

export interface Incident {
  id: string;
  phoneNumber: string;
  timestamp: string;
  transcript?: string;
  riskAssessment: RiskAssessment;
  reportedToFTC?: boolean;
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  notificationsEnabled: boolean;
  createdAt: string;
}