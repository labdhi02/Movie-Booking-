import { findById as findTheaterById } from "../theater/theater.repository";
import {
  create as createScreenRepo,
  update as updateScreenRepo,
  findById as findScreenById,
  findByTheaterId,
} from "./screen.repository";
import { NotFoundError } from "../../errors/custom-errors";
import { CreateScreenData, UpdateScreenData, Screen } from "./screen.types";

export const createScreen = async (
  theaterId: string,
  data: CreateScreenData,
): Promise<Screen> => {
  const theater = await findTheaterById(theaterId);
  if (!theater) {
    throw new NotFoundError("Theater not found");
  }

  return await createScreenRepo(data);
};

export const updateScreen = async (
  id: string,
  data: UpdateScreenData,
): Promise<Screen> => {
  const screen = await findScreenById(id);
  if (!screen) {
    throw new NotFoundError("Screen not found");
  }

  return await updateScreenRepo(id, data);
};

export const getScreensByTheater = async (
  theaterId: string,
): Promise<Screen[]> => {
  const theater = await findTheaterById(theaterId);
  if (!theater) {
    throw new NotFoundError("Theater not found");
  }
  return await findByTheaterId(theaterId);
};
