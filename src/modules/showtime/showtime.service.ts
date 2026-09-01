import {
  create,
  update,
  remove,
  findAll,
  findById,
  findByMovie,
  findShowtimes as findShowtimesRepo,
  ShowtimeWithRelations,
} from "./showtime.repository";
import { findById as findMovieById } from "../movie/movie.repository";
import { findById as findScreenById } from "../screen/screen.repository";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
} from "../../errors/custom-errors";
import {
  CreateShowtimeData,
  UpdateShowtimeData,
  GetShowtimesQuery,
} from "./showtime.types";
import { ShowtimeFilterQuery } from "./showtime.validator";

export interface ShowtimeFilterResponse {
  data: ShowtimeWithRelations[];

  pagination: {
    nextCursor: string | null;

    previousCursor: string | null;
    limit: number;
  };
}

export const createShowtime = async (data: CreateShowtimeData) => {
  if (new Date(data.startTime) >= new Date(data.endTime)) {
    throw new ValidationError("Start time must be before end time");
  }

  const movie = await findMovieById(data.movieId);
  if (!movie) {
    throw new NotFoundError("Movie not found");
  }

  const startTime = new Date(data.startTime);
  if (movie.releaseDate) {
    const releaseDate = new Date(movie.releaseDate);
    if (startTime < releaseDate) {
      throw new ValidationError(
        `Showtime start time must be on or after the movie release date (${releaseDate.toISOString().split("T")[0]})`,
      );
    }
  }

  if (movie.pullDate) {
    const pullDate = new Date(movie.pullDate);
    if (startTime > pullDate) {
      throw new ValidationError(
        `Showtime start time must be on or before the movie pull date (${pullDate.toISOString().split("T")[0]})`,
      );
    }
  }

  const screen = await findScreenById(data.screenId);
  if (!screen) {
    throw new NotFoundError("Screen not found");
  }

  try {
    return await create(data);
  } catch (error: any) {
    if (
      error.code === "23P01" ||
      error.constraint_name === "showtime_no_overlap" ||
      error.constraint === "showtime_no_overlap" ||
      (error.message && error.message.includes("showtime_no_overlap"))
    ) {
      throw new ConflictError(
        `Cannot create showtime on ${screen.name}. ` +
          `The time slot to conflicts with an existing showtime. `,
      );
    }

    if (error.code === "23503") {
      throw new NotFoundError(
        `Invalid reference: ${error.detail || "Movie or Screen not found"}`,
      );
    }
    if (error.message) {
      throw new Error(
        `Database error: ${error.message}${error.detail ? ` - ${error.detail}` : ""}`,
      );
    }

    throw error;
  }
};

export const updateShowtime = async (id: string, data: UpdateShowtimeData) => {
  const existing = await findById(id);
  if (!existing) {
    throw new NotFoundError("Showtime not found");
  }

  const startTime = data.startTime
    ? new Date(data.startTime)
    : new Date(existing.startTime);
  const endTime = data.endTime
    ? new Date(data.endTime)
    : new Date(existing.endTime);

  if (startTime >= endTime) {
    throw new ValidationError("Start time must be before end time");
  }

  if (data.movieId || data.startTime) {
    const movieId = data.movieId || existing.movieId;
    const movie = await findMovieById(movieId);

    if (!movie) {
      throw new NotFoundError("Movie not found");
    }

    if (movie.releaseDate) {
      const releaseDate = new Date(movie.releaseDate);
      if (startTime < releaseDate) {
        throw new ValidationError(
          `Showtime start time must be on or after the movie release date (${releaseDate.toISOString().split("T")[0]})`,
        );
      }
    }

    if (movie.pullDate) {
      const pullDate = new Date(movie.pullDate);
      if (startTime > pullDate) {
        throw new ValidationError(
          `Showtime start time must be on or before the movie pull date (${pullDate.toISOString().split("T")[0]})`,
        );
      }
    }
  }

  if (data.screenId) {
    const screen = await findScreenById(data.screenId);
    if (!screen) {
      throw new NotFoundError("Screen not found");
    }
  }

  try {
    return await update(id, data);
  } catch (error: any) {
    if (error.code === "23P01") {
      throw new ConflictError(
        "Showtime conflicts with existing schedule. Please choose a different time or screen.",
      );
    }
    throw error;
  }
};

export const deleteShowtime = async (id: string) => {
  const existing = await findById(id);
  if (!existing) {
    throw new NotFoundError("Showtime not found");
  }
  await remove(id);
};

export const getAllShowtimes = async (query: GetShowtimesQuery) => {
  return await findAll(query);
};

export const getShowtimesByMovie = async (movieId: string) => {
  return await findByMovie(movieId);
};

export const filterShowtimes = async (
  query: ShowtimeFilterQuery,
): Promise<ShowtimeFilterResponse> => {
  const filters = {
    movieId: query.movieId,
    theaterId: query.theaterId,
    date: query.date,
    startDate: query.startDate,
    endDate: query.endDate,
  };

  const pagination = {
    cursor: query.cursor,
    limit: query.limit ?? 20, // Fallback to 20 if undefined
  };

  const result = await findShowtimesRepo(filters, pagination);

  return {
    data: result.items,
    pagination: {
      nextCursor: result.nextCursor,
      previousCursor: result.previousCursor,
      limit: pagination.limit,
    },
  };
};
