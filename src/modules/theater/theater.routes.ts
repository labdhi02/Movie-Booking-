import { Router } from 'express';
import { adminAuth } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { createTheaterSchema, updateTheaterSchema } from './theater.validator';
import {
  createTheater,
  updateTheater,
  deleteTheater,
  getAllTheaters,
  getTheaterById,
} from './theater.controller';

const router = Router();

router.post('/', adminAuth, validateRequest(createTheaterSchema), createTheater);
router.patch('/:id', adminAuth, validateRequest(updateTheaterSchema), updateTheater);
router.delete('/:id', adminAuth, deleteTheater);
router.get('/', getAllTheaters);
router.get('/:id', getTheaterById);

export default router;
