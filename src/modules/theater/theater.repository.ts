import { db } from '../../db/connection';
import { theaters } from '../../db/schema';
import { eq, isNull, and } from 'drizzle-orm';
import { CreateTheaterData, UpdateTheaterData } from './theater.types';

export const create = async (data: CreateTheaterData) => {
  const [theater] = await db
    .insert(theaters)
    .values(data)
    .returning();
  return theater;
};

export const update = async (id: string, data: UpdateTheaterData) => {
  const [theater] = await db
    .update(theaters)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(theaters.id, id))
    .returning();
  return theater;
};

export const softDelete = async (id: string) => {
  await db
    .update(theaters)
    .set({ deletedAt: new Date() })
    .where(eq(theaters.id, id));
};

export const findAll = async () => {
  return await db
    .select()
    .from(theaters)
    .where(isNull(theaters.deletedAt));
};

export const findById = async (id: string) => {
  const [theater] = await db
    .select()
    .from(theaters)
    .where(and(eq(theaters.id, id), isNull(theaters.deletedAt)));
  return theater || null;
};
