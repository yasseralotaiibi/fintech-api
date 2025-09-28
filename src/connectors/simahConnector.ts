import { logger } from '../config/logger';

type SimahCreditReport = {
  nationalId: string;
  score: number;
  summary: string;
};

class SimahConnector {
  async fetchCreditReport(nationalId: string): Promise<SimahCreditReport> {
    logger.info({ nationalId }, 'SIMAH credit report stub invoked');
    return {
      nationalId,
      score: 650,
      summary: 'Mock SIMAH credit report for sandbox usage',
    };
  }
}

export const simahConnector = new SimahConnector();
export default simahConnector;
