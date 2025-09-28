import type { Request, Response } from 'express';

export function demoFlowHandler(_req: Request, res: Response) {
  return res.json({
    message:
      'Mock journey: initiate CIBA request, approve via /mock/nafath/approve, poll /ciba/auth/token, manage consents.',
    steps: [
      'POST /ciba/auth/request with client_id, login_hint, scope',
      'Simulate approval via POST /mock/nafath/approve',
      'Poll POST /ciba/auth/token until approved',
      'Use access token to call /consents endpoints',
    ],
  });
}
