import cors from 'cors';

const ALLOWED_ORIGINS = [
  process.env.ALLOWED_ORIGINS || '',
  'https://portal.scamshieldle.com',
  'https://family.scamshieldle.com',
  'https://scamshieldle.com',
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
