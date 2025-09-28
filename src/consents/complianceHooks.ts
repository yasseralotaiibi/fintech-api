import { env } from '../config/env';
import { logger } from '../config/logger';

export interface ConsentPayload {
  consentId: string;
  subject: string;
  scope: string[];
}

export const issueConsentReceipt = async (payload: ConsentPayload) => {
  logger.info(
    { payload, webhook: env.consentReceiptWebhook },
    'Issuing PDPL consent receipt (stub)',
  );
};

export const enforceDataMinimisation = async (payload: ConsentPayload) => {
  logger.info({ payload }, 'Running data minimisation checks (stub)');
};

export const appendImmutableAuditTrail = async (payload: ConsentPayload) => {
  logger.info({ payload }, 'Appending immutable audit trail entry (stub)');
};
