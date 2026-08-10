import "dotenv/config";
import express from "express";
import http from "http";
import logger from "./utils/logger";
import { verifyConnection } from "./db/connection";
import routes from "./routes";
import { errorHandler } from "./middleware/error-handler.middleware";
import requestLogger from "./middleware/requestLogger";

const app = express();
const httpServer = http.createServer(app);
const PORT = Number(process.env.PORT) || 5000;

app.use(requestLogger);

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Movie Reservation System API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use('/api/v1', routes);
app.use(errorHandler);

httpServer.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  try {
    const isConnected = await verifyConnection();
    
    if (!isConnected) {
      logger.error("Database connection failed. Check DATABASE_URL in .env");
      process.exit(1);
    }
  } catch (error: any) {
    logger.error("Failed to verify database connection", {
      message: error?.message,
      stack: error?.stack,
    });
    process.exit(1);
  }
});

export default app;
export { httpServer };
