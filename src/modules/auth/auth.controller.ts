import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.types';

export async function getCurrentUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.status(200).json({
      id: req.user!.id,
      email: req.user!.email,
      role: req.user!.role,
    });
  } catch (error) {
    next(error);
  }
}
