import logger from "../utils/logger";
import { NextFunction, Request, Response } from "express";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration_ms = Date.now() - start;
    const status = res.statusCode;

    logger.info("http.request", {
      method: req.method,
      path: req.originalUrl,
      status,
      duration_ms,
      ip: req.ip,
      user_agent: req.headers["user-agent"],
    });
  });

  next();
};

export default requestLogger;
