import type { NextFunction, Request, Response } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const jwks = createRemoteJWKSet(new URL(env.jwtJwksUri));

export async function jwtValidationMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    const token = authorization.replace('Bearer ', '');

    if (env.skipJwtValidation) {
      req.user = { sub: 'mock-user', scope: 'consents:create consents:read consents:revoke' };
      return next();
    }

    const { payload } = await jwtVerify(token, jwks, {
      issuer: env.jwtIssuer,
      audience: env.jwtAudience,
    });

    req.user = payload;
    return next();
  } catch (error) {
    logger.warn('JWT validation failed', { error });
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

export function requireScopes(scopes: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const tokenScopes = (req.user?.scope as string | undefined)?.split(' ') ?? [];
    const missing = scopes.filter((scope) => !tokenScopes.includes(scope));
    if (missing.length > 0) {
      return res.status(403).json({ message: 'Insufficient scope', missing });
    }
    return next();
  };
}
