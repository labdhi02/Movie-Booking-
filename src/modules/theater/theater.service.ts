import {
  create,
  update,
  softDelete,
  findAll,
  findById,
} from "./theater.repository";
import { NotFoundError } from "../../errors/custom-errors";
import { CreateTheaterData, UpdateTheaterData } from "./theater.types";

export const createTheater = async (data: CreateTheaterData) => {
  return await create(data);
};

export const updateTheater = async (id: string, data: UpdateTheaterData) => {
  const existing = await findById(id);
  if (!existing) {
    throw new NotFoundError("Theater not found");
  }
  return await update(id, data);
};

export const deleteTheater = async (id: string) => {
  const existing = await findById(id);
  if (!existing) {
    throw new NotFoundError("Theater not found");
  }
  await softDelete(id);
};

export const getAllTheaters = async () => {
  return await findAll();
};

export const getTheaterById = async (id: string) => {
  const theater = await findById(id);
  if (!theater) {
    throw new NotFoundError("Theater not found");
  }
  return theater;
};
