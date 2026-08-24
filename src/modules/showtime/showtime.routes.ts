import { Router } from 'express';
import { adminAuth } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { 
  createShowtimeSchema, 
  updateShowtimeSchema 
} from './showtime.validator';
import {
  createShowtime,
  updateShowtime,
  deleteShowtime,
  getAllShowtimes,
  getShowtimesByMovie,
} from './showtime.controller';

const router = Router();

router.post('/', adminAuth, validateRequest(createShowtimeSchema), createShowtime);
router.patch('/:id', adminAuth, validateRequest(updateShowtimeSchema), updateShowtime);
router.delete('/:id', adminAuth, deleteShowtime);

router.get('/', getAllShowtimes);
router.get('/movie/:movieId', getShowtimesByMovie);

export default router;
