import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { JWTPayload } from '../types/index.js';

// Per-agency in-memory rate limiter (requests per hour)
const agencyRequestCounts = new Map<string, { count: number; resetAt: number }>();

export function validateLEToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header. Expected: Bearer <token>' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, config.jwt.secret) as JWTPayload;

    if (!payload.agency || !payload.agencyId) {
      res.status(401).json({ error: 'Invalid token: missing agency claims' });
      return;
    }

    // Per-agency rate limiting
    const now = Date.now();
    const hourMs = 60 * 60 * 1000;
    const entry = agencyRequestCounts.get(payload.agencyId) || { count: 0, resetAt: now + hourMs };

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + hourMs;
    }
    entry.count++;
    agencyRequestCounts.set(payload.agencyId, entry);

    if (entry.count > config.rateLimit.maxPerAgency) {
      res.status(429).json({
        error: 'Agency rate limit exceeded',
        resetAt: new Date(entry.resetAt).toISOString(),
      });
      return;
    }

    // Attach payload to request
    (req as Request & { agency: JWTPayload }).agency = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      res.status(500).json({ error: 'Authentication error' });
    }
  }
}

/** Middleware that requires super_admin role */
export function requireSuperAdmin(req: Request, res: Response, next: NextFunction): void {
  const agencyReq = req as Request & { agency?: JWTPayload };
  if (!agencyReq.agency || agencyReq.agency.role !== 'super_admin') {
    res.status(403).json({ error: 'Forbidden: super_admin role required' });
    return;
  }
  next();
}

/** Generate a JWT for a law enforcement agency */
export function generateAgencyToken(agencyId: string, agency: string, role: 'agency' | 'super_admin' = 'agency'): string {
  const payload: JWTPayload = { agencyId, agency, role };
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn as string });
}
