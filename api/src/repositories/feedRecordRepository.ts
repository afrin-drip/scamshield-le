import { Firestore, FieldValue } from '@google-cloud/firestore';
import { FeedRecord } from '../services/cisaFtcFeedService';

const COLLECTION = 'feedRecords';
const META = 'feedMeta';
const BATCH_SIZE = 500;

export class FeedRecordRepository {
  private db = new Firestore({ projectId: process.env.FIRESTORE_PROJECT_ID });

  async batchUpsert(records: FeedRecord[]): Promise<number> {
    if (!records.length) return 0;
    let written = 0;
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const chunk = records.slice(i, i+BATCH_SIZE);
      const batch = this.db.batch();
      for (const r of chunk) batch.set(this.db.collection(COLLECTION).doc(r.id), { ...r, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      await batch.commit();
      written += chunk.length;
      for (const src of [...new Set(chunk.map(r=>r.source))]) {
        await this.db.collection(META).doc(src).set({ lastSync: FieldValue.serverTimestamp(), lastBatchSize: chunk.filter(r=>r.source===src).length }, { merge: true });
      }
    }
    return written;
  }

  async getStats(): Promise<Record<string,number>> {
    const counts: Record<string,number> = {};
    await Promise.all(['ftc','cisa'].map(async src => {
      const snap = await this.db.collection(COLLECTION).where('source','==',src).count().get();
      counts[src] = snap.data().count;
    }));
    return counts;
  }

  async getFeedStatus(): Promise<Record<string,{lastSync:Date|null}>> {
    const status: Record<string,{lastSync:Date|null}> = {};
    await Promise.all(['ftc','cisa'].map(async src => {
      const doc = await this.db.collection(META).doc(src).get();
      status[src] = { lastSync: doc.exists ? doc.data()!.lastSync?.toDate()??null : null };
    }));
    return status;
  }
}

export const feedRecordRepository = new FeedRecordRepository();