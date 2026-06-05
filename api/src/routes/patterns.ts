import { Router, Request, Response } from 'express';
import { validateLEToken } from '../middleware/auth.js';
import { getSignalPatterns, getAnonymizedIncidents } from '../services/firestoreService.js';
import { AnonymizedIncident } from '../types/index.js';

const router = Router();
router.use(validateLEToken);

/** GET /patterns/trending — most common scam signals in last 7/30 days */
router.get('/trending', async (req: Request, res: Response): Promise<void> => {
  try {
    const days = parseInt(req.query.days as string || '30', 10);
    if (![7, 14, 30, 90].includes(days)) {
      res.status(400).json({ error: 'days must be one of: 7, 14, 30, 90' });
      return;
    }

    const [current, previous] = await Promise.all([
      getSignalPatterns(days),
      getSignalPatterns(days * 2),
    ]);

    const previousMap = new Map(previous.map(p => [p.signal, p.count]));

    const withTrend = current.map(pattern => {
      const prevCount = previousMap.get(pattern.signal) || 0;
      const prevPeriodCount = Math.max(0, prevCount - pattern.count);
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (pattern.count > prevPeriodCount * 1.1) trend = 'up';
      else if (pattern.count < prevPeriodCount * 0.9) trend = 'down';
      return { ...pattern, trend, previousCount: prevPeriodCount };
    });

    res.json({
      period: `last ${days} days`,
      totalSignals: withTrend.reduce((s, p) => s + p.count, 0),
      trending: withTrend.slice(0, 20),
    });
  } catch (err) {
    console.error('GET /patterns/trending error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/** GET /patterns/scripts — clusters of similar transcript excerpts */
router.get('/scripts', async (req: Request, res: Response): Promise<void> => {
  try {
    const { incidents } = await getAnonymizedIncidents({ limit: 2000, offset: 0 }, {});

    // Simple keyword clustering on transcript excerpts
    const keywordClusters: Record<string, { count: number; examples: string[]; signals: string[] }> = {};

    const scriptKeywords = [
      'social security', 'irs', 'warrant', 'arrest', 'gift card', 'wire transfer',
      'grandchild', 'accident', 'lottery', 'prize', 'microsoft', 'apple', 'amazon',
      'bank account', 'suspended', 'verify', 'confirm your', 'press 1', 'call back',
    ];

    incidents.forEach(inc => {
      const excerpt = (inc.transcriptExcerpt || '').toLowerCase();
      scriptKeywords.forEach(keyword => {
        if (excerpt.includes(keyword)) {
          if (!keywordClusters[keyword]) {
            keywordClusters[keyword] = { count: 0, examples: [], signals: [] };
          }
          keywordClusters[keyword].count++;
          if (keywordClusters[keyword].examples.length < 3) {
            keywordClusters[keyword].examples.push(inc.transcriptExcerpt);
          }
          inc.signals.forEach(s => {
            if (!keywordClusters[keyword].signals.includes(s)) {
              keywordClusters[keyword].signals.push(s);
            }
          });
        }
      });
    });

    const clusters = Object.entries(keywordClusters)
      .sort(([, a], [, b]) => b.count - a.count)
      .map(([keyword, data]) => ({ keyword, ...data }));

    res.json({
      clustersFound: clusters.length,
      incidentsAnalyzed: incidents.length,
      clusters,
    });
  } catch (err) {
    console.error('GET /patterns/scripts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/** GET /patterns/area-codes — top area codes by scam volume */
router.get('/area-codes', async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string || '25', 10), 100);
    const { incidents } = await getAnonymizedIncidents({ limit: 10000, offset: 0 }, {});

    const areaCodeMap: Record<string, { count: number; avgRiskScore: number; totalRisk: number; state: string }> = {};

    incidents.forEach(inc => {
      const ac = inc.areaCode || 'UNKNOWN';
      if (!areaCodeMap[ac]) areaCodeMap[ac] = { count: 0, avgRiskScore: 0, totalRisk: 0, state: inc.state || '' };
      areaCodeMap[ac].count++;
      areaCodeMap[ac].totalRisk += inc.riskScore;
    });

    const results = Object.entries(areaCodeMap)
      .map(([areaCode, stats]) => ({
        areaCode,
        state: stats.state,
        incidentCount: stats.count,
        avgRiskScore: Math.round((stats.totalRisk / stats.count) * 10) / 10,
      }))
      .sort((a, b) => b.incidentCount - a.incidentCount)
      .slice(0, limit);

    res.json({ topAreaCodes: results });
  } catch (err) {
    console.error('GET /patterns/area-codes error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/** GET /patterns/peak-hours — when scam calls most frequently occur */
router.get('/peak-hours', async (req: Request, res: Response): Promise<void> => {
  try {
    const { incidents } = await getAnonymizedIncidents({ limit: 10000, offset: 0 }, {});

    const hourCounts = new Array(24).fill(0);
    const hourRiskTotals = new Array(24).fill(0);

    incidents.forEach((inc: AnonymizedIncident) => {
      const hour = new Date(inc.timestamp).getHours();
      hourCounts[hour]++;
      hourRiskTotals[hour] += inc.riskScore;
    });

    const total = incidents.length || 1;
    const peakHours = hourCounts.map((count, hour) => ({
      hour,
      label: `${hour.toString().padStart(2, '0')}:00`,
      incidentCount: count,
      percentage: Math.round((count / total) * 1000) / 10,
      avgRiskScore: count > 0 ? Math.round((hourRiskTotals[hour] / count) * 10) / 10 : 0,
    }));

    const peakHour = peakHours.reduce((max, h) => h.incidentCount > max.incidentCount ? h : max, peakHours[0]);

    res.json({
      totalIncidentsAnalyzed: incidents.length,
      peakHour: peakHour.label,
      distribution: peakHours,
    });
  } catch (err) {
    console.error('GET /patterns/peak-hours error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
