import { logger } from '../config/logger';

type AbsherVerificationResult = {
  nationalId: string;
  status: 'verified' | 'failed';
  reference: string;
};

class AbsherConnector {
  async verifyIdentity(nationalId: string): Promise<AbsherVerificationResult> {
    logger.info({ nationalId }, 'Absher verification stub invoked');
    return {
      nationalId,
      status: 'verified',
      reference: `absher-${nationalId}`,
    };
  }
}

export const absherConnector = new AbsherConnector();
export default absherConnector;
