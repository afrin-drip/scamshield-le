const REQUIRED = ['JWT_SECRET', 'FIRESTORE_PROJECT_ID', 'PORT'] as const;
const WARN_ONLY = ['FTC_API_KEY'] as const;

export function validateEnv(): void {
  const missing = REQUIRED.filter(k => !process.env[k]);
  if (missing.length > 0) throw new Error(`Missing required environment variables: ${missing.join(', ')}\nCheck your .env file.`);
  for (const k of WARN_ONLY) {
    if (!process.env[k]) console.warn(`[validateEnv] Warning: ${k} is not set. Some features may be limited.`);
  }
  console.log('[validateEnv] All required environment variables present.');
}