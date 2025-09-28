import { ConsentStatus } from '@prisma/client';

import { prisma } from '../config/db.js';
import {
  issueConsentReceipt,
  logAuditEvent,
  performDataMinimisationCheck,
} from '../compliance/pdplHooks.js';

export type CreateConsentInput = {
  clientId: string;
  customerId: string;
  scopes: string[];
};

export async function createConsent(input: CreateConsentInput) {
  const minimised = performDataMinimisationCheck({
    consentId: 'pending',
    customerId: input.customerId,
    scopes: input.scopes,
  });

  const consent = await prisma.consent.create({
    data: {
      clientId: input.clientId,
      customerId: minimised.customerId as string,
      scopes: minimised.scopes as string[],
    },
  });

  await issueConsentReceipt({
    consentId: consent.id,
    customerId: consent.customerId,
    scopes: consent.scopes,
    issuedAt: consent.createdAt,
  });

  await logAuditEvent({
    type: 'CONSENT_CREATED',
    actor: input.clientId,
    subject: consent.customerId,
    payload: { consentId: consent.id, scopes: consent.scopes },
    timestamp: new Date(),
  });

  return consent;
}

export async function listConsents() {
  return prisma.consent.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function revokeConsent(consentId: string) {
  const consent = await prisma.consent.update({
    where: { id: consentId },
    data: {
      status: ConsentStatus.REVOKED,
    },
  });

  await logAuditEvent({
    type: 'CONSENT_REVOKED',
    actor: 'system',
    subject: consent.customerId,
    payload: { consentId: consent.id },
    timestamp: new Date(),
  });

  return consent;
}
