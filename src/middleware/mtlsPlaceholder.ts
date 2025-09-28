import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const mtlsEnforcementPlaceholder = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.socket.authorized) {
    logger.warn('mTLS placeholder triggered. Integrate certificate validation with gateway.');
  }

  next();
};
