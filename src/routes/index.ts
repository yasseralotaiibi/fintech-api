import { Router } from 'express';

import { cibaRoutes } from './cibaRoutes.js';
import { consentRoutes } from './consentRoutes.js';
import { mockRoutes } from './mockRoutes.js';

const router = Router();

router.use('/ciba', cibaRoutes);
router.use('/consents', consentRoutes);
router.use('/mock', mockRoutes);

export const apiRoutes = router;
