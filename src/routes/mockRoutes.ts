import { Router } from 'express';

import { mockApprove, mockDeny } from '../auth/cibaController.js';

const router = Router();

router.post('/nafath/approve', mockApprove);
router.post('/nafath/deny', mockDeny);

export const mockRoutes = router;
