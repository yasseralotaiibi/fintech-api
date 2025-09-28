import { Router } from 'express';
import { initiateAuthRequest, pollToken } from '../auth/cibaController';

const router = Router();

router.post('/auth/request', initiateAuthRequest);
router.post('/auth/token', pollToken);

export default router;
