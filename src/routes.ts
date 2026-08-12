import { Router } from "express";
import theaterRoutes from "./modules/theater/theater.routes";
import screenRoutes from "./modules/screen/screen.routes";
import seatRoutes from "./modules/seat/seat.routes";
import movieRoutes from "./modules/movie/movie.routes";

const router = Router();

router.use("/theaters", theaterRoutes);
router.use("/screens", screenRoutes);
router.use("/screens", seatRoutes);
router.use("/movies", movieRoutes);

export default router;
