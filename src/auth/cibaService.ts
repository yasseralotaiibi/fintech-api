import { randomUUID } from 'crypto';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { redisClient } from '../config/redis.js';
import { signResponsePlaceholder } from '../utils/jwsPlaceholder.js';

export type CibaAuthStatus = 'PENDING' | 'APPROVED' | 'DENIED' | 'EXPIRED';

export type CibaAuthRequest = {
  authReqId: string;
  clientId: string;
  loginHint: string;
  scope: string[];
  status: CibaAuthStatus;
  expiresAt: number;
  subject?: string;
};

const REDIS_PREFIX = 'ciba:auth:';

export async function createAuthRequest(params: {
  clientId: string;
  loginHint: string;
  scope: string[];
}): Promise<{ authReqId: string; expiresIn: number; interval: number }> {
  const authReqId = randomUUID();
  const expiresIn = env.cibaExpirationSeconds;
  const record: CibaAuthRequest = {
    authReqId,
    clientId: params.clientId,
    loginHint: params.loginHint,
    scope: params.scope,
    status: 'PENDING',
    expiresAt: Date.now() + expiresIn * 1000,
  };

  await redisClient.set(`${REDIS_PREFIX}${authReqId}`, JSON.stringify(record), 'EX', expiresIn);
  logger.info('CIBA auth request created', { authReqId, clientId: params.clientId });

  return {
    authReqId,
    expiresIn,
    interval: env.cibaPollInterval,
  };
}

export async function getAuthRequest(authReqId: string): Promise<CibaAuthRequest | null> {
  const raw = await redisClient.get(`${REDIS_PREFIX}${authReqId}`);
  if (!raw) {
    return null;
  }
  return JSON.parse(raw) as CibaAuthRequest;
}

export async function updateAuthRequest(authReqId: string, updates: Partial<CibaAuthRequest>) {
  const existing = await getAuthRequest(authReqId);
  if (!existing) {
    return null;
  }
  const updated: CibaAuthRequest = { ...existing, ...updates };
  const ttl = Math.max(1, Math.floor((updated.expiresAt - Date.now()) / 1000));
  await redisClient.set(`${REDIS_PREFIX}${authReqId}`, JSON.stringify(updated), 'EX', ttl);
  return updated;
}

export async function approveAuthRequest(authReqId: string, subject: string) {
  return updateAuthRequest(authReqId, { status: 'APPROVED', subject });
}

export async function denyAuthRequest(authReqId: string) {
  return updateAuthRequest(authReqId, { status: 'DENIED' });
}

export async function generateTokens(authReqId: string) {
  const request = await getAuthRequest(authReqId);
  if (!request) {
    return null;
  }

  if (request.expiresAt <= Date.now()) {
    await updateAuthRequest(authReqId, { status: 'EXPIRED' });
    return { status: 'EXPIRED' as CibaAuthStatus };
  }

  if (request.status !== 'APPROVED') {
    return { status: request.status };
  }

  const tokens = signResponsePlaceholder({
    access_token: `mock-access-${authReqId}`,
    id_token: `mock-id-${request.subject ?? 'user'}`,
    token_type: 'Bearer',
    expires_in: 3600,
    scope: request.scope.join(' '),
  });

  return { status: 'APPROVED' as CibaAuthStatus, tokens };
}
