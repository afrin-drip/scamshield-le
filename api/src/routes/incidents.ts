import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validateLEToken } from '../middleware/auth.js';
import { getAnonymizedIncidents, getIncidentsByAreaCode } from '../services/firestoreService.js';
import { getSignalPatterns } from '../services/firestoreService.js';
import { AnonymizedIncident } from '../types/index.js';

const router = Router();

// All incident routes require LE token
router.use(validateLEToken);

const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(1000).default(100),
  offset: z.coerce.number().int().min(0).default(0),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minRiskScore: z.coerce.number().min(0).max(100).optional(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  areaCode: z.string().regex(/^\d{3}$/).optional(),
  signal: z.string().optional(),
});

/** GET /incidents — paginated list of anonymized incidents */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid query parameters', details: parsed.error.flatten() });
      return;
    }

    const { limit, offset, startDate, endDate, minRiskScore, riskLevel, areaCode, signal } = parsed.data;

    const filters = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      minRiskScore,
      riskLevel,
      areaCode,
      signal,
    };

    const { incidents, total } = await getAnonymizedIncidents({ limit, offset }, filters);

    res.json({
      data: incidents,
      pagination: { limit, offset, total, hasMore: offset + limit < total },
    });
  } catch (err) {
    console.error('GET /incidents error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/** GET /incidents/by-area-code/:areaCode */
router.get('/by-area-code/:areaCode', async (req: Request, res: Response): Promise<void> => {
  try {
    const { areaCode } = req.params;
    if (!/^\d{3}$/.test(areaCode)) {
      res.status(400).json({ error: 'Area code must be a 3-digit number' });
      return;
    }

    const incidents = await getIncidentsByAreaCode(areaCode);

    // Group by day
    const byDay: Record<string, AnonymizedIncident[]> = {};
    incidents.forEach(inc => {
      const day = new Date(inc.timestamp).toISOString().split('T')[0];
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(inc);
    });

    res.json({
      areaCode,
      totalIncidents: incidents.length,
      avgRiskScore: incidents.length > 0
        ? Math.round(incidents.reduce((s, i) => s + i.riskScore, 0) / incidents.length * 10) / 10
        : 0,
      byDay,
      incidents,
    });
  } catch (err) {
    console.error('GET /incidents/by-area-code error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/** GET /incidents/by-signal — incidents grouped by scam signal type */
router.get('/by-signal', async (req: Request, res: Response): Promise<void> => {
  try {
    const days = parseInt(req.query.days as string || '30', 10);
    const patterns = await getSignalPatterns(Math.min(days, 365));

    res.json({
      period: `last ${days} days`,
      signals: patterns,
    });
  } catch (err) {
    console.error('GET /incidents/by-signal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/** GET /incidents/export — CSV export */
router.get('/export', async (req: Request, res: Response): Promise<void> => {
  try {
    const { incidents } = await getAnonymizedIncidents(
      { limit: 10000, offset: 0 },
      {}
    );

    const headers = ['id', 'timestamp', 'riskScore', 'riskLevel', 'areaCode', 'state', 'signals', 'transcriptExcerpt'];
    const csvRows = [
      headers.join(','),
      ...incidents.map(inc =>
        [
          inc.id,
          new Date(inc.timestamp).toISOString(),
          inc.riskScore,
          inc.riskLevel,
          inc.areaCode,
          inc.state || '',
          `"${inc.signals.join('; ')}"`,
          `"${(inc.transcriptExcerpt || '').replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ];

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="scamshield_incidents_${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvRows.join('\n'));
  } catch (err) {
    console.error('GET /incidents/export error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
