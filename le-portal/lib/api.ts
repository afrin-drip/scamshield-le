import { format } from 'date-fns';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('le_token');
};

const apiUrl = () => process.env.NEXT_PUBLIC_LE_API_URL || 'http://localhost:8080';

async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${apiUrl()}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export interface Stats {
  total_incidents_30d: number;
  critical_alerts: number;
  unique_numbers: number;
  states_affected: number;
  daily_trend: { date: string; count: number }[];
  top_signals: { signal: string; count: number }[];
}

export interface Incident {
  id: string;
  phone_number: string;
  area_code: string;
  state: string;
  risk_score: number;
  risk_level: 'CRITICAL' | 'LIKELY_SCAM' | 'SUSPICIOUS' | 'SAFE';
  signal_type: string;
  transcript?: string;
  created_at: string;
  report_count: number;
}

export interface IncidentFilters {
  start_date?: string;
  end_date?: string;
  risk_level?: string;
  signal_type?: string;
  area_code?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

export interface MapDataPoint {
  area_code: string;
  lat: number;
  lng: number;
  state: string;
  city: string;
  incident_count: number;
  risk_level: 'CRITICAL' | 'LIKELY_SCAM' | 'SUSPICIOUS';
  top_signal: string;
  last_seen: string;
}

export interface Pattern {
  signal: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  change_pct: number;
  peak_hour: number;
  area_codes: string[];
}

export interface Agency {
  id: string;
  name: string;
  state: string;
  api_key_preview: string;
  created_at: string;
  last_active: string;
  is_super_admin: boolean;
}

export async function login(agency_id: string, api_key: string): Promise<{ token: string; agency: Agency }> {
  return apiFetch('/api/le/auth/login', {
    method: 'POST',
    body: JSON.stringify({ agency_id, api_key }),
  });
}

export async function getStats(days = 30): Promise<Stats> {
  return apiFetch(`/api/le/stats?days=${days}`);
}

export async function getIncidents(filters: IncidentFilters = {}): Promise<{ incidents: Incident[]; total: number; page: number; pages: number }> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) params.set(k, String(v)); });
  return apiFetch(`/api/le/incidents?${params.toString()}`);
}

export async function getIncidentById(id: string): Promise<Incident> {
  return apiFetch(`/api/le/incidents/${id}`);
}

export async function getMapData(days?: number): Promise<MapDataPoint[]> {
  const q = days ? `?days=${days}` : '';
  return apiFetch(`/api/le/map${q}`);
}

export async function getPatterns(days = 30): Promise<{ patterns: Pattern[]; hourly_heatmap: number[][]; phrase_clusters: { phrase: string; count: number }[] }> {
  return apiFetch(`/api/le/patterns?days=${days}`);
}

export async function getAgencies(): Promise<Agency[]> {
  return apiFetch('/api/le/agencies');
}

export async function registerAgency(data: { name: string; state: string; contact_email: string }): Promise<Agency> {
  return apiFetch('/api/le/agencies', { method: 'POST', body: JSON.stringify(data) });
}

export async function rotateApiKey(agency_id: string): Promise<{ api_key: string }> {
  return apiFetch(`/api/le/agencies/${agency_id}/rotate-key`, { method: 'POST' });
}
