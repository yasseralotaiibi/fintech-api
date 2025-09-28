import type { Request, Response } from 'express';

import {
  approveAuthRequest,
  createAuthRequest,
  denyAuthRequest,
  generateTokens,
} from './cibaService.js';

export async function handleCibaAuthRequest(req: Request, res: Response) {
  const { client_id: clientId, scope, login_hint: loginHint } = req.body ?? {};
  if (!clientId || !loginHint) {
    return res.status(400).json({ message: 'client_id and login_hint are required' });
  }

  const response = await createAuthRequest({
    clientId,
    loginHint,
    scope: typeof scope === 'string' ? scope.split(' ') : Array.isArray(scope) ? scope : [],
  });

  return res.status(202).json({
    auth_req_id: response.authReqId,
    expires_in: response.expiresIn,
    interval: response.interval,
  });
}

export async function handleCibaTokenRequest(req: Request, res: Response) {
  const { auth_req_id: authReqId } = req.body ?? {};
  if (!authReqId) {
    return res.status(400).json({ message: 'auth_req_id is required' });
  }

  const result = await generateTokens(authReqId);
  if (!result) {
    return res.status(404).json({ message: 'auth_req_id not found' });
  }

  if (result.status !== 'APPROVED') {
    return res.status(400).json({
      error: 'authorization_pending',
      status: result.status,
    });
  }

  return res.json(result.tokens);
}

export async function mockApprove(req: Request, res: Response) {
  const { auth_req_id: authReqId, subject = 'nafath-user' } = req.body ?? {};
  if (!authReqId) {
    return res.status(400).json({ message: 'auth_req_id is required' });
  }

  const updated = await approveAuthRequest(authReqId, subject);
  if (!updated) {
    return res.status(404).json({ message: 'auth_req_id not found' });
  }

  return res.json({ message: 'Approval recorded', auth_req_id: authReqId });
}

export async function mockDeny(req: Request, res: Response) {
  const { auth_req_id: authReqId } = req.body ?? {};
  if (!authReqId) {
    return res.status(400).json({ message: 'auth_req_id is required' });
  }

  const updated = await denyAuthRequest(authReqId);
  if (!updated) {
    return res.status(404).json({ message: 'auth_req_id not found' });
  }

  return res.json({ message: 'Denial recorded', auth_req_id: authReqId });
}
