import { pgTable, uuid, varchar, text, timestamp, integer, date, index } from 'drizzle-orm/pg-core';


export const movies = pgTable('movies', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 500 }).notNull(),
  genres: text('genres').array(),
  actors: text('actors').array(),
  durationMinutes: integer('duration_minutes').notNull(),
  rating: varchar('rating', { length: 10 }),
  description: text('description'),
  releaseDate: date('release_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  deletedAtIdx: index('movies_deleted_at_idx').on(table.deletedAt),
}));
