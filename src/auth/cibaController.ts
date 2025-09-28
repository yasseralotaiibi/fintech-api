import { Request, Response } from 'express';
import { createAuthRequest, getAuthRequest, generateTokenResponse } from './cibaService';
import nafathConnector from '../connectors/nafathConnector';

const scopeFromBody = (scope: unknown): string[] => {
  if (Array.isArray(scope)) {
    return scope as string[];
  }

  if (typeof scope === 'string') {
    return scope.split(' ');
  }

  return [];
};

export const initiateAuthRequest = async (req: Request, res: Response) => {
  const { client_id: clientId, scope } = req.body ?? {};

  if (!clientId) {
    res.status(400).json({ message: 'client_id is required' });
    return;
  }

  const authRequest = await createAuthRequest(clientId, scopeFromBody(scope));

  res.status(201).json({
    auth_req_id: authRequest.authReqId,
    expires_in: Math.floor((authRequest.expiresAt - Date.now()) / 1000),
    interval: authRequest.interval,
  });
};

export const pollToken = async (req: Request, res: Response) => {
  const { auth_req_id: authReqId } = req.body ?? {};

  if (!authReqId) {
    res.status(400).json({ message: 'auth_req_id is required' });
    return;
  }

  const authRequest = await getAuthRequest(authReqId);

  if (!authRequest) {
    res.status(404).json({ message: 'Authentication request not found' });
    return;
  }

  if (authRequest.status === 'pending') {
    res.status(202).json({
      status: authRequest.status,
      interval: authRequest.interval,
      auth_req_id: authRequest.authReqId,
    });
    return;
  }

  if (authRequest.status === 'denied') {
    res.status(403).json({
      error: 'access_denied',
      error_description: 'The authentication request was denied by the end-user',
    });
    return;
  }

  if (authRequest.status === 'expired') {
    res.status(400).json({
      error: 'expired_token',
      error_description: 'The authentication request expired before approval',
    });
    return;
  }

  res.json(generateTokenResponse(authReqId));
};

export const mockNafathApprove = async (req: Request, res: Response) => {
  const { auth_req_id: authReqId, national_id: nationalId } = req.body ?? {};

  if (!authReqId || !nationalId) {
    res.status(400).json({ message: 'auth_req_id and national_id are required' });
    return;
  }

  const result = await nafathConnector.triggerApproval(authReqId, nationalId);
  if (!result) {
    res.status(404).json({ message: 'Authentication request not found' });
    return;
  }

  res.json({ status: 'approved', auth_req_id: authReqId, national_id: nationalId });
};

export const mockNafathDeny = async (req: Request, res: Response) => {
  const { auth_req_id: authReqId, national_id: nationalId } = req.body ?? {};

  if (!authReqId || !nationalId) {
    res.status(400).json({ message: 'auth_req_id and national_id are required' });
    return;
  }

  const result = await nafathConnector.triggerDenial(authReqId, nationalId);
  if (!result) {
    res.status(404).json({ message: 'Authentication request not found' });
    return;
  }

  res.json({ status: 'denied', auth_req_id: authReqId, national_id: nationalId });
};
