import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../errors/custom-errors";

export function validateRequest(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        next(new ValidationError("Validation failed", formattedErrors));
      } else {
        next(error);
      }
    }
  };
}

export function validate(schemas: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {

      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        const validatedQuery = schemas.query.parse(req.query);
        Object.keys(req.query).forEach(key => delete (req.query as any)[key]);
        Object.assign(req.query, validatedQuery);
      }

      if (schemas.params) {
        const validatedParams = schemas.params.parse(req.params);
        Object.keys(req.params).forEach(key => delete req.params[key]);
        Object.assign(req.params, validatedParams);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        next(new ValidationError("Validation failed", formattedErrors));
      } else {
        next(error);
      }
    }
  };
}
