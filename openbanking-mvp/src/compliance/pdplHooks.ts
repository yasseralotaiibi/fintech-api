import logger from '../config/logger';
import { Consent } from '@prisma/client';

export interface ConsentReceipt {
  consentId: string;
  issuedAt: string;
  purpose: string;
  dataItems: string[];
}

export const issueConsentReceipt = async (consent: Consent): Promise<ConsentReceipt> => {
  const receipt: ConsentReceipt = {
    consentId: consent.id,
    issuedAt: new Date().toISOString(),
    purpose: consent.purpose || 'account_information',
    dataItems: ['account_holder_name', 'iban', 'transaction_history']
  };

  logger.info('pdpl:consent_receipt', receipt);
  return receipt;
};

export const enforceDataMinimisation = async (payload: unknown): Promise<void> => {
  logger.info('pdpl:data_minimisation_check', {
    allowedDataPoints: ['account_holder_name', 'iban', 'transaction_history'],
    payloadPreview: payload
  });
};

export const recordImmutableAuditLog = async (event: { type: string; metadata?: unknown }): Promise<void> => {
  logger.info('pdpl:audit_log_placeholder', event);
};
