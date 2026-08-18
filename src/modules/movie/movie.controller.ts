import { Request, Response, NextFunction } from "express";
import {
  createMovie as createMovieService,
  updateMovie as updateMovieService,
  deleteMovie as deleteMovieService,
  getAllMovies as getAllMoviesService,
  getMovieById as getMovieByIdService,
} from "./movie.service";

export const createMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const movie = await createMovieService(req.body);
    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
};

export const updateMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const movie = await updateMovieService(req.params.id as string, req.body);
    res.status(200).json({
      message: "Movie updated successfully",
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteMovieService(req.params.id as string);
    res.status(200).json({
      message: "Movie deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMovies = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const movies = await getAllMoviesService();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const movie = await getMovieByIdService(req.params.id as string);
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};
