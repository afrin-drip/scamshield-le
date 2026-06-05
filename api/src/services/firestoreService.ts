import admin from 'firebase-admin';
import { AnonymizedIncident, IncidentFilters, PaginationOptions, PatternResult, SummaryStats, WeeklyTrend, StateStats } from '../types/index.js';
import { stripPII, areaCodeToState } from '../utils/anonymizer.js';
import { config } from '../config/index.js';

let db: admin.firestore.Firestore;

export function getFirestore(): admin.firestore.Firestore {
  if (!db) {
    db = admin.firestore();
  }
  return db;
}

/** Fetch anonymized incidents with pagination and optional filters */
export async function getAnonymizedIncidents(
  options: PaginationOptions,
  filters: IncidentFilters = {}
): Promise<{ incidents: AnonymizedIncident[]; total: number }> {
  const firestore = getFirestore();
  let query: admin.firestore.Query = firestore.collection(config.collection.incidents);

  if (filters.startDate) {
    query = query.where('timestamp', '>=', filters.startDate);
  }
  if (filters.endDate) {
    query = query.where('timestamp', '<=', filters.endDate);
  }
  if (filters.minRiskScore !== undefined) {
    query = query.where('riskScore', '>=', filters.minRiskScore);
  }
  if (filters.riskLevel) {
    query = query.where('riskLevel', '==', filters.riskLevel);
  }

  const countSnapshot = await query.count().get();
  const total = countSnapshot.data().count;

  const snapshot = await query
    .orderBy('timestamp', 'desc')
    .offset(options.offset)
    .limit(options.limit)
    .get();

  const incidents: AnonymizedIncident[] = snapshot.docs
    .map(doc => {
      const data = { id: doc.id, ...doc.data() };
      return stripPII(data) as AnonymizedIncident;
    })
    .filter(inc => {
      if (filters.areaCode && inc.areaCode !== filters.areaCode) return false;
      if (filters.signal && !inc.signals.includes(filters.signal)) return false;
      return true;
    });

  return { incidents, total };
}

/** Get incidents grouped by area code */
export async function getIncidentsByAreaCode(areaCode: string): Promise<AnonymizedIncident[]> {
  const firestore = getFirestore();
  const snapshot = await firestore
    .collection(config.collection.incidents)
    .orderBy('timestamp', 'desc')
    .limit(500)
    .get();

  return snapshot.docs
    .map(doc => stripPII({ id: doc.id, ...doc.data() }) as AnonymizedIncident)
    .filter(inc => inc.areaCode === areaCode);
}

/** Get signal patterns for the last N days */
export async function getSignalPatterns(days: number): Promise<PatternResult[]> {
  const firestore = getFirestore();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const snapshot = await firestore
    .collection(config.collection.incidents)
    .where('timestamp', '>=', since)
    .get();

  const signalCounts: Record<string, number> = {};
  let total = 0;

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const signals: string[] = Array.isArray(data.signals) ? data.signals : [];
    signals.forEach(s => {
      signalCounts[s] = (signalCounts[s] || 0) + 1;
      total++;
    });
  });

  const results: PatternResult[] = Object.entries(signalCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([signal, count]) => ({
      signal,
      count,
      percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
      trend: 'stable' as const,
    }));

  return results;
}

/** Aggregate summary statistics */
export async function getSummaryStats(): Promise<SummaryStats> {
  const firestore = getFirestore();
  const snapshot = await firestore.collection(config.collection.incidents).get();

  const incidents = snapshot.docs.map(doc => stripPII({ id: doc.id, ...doc.data() }) as AnonymizedIncident);

  const uniqueAreaCodes = new Set(incidents.map(i => i.areaCode)).size;
  const totalRisk = incidents.reduce((sum, i) => sum + i.riskScore, 0);
  const avgRiskScore = incidents.length > 0 ? Math.round((totalRisk / incidents.length) * 10) / 10 : 0;

  const criticalCount = incidents.filter(i => i.riskLevel === 'CRITICAL').length;
  const highCount = incidents.filter(i => i.riskLevel === 'HIGH').length;
  const mediumCount = incidents.filter(i => i.riskLevel === 'MEDIUM').length;
  const lowCount = incidents.filter(i => i.riskLevel === 'LOW').length;

  const timestamps = incidents.map(i => new Date(i.timestamp).getTime()).filter(t => !isNaN(t));
  const start = timestamps.length > 0 ? new Date(Math.min(...timestamps)) : new Date();
  const end = timestamps.length > 0 ? new Date(Math.max(...timestamps)) : new Date();

  return { totalIncidents: incidents.length, uniqueAreaCodes, avgRiskScore, criticalCount, highCount, mediumCount, lowCount, dateRange: { start, end } };
}

/** Week-over-week trends for the last N weeks */
export async function getWeeklyTrends(weeks = 8): Promise<WeeklyTrend[]> {
  const firestore = getFirestore();
  const since = new Date();
  since.setDate(since.getDate() - weeks * 7);

  const snapshot = await firestore
    .collection(config.collection.incidents)
    .where('timestamp', '>=', since)
    .get();

  const weekMap: Record<string, { count: number; totalRisk: number; criticalCount: number }> = {};

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const ts = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
    const weekStart = getWeekStart(ts);
    const key = weekStart.toISOString().split('T')[0];
    if (!weekMap[key]) weekMap[key] = { count: 0, totalRisk: 0, criticalCount: 0 };
    weekMap[key].count++;
    weekMap[key].totalRisk += data.riskScore || 0;
    if ((data.riskLevel || '') === 'CRITICAL') weekMap[key].criticalCount++;
  });

  return Object.entries(weekMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, stats]) => ({
      week,
      count: stats.count,
      avgRiskScore: stats.count > 0 ? Math.round((stats.totalRisk / stats.count) * 10) / 10 : 0,
      criticalCount: stats.criticalCount,
    }));
}

/** Incidents grouped by US state */
export async function getIncidentsByState(): Promise<StateStats[]> {
  const firestore = getFirestore();
  const snapshot = await firestore.collection(config.collection.incidents).get();

  const stateMap: Record<string, { count: number; totalRisk: number; signals: Record<string, number> }> = {};

  snapshot.docs.forEach(doc => {
    const inc = stripPII({ id: doc.id, ...doc.data() }) as AnonymizedIncident;
    const state = inc.state || areaCodeToState(inc.areaCode) || 'UNKNOWN';
    if (!stateMap[state]) stateMap[state] = { count: 0, totalRisk: 0, signals: {} };
    stateMap[state].count++;
    stateMap[state].totalRisk += inc.riskScore;
    inc.signals.forEach(s => {
      stateMap[state].signals[s] = (stateMap[state].signals[s] || 0) + 1;
    });
  });

  return Object.entries(stateMap)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([state, stats]) => ({
      state: getStateName(state),
      stateCode: state,
      incidentCount: stats.count,
      avgRiskScore: stats.count > 0 ? Math.round((stats.totalRisk / stats.count) * 10) / 10 : 0,
      topSignals: Object.entries(stats.signals).sort(([, a], [, b]) => b - a).slice(0, 3).map(([s]) => s),
    }));
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getStateName(code: string): string {
  const names: Record<string, string> = {
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
    CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
    FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
    IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
    ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
    MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
    NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
    NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon',
    PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
    TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia',
    WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  };
  return names[code] || code;
}
