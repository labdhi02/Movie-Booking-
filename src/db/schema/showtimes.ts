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
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  status: showtimeStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
