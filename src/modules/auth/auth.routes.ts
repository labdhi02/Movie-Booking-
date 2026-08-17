import { Router } from 'express';
import { userAuth } from '../../middleware/auth.middleware';
import { getCurrentUser } from './auth.controller';

const router = Router();

router.get('/me', userAuth, getCurrentUser);

export default router;
