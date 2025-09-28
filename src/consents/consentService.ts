import { prisma } from '../config/prisma';
import { recordAuditEvent } from '../utils/auditLogger';
import {
  appendImmutableAuditTrail,
  enforceDataMinimisation,
  issueConsentReceipt,
} from './complianceHooks';

interface ConsentInput {
  subject: string;
  clientId: string;
  scope: string[];
  expiresAt?: Date;
}

export const createConsent = async (input: ConsentInput) => {
  const consent = await prisma.consent.create({
    data: {
      subject: input.subject,
      clientId: input.clientId,
      scope: input.scope,
      status: 'active',
      expiresAt: input.expiresAt ?? null,
    },
  });

  await Promise.all([
    issueConsentReceipt({ consentId: consent.id, scope: consent.scope, subject: consent.subject }),
    enforceDataMinimisation({
      consentId: consent.id,
      scope: consent.scope,
      subject: consent.subject,
    }),
    appendImmutableAuditTrail({
      consentId: consent.id,
      scope: consent.scope,
      subject: consent.subject,
    }),
    recordAuditEvent({ action: 'consent.created', actor: consent.clientId, consentId: consent.id }),
  ]);

  return consent;
};

export const listConsents = async (subject?: string) => {
  return prisma.consent.findMany({
    where: subject ? { subject } : {},
    orderBy: { createdAt: 'desc' },
  });
};

export const revokeConsent = async (id: string) => {
  const consent = await prisma.consent.update({
    where: { id },
    data: { status: 'revoked' },
  });

  await recordAuditEvent({
    action: 'consent.revoked',
    actor: consent.clientId,
    consentId: consent.id,
  });

  return consent;
};
