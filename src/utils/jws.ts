import crypto from 'crypto';
import { logger } from '../config/logger';

export interface JwsPlaceholderResult {
  protectedHeader: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export const signPayloadPlaceholder = (payload: Record<string, unknown>): JwsPlaceholderResult => {
  const signature = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  const protectedHeader = {
    alg: 'PS256',
    kid: 'placeholder-kid',
    crit: ['b64'],
  };

  logger.debug('JWS placeholder invoked');

  return {
    protectedHeader,
    payload,
    signature,
  };
};
