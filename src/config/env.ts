import dotenv from 'dotenv';

dotenv.config();

const numberFromEnv = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: numberFromEnv(process.env.PORT, 3000),
  databaseUrl:
    process.env.DATABASE_URL ??
    'postgresql://openbanking:openbanking@localhost:5432/openbanking?schema=public',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  jwtIssuerSigningKey: process.env.JWT_ISSUER_SIGNING_KEY ?? 'insecure-development-secret',
  jwtAudience: process.env.JWT_AUDIENCE ?? 'riyadah-open-banking',
  jwtIssuer: process.env.JWT_ISSUER ?? 'https://sandbox.riyadah.sa',
  nonceTtlSeconds: numberFromEnv(process.env.NONCE_TTL_SECONDS, 300),
  consentReceiptWebhook: process.env.CONSENT_RECEIPT_WEBHOOK ?? '',
  enableRequestLogging: (process.env.ENABLE_REQUEST_LOGGING ?? 'true') === 'true',
};

export const securityPlaceholders = {
  mtls: 'mTLS enforcement placeholder – integrate with API gateway or ingress controller.',
  jws: 'JWS signing placeholder – integrate with approved FAPI-compliant signing service.',
};
