import { Router } from "express";
import theaterRoutes from "./modules/theater/theater.routes";

const router = Router();

router.use("/theaters", theaterRoutes);

export default router;
