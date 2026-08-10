import { pgTable, uuid, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { screens } from './screens';
import { seatTypeEnum } from './enums';

export const seats = pgTable('seats', {
  id: uuid('id').primaryKey().defaultRandom(),
  screenId: uuid('screen_id')
    .notNull()
    .references(() => screens.id, { onDelete: 'cascade' }),
  row: varchar('row', { length: 10 }).notNull(),
  column: integer('column').notNull(),
  seatType: seatTypeEnum('seat_type').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const seatsRelations = relations(seats, ({ one }) => ({
  screen: one(screens, {
    fields: [seats.screenId],
    references: [screens.id],
  }),
}));
