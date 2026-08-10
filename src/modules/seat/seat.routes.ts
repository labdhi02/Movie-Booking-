import { Router } from 'express';
import { adminAuth } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { bulkCreateSeatsSchema } from './seat.validator';
import { bulkCreateSeats } from './seat.controller';

const router = Router();

router.post('/:screenId/seats', adminAuth, validateRequest(bulkCreateSeatsSchema), bulkCreateSeats);

export default router;
