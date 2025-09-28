import { prisma } from '../config/prisma';
import { logger } from '../config/logger';

type AuditPayload = {
  action: string;
  actor: string;
  consentId?: string;
  details?: Record<string, unknown>;
};

export const recordAuditEvent = async ({ action, actor, consentId, details }: AuditPayload) => {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        actor,
        consentId,
        details: details ?? {},
      },
    });
  } catch (error) {
    logger.error({ error, action, actor }, 'Failed to write audit log');
  }
};
