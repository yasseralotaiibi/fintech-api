import { approveAuthRequest, denyAuthRequest } from '../auth/cibaService';
import { logger } from '../config/logger';

class NafathConnector {
  async triggerApproval(authReqId: string, nationalId: string) {
    logger.info({ authReqId, nationalId }, 'Nafath mock approval triggered');
    return approveAuthRequest(authReqId, nationalId);
  }

  async triggerDenial(authReqId: string, nationalId: string) {
    logger.info({ authReqId, nationalId }, 'Nafath mock denial triggered');
    return denyAuthRequest(authReqId, nationalId);
  }
}

export const nafathConnector = new NafathConnector();
export default nafathConnector;
