import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  cibaPollInterval: Number(process.env.CIBA_POLL_INTERVAL ?? 5),
  cibaExpirationSeconds: Number(process.env.CIBA_EXPIRATION_SECONDS ?? 120),
  jwtIssuer: process.env.JWT_ISSUER ?? 'riyadah-openbanking',
  jwtAudience: process.env.JWT_AUDIENCE ?? 'sandbox-clients',
  jwtJwksUri: process.env.JWT_JWKS_URI ?? 'https://example.com/.well-known/jwks.json',
  skipJwtValidation: process.env.SKIP_JWT_VALIDATION === 'true',
};

export const requiredEnvVars = ['DATABASE_URL'];

export function validateEnv(): void {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
