import { Request } from 'express';
import { UserRole } from '../db/schema/enums';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
