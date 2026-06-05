import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validateLEToken, requireSuperAdmin, generateAgencyToken } from '../middleware/auth.js';
import { getFirestore } from '../services/firestoreService.js';
import { config } from '../config/index.js';
import { LEAgency } from '../types/index.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(3).max(100),
  agencyCode: z.string().min(2).max(20).regex(/^[a-z0-9_-]+$/i),
  jurisdiction: z.string().min(2).max(100),
  contactEmail: z.string().email(),
  adminSecret: z.string().optional(),
});

/** POST /agencies/register — register a new LE agency */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid request body', details: parsed.error.flatten() });
      return;
    }

    const { name, agencyCode, jurisdiction, contactEmail, adminSecret } = parsed.data;

    // Require admin secret for self-registration
    if (adminSecret !== process.env.AGENCY_REGISTRATION_SECRET) {
      res.status(403).json({ error: 'Invalid registration secret. Contact ScamShield LE team.' });
      return;
    }

    const firestore = getFirestore();
    const agencyRef = firestore.collection(config.collection.agencies);

    // Check for duplicate agencyCode
    const existing = await agencyRef.where('agencyCode', '==', agencyCode.toLowerCase()).get();
    if (!existing.empty) {
      res.status(409).json({ error: `Agency code '${agencyCode}' is already registered` });
      return;
    }

    const agency: Omit<LEAgency, 'id'> = {
      name,
      agencyCode: agencyCode.toLowerCase(),
      jurisdiction,
      contactEmail,
      createdAt: new Date(),
      active: true,
      role: 'agency',
    };

    const docRef = await agencyRef.add(agency);

    const token = generateAgencyToken(docRef.id, agencyCode.toLowerCase(), 'agency');

    res.status(201).json({
      message: 'Agency registered successfully',
      agencyId: docRef.id,
      agencyCode: agencyCode.toLowerCase(),
      token,
      expiresIn: config.jwt.expiresIn,
      note: 'Store this token securely. Use it as: Authorization: Bearer <token>',
    });
  } catch (err) {
    console.error('POST /agencies/register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/** GET /agencies/list — list all registered agencies (super_admin only) */
router.get('/list', validateLEToken, requireSuperAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const firestore = getFirestore();
    const snapshot = await firestore.collection(config.collection.agencies).get();

    const agencies: (LEAgency & { id: string })[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<LEAgency, 'id'>),
    }));

    res.json({
      total: agencies.length,
      agencies: agencies.map(a => ({
        id: a.id,
        name: a.name,
        agencyCode: a.agencyCode,
        jurisdiction: a.jurisdiction,
        contactEmail: a.contactEmail,
        active: a.active,
        role: a.role,
        createdAt: a.createdAt,
      })),
    });
  } catch (err) {
    console.error('GET /agencies/list error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
