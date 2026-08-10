import { Request, Response, NextFunction } from "express";
import {
  createScreen as createScreenService,
  updateScreen as updateScreenService,
  getScreensByTheater as getScreensByTheaterService,
} from "./screen.service";

export const createScreen = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const screen = await createScreenService(
      req.params.theaterId as string,
      { ...req.body, theaterId: req.params.theaterId as string },
    );
    res.status(201).json(screen);
  } catch (error) {
    next(error);
  }
};

export const updateScreen = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const screen = await updateScreenService(
      req.params.id as string,
      req.body,
    );
    res.status(200).json(screen);
  } catch (error) {
    next(error);
  }
};

export const getScreensByTheater = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const screens = await getScreensByTheaterService(
      req.params.theaterId as string,
    );
    res.status(200).json(screens);
  } catch (error) {
    next(error);
  }
};
