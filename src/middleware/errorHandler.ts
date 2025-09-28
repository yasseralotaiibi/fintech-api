import type { NextFunction, Request, Response } from 'express';

import { logger } from '../config/logger.js';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  logger.error('Unhandled error', { error: err, path: req.path });
  res
    .status(500)
    .json({ message: 'Internal server error', traceId: req.nonce ?? req.headers['x-request-id'] });
}
