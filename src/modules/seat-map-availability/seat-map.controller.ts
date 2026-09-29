import { Request, Response, NextFunction } from "express";
import { getSeatsForShowtime } from "./seat-map.service";
import { GetSeatsParams } from "./seat-map.types";

export const getShowtimeSeats = async (
  req: Request<GetSeatsParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id: showtimeId } = req.params;
    const seats = await getSeatsForShowtime(showtimeId);
    res.status(200).json(seats);
  } catch (error) {
    next(error);
  }
};
