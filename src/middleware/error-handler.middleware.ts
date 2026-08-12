import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
} from "../errors/custom-errors";

export function errorHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error(error.message || "Error occurred", {
    name: error.name,
  });
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
      message: "Internal server error",
      code: "INTERNAL_ERROR",
    },
  });
}
