import { db } from "../../db/connection";
import { movies } from "../../db/schema/movies";
import { showtimes } from "../../db/schema/showtimes";
import { SQL, eq, isNull, and, ilike, sql, gt, gte, lte } from "drizzle-orm";
import { CreateMovieData, UpdateMovieData, Movie } from "./movie.types";
import { encodeCursor, decodeCursor } from "../../utils/pagination";

export interface MovieFilterOptions {
  title?: string;
  genre?: string;
  actor?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginationOptions {
  cursor?: string;
  limit: number;
}

export interface PaginatedMovies {
  items: Movie[];
  nextCursor: string | null;
  previousCursor: string | null;
}

export const create = async (data: CreateMovieData) => {
  const [movie] = await db.insert(movies).values(data).returning();
  return movie;
};

export const update = async (id: string, data: UpdateMovieData) => {
  const [movie] = await db
    .update(movies)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(movies.id, id))
    .returning();
  return movie;
};

export const softDelete = async (id: string) => {
  await db
    .update(movies)
    .set({ deletedAt: new Date() })
    .where(eq(movies.id, id));
};

export const findAll = async () => {
  return await db.select().from(movies).where(isNull(movies.deletedAt));
};

export const findById = async (id: string) => {
  const [movie] = await db
    .select()
    .from(movies)
    .where(and(eq(movies.id, id), isNull(movies.deletedAt)));
  return movie || null;
};

const buildDateRangeCondition = (
  startDate?: string,
  endDate?: string,
): SQL | undefined => {
  const dateConditions: SQL[] = [];

  if (startDate) {
    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);
    dateConditions.push(gte(showtimes.startTime, start));
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);
    dateConditions.push(lte(showtimes.startTime, end));
  }

  return dateConditions.length > 0 ? and(...dateConditions) : undefined;
};

export const searchMovies = async (
  filters: MovieFilterOptions,
  pagination: PaginationOptions,
): Promise<PaginatedMovies> => {
  const conditions: SQL[] = [];

  conditions.push(isNull(movies.deletedAt));

  if (filters.title) {
    conditions.push(ilike(movies.title, `%${filters.title}%`));
  }

  if (filters.genre) {
    conditions.push(sql`${movies.genres} @> ARRAY[${filters.genre}]::text[]`);
  }

  if (filters.actor) {
    conditions.push(
      sql`EXISTS (
        SELECT 1 FROM unnest(${movies.actors}) AS actor
        WHERE actor ILIKE ${`%${filters.actor}%`}
      )`,
    );
  }

  if (pagination.cursor) {
    const decodedCursor = decodeCursor(pagination.cursor);
    conditions.push(gt(movies.id, decodedCursor));
  }

  const needsDateFilter = filters.startDate || filters.endDate;

  let results;

  if (!needsDateFilter) {
    results = await db
      .select()
      .from(movies)
      .where(and(...conditions))
      .orderBy(movies.id)
      .limit(pagination.limit + 1);
  } else {
    const dateRangeCondition = buildDateRangeCondition(
      filters.startDate,
      filters.endDate,
    );

    results = await db
      .selectDistinctOn([movies.id], {
        id: movies.id,
        title: movies.title,
        description: movies.description,
        releaseDate: movies.releaseDate,
        pullDate: movies.pullDate,
        durationMinutes: movies.durationMinutes,
        rating: movies.rating,
        genres: movies.genres,
        actors: movies.actors,
        createdAt: movies.createdAt,
        updatedAt: movies.updatedAt,
        deletedAt: movies.deletedAt,
      })
      .from(movies)
      .leftJoin(showtimes, eq(showtimes.movieId, movies.id))
      .where(and(...conditions, dateRangeCondition))
      .orderBy(movies.id)
      .limit(pagination.limit + 1);
  }

  const hasMore = results.length > pagination.limit;
  const items = hasMore ? results.slice(0, -1) : results;

  const nextCursor = hasMore ? encodeCursor(items[items.length - 1].id) : null;
  const previousCursor = pagination.cursor ? encodeCursor(items[0].id) : null;

  return {
    items,
    nextCursor,
    previousCursor,
  };
};
