import {
  create,
  update,
  softDelete,
  findAll,
  findById,
  searchMovies as searchMoviesRepo,
} from "./movie.repository";
import { NotFoundError } from "../../errors/custom-errors";
import { CreateMovieData, UpdateMovieData, Movie } from "./movie.types";
import { MovieSearchQuery } from "./movie.validator";

export interface MovieSearchResponse {
  data: Movie[];
  pagination: {
    nextCursor: string | null;
    previousCursor: string | null;
    limit: number;
  };
}

export const createMovie = async (data: CreateMovieData) => {
  return await create(data);
};

export const updateMovie = async (id: string, data: UpdateMovieData) => {
  const existing = await findById(id);
  if (!existing) {
    throw new NotFoundError("Movie not found");
  }
  return await update(id, data);
};

export const deleteMovie = async (id: string) => {
  const existing = await findById(id);
  if (!existing) {
    throw new NotFoundError("Movie not found");
  }
  await softDelete(id);
};

export const getAllMovies = async () => {
  return await findAll();
};

export const getMovieById = async (id: string) => {
  const movie = await findById(id);
  if (!movie) {
    throw new NotFoundError("Movie not found");
  }
  return movie;
};

export const searchMovies = async (
  query: MovieSearchQuery,
): Promise<MovieSearchResponse> => {
  const filters = {
    title: query.title,
    genre: query.genre,
    actor: query.actor,
    startDate: query.startDate,
    endDate: query.endDate,
  };

  const pagination = {
    cursor: query.cursor,
    limit: query.limit ?? 20, // Fallback to 20 if undefined
  };

  const result = await searchMoviesRepo(filters, pagination);

  return {
    data: result.items,
    pagination: {
      nextCursor: result.nextCursor,
      previousCursor: result.previousCursor,
      limit: pagination.limit,
    },
  };
};
