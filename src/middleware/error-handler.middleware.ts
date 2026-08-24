import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  TokenExpiredError,
} from "../errors/custom-errors";

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (
    error instanceof UnauthorizedError ||
    error instanceof ForbiddenError ||
    error instanceof TokenExpiredError
  ) {
    logger.warn("Authentication failure", {
      userId: (req as any).user?.id,
      path: req.path,
      errorName: error.name,
      message: error.message,
    });
  } else {
    logger.error(error.message || "Error occurred", {
      name: error.name,
    });
  }

  if (error instanceof UnauthorizedError) {
    return res.status(401).json({
      error: {
        message: error.message,
        code: "UNAUTHORIZED",
      },
    });
  }

  if (error instanceof TokenExpiredError) {
    return res.status(401).json({
      error: {
        message: error.message,
        code: "TOKEN_EXPIRED",
      },
    });
  }

  if (error instanceof ForbiddenError) {
    return res.status(403).json({
      error: {
        message: error.message,
        code: "FORBIDDEN",
      },
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      error: {
        message: error.message,
        code: "NOT_FOUND",
      },
    });
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: {
        message: error.message,
        code: "VALIDATION_ERROR",
        details: error.details,
      },
    });
  }

  if (error instanceof ConflictError) {
    return res.status(409).json({
      error: {
        message: error.message,
        code: "CONFLICT",
      },
    });
  }

  if (error.code === "23503") {
    return res.status(409).json({
      error: {
        message: "Operation violates data integrity constraints",
        code: "CONFLICT",
        detail: error.detail || "Foreign key constraint violation",
      },
    });
  }

  if (error.code === "23505") {
    return res.status(409).json({
      error: {
        message: "Resource already exists",
        code: "DUPLICATE",
      },
    });
  }

  return res.status(500).json({
    error: {
      message: error.message || "Internal server error",
      code: "INTERNAL_ERROR",
      ...(process.env.NODE_ENV === 'development' && { 
        detail: error.detail,
        dbCode: error.code 
      }),
    },
  });
}
