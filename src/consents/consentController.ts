import type { Request, Response } from 'express';

import { createConsent, listConsents, revokeConsent } from './consentService.js';

export async function handleCreateConsent(req: Request, res: Response) {
  const { client_id: clientId, customer_id: customerId, scopes } = req.body ?? {};
  if (!clientId || !customerId) {
    return res.status(400).json({ message: 'client_id and customer_id are required' });
  }

  const consent = await createConsent({
    clientId,
    customerId,
    scopes: Array.isArray(scopes) ? scopes : typeof scopes === 'string' ? scopes.split(' ') : [],
  });

  return res.status(201).json(consent);
}

export async function handleListConsents(_req: Request, res: Response) {
  const consents = await listConsents();
  return res.json(consents);
}

export async function handleRevokeConsent(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'id is required' });
  }

  const consent = await revokeConsent(id);
  return res.json(consent);
}
