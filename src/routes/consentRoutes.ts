import { Router } from 'express';
import {
  createConsentController,
  listConsentsController,
  revokeConsentController,
} from '../consents/consentController';

const router = Router();

router.post('/', createConsentController);
router.get('/', listConsentsController);
router.delete('/:id', revokeConsentController);

export default router;
