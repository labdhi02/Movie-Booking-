import { Router } from 'express';
import { z } from 'zod';
import { adminAuth } from '../../middleware/auth.middleware';
import { validateRequest, validate } from '../../middleware/validation.middleware';
import { createMovieSchema, updateMovieSchema, movieSearchQuerySchema } from './movie.validator';
import { showtimeFilterQuerySchema } from '../showtime/showtime.validator';
import {
  createMovie,
  updateMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
  searchMovies,
  getMovieShowtimes,
} from './movie.controller';

const router = Router();

router.post('/', adminAuth, validateRequest(createMovieSchema), createMovie);
router.patch('/:id', adminAuth, validateRequest(updateMovieSchema), updateMovie);
router.delete('/:id', adminAuth, deleteMovie);

router.get('/', validate({ query: movieSearchQuerySchema }), searchMovies as any);
router.get(
  '/:id/showtimes',
  validate({
    params: z.object({ id: z.string().uuid() }),
    query: showtimeFilterQuerySchema,
  }),
  getMovieShowtimes as any
);
router.get('/:id', getMovieById);

export default router;
