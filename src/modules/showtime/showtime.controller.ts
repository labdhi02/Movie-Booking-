import { Request, Response, NextFunction } from "express";
import {
  createShowtime as createShowtimeService,
  updateShowtime as updateShowtimeService,
  deleteShowtime as deleteShowtimeService,
  getAllShowtimes as getAllShowtimesService,
  getShowtimesByMovie as getShowtimesByMovieService,
  filterShowtimes as filterShowtimesService,
} from "./showtime.service";
import { GetShowtimesQuery } from "./showtime.types";
import { ShowtimeFilterQuery } from "./showtime.validator";

export const createShowtime = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = {
      ...req.body,
      startTime: new Date(req.body.startTime),
      endTime: new Date(req.body.endTime),
    };
    const showtime = await createShowtimeService(data);
    res.status(201).json(showtime);
  } catch (error) {
    next(error);
  }
};

export const updateShowtime = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const data = {
      ...req.body,
      ...(req.body.startTime && { startTime: new Date(req.body.startTime) }),
      ...(req.body.endTime && { endTime: new Date(req.body.endTime) }),
    };
    const showtime = await updateShowtimeService(id, data);
    res.status(200).json({
      message: "Showtime updated successfully",
      data: showtime,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteShowtime = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await deleteShowtimeService(id);
    res.status(200).json({
      message: "Showtime deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllShowtimes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query: GetShowtimesQuery = {};

    if (req.query.movieId && typeof req.query.movieId === "string") {
      query.movieId = req.query.movieId;
    }

    if (req.query.theaterId && typeof req.query.theaterId === "string") {
      query.theaterId = req.query.theaterId;
    }

    if (req.query.date && typeof req.query.date === "string") {
      query.date = req.query.date;
    }

    const showtimes = await getAllShowtimesService(query);
    res.status(200).json(showtimes);
  } catch (error) {
    next(error);
  }
};

export const getShowtimesByMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const movieId = Array.isArray(req.params.movieId)
      ? req.params.movieId[0]
      : req.params.movieId;
    const showtimes = await getShowtimesByMovieService(movieId);
    res.status(200).json(showtimes);
  } catch (error) {
    next(error);
  }
};

export const filterShowtimes = async (
  req: Request<{}, {}, {}, ShowtimeFilterQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await filterShowtimesService(req.query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
