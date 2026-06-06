import { Router, Request, Response } from 'express';
import { Firestore } from '@google-cloud/firestore';

const router = Router();
let _schedulerRunning = false;

export function markSchedulerRunning(): void { _schedulerRunning = true; }
export function markSchedulerStopped(): void { _schedulerRunning = false; }

const db = new Firestore({ projectId: process.env.FIRESTORE_PROJECT_ID });

router.get('/', async (_req: Request, res: Response) => {
  let firestoreStatus: 'ok' | 'error' = 'ok';
  try {
    await Promise.race([
      db.collection('__health__').limit(1).get(),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000)),
    ]);
  } catch { firestoreStatus = 'error'; }

  const ok = firestoreStatus === 'ok' && _schedulerRunning;
  res.status(ok ? 200 : 503).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    services: {
      firestore: firestoreStatus,
      feedScheduler: _schedulerRunning ? 'ok' : 'stopped',
    },
  });
});

export default router;