import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';
import { env } from '../config/env';

const buildNonceKey = (nonce: string) => `nonce:${nonce}`;

export const nonceMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const nonce = (req.headers['x-jti'] as string) ?? (req.headers['x-nonce'] as string);

  if (!nonce) {
    res
      .status(400)
      .json({ message: 'Nonce header (x-jti or x-nonce) is required for FAPI compliance' });
    return;
  }

  try {
    const nonceKey = buildNonceKey(nonce);
    const exists = await redis.exists(nonceKey);

    if (exists) {
      res.status(409).json({ message: 'Replay detected: nonce already used' });
      return;
    }

    await redis.set(nonceKey, '1', 'EX', env.nonceTtlSeconds);
    next();
  } catch (error) {
    res
      .status(503)
      .json({ message: 'Nonce service unavailable', details: (error as Error).message });
  }
};
