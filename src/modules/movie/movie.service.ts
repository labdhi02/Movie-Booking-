import {
  create,
  update,
  softDelete,
  findAll,
  findById,
} from './movie.repository';
import { NotFoundError } from '../../errors/custom-errors';
import { CreateMovieData, UpdateMovieData } from './movie.types';

export const createMovie = async (data: CreateMovieData) => {
  return await create(data);
};

export const updateMovie = async (id: string, data: UpdateMovieData) => {
  const existing = await findById(id);
  if (!existing) {
    throw new NotFoundError('Movie not found');
  }
  return await update(id, data);
};


export const deleteMovie = async (id: string) => {
  const existing = await findById(id);
  if (!existing) {
    throw new NotFoundError('Movie not found');
  }
  await softDelete(id);
};

export const getAllMovies = async () => {
  return await findAll();
};

export const getMovieById = async (id: string) => {
  const movie = await findById(id);
  if (!movie) {
    throw new NotFoundError('Movie not found');
  }
  return movie;
};
