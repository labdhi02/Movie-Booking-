import { db } from '../../db/connection';
import { screens } from '../../db/schema/screens';
import { eq } from 'drizzle-orm';
import { CreateScreenData, UpdateScreenData } from './screen.types';

export const create = async (data: CreateScreenData) => {
  const [screen] = await db
    .insert(screens)
    .values(data)
    .returning();
  return screen;
};

export const update = async (id: string, data: UpdateScreenData) => {
  const [screen] = await db
    .update(screens)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(screens.id, id))
    .returning();
  return screen;
};

export const findById = async (id: string) => {
  const [screen] = await db
    .select()
    .from(screens)
    .where(eq(screens.id, id));
  return screen || null;
};

export const findByTheaterId = async (theaterId: string) => {
  return await db
    .select()
    .from(screens)
    .where(eq(screens.theaterId, theaterId));
};
