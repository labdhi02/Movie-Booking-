import { Request, Response, NextFunction } from "express";
import {
  createTheater as createTheaterService,
  updateTheater as updateTheaterService,
  deleteTheater as deleteTheaterService,
  getAllTheaters as getAllTheatersService,
  getTheaterById as getTheaterByIdService,
} from "./theater.service";

export const createTheater = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const theater = await createTheaterService(req.body);
    res.status(201).json(theater);
  } catch (error) {
    next(error);
  }
};

export const updateTheater = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const theater = await updateTheaterService(
      req.params.id as string,
      req.body,
    );
    res.status(200).json(theater);
  } catch (error) {
    next(error);
  }
};

export const deleteTheater = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteTheaterService(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getAllTheaters = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const theaters = await getAllTheatersService();
    res.status(200).json(theaters);
  } catch (error) {
    next(error);
  }
};

export const getTheaterById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const theater = await getTheaterByIdService(req.params.id as string);
    res.status(200).json(theater);
  } catch (error) {
    next(error);
  }
};
