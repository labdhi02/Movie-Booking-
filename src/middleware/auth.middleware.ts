import { Response, NextFunction } from "express";
import { verifySupabaseJWT } from "../utils/jwt";
import { UnauthorizedError, ForbiddenError } from "../errors/custom-errors";
import { db } from "../db/connection";
import { profiles } from "../db/schema/profiles";
import { UserRole } from "../db/schema/enums";
import { eq } from "drizzle-orm";
import logger from "../utils/logger";
import { AuthenticatedRequest, AuthUser } from "./auth.types";

export type { AuthenticatedRequest, AuthUser } from "./auth.types";
export { UserRole } from "../db/schema/enums";

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError("Missing authorization token");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Invalid authorization header format");
    }

    const token = authHeader.substring(7);
    const payload = verifySupabaseJWT(token);
    const userId = payload.sub;

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, userId),
    });

    if (!profile) {
      throw new UnauthorizedError("User profile not found");
    }

    req.user = {
      id: userId,
      email: payload.email,
      firstName:
        payload.user_metadata?.first_name || profile.firstName || undefined,
      lastName:
        payload.user_metadata?.last_name || profile.lastName || undefined,
      role: profile.role as UserRole,
    };

    logger.debug("User authenticated successfully", {
      userId: req.user.id,
      email: req.user.email,
      role: req.user.role,
    });

    next();
  } catch (error) {
    next(error);
  }
}

export function authorize(requiredRole: UserRole) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      if (!req.user) {
        logger.warn("Authorization failed: User not authenticated", {
          path: req.path,
          method: req.method,
        });
        throw new UnauthorizedError("Authentication required");
      }

      if (req.user.role !== requiredRole) {
        logger.warn("Authorization failed: Insufficient permissions", {
          userId: req.user.id,
          userRole: req.user.role,
          requiredRole,
          path: req.path,
          method: req.method,
        });
        throw new ForbiddenError("Insufficient permissions");
      }

      logger.debug("User authorized successfully", {
        userId: req.user.id,
        role: req.user.role,
        path: req.path,
      });

      next();
    } catch (error) {
      next(error);
    }
  };
}
export async function adminAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  await authenticate(req, res, (err) => {
    if (err) return next(err);
    authorize(UserRole.ADMIN)(req, res, next);
  });
}

export async function userAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  await authenticate(req, res, next);
}
