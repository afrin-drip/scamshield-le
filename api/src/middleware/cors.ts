import cors from 'cors';

const ALLOWED_ORIGINS = [
  process.env.ALLOWED_ORIGINS || '',
  'https://scamshield-le-portal.vercel.app',
  'https://scamshield-family-dashboard.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean).flatMap(o => o.split(','));

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed`));
    }
  },
  credentials: true,
});
