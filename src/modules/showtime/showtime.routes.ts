import { Router } from 'express';
import { adminAuth } from '../../middleware/auth.middleware';
import { validateRequest, validate } from '../../middleware/validation.middleware';
import { 
  createShowtimeSchema, 
  updateShowtimeSchema,
  showtimeFilterQuerySchema,
} from './showtime.validator';
import {
  createShowtime,
  updateShowtime,
  deleteShowtime,
  getAllShowtimes,
  getShowtimesByMovie,
  filterShowtimes,
} from './showtime.controller';

const router = Router();

router.post('/', adminAuth, validateRequest(createShowtimeSchema), createShowtime);
router.patch('/:id', adminAuth, validateRequest(updateShowtimeSchema), updateShowtime);
router.delete('/:id', adminAuth, deleteShowtime);

router.get('/', validate({ query: showtimeFilterQuerySchema }), filterShowtimes as any);
router.get('/movie/:movieId', getShowtimesByMovie);

export default router;
