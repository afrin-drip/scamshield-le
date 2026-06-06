const REQUIRED: string[] = ['JWT_SECRET', 'FIRESTORE_PROJECT_ID', 'PORT'];
const WARN_ONLY: string[] = ['FTC_API_KEY'];

export function validateEnv(): void {
  const missing = REQUIRED.filter(k => !process.env[k]?.trim());
  if (missing.length) {
    throw new Error(
      `\n[validateEnv] Missing required environment variables:\n` +
      missing.map(k => `  - ${k}`).join('\n') +
      `\n\nCheck your .env file and try again.\n`
    );
  }
  WARN_ONLY.filter(k => !process.env[k]?.trim())
    .forEach(k => console.warn(`[validateEnv] Warning: ${k} is not set — some features will be limited.`));
  console.log('[validateEnv] All required environment variables present.');
}