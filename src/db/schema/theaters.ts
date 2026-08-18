import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { screens } from './screens';

export const theaters = pgTable('theaters', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  address: text('address').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  deletedAtIdx: index('theaters_deleted_at_idx').on(table.deletedAt),
}));

export const theatersRelations = relations(theaters, ({ many }) => ({
  screens: many(screens),
}));
