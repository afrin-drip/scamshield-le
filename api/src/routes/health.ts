import { Router, Request, Response } from 'express';
import { Firestore } from '@google-cloud/firestore';

const router = Router();
let schedulerRunning = false;
export function markSchedulerRunning() { schedulerRunning = true; }
export function markSchedulerStopped() { schedulerRunning = false; }

const db = new Firestore({ projectId: process.env.FIRESTORE_PROJECT_ID });

router.get('/', async (_req: Request, res: Response) => {
  let firestoreStatus: 'ok' | 'error' = 'ok';
  try {
    await Promise.race([
      db.collection('__health_probe__').limit(1).get(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
    ]);
  } catch { firestoreStatus = 'error'; }

  const healthy = firestoreStatus === 'ok' && schedulerRunning;
  res.status(healthy ? 200 : 503).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    services: {
      firestore: firestoreStatus,
      feedScheduler: schedulerRunning ? 'ok' : 'stopped',
    },
  });
});

export default router;