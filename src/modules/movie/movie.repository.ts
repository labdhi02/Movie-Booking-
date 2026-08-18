import { db } from '../../db/connection';
import { movies } from '../../db/schema/movies';
import { eq, isNull, and } from 'drizzle-orm';
import { CreateMovieData, UpdateMovieData } from './movie.types';

export const create = async (data: CreateMovieData) => {
  const [movie] = await db
    .insert(movies)
    .values(data)
    .returning();
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
  return await db
    .select()
    .from(movies)
    .where(isNull(movies.deletedAt));
};

export const findById = async (id: string) => {
  const [movie] = await db
    .select()
    .from(movies)
    .where(and(eq(movies.id, id), isNull(movies.deletedAt)));
  return movie || null;
};
