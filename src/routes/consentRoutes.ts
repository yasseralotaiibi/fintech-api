import { Router } from 'express';

import {
  handleCreateConsent,
  handleListConsents,
  handleRevokeConsent,
} from '../consents/consentController.js';
import { jwtValidationMiddleware, requireScopes } from '../middleware/jwtAuth.js';

const router = Router();

router.use(jwtValidationMiddleware);
router.post('/', requireScopes(['consents:create']), handleCreateConsent);
router.get('/', requireScopes(['consents:read']), handleListConsents);
router.delete('/:id', requireScopes(['consents:revoke']), handleRevokeConsent);

export const consentRoutes = router;
