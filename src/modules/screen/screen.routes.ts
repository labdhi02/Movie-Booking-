import { Router } from 'express';
import { adminAuth } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { createScreenSchema, updateScreenSchema } from './screen.validator';
import {
  createScreen,
  updateScreen,
  getScreensByTheater,
} from './screen.controller';

const router = Router();

router.post('/:theaterId', adminAuth, validateRequest(createScreenSchema), createScreen);
router.patch('/:id', adminAuth, validateRequest(updateScreenSchema), updateScreen);

router.get('/:theaterId', getScreensByTheater);

export default router;
