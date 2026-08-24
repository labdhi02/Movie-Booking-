import { db } from "../../db/connection";
import { showtimes } from "../../db/schema/showtimes";
import { screens } from "../../db/schema/screens";
import { movies } from "../../db/schema/movies";
import { theaters } from "../../db/schema/theaters";
import { eq, and, gte, lte, inArray } from "drizzle-orm";
import {
  CreateShowtimeData,
  UpdateShowtimeData,
  GetShowtimesQuery,
} from "./showtime.types";

export const create = async (data: CreateShowtimeData) => {
  try {
    const [showtime] = await db.insert(showtimes).values(data).returning();
    return showtime;
  } catch (error: any) {
    const actualError = error.cause || error;
    throw actualError;
  }
};

export const update = async (id: string, data: UpdateShowtimeData) => {
  try {
    const [showtime] = await db
      .update(showtimes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(showtimes.id, id))
      .returning();
    return showtime;
  } catch (error: any) {
    throw error.cause || error;
  }
};

export const remove = async (id: string) => {
  await db.delete(showtimes).where(eq(showtimes.id, id));
};

export const findById = async (id: string) => {
  const [showtime] = await db
    .select()
    .from(showtimes)
    .where(eq(showtimes.id, id));
  return showtime || null;
};

export const findAll = async (query: GetShowtimesQuery) => {
  const conditions = [];

  if (query.movieId) {
    conditions.push(eq(showtimes.movieId, query.movieId));
  }
  if (query.theaterId) {
    const screensInTheater = await db
      .select({ id: screens.id })
      .from(screens)
      .where(eq(screens.theaterId, query.theaterId));

    const screenIds = screensInTheater.map((s) => s.id);
    if (screenIds.length > 0) {
      conditions.push(inArray(showtimes.screenId, screenIds));
    } else {
      return [];
    }
  }

  if (query.date) {
    const startOfDay = new Date(query.date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(query.date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    conditions.push(gte(showtimes.startTime, startOfDay));
    conditions.push(lte(showtimes.startTime, endOfDay));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return await db
    .select({
      id: showtimes.id,
      movieId: showtimes.movieId,
      screenId: showtimes.screenId,
      startTime: showtimes.startTime,
      endTime: showtimes.endTime,
      status: showtimes.status,
      createdAt: showtimes.createdAt,
      updatedAt: showtimes.updatedAt,
      movie: {
        id: movies.id,
        title: movies.title,
        rating: movies.rating,
        durationMinutes: movies.durationMinutes,
        releaseDate: movies.releaseDate,
      },
      screen: {
        id: screens.id,
        name: screens.name,
        screenNumber: screens.screenNumber,
        totalSeats: screens.totalSeats,
      },
      theater: {
        id: theaters.id,
        name: theaters.name,
        location: theaters.location,
      },
    })
    .from(showtimes)
    .leftJoin(movies, eq(showtimes.movieId, movies.id))
    .leftJoin(screens, eq(showtimes.screenId, screens.id))
    .leftJoin(theaters, eq(screens.theaterId, theaters.id))
    .where(whereClause)
    .orderBy(showtimes.startTime);
};

export const findByMovie = async (movieId: string) => {
  return await db
    .select({
      id: showtimes.id,
      movieId: showtimes.movieId,
      screenId: showtimes.screenId,
      startTime: showtimes.startTime,
      endTime: showtimes.endTime,
      status: showtimes.status,
      createdAt: showtimes.createdAt,
      updatedAt: showtimes.updatedAt,
      screen: {
        id: screens.id,
        name: screens.name,
        screenNumber: screens.screenNumber,
        totalSeats: screens.totalSeats,
      },
      theater: {
        id: theaters.id,
        name: theaters.name,
        location: theaters.location,
        address: theaters.address,
      },
    })
    .from(showtimes)
    .leftJoin(screens, eq(showtimes.screenId, screens.id))
    .leftJoin(theaters, eq(screens.theaterId, theaters.id))
    .where(eq(showtimes.movieId, movieId))
    .orderBy(showtimes.startTime);
};
