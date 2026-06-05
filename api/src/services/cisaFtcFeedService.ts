import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';

export interface FeedRecord {
  id: string;
  source: 'ftc' | 'cisa';
  phoneNumber?: string;
  areaCode: string;
  signalType: string;
  riskScore: number;
  description: string;
  reportedAt: string;
  rawData: Record<string, unknown>;
}

interface FtcComplaint { phone_number?: string; subject?: string; created_date?: string; is_robo_call?: boolean; [key: string]: unknown; }

const FTC_API = 'https://api.ftc.gov/v0/dnc-complaints';
const CISA_RSS = 'https://www.cisa.gov/uscert/ncas/all.xml';
const PHONE_SCAM_KEYWORDS = ['vishing','phone scam','gov impersonat','irs','social security','medicare','tech support','warrant','arrest','gift card'];

function normalizePhone(p: string): string { return p.replace(/[^0-9]/g, ''); }
function areaCode(phone: string): string { const n = normalizePhone(phone); return n.length >= 10 ? n.slice(n.length === 11 ? 1 : 0, (n.length === 11 ? 1 : 0) + 3) : '000'; }
function riskFromSubject(subject?: string): number {
  if (!subject) return 40;
  const s = subject.toLowerCase();
  if (s.includes('warrant') || s.includes('arrest') || s.includes('social security')) return 90;
  if (s.includes('irs') || s.includes('gift card') || s.includes('medicare')) return 80;
  if (s.includes('tech support') || s.includes('vishing')) return 75;
  return 55;
}

export class CisaFtcFeedService {
  async ingestFtcFeed(): Promise<FeedRecord[]> {
    const key = process.env.FTC_API_KEY;
    let complaints: FtcComplaint[] = [];
    if (key) {
      const res = await fetch(`${FTC_API}?api_key=${key}&limit=500`);
      if (res.ok) { const data = await res.json() as any; complaints = data.result?.records ?? []; }
    }
    if (complaints.length === 0) {
      const date = new Date(); date.setDate(date.getDate()-1);
      const ds = date.toISOString().slice(0,10);
      const csvRes = await fetch(`https://www.ftc.gov/sites/default/files/DNC_Complaint_Numbers_${ds}.csv`).catch(()=>null);
      if (csvRes?.ok) {
        const text = await csvRes.text();
        complaints = text.split('\n').slice(1).filter(Boolean).map(line => { const [phone,date,subject] = line.split(','); return { phone_number: phone?.trim(), created_date: date?.trim(), subject: subject?.trim() }; });
      }
    }
    return complaints.filter(c => c.phone_number).map((c, i) => ({
      id: `ftc-${normalizePhone(c.phone_number!)}-${Date.now()}-${i}`,
      source: 'ftc',
      phoneNumber: normalizePhone(c.phone_number!),
      areaCode: areaCode(c.phone_number!),
      signalType: c.is_robo_call ? 'robocall' : 'scam_call',
      riskScore: riskFromSubject(c.subject as string),
      description: (c.subject as string) ?? 'FTC DNC complaint',
      reportedAt: c.created_date ?? new Date().toISOString(),
      rawData: c as Record<string,unknown>,
    }));
  }

  async ingestCisaFeed(): Promise<FeedRecord[]> {
    const res = await fetch(CISA_RSS);
    if (!res.ok) return [];
    const xml = await res.text();
    const parsed = await parseStringPromise(xml, { explicitArray: false });
    const items: any[] = parsed?.rss?.channel?.item ?? [];
    return items
      .filter(item => PHONE_SCAM_KEYWORDS.some(kw => (item.title+item.description).toLowerCase().includes(kw)))
      .map((item, i) => ({
        id: `cisa-${Buffer.from(item.link??i.toString()).toString('base64').slice(0,16)}`,
        source: 'cisa',
        areaCode: '000',
        signalType: 'gov_impersonation',
        riskScore: 85,
        description: item.title ?? 'CISA advisory',
        reportedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        rawData: item as Record<string,unknown>,
      }));
  }

  async ingestAll(): Promise<{ ftc: FeedRecord[]; cisa: FeedRecord[]; errors: string[] }> {
    const errors: string[] = [];
    const [ftc, cisa] = await Promise.all([
      this.ingestFtcFeed().catch(e => { errors.push('FTC: '+e.message); return []; }),
      this.ingestCisaFeed().catch(e => { errors.push('CISA: '+e.message); return []; }),
    ]);
    return { ftc, cisa, errors };
  }
}

export const cisaFtcFeedService = new CisaFtcFeedService();