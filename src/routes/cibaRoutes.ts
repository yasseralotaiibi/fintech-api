import { Router } from 'express';

import { handleCibaAuthRequest, handleCibaTokenRequest } from '../auth/cibaController.js';
import { nonceIssueMiddleware, nonceValidationMiddleware } from '../middleware/nonceMiddleware.js';
import { mtlsEnforcementPlaceholder } from '../middleware/mtlsPlaceholder.js';

const router = Router();

router.post(
  '/auth/request',
  mtlsEnforcementPlaceholder,
  nonceValidationMiddleware,
  nonceIssueMiddleware,
  handleCibaAuthRequest,
);
router.post('/auth/token', mtlsEnforcementPlaceholder, handleCibaTokenRequest);

export const cibaRoutes = router;
