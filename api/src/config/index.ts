import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    databaseURL: process.env.FIREBASE_DATABASE_URL || '',
  },

  jwt: {
    secret: process.env.LE_API_SECRET || 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'https://ftc.gov,https://fbi.gov').split(',').map(o => o.trim()),
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    maxPerAgency: parseInt(process.env.RATE_LIMIT_AGENCY || '500', 10),
  },

  collection: {
    incidents: process.env.INCIDENTS_COLLECTION || 'callAnalysis',
    agencies: process.env.AGENCIES_COLLECTION || 'leAgencies',
  },
};

export function validateConfig(): void {
  const required = ['FIREBASE_PROJECT_ID', 'LE_API_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
