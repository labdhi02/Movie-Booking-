import { Router } from 'express';
import { adminAuth } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { createMovieSchema, updateMovieSchema } from './movie.validator';
import {
  createMovie,
  updateMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
} from './movie.controller';

const router = Router();

router.post('/', adminAuth, validateRequest(createMovieSchema), createMovie);
router.patch('/:id', adminAuth, validateRequest(updateMovieSchema), updateMovie);
router.delete('/:id', adminAuth, deleteMovie);

router.get('/', getAllMovies);
router.get('/:id', getMovieById);

export default router;
