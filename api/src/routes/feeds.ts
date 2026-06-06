import { Router, Request, Response } from 'express';
import { cisaFtcFeedService } from '../services/cisaFtcFeedService';
import { feedRecordRepository } from '../repositories/feedRecordRepository';
import { syncState } from '../jobs/feedScheduler';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/status', authenticate, async (_req: Request, res: Response) => {
  try {
    const [stats, feedStatus] = await Promise.all([
      feedRecordRepository.getStats(),
      feedRecordRepository.getFeedStatus(),
    ]);
    res.set('Cache-Control', 'no-cache');
    res.json({
      ftc: { lastSync: feedStatus.ftc?.lastSync ?? syncState.ftc.lastSync, recordCount: stats.ftc ?? 0, lastError: syncState.ftc.lastError },
      cisa: { lastSync: feedStatus.cisa?.lastSync ?? syncState.cisa.lastSync, recordCount: stats.cisa ?? 0, lastError: syncState.cisa.lastError },
      overall: { healthy: !syncState.ftc.lastError && !syncState.cisa.lastError, totalRecords: (stats.ftc ?? 0) + (stats.cisa ?? 0) },
    });
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
});

router.post('/sync', authenticate, async (_req: Request, res: Response) => {
  try {
    const { ftc, cisa, errors } = await cisaFtcFeedService.ingestAll();
    const [ftcN, cisaN] = await Promise.all([
      feedRecordRepository.batchUpsert(ftc),
      feedRecordRepository.batchUpsert(cisa),
    ]);
    res.json({ success: errors.length === 0, ftc: { ingested: ftc.length, upserted: ftcN }, cisa: { ingested: cisa.length, upserted: cisaN }, errors });
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
});

export default router;