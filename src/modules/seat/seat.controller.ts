import { Request, Response, NextFunction } from "express";
import { bulkCreateSeats as bulkCreateSeatsService } from "./seat.service";

export const bulkCreateSeats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const seats = await bulkCreateSeatsService(
      req.params.screenId as string,
      req.body,
    );
    res.status(201).json(seats);
  } catch (error) {
    next(error);
  }
};
