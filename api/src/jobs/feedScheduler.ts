import cron from 'node-cron';
import { cisaFtcFeedService } from '../services/cisaFtcFeedService';
import { feedRecordRepository } from '../repositories/feedRecordRepository';

interface SyncState { lastSync: Date | null; recordCount: number; lastError: string | null; }
export const syncState: { ftc: SyncState; cisa: SyncState } = {
  ftc: { lastSync: null, recordCount: 0, lastError: null },
  cisa: { lastSync: null, recordCount: 0, lastError: null },
};

async function runFtcSync() {
  const start = Date.now();
  console.log('[FeedScheduler][FTC] Starting sync');
  try {
    const records = await cisaFtcFeedService.ingestFtcFeed();
    await feedRecordRepository.batchUpsert(records);
    syncState.ftc = { lastSync: new Date(), recordCount: records.length, lastError: null };
    console.log('[FeedScheduler][FTC] Done —', records.length, 'records in', Date.now()-start, 'ms');
  } catch (err) {
    syncState.ftc.lastError = (err as Error).message;
    console.error('[FeedScheduler][FTC] Error:', (err as Error).message);
  }
}

async function runCisaSync() {
  const start = Date.now();
  console.log('[FeedScheduler][CISA] Starting sync');
  try {
    const records = await cisaFtcFeedService.ingestCisaFeed();
    await feedRecordRepository.batchUpsert(records);
    syncState.cisa = { lastSync: new Date(), recordCount: records.length, lastError: null };
    console.log('[FeedScheduler][CISA] Done —', records.length, 'records in', Date.now()-start, 'ms');
  } catch (err) {
    syncState.cisa.lastError = (err as Error).message;
    console.error('[FeedScheduler][CISA] Error:', (err as Error).message);
  }
}

export function startFeedScheduler() {
  cron.schedule('0 13 * * 1-5', () => runFtcSync().catch(console.error), { timezone: 'UTC' });
  cron.schedule('0 */6 * * *', () => runCisaSync().catch(console.error), { timezone: 'UTC' });
  console.log('[FeedScheduler] Started — FTC: weekdays 13:00 UTC, CISA: every 6h');
}