import { Router, Request, Response } from 'express';
import { validateLEToken } from '../middleware/auth.js';
import { getSummaryStats, getWeeklyTrends, getIncidentsByState } from '../services/firestoreService.js';

const router = Router();
router.use(validateLEToken);

/** GET /stats/summary — overall aggregate statistics */
router.get('/summary', async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await getSummaryStats();
    res.json({
      ...stats,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('GET /stats/summary error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/** GET /stats/weekly — week-over-week trend data */
router.get('/weekly', async (req: Request, res: Response): Promise<void> => {
  try {
    const weeks = Math.min(parseInt(req.query.weeks as string || '8', 10), 52);
    const trends = await getWeeklyTrends(weeks);

    // Calculate week-over-week change
    const withChange = trends.map((week, idx) => {
      if (idx === 0) return { ...week, change: 0, changePercent: 0 };
      const prev = trends[idx - 1];
      const change = week.count - prev.count;
      const changePercent = prev.count > 0 ? Math.round((change / prev.count) * 1000) / 10 : 0;
      return { ...week, change, changePercent };
    });

    res.json({
      weeks: withChange.length,
      data: withChange,
    });
  } catch (err) {
    console.error('GET /stats/weekly error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/** GET /stats/by-state — incidents grouped by US state */
router.get('/by-state', async (_req: Request, res: Response): Promise<void> => {
  try {
    const stateStats = await getIncidentsByState();
    res.json({
      totalStates: stateStats.length,
      states: stateStats,
    });
  } catch (err) {
    console.error('GET /stats/by-state error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
