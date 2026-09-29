import { Router } from 'express';
import { validate } from '../../middleware/validation.middleware';
import { getSeatsParamsSchema } from './seat-map.validator';
import { getShowtimeSeats } from './seat-map.controller';

const router = Router();

router.get(
  '/:id/seats',
  validate({ params: getSeatsParamsSchema }),
  getShowtimeSeats as any
);

export default router;
