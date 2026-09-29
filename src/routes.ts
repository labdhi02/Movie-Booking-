import { Router } from "express";
import theaterRoutes from "./modules/theater/theater.routes";
import screenRoutes from "./modules/screen/screen.routes";
import seatRoutes from "./modules/seat/seat.routes";
import movieRoutes from "./modules/movie/movie.routes";
import authRoutes from "./modules/auth/auth.routes";
import showtimeRoutes from "./modules/showtime/showtime.routes";
import seatMapRoutes from "./modules/seat-map-availability/seat-map.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/theaters", theaterRoutes);
router.use("/screens", screenRoutes);
router.use("/screens", seatRoutes);
router.use("/movies", movieRoutes);
router.use("/showtimes", showtimeRoutes);
router.use("/showtimes", seatMapRoutes);

export default router;
