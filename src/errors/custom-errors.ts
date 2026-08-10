export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }
}

export class ValidationError extends Error {
  details?: any[];
  constructor(message: string, details?: any[]) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConflictError);
    }
  }
}
