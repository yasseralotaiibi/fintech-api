import { v4 as uuid } from 'uuid';
import { redis } from '../config/redis';
import { logger } from '../config/logger';
import { recordAuditEvent } from '../utils/auditLogger';

export type AuthStatus = 'pending' | 'approved' | 'denied' | 'expired';

export interface CibaAuthRequest {
  authReqId: string;
  clientId: string;
  scope: string[];
  status: AuthStatus;
  expiresAt: number;
  interval: number;
  subject?: string;
  updatedAt: number;
}

const AUTH_TTL_SECONDS = 300;
const INTERVAL_SECONDS = 5;
const buildKey = (authReqId: string) => `ciba:auth:${authReqId}`;

const deserialize = (value: string | null): CibaAuthRequest | undefined => {
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(value) as CibaAuthRequest;
  } catch (error) {
    logger.error({ error }, 'Failed to deserialize CIBA request');
    return undefined;
  }
};

const persist = async (request: CibaAuthRequest) => {
  await redis.set(buildKey(request.authReqId), JSON.stringify(request), 'EX', AUTH_TTL_SECONDS);
};

export const createAuthRequest = async (
  clientId: string,
  scope: string[],
): Promise<CibaAuthRequest> => {
  const authReqId = uuid();
  const request: CibaAuthRequest = {
    authReqId,
    clientId,
    scope,
    status: 'pending',
    expiresAt: Date.now() + AUTH_TTL_SECONDS * 1000,
    interval: INTERVAL_SECONDS,
    updatedAt: Date.now(),
  };

  await persist(request);

  await recordAuditEvent({
    action: 'ciba.auth.requested',
    actor: clientId,
    details: { scope },
  });

  return request;
};

export const getAuthRequest = async (authReqId: string): Promise<CibaAuthRequest | undefined> => {
  const raw = await redis.get(buildKey(authReqId));
  const request = deserialize(raw);

  if (!request) {
    return undefined;
  }

  if (request.expiresAt < Date.now() && request.status === 'pending') {
    request.status = 'expired';
    await persist(request);
  }

  return request;
};

export const approveAuthRequest = async (
  authReqId: string,
  subject: string,
): Promise<CibaAuthRequest | undefined> => {
  const request = await getAuthRequest(authReqId);
  if (!request) {
    return undefined;
  }

  request.status = 'approved';
  request.subject = subject;
  request.updatedAt = Date.now();

  await persist(request);

  await recordAuditEvent({
    action: 'ciba.auth.approved',
    actor: subject,
    details: { authReqId },
  });

  return request;
};

export const denyAuthRequest = async (authReqId: string, subject: string) => {
  const request = await getAuthRequest(authReqId);
  if (!request) {
    return undefined;
  }

  request.status = 'denied';
  request.subject = subject;
  request.updatedAt = Date.now();

  await persist(request);

  await recordAuditEvent({
    action: 'ciba.auth.denied',
    actor: subject,
    details: { authReqId },
  });

  return request;
};

export interface TokenResponse {
  access_token: string;
  id_token: string;
  token_type: 'Bearer';
  expires_in: number;
}

export const generateTokenResponse = (authReqId: string): TokenResponse => ({
  access_token: `access-${authReqId}`,
  id_token: `id-${authReqId}`,
  token_type: 'Bearer',
  expires_in: AUTH_TTL_SECONDS,
});
