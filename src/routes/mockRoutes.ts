import { Router } from 'express';
import { mockNafathApprove, mockNafathDeny } from '../auth/cibaController';

const router = Router();

router.post('/nafath/approve', mockNafathApprove);
router.post('/nafath/deny', mockNafathDeny);

export default router;
