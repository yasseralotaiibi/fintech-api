import type { NextFunction, Request, Response } from 'express';
import type { TLSSocket } from 'node:tls';

import { logger } from '../config/logger.js';

export function mtlsEnforcementPlaceholder(req: Request, res: Response, next: NextFunction) {
  // Placeholder for future mTLS enforcement logic. In production, validate client certificates here.
  const tlsSocket = req.socket as TLSSocket;
  const peerCertificate =
    typeof tlsSocket.getPeerCertificate === 'function' ? tlsSocket.getPeerCertificate() : undefined;

  logger.debug('mTLS placeholder executed', {
    clientCertSubject: peerCertificate?.subject ?? 'not-provided',
  });
  return next();
}
