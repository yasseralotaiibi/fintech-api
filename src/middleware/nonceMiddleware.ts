import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

import { redisClient } from '../config/redis.js';

const NONCE_TTL_SECONDS = 5 * 60;

async function markConsumed(key: string) {
  await redisClient.set(key, 'consumed', 'EX', NONCE_TTL_SECONDS);
}

export async function nonceIssueMiddleware(req: Request, res: Response, next: NextFunction) {
  const nonce = randomUUID();
  await redisClient.set(`nonce:${nonce}`, 'issued', 'EX', NONCE_TTL_SECONDS);
  req.nonce = nonce;
  res.setHeader('x-openbanking-nonce', nonce);
  return next();
}

export async function nonceValidationMiddleware(req: Request, res: Response, next: NextFunction) {
  const nonce = (req.headers['x-openbanking-nonce'] as string | undefined) ?? req.nonce;
  if (!nonce) {
    return res.status(400).json({ message: 'Nonce required' });
  }

  const key = `nonce:${nonce}`;
  const status = await redisClient.get(key);

  if (status === 'consumed') {
    return res.status(409).json({ message: 'Nonce already used' });
  }

  if (status === 'issued') {
    await markConsumed(key);
  } else if (!status) {
    const result = await redisClient.set(key, 'consumed', 'EX', NONCE_TTL_SECONDS, 'NX');
    if (result === null) {
      return res.status(409).json({ message: 'Nonce replay detected' });
    }
  }

  req.nonce = nonce;
  return next();
}
