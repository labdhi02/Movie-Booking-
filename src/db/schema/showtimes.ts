import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { movies } from './movies';
import { screens } from './screens';
import { showtimeStatusEnum } from './enums';

export const showtimes = pgTable('showtimes', {
  id: uuid('id').primaryKey().defaultRandom(),
  movieId: uuid('movie_id')
    .notNull()
    .references(() => movies.id, { onDelete: 'restrict' }),
  screenId: uuid('screen_id')
    .notNull()
    .references(() => screens.id, { onDelete: 'restrict' }),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  status: showtimeStatusEnum('status').notNull().default('scheduled'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
