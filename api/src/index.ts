import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import admin from 'firebase-admin';
import { config, validateConfig } from './config/index.js';
import incidentsRouter from './routes/incidents.js';
import patternsRouter from './routes/patterns.js';
import statsRouter from './routes/stats.js';
import agenciesRouter from './routes/agencies.js';

// Validate environment on startup
validateConfig();

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebase.projectId,
      privateKey: config.firebase.privateKey,
      clientEmail: config.firebase.clientEmail,
    }),
    databaseURL: config.firebase.databaseURL,
  });
}

const app = express();

// ── Security headers ─────────────────────────────────────────────────────────
app.use(helmet());
app.disable('x-powered-by');

// ── CORS — whitelist law enforcement domains ──────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, Postman)
    if (!origin) return callback(null, true);
    if (config.cors.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: origin '${origin}' is not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH'],
  allowedHeaders: ['Authorization', 'Content-Type', 'X-Agency-ID'],
  credentials: true,
}));

// ── Global rate limiter: 100 req / 15 min per IP ──────────────────────────────
const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});
app.use(globalLimiter);

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// ── Health check (no auth required) ──────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ScamShield LE API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ── API v1 routes ─────────────────────────────────────────────────────────────
app.use('/api/v1/incidents', incidentsRouter);
app.use('/api/v1/patterns', patternsRouter);
app.use('/api/v1/stats', statsRouter);
app.use('/api/v1/agencies', agenciesRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`ScamShield LE API running on port ${config.port} [${config.nodeEnv}]`);
  console.log(`Health: http://localhost:${config.port}/health`);
});

export default app;
