import { Request, Response } from 'express';
import { createConsent, listConsents, revokeConsent } from './consentService';

const toScopeArray = (scope: unknown): string[] => {
  if (Array.isArray(scope)) {
    return scope as string[];
  }

  if (typeof scope === 'string') {
    return scope.split(' ');
  }

  return [];
};

export const createConsentController = async (req: Request, res: Response) => {
  const { subject, client_id: clientId, scope, expires_at: expiresAt } = req.body ?? {};

  if (!subject || !clientId) {
    res.status(400).json({ message: 'subject and client_id are required' });
    return;
  }

  const consent = await createConsent({
    subject,
    clientId,
    scope: toScopeArray(scope),
    expiresAt: expiresAt ? new Date(expiresAt) : undefined,
  });

  res.status(201).json(consent);
};

export const listConsentsController = async (req: Request, res: Response) => {
  const consents = await listConsents(req.query.subject as string | undefined);
  res.json(consents);
};

export const revokeConsentController = async (req: Request, res: Response) => {
  const consentId = req.params.id;

  try {
    const consent = await revokeConsent(consentId);
    res.json(consent);
  } catch (error) {
    res.status(404).json({ message: 'Consent not found', details: (error as Error).message });
  }
};
